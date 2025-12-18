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

    // Try to subscribe to newsletter in Supabase (but don't fail if it's down)
    let subscriber = null;
    let supabaseSuccess = false;
    let supabaseError: string | null = null;
    try {
      subscriber = await subscribeToNewsletter(sanitizedData);
      supabaseSuccess = true;
      console.log('Successfully saved to Supabase');
    } catch (error) {
      if (error instanceof Error) {
        supabaseError = error.message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        supabaseError = String(error.message);
      } else if (error && typeof error === 'object' && 'code' in error) {
        supabaseError = `Code: ${error.code} - ${JSON.stringify(error)}`;
      } else {
        supabaseError = JSON.stringify(error);
      }
      console.error('Supabase subscription failed:', {
        error: supabaseError,
        fullError: error,
        errorType: error?.constructor?.name,
      });
      
      // Check if it's a connection/database issue
      if (supabaseError.includes('fetch') || supabaseError.includes('network') || supabaseError.includes('ECONNREFUSED')) {
        console.warn('Supabase appears to be down or paused. Continuing with Kit subscription only.');
      } else {
        // For other errors (like duplicates), we might want to continue
        console.warn('Supabase error (non-critical):', supabaseError);
      }
      // Continue without failing - we'll try Kit.co instead
    }

    // Try to add to Kit list (primary method if Supabase is down)
    let kitSynced = false;
    let kitError: string | null = null;
    try {
      const kitResult = await addToKitList({
        email: sanitizedData.email,
        name: sanitizedData.name,
        tags: ['newsletter', 'website-signup']
      });
      kitSynced = kitResult.success;
      if (kitSynced) {
        console.log('Successfully saved to Kit.co');
      } else {
        kitError = kitResult.error || 'Kit.co API failed';
      }
    } catch (error) {
      kitError = error instanceof Error ? error.message : String(error);
      console.error('Kit integration failed:', kitError);
      // Continue without failing the subscription
    }

    // If Supabase succeeded, we're good (Kit is optional)
    if (supabaseSuccess) {
      // Success! Kit.co is optional, so even if it failed, we succeeded
      console.log('Subscription successful via Supabase', {
        kit_synced: kitSynced,
        email: sanitizedData.email.substring(0, 3) + '***',
      });
    } else {
      // Supabase failed - check if Kit worked as backup
      if (kitSynced) {
        console.log('Subscription successful via Kit.co (Supabase failed)', {
          supabase_error: supabaseError?.substring(0, 50),
          email: sanitizedData.email.substring(0, 3) + '***',
        });
      } else {
        // Both failed - this is a problem
        console.error('CRITICAL: Both subscription methods failed', {
          supabase_error: supabaseError,
          kit_error: kitError,
          email: sanitizedData.email.substring(0, 3) + '***',
        });
        
        return NextResponse.json(
          { 
            error: 'Unable to save subscription. Please try again later or contact support.',
            details: 'Both Supabase and Kit.co subscriptions failed',
            // Include errors in response for debugging (will be visible in browser console)
            debug: {
              supabase: supabaseError?.substring(0, 100) || 'Unknown error',
              kit: kitError?.substring(0, 100) || 'Unknown error',
            }
          },
          { status: 500 }
        );
      }
    }

    // Send welcome email (try Resend first since it's more reliable)
    let emailSent = false;
    let emailError: string | null = null;
    try {
      if (!process.env.RESEND_API_KEY) {
        emailError = 'RESEND_API_KEY not configured';
        console.warn('Cannot send welcome email: RESEND_API_KEY not set');
      } else {
        const welcomeEmail = emailTemplates.newsletterWelcome(sanitizedData.name || 'Friend');
        const emailResult = await sendEmail({
          to: sanitizedData.email,
          subject: welcomeEmail.subject,
          html: welcomeEmail.html,
          text: welcomeEmail.text
        });
        emailSent = emailResult !== null;
        if (!emailSent) {
          emailError = 'Email sending returned null (check logs for details)';
        }
      }
    } catch (error) {
      emailError = error instanceof Error ? error.message : String(error);
      console.error('Email sending failed:', {
        error: emailError,
        email: sanitizedData.email.substring(0, 3) + '***',
      });
      // Continue without failing the subscription
    }

    return NextResponse.json({
      success: true,
      data: subscriber,
      supabase_synced: supabaseSuccess,
      kit_synced: kitSynced,
      email_sent: emailSent,
      email_error: emailError || undefined,
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
