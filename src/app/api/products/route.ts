import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // 'digital' or 'physical'
    const featured = searchParams.get('featured'); // 'true' to get only featured products
    
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    // Filter by featured if provided
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }
    
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
      return errorResponse('Failed to fetch products', error.message, 'DATABASE_ERROR', 500);
    }
    
    return successResponse(products || []);

  } catch (error) {
    return errorResponse(
      'Failed to fetch products',
      error instanceof Error ? error.message : 'Unknown error',
      'INTERNAL_ERROR',
      500
    );
  }
}
