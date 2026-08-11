import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api-response';

const PUBLIC_PRODUCT_FIELDS = [
  'id',
  'name',
  'description',
  'price',
  'product_type',
  'product_category',
  'file_path',
  'image_path',
  'is_active',
  'is_featured',
  'display_order',
  'created_at',
  'updated_at',
].join(',');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    // Physical commerce is intentionally paused while the custom Printful
    // pipeline is retired. Returning an empty catalog activates the store's
    // existing Coming Soon state without deleting product data or admin access.
    if (category === 'physical') {
      return successResponse([]);
    }

    const supabase = createClient();

    let query = supabase
      .from('products')
      .select(PUBLIC_PRODUCT_FIELDS)
      .eq('is_active', true);

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (category === 'digital') {
      query = query.or(
        'product_type.in.(recipe_card,guide,ebook,bundle),product_category.eq.digital'
      );
    }

    const { data: products, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      return errorResponse(
        'Failed to fetch products',
        error.message,
        'DATABASE_ERROR',
        500
      );
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
