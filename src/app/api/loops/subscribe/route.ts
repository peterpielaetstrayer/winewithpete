import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.LOOPS_API_KEY) {
      console.error('LOOPS_API_KEY not configured in environment');
      return NextResponse.json(
        { error: 'Email service not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Prepare request payload
    // Try with mailing list first, fallback to just email if that fails
    const requestPayload = {
      email: sanitizedEmail,
      source: 'december-reset-landing',
      mailingLists: {
        'december-reset-leads': true,
      },
    };
    
    // Alternative format (if object doesn't work, try array)
    // const requestPayloadAlt = {
    //   email: sanitizedEmail,
    //   source: 'december-reset-landing',
    //   mailingLists: ['december-reset-leads'],
    // };

    console.log('Calling Loops API:', {
      endpoint: 'https://app.loops.so/api/v1/contacts/create',
      hasApiKey: !!process.env.LOOPS_API_KEY,
      apiKeyLength: process.env.LOOPS_API_KEY?.length || 0,
      payload: { ...requestPayload, email: sanitizedEmail.substring(0, 3) + '***' },
    });

    // Call Loops API to create contact
    let loopsResponse = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    // If first attempt fails with 400, try without mailing list (in case list doesn't exist)
    if (!loopsResponse.ok && loopsResponse.status === 400) {
      console.log('First attempt failed with 400, trying without mailing list...');
      const fallbackPayload = {
        email: sanitizedEmail,
        source: 'december-reset-landing',
      };
      
      loopsResponse = await fetch('https://app.loops.so/api/v1/contacts/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fallbackPayload),
      });
      
      if (loopsResponse.ok) {
        console.log('Success with fallback (no mailing list)');
      }
    }

    if (!loopsResponse.ok) {
      let errorData: unknown;
      try {
        errorData = await loopsResponse.json();
      } catch {
        errorData = await loopsResponse.text();
      }
      
      console.error('Loops API error:', {
        status: loopsResponse.status,
        statusText: loopsResponse.statusText,
        error: errorData,
        email: sanitizedEmail.substring(0, 3) + '***',
      });
      
      // Handle duplicate email - Loops may return 400 or 409
      const errorMessage = typeof errorData === 'string' 
        ? errorData.toLowerCase() 
        : (errorData?.message || errorData?.error || '').toLowerCase();
      
      const isDuplicate = 
        loopsResponse.status === 409 ||
        loopsResponse.status === 400 && (
          errorMessage.includes('already exists') ||
          errorMessage.includes('duplicate') ||
          errorMessage.includes('already subscribed') ||
          errorMessage.includes('contact already')
        );
      
      if (isDuplicate) {
        // Return 200 for duplicates so form shows success message
        return NextResponse.json({
          success: true,
          message: 'You\'re already subscribed! Check your email for the Quick Start Guide.',
          already_subscribed: true,
        }, { status: 200 });
      }

      // Return detailed error for debugging
      const errorResponse = {
        error: 'Failed to subscribe. Please try again.',
        details: errorData,
        status: loopsResponse.status,
        statusText: loopsResponse.statusText,
      };

      console.error('Returning error response:', {
        ...errorResponse,
        errorDataString: typeof errorData === 'string' ? errorData : JSON.stringify(errorData),
      });

      return NextResponse.json(
        errorResponse,
        { status: loopsResponse.status }
      );
    }

    const result = await loopsResponse.json();
    
    console.log('Loops subscription successful:', {
      email: sanitizedEmail.substring(0, 3) + '***',
      loopsId: result.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email for the Quick Start Guide.',
      data: result,
    });

  } catch (error) {
    console.error('Loops subscription error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Full error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { 
        error: 'Failed to subscribe. Please try again.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

