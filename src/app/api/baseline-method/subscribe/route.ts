import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/supabase/database';
import { sendEmail, emailTemplates } from '@/lib/email';

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

    // Save to Supabase (source of truth)
    let subscriber = null;
    let supabaseSuccess = false;
    let supabaseError: string | null = null;
    try {
      subscriber = await subscribeToNewsletter(sanitizedData);
      supabaseSuccess = true;
      console.log('Successfully saved to Supabase');
    } catch (error) {
      let errorCode = '';
      let errorMessage = '';
      
      if (error instanceof Error) {
        errorMessage = error.message;
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
        if ('details' in error) {
          errorMessage += ' ' + String(error.details);
        }
      } else {
        errorMessage = JSON.stringify(error);
      }
      
      supabaseError = errorMessage;
      
      // Check if it's a duplicate email error
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
        // For duplicates, we'll still continue to send email and sync to Loops
        supabaseSuccess = true; // Consider duplicate as success
      } else {
        console.error('Supabase subscription failed:', {
          error: supabaseError,
          errorCode,
          fullError: error,
        });
      }
    }

    // If Supabase failed (and it's not a duplicate), we can't continue
    if (!supabaseSuccess) {
      console.error('CRITICAL: Supabase subscription failed', {
        supabase_error: supabaseError,
        email: sanitizedData.email.substring(0, 3) + '***',
      });
      
      return NextResponse.json(
        { 
          error: 'Unable to save subscription. Please try again later or contact support.',
          details: 'Database connection failed',
        },
        { status: 500 }
      );
    }

    // Sync to Loops for email marketing (with baseline-method tags)
    let loopsSynced = false;
    let loopsError: string | null = null;
    try {
      if (process.env.LOOPS_API_KEY) {
        const loopsPayload = {
          email: sanitizedData.email,
          firstName: sanitizedData.name?.split(' ')[0] || undefined,
          lastName: sanitizedData.name?.split(' ').slice(1).join(' ') || undefined,
          source: 'baseline-method',
          userGroup: 'baseline-method',
        };

        // Try to create the contact first
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
          console.log('Successfully created contact in Loops');
        } else {
          const errorData = await loopsResponse.json().catch(() => ({ message: 'Unknown error' }));
          loopsError = errorData?.message || `Loops API error: ${loopsResponse.status}`;
          
          // If it's a duplicate, update the existing contact with baseline-method tags
          if (loopsResponse.status === 409 || loopsResponse.status === 400) {
            const errorMsg = (errorData?.message || '').toLowerCase();
            if (errorMsg.includes('already exists') || errorMsg.includes('duplicate')) {
              console.log('Email already in Loops, updating with baseline-method tags');
              
              // Update existing contact to add baseline-method tags
              const updatePayload = {
                email: sanitizedData.email,
                source: 'baseline-method',
                userGroup: 'baseline-method',
              };

              const updateResponse = await fetch('https://app.loops.so/api/v1/contacts/update', {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatePayload),
              });

              if (updateResponse.ok) {
                loopsSynced = true;
                console.log('Successfully updated existing contact in Loops with baseline-method tags');
              } else {
                const updateErrorData = await updateResponse.json().catch(() => ({ message: 'Unknown error' }));
                console.warn('Failed to update existing contact in Loops:', updateErrorData);
                // Still consider it success since contact exists
                loopsSynced = true;
              }
            } else {
              console.warn('Loops sync failed (non-critical):', loopsError);
            }
          } else {
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

    // Send email with Gumroad link via Resend
    let emailSent = false;
    let emailError: string | null = null;
    try {
      if (!process.env.RESEND_API_KEY) {
        emailError = 'RESEND_API_KEY not configured';
        console.warn('Cannot send email: RESEND_API_KEY not set');
      } else {
        const baselineEmail = emailTemplates.baselineMethodWelcome(
          sanitizedData.name || 'Friend',
          'https://8413493499309.gumroad.com/l/baseline-method'
        );
        const emailResult = await sendEmail({
          to: sanitizedData.email,
          subject: baselineEmail.subject,
          html: baselineEmail.html,
          text: baselineEmail.text
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
      gumroad_url: 'https://8413493499309.gumroad.com/l/baseline-method',
      message: 'Successfully subscribed! Check your email for the download link.'
    });

  } catch (error) {
    console.error('Baseline Method subscription error:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Non-Error object:', JSON.stringify(error, null, 2));
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to subscribe. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

