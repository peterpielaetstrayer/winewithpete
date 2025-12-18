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

    // Call Loops API to create contact
    const loopsResponse = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: sanitizedEmail,
        source: 'december-reset-landing',
        mailingLists: {
          'december-reset-leads': true,
        },
      }),
    });

    if (!loopsResponse.ok) {
      const errorData = await loopsResponse.text();
      console.error('Loops API error:', {
        status: loopsResponse.status,
        statusText: loopsResponse.statusText,
        error: errorData,
        email: sanitizedEmail.substring(0, 3) + '***',
      });
      
      // Handle duplicate email (409 conflict)
      if (loopsResponse.status === 409) {
        return NextResponse.json({
          success: true,
          message: 'You\'re already subscribed! Check your email for the Quick Start Guide.',
          already_subscribed: true,
        });
      }

      return NextResponse.json(
        { 
          error: 'Failed to subscribe. Please try again.',
          details: process.env.NODE_ENV === 'development' ? errorData : undefined,
        },
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

