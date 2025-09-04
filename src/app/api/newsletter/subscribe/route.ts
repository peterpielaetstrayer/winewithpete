import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/supabase/database';
import { newsletterSchema, validateEmail, validateName } from '@/lib/validations';
import { addToKitList, sendKitWelcomeEmail } from '@/lib/kit';
import { sendEmail, emailTemplates } from '@/lib/email';
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
