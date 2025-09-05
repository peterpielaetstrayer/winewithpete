import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerSupabase();
    
    console.log('Testing products table access...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, is_active')
      .eq('is_active', true)
      .limit(5);

    console.log('Products query result:', { products, error });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: products?.length || 0,
      products: products || []
    });

  } catch (error) {
    console.error('Test products error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
