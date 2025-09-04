import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/supabase/database';
import { newsletterSchema, validateEmail, validateName } from '@/lib/validations';
// import type { NewsletterFormData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input with Zod
    const validationResult = newsletterSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors.map(e => e.message)
        },
        { status: 400 }
      );
    }

    const { email, name } = validationResult.data;

    // Sanitize inputs
    const sanitizedData = {
      email: validateEmail(email),
      name: name ? validateName(name) : undefined,
    };

    // Subscribe to newsletter
    const subscriber = await subscribeToNewsletter(sanitizedData);

    // TODO: Send welcome email via Kit
    // For now, just return success

    return NextResponse.json({
      success: true,
      data: subscriber,
      message: 'Successfully subscribed to our newsletter!'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    // Handle duplicate subscription
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
