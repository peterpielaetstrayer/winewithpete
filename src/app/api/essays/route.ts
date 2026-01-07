import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api-response';

// Public API to fetch active featured essays
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured'); // 'true' to get only the featured essay for /start
    
    let query = supabase
      .from('featured_essays')
      .select('*')
      .eq('is_active', true);
    
    // Filter by featured if provided
    if (featured === 'true') {
      query = query.eq('featured_essay', true);
    }
    
    const { data: essays, error } = await query.order('display_order', { ascending: true });

    if (error) {
      return errorResponse('Failed to fetch essays', error.message, 'DATABASE_ERROR', 500);
    }
    
    return successResponse(essays || []);

  } catch (error) {
    return errorResponse(
      'Failed to fetch essays',
      error instanceof Error ? error.message : 'Unknown error',
      'INTERNAL_ERROR',
      500
    );
  }
}

