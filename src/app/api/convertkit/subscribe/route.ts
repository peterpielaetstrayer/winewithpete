import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, formId } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID is required' },
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

    const apiKey = process.env.CONVERTKIT_API_KEY;
    if (!apiKey || apiKey === 'placeholder-api-key') {
      console.warn('ConvertKit API key not configured - using placeholder');
      // Return success for placeholder/testing
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed! (Placeholder mode)',
        placeholder: true,
      });
    }

    // Subscribe to ConvertKit
    const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        api_key: apiKey,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('ConvertKit API error:', {
        status: response.status,
        statusText: response.statusText,
        error: result,
        formId,
        email: email.substring(0, 3) + '***', // Log partial email for debugging
      });
      
      // Provide more helpful error messages
      let errorMessage = 'Failed to subscribe';
      if (result.error) {
        errorMessage = result.error;
      } else if (response.status === 401) {
        errorMessage = 'Invalid API key. Please check your ConvertKit API key.';
      } else if (response.status === 404) {
        errorMessage = 'Form not found. Please check your ConvertKit Form ID.';
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? result : undefined,
        },
        { status: response.status }
      );
    }

    console.log('ConvertKit subscription successful:', {
      formId,
      email: email.substring(0, 3) + '***',
      subscription: result.subscription,
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
      subscription: result.subscription,
    });

  } catch (error) {
    console.error('ConvertKit subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

