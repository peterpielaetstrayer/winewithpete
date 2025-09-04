import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/supabase/database';
import { newsletterSchema, validateEmail, validateName } from '@/lib/validations';
import { addToKitList, sendKitWelcomeEmail } from '@/lib/kit';
import { sendEmail, emailTemplates } from '@/lib/email';
// import type { NewsletterFormData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.email || typeof body.email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const { email, name } = body;

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      email: email.trim().toLowerCase(),
      name: name ? name.trim() : undefined,
    };

    // Subscribe to newsletter in Supabase
    const subscriber = await subscribeToNewsletter(sanitizedData);

    // Try to add to Kit list (but don't fail if it doesn't work)
    let kitSynced = false;
    try {
      const kitResult = await addToKitList({
        email: sanitizedData.email,
        name: sanitizedData.name,
        tags: ['newsletter', 'website-signup']
      });
      kitSynced = kitResult.success;
    } catch (error) {
      console.error('Kit integration failed:', error);
      // Continue without failing the subscription
    }

    // Send welcome email (try Resend first since it's more reliable)
    let emailSent = false;
    try {
      const welcomeEmail = emailTemplates.newsletterWelcome(sanitizedData.name || 'Friend');
      await sendEmail({
        to: sanitizedData.email,
        subject: welcomeEmail.subject,
        html: welcomeEmail.html,
        text: welcomeEmail.text
      });
      emailSent = true;
    } catch (error) {
      console.error('Email sending failed:', error);
      // Continue without failing the subscription
    }

    return NextResponse.json({
      success: true,
      data: subscriber,
      kit_synced: kitSynced,
      email_sent: emailSent,
      message: 'Successfully subscribed to our newsletter!'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Handle duplicate subscription
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter' },
        { status: 409 }
      );
    }

    // Handle RLS policy errors
    if (error instanceof Error && error.message.includes('row-level security')) {
      return NextResponse.json(
        { error: 'Database permission error. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to subscribe. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
