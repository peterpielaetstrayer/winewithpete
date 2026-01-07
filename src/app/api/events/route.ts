import { getUpcomingEvents } from '@/lib/supabase/database';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const events = await getUpcomingEvents();
    
    return successResponse(events);

  } catch (error) {
    return errorResponse(
      'Failed to fetch events',
      error instanceof Error ? error.message : 'Unknown error',
      'INTERNAL_ERROR',
      500
    );
  }
}
