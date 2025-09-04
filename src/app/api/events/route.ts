import { NextResponse } from 'next/server';
import { getUpcomingEvents } from '@/lib/supabase/database';

export async function GET() {
  try {
    console.log('Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...'
    });

    const events = await getUpcomingEvents();
    
    return NextResponse.json({
      success: true,
      events
    });

  } catch (error) {
    console.error('Events fetch error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
