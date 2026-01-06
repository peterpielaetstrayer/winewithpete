import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Public API to fetch active featured essays
export async function GET() {
  try {
    const supabase = createClient();
    
    const { data: essays, error } = await supabase
      .from('featured_essays')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

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

