import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { emailSchema, nameSchema, validateEmail, validateName } from '@/lib/validations';
import { z } from 'zod';

const gatheringInterestSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  location: z.string().max(200, 'Location too long').optional(),
  interestType: z.enum(['attend', 'host', 'collaborate']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = gatheringInterestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors.map(e => e.message)
        },
        { status: 400 }
      );
    }

    const { email, name, location, interestType } = validationResult.data;

    // Sanitize inputs
    const sanitizedData = {
      email: validateEmail(email),
      name: validateName(name),
      location: location ? location.trim().substring(0, 200) : null,
      interest_type: interestType || 'attend',
    };

    // Store in Supabase
    // For now, we'll store in newsletter_subscribers with preferences
    // TODO: Create dedicated gathering_interests table if needed
    const supabase = createClient();
    
    // First, try to get existing subscriber
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, preferences')
      .eq('email', sanitizedData.email)
      .single();

    if (existing) {
      // Update preferences with gathering interest
      const preferences = existing.preferences || {};
      preferences.gathering_interest = {
        location: sanitizedData.location,
        interest_type: sanitizedData.interest_type,
        submitted_at: new Date().toISOString(),
      };

      await supabase
        .from('newsletter_subscribers')
        .update({ preferences })
        .eq('id', existing.id);
    } else {
      // Create new subscriber with gathering interest
      await supabase
        .from('newsletter_subscribers')
        .insert({
          email: sanitizedData.email,
          name: sanitizedData.name,
          preferences: {
            gathering_interest: {
              location: sanitizedData.location,
              interest_type: sanitizedData.interest_type,
              submitted_at: new Date().toISOString(),
            },
          },
          is_active: true,
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! We\'ll notify you when gatherings are announced in your area.',
    });

  } catch (error) {
    console.error('Gathering interest error:', error);
    
    return NextResponse.json(
      { error: 'Failed to submit interest. Please try again.' },
      { status: 500 }
    );
  }
}

