import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/supabase/database';
import { newsletterSchema, validateEmail, validateName } from '@/lib/validations';
import { sendEmail, emailTemplates } from '@/lib/email';
// import type { NewsletterFormData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body. Expected JSON.' },
        { status: 400 }
      );
    }
    
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
      // Extract error information
      let errorCode = '';
      let errorMessage = '';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        // Check for Supabase error code in the error object
        if ('code' in error) {
          errorCode = String(error.code);
        }
      } else if (error && typeof error === 'object') {
        if ('message' in error) {
          errorMessage = String(error.message);
        }
        if ('code' in error) {
          errorCode = String(error.code);
        }
        // Supabase errors sometimes have details
        if ('details' in error) {
          errorMessage += ' ' + String(error.details);
        }
      } else {
        errorMessage = JSON.stringify(error);
      }
      
      supabaseError = errorMessage;
      
      // Check if it's a duplicate email error
      // Supabase/PostgreSQL returns code '23505' for unique constraint violations
      const lowerMessage = errorMessage.toLowerCase();
      
      if (
        errorCode === '23505' ||
        lowerMessage.includes('duplicate') ||
        lowerMessage.includes('unique') ||
        lowerMessage.includes('already exists') ||
        lowerMessage.includes('violates unique constraint') ||
        lowerMessage.includes('duplicate key value')
      ) {
        console.log('Duplicate email detected:', sanitizedData.email.substring(0, 3) + '***');
        // Return early with success message for duplicates
        return NextResponse.json(
          { 
            success: true,
            message: 'This email is already subscribed to our newsletter!',
            already_subscribed: true
          },
          { status: 200 }
        );
      }
      
      console.error('Supabase subscription failed:', {
        error: supabaseError,
        errorCode,
        fullError: error,
        errorType: error?.constructor?.name,
      });
      
      // Check if it's a connection/database issue
      if (supabaseError.includes('fetch') || supabaseError.includes('network') || supabaseError.includes('ECONNREFUSED')) {
        console.warn('Supabase appears to be down or paused. Cannot continue without database.');
      } else {
        // For other errors (like duplicates), we might want to continue
        console.warn('Supabase error (non-critical):', supabaseError);
      }
    }

    // If Supabase failed, we can't continue
    if (!supabaseSuccess) {
      console.error('CRITICAL: Supabase subscription failed', {
        supabase_error: supabaseError,
        email: sanitizedData.email.substring(0, 3) + '***',
      });
      
      return NextResponse.json(
        { 
          error: 'Unable to save subscription. Please try again later or contact support.',
          details: 'Database connection failed',
          debug: {
            supabase: supabaseError?.substring(0, 100) || 'Unknown error',
          }
        },
        { status: 500 }
      );
    }

    // Sync to Loops for email marketing (optional, but recommended)
    let loopsSynced = false;
    let loopsError: string | null = null;
    try {
      if (process.env.LOOPS_API_KEY) {
        const loopsPayload = {
          email: sanitizedData.email,
          firstName: sanitizedData.name?.split(' ')[0] || undefined,
          lastName: sanitizedData.name?.split(' ').slice(1).join(' ') || undefined,
          source: 'website-newsletter',
        };

        const loopsResponse = await fetch('https://app.loops.so/api/v1/contacts/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loopsPayload),
        });

        if (loopsResponse.ok) {
          loopsSynced = true;
          console.log('Successfully synced to Loops');
        } else {
          const errorData = await loopsResponse.json().catch(() => ({ message: 'Unknown error' }));
          loopsError = errorData?.message || `Loops API error: ${loopsResponse.status}`;
          
          // Don't fail if it's a duplicate (that's okay)
          if (loopsResponse.status === 409 || loopsResponse.status === 400) {
            const errorMsg = (errorData?.message || '').toLowerCase();
            if (errorMsg.includes('already exists') || errorMsg.includes('duplicate')) {
              loopsSynced = true; // Consider duplicate as success
              console.log('Email already in Loops (duplicate)');
            }
          }
          
          if (!loopsSynced) {
            console.warn('Loops sync failed (non-critical):', loopsError);
          }
        }
      } else {
        loopsError = 'LOOPS_API_KEY not configured';
        console.warn('Loops API key not set, skipping Loops sync');
      }
    } catch (error) {
      loopsError = error instanceof Error ? error.message : String(error);
      console.warn('Loops integration failed (non-critical):', loopsError);
      // Continue without failing the subscription
    }

    console.log('Subscription successful via Supabase', {
      loops_synced: loopsSynced,
      email: sanitizedData.email.substring(0, 3) + '***',
    });

    // Send welcome email (try Resend first since it's more reliable)
    let emailSent = false;
    let emailError: string | null = null;
    try {
      if (!process.env.RESEND_API_KEY) {
        emailError = 'RESEND_API_KEY not configured';
        console.warn('Cannot send welcome email: RESEND_API_KEY not set');
      } else {
        // Get recipe card URL from environment variable (if set)
        const recipeCardUrl = process.env.NEXT_PUBLIC_RECIPE_CARD_URL;
        const welcomeEmail = emailTemplates.newsletterWelcome(sanitizedData.name || 'Friend', recipeCardUrl);
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
      loops_synced: loopsSynced,
      email_sent: emailSent,
      email_error: emailError || undefined,
      loops_error: loopsError || undefined,
      message: 'Successfully subscribed to our newsletter!'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Non-Error object:', JSON.stringify(error, null, 2));
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

    // Check for Supabase connection errors
    if (error instanceof Error && (
      error.message.includes('fetch') || 
      error.message.includes('network') || 
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('SUPABASE_URL') ||
      error.message.includes('SUPABASE_ANON_KEY')
    )) {
      return NextResponse.json(
        { 
          error: 'Database connection error. Please try again later.',
          details: 'Service temporarily unavailable'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to subscribe. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error',
        // Include error type for debugging
        error_type: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    );
  }
}
