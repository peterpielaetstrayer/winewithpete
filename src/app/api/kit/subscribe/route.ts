import { NextRequest, NextResponse } from 'next/server';
import { addToKitList } from '@/lib/kit';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.KIT_API_KEY) {
      console.error('KIT_API_KEY not configured in environment');
      return NextResponse.json(
        { error: 'Email service not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, tags } = body;

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

    // Subscribe to Kit with december-reset tag
    const result = await addToKitList({
      email: email.trim().toLowerCase(),
      tags: ['december-reset'],
    });

    if (!result.success) {
      console.error('Kit subscription error:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to subscribe' },
        { status: 500 }
      );
    }

    console.log('Kit subscription successful:', {
      email: email.substring(0, 3) + '***',
      tags: result.data?.tags,
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
      data: result.data,
    });

  } catch (error) {
    console.error('Kit subscription error:', error);
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

