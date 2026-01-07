import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
      console.error('Essays fetch error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch essays' 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: essays || []
    });

  } catch (error) {
    console.error('Essays API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch essays' 
      },
      { status: 500 }
    );
  }
}

