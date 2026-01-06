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
        
        // Log the product structure for debugging
        console.log('Product structure:', {
          hasSyncProduct: !!product.sync_product,
          hasSyncVariants: !!product.sync_variants,
          hasVariants: !!product.variants,
          syncVariantsType: typeof product.sync_variants,
          productKeys: Object.keys(product)
        });
        
        // Ensure syncVariants is always an array
        let syncVariants = [];
        
        // Try multiple ways to get variants
        if (Array.isArray(product.sync_variants)) {
          syncVariants = product.sync_variants;
        } else if (Array.isArray(product.variants)) {
          syncVariants = product.variants;
        } else if (product.sync_variants && typeof product.sync_variants === 'object') {
          // If it's an object, try to extract array from it
          if (Array.isArray(Object.values(product.sync_variants)[0])) {
            syncVariants = Object.values(product.sync_variants)[0] as any[];
          } else {
            // Might be an object with variant IDs as keys
            syncVariants = Object.values(product.sync_variants);
          }
        }
        
        // If still no variants, the product might need to be fetched with full details
        // Try fetching the full product details from Printful
        if (syncVariants.length === 0 && syncProduct.id) {
          try {
            const apiKey = process.env.PRINTFUL_API_KEY;
            const productDetailResponse = await fetch(
              `https://api.printful.com/sync/products/${syncProduct.id}`,
              {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                },
              }
            );
            
            if (productDetailResponse.ok) {
              const productDetail = await productDetailResponse.json();
              const fullProduct = productDetail.result;
              
              // Try to get variants from the full product
              if (Array.isArray(fullProduct.sync_variants)) {
                syncVariants = fullProduct.sync_variants;
              } else if (Array.isArray(fullProduct.variants)) {
                syncVariants = fullProduct.variants;
              }
              
              console.log(`Fetched product details for ${syncProduct.id}, found ${syncVariants.length} variants`);
            }
          } catch (e) {
            console.error(`Error fetching product details for ${syncProduct.id}:`, e);
          }
        }
        
        if (!Array.isArray(syncVariants) || syncVariants.length === 0) {
          errors.push({ 
            product: syncProduct.name || product.id || 'Unknown', 
            error: 'No variants found or variants not in expected format',
            debug: `Product keys: ${Object.keys(product).join(', ')}`
          });
          continue;
        }

        // Use first variant for base price (or find variant with retail_price)
        const mainVariant = Array.isArray(syncVariants) 
          ? (syncVariants.find((v: any) => v && (v.retail_price || v.price)) || syncVariants[0])
          : null;
        
        if (!mainVariant) {
          errors.push({ 
            product: syncProduct.name || product.id || 'Unknown', 
            error: 'Could not extract variant data' 
          });
          continue;
        }
        
        // Get product image (from sync_product or variants)
        const productImage = syncProduct.thumbnail_url || 
                            syncProduct.preview_url ||
                            syncProduct.image ||
                            mainVariant?.preview_image ||
                            mainVariant?.files?.[0]?.preview_url ||
                            mainVariant?.files?.[0]?.url ||
                            null;

        // Better price extraction - Printful prices can be in different fields
        // Log variant structure for debugging
        console.log('Variant price fields:', {
          variantId: mainVariant.id,
          retail_price: mainVariant.retail_price,
          price: mainVariant.price,
          cost: mainVariant.cost,
          allKeys: Object.keys(mainVariant)
        });
        
        // Try multiple price sources (Printful uses different fields)
        let price = 0;
        if (mainVariant.retail_price !== undefined && mainVariant.retail_price !== null) {
          // retail_price is in cents
          price = parseFloat((mainVariant.retail_price / 100).toFixed(2));
        } else if (mainVariant.price !== undefined && mainVariant.price !== null) {
          // price might be in cents or dollars
          price = mainVariant.price > 1000 
            ? parseFloat((mainVariant.price / 100).toFixed(2)) // Assume cents if > 1000
            : parseFloat(mainVariant.price.toFixed(2)); // Otherwise dollars
        } else if (mainVariant.cost !== undefined && mainVariant.cost !== null) {
          // Fallback to cost if available
          price = mainVariant.cost > 1000
            ? parseFloat((mainVariant.cost / 100).toFixed(2))
            : parseFloat(mainVariant.cost.toFixed(2));
        }
        
        console.log(`Extracted price for ${syncProduct.name}: $${price}`);

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

        // Get better description - try multiple sources
        const description = syncProduct.description || 
                          product.description || 
                          syncProduct.name || 
                          null;

        // Create or update product in Supabase
        const productData = {
          name: syncProduct.name || 'Unnamed Product',
          description: description,
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

