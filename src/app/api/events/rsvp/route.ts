import { NextRequest, NextResponse } from 'next/server';
import { createRSVP } from '@/lib/supabase/database';
import type { RSVPFormData } from '@/lib/types';
import { rsvpSchema, validateEmail, validateName } from '@/lib/validations';
import { apiRateLimit } from '@/lib/rate-limit';
import { apiCors, addCorsHeaders } from '@/lib/cors';

export async function POST(request: NextRequest) {
  // Handle CORS
  const corsHeaders = apiCors(request);
  if (corsHeaders instanceof NextResponse) return corsHeaders;
  
  try {
    
    // Check rate limit
    const rateLimitResult = apiRateLimit(request);
    if (!rateLimitResult.success) {
      const response = NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          }
        }
      );
      return addCorsHeaders(response, corsHeaders);
    }

    const body = await request.json();
    
    // Validate input with Zod
    const validationResult = rsvpSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues.map(e => e.message)
        },
        { status: 400 }
      );
    }

    const { eventId, ...rsvpData } = validationResult.data;

    // Sanitize inputs
    const sanitizedData: RSVPFormData = {
      email: validateEmail(rsvpData.email),
      name: validateName(rsvpData.name),
      notes: rsvpData.notes ? rsvpData.notes.trim().substring(0, 500) : undefined,
    };

    // Create RSVP
    const rsvp = await createRSVP(eventId, sanitizedData);

    // RSVP is recorded as pending; no confirmation email is currently sent.

    const response = NextResponse.json({
      success: true,
      data: rsvp,
      message: 'RSVP received. Your place is pending confirmation.'
    });
    return addCorsHeaders(response, corsHeaders);

  } catch (error) {
    console.error('RSVP error:', error);
    
    // Handle duplicate RSVP
    if (error instanceof Error && error.message.includes('duplicate')) {
      const response = NextResponse.json(
        { error: 'You have already RSVPed for this event' },
        { status: 409 }
      );
      return addCorsHeaders(response, corsHeaders);
    }

    const response = NextResponse.json(
      { error: 'Failed to submit RSVP. Please try again.' },
      { status: 500 }
    );
    return addCorsHeaders(response, corsHeaders);
  }
}
