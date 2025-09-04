import { NextRequest, NextResponse } from 'next/server';
import { createRSVP } from '@/lib/supabase/database';
import type { RSVPFormData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, ...rsvpData } = body;

    // Validate required fields
    if (!eventId || !rsvpData.email || !rsvpData.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rsvpData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create RSVP
    const rsvp = await createRSVP(eventId, rsvpData as RSVPFormData);

    // TODO: Send confirmation email via Kit
    // For now, just return success

    return NextResponse.json({
      success: true,
      data: rsvp,
      message: 'RSVP submitted successfully! You will receive a confirmation email shortly.'
    });

  } catch (error) {
    console.error('RSVP error:', error);
    
    // Handle duplicate RSVP
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'You have already RSVPed for this event' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit RSVP. Please try again.' },
      { status: 500 }
    );
  }
}
