import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch products' 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: products || []
    });

  } catch (error) {
    console.error('Products fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch products' 
      },
      { status: 500 }
    );
  }
}
