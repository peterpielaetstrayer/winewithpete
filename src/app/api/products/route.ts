import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // 'digital' or 'physical'
    
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    // Filter by category if provided
    if (category === 'digital') {
      // Digital products: recipe_card, guide, ebook, bundle OR product_category = 'digital'
      query = query.or('product_type.in.(recipe_card,guide,ebook,bundle),product_category.eq.digital');
    } else if (category === 'physical') {
      // Physical products: physical, merch OR product_category in (merch, wine_bear)
      query = query.or('product_type.in.(physical,merch),product_category.in.(merch,wine_bear)');
    }
    
    const { data: products, error } = await query.order('created_at', { ascending: false });

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
