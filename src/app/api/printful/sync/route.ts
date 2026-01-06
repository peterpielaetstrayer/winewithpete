import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'Products array is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const syncedProducts = [];
    const errors = [];

    for (const product of products) {
      try {
        // Extract sync_product data (Printful structure)
        const syncProduct = product.sync_product || product;
        const syncVariants = product.sync_variants || product.variants || [];
        
        if (syncVariants.length === 0) {
          errors.push({ product: syncProduct.name || product.id, error: 'No variants found' });
          continue;
        }

        // Use first variant for base price (or find variant with retail_price)
        const mainVariant = syncVariants.find((v: any) => v.retail_price) || syncVariants[0];
        
        // Get product image (from sync_product or variants)
        const productImage = syncProduct.thumbnail_url || 
                            syncProduct.preview_url ||
                            mainVariant?.preview_image ||
                            mainVariant?.files?.[0]?.preview_url ||
                            null;

        // Calculate price from variant (Printful prices are in cents)
        // Use retail_price if set, otherwise use price
        const price = mainVariant?.retail_price 
          ? parseFloat((mainVariant.retail_price / 100).toFixed(2))
          : mainVariant?.price
          ? parseFloat((mainVariant.price / 100).toFixed(2))
          : 0;

        // Determine category (check if wine bear in name/description)
        const nameLower = (syncProduct.name || '').toLowerCase();
        const descriptionLower = (syncProduct.description || '').toLowerCase();
        const isWineBear = nameLower.includes('wine bear') || nameLower.includes('winebear') || 
                         descriptionLower.includes('wine bear');
        
        const productCategory = isWineBear ? 'wine_bear' : 'merch';

        // Determine product type
        const productType = 'physical'; // All Printful products are physical

        // Get Printful product ID
        const printfulProductId = syncProduct.id?.toString() || product.id?.toString();

        // Create or update product in Supabase
        const productData = {
          name: syncProduct.name || 'Unnamed Product',
          description: syncProduct.description || null,
          price: price,
          product_type: productType,
          product_category: productCategory,
          printful_product_id: printfulProductId,
          printful_variant_id: mainVariant.id?.toString(),
          printful_sync_data: product, // Store full Printful data
          image_path: productImage,
          is_active: true,
          is_featured: isWineBear, // Auto-feature wine bear products
          display_order: 0,
        };

        // Check if product already exists
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('printful_product_id', printfulProductId)
          .maybeSingle();

        let result;
        if (existing) {
          // Update existing
          const { data, error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', existing.id)
            .select()
            .single();
          
          if (error) throw error;
          result = data;
        } else {
          // Insert new
          const { data, error } = await supabase
            .from('products')
            .insert(productData)
            .select()
            .single();
          
          if (error) throw error;
          result = data;
        }

        syncedProducts.push(result);

      } catch (error) {
        console.error(`Error syncing product ${product.id}:`, error);
        errors.push({ 
          product: product.name || product.id, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedProducts.length,
      products: syncedProducts,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error('Printful sync error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sync products',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

