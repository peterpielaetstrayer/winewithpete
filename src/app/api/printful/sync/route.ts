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
        
        // Extract ALL images from product and variants
        // Printful products can have images at multiple levels:
        // 1. Product-level: thumbnail_url, preview_url, image
        // 2. Variant-level: preview_image, files[].preview_url, files[].url
        // 3. Mockup images: variant mockups (best quality)
        
        const allImages: string[] = [];
        
        // Product-level images
        if (syncProduct.thumbnail_url) allImages.push(syncProduct.thumbnail_url);
        if (syncProduct.preview_url && !allImages.includes(syncProduct.preview_url)) {
          allImages.push(syncProduct.preview_url);
        }
        if (syncProduct.image && !allImages.includes(syncProduct.image)) {
          allImages.push(syncProduct.image);
        }
        
        // Variant-level images (including mockups)
        syncVariants.forEach((variant: any) => {
          // Variant preview image
          if (variant.preview_image && !allImages.includes(variant.preview_image)) {
            allImages.push(variant.preview_image);
          }
          
          // Variant files (mockups and product images)
          if (Array.isArray(variant.files)) {
            variant.files.forEach((file: any) => {
              // Mockup images (best quality)
              if (file.preview_url && !allImages.includes(file.preview_url)) {
                allImages.push(file.preview_url);
              }
              // Product images
              if (file.url && !allImages.includes(file.url)) {
                allImages.push(file.url);
              }
            });
          }
          
          // Some variants have mockup_url directly
          if (variant.mockup_url && !allImages.includes(variant.mockup_url)) {
            allImages.push(variant.mockup_url);
          }
        });
        
        // Primary image: prefer mockup/preview images over thumbnails
        // Priority: mockup > preview_image > preview_url > thumbnail_url
        const productImage = allImages.find(img => 
          img.includes('mockup') || img.includes('preview')
        ) || allImages[0] || null;
        
        // Store all images for gallery display
        const variantImages = syncVariants.map((variant: any) => {
          const variantImgs: string[] = [];
          
          if (variant.preview_image) variantImgs.push(variant.preview_image);
          if (variant.mockup_url) variantImgs.push(variant.mockup_url);
          
          if (Array.isArray(variant.files)) {
            variant.files.forEach((file: any) => {
              if (file.preview_url) variantImgs.push(file.preview_url);
              if (file.url && !variantImgs.includes(file.url)) variantImgs.push(file.url);
            });
          }
          
          return {
            variant_id: variant.id,
            variant_name: variant.name || variant.variant || `${variant.size || ''} ${variant.color || ''}`.trim(),
            images: variantImgs,
            price: variant.retail_price || variant.price,
            size: variant.size,
            color: variant.color,
          };
        });

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
        // Printful API typically returns prices in cents, but we need to check the actual format
        let price = 0;
        
        // Helper function to safely convert price to number
        const toNumber = (value: any): number | null => {
          if (value === null || value === undefined) return null;
          const num = typeof value === 'string' ? parseFloat(value) : Number(value);
          return isNaN(num) ? null : num;
        };
        
        const rawRetailPrice = toNumber(mainVariant.retail_price);
        const rawPrice = toNumber(mainVariant.price);
        const rawCost = toNumber(mainVariant.cost);
        
        if (rawRetailPrice !== null && rawRetailPrice !== undefined) {
          // retail_price: Printful usually returns in cents
          // If value is >= 100, it's likely in cents; if < 100, might be dollars
          // But also check: if it's between 1-100, it could be dollars (like 39.99 or 51)
          if (rawRetailPrice >= 100) {
            // Large number, definitely cents
            price = Math.round((rawRetailPrice / 100) * 100) / 100;
          } else if (rawRetailPrice >= 1 && rawRetailPrice < 100) {
            // Medium number (1-100), could be dollars (like 39.99, 51) or cents (like 40, 51)
            // If it's a whole number between 10-100, it's likely dollars; otherwise check decimals
            if (rawRetailPrice % 1 === 0 && rawRetailPrice >= 10) {
              // Whole number >= 10, likely dollars (like 40, 51)
              price = rawRetailPrice;
            } else {
              // Has decimals or < 10, could be either - try as dollars first
              price = rawRetailPrice;
            }
          } else {
            // Very small number (< 1), likely already in dollars as decimal
            price = rawRetailPrice;
          }
        } else if (rawPrice !== null && rawPrice !== undefined) {
          // Same logic for price field
          if (rawPrice >= 100) {
            price = Math.round((rawPrice / 100) * 100) / 100;
          } else {
            price = rawPrice;
          }
        } else if (rawCost !== null && rawCost !== undefined) {
          // Same logic for cost field
          if (rawCost >= 100) {
            price = Math.round((rawCost / 100) * 100) / 100;
          } else {
            price = rawCost;
          }
        }
        
        // Final check: if price is suspiciously low (< 1) but raw value is reasonable (10-1000), 
        // it means we incorrectly divided. Use raw value as dollars.
        if (price > 0 && price < 1) {
          const rawValue = rawRetailPrice ?? rawPrice ?? rawCost;
          if (rawValue !== null && rawValue >= 10 && rawValue < 1000) {
            price = rawValue;
            console.log(`Price was too low (${price}), using raw value as dollars: $${price}`);
          }
        }
        
        // Ensure price is a valid number with 2 decimal places
        price = Math.round(price * 100) / 100;
        
        console.log(`Extracted price for ${syncProduct.name}: $${price} (raw retail_price: ${mainVariant.retail_price}, raw price: ${mainVariant.price})`);

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
          printful_sync_data: {
            ...product, // Store full Printful data
            all_images: allImages, // All available images (deduplicated)
            variant_images: variantImages, // Images organized by variant
            variant_count: syncVariants.length,
            variants: syncVariants.map((v: any) => ({
              id: v.id,
              name: v.name || v.variant,
              size: v.size,
              color: v.color,
              retail_price: v.retail_price,
              price: v.price,
            })),
          },
          image_path: productImage,
          is_active: true,
          is_featured: isWineBear, // Auto-feature wine bear products
          display_order: 0,
        };
        
        console.log(`Syncing ${syncProduct.name}: ${allImages.length} images found, ${syncVariants.length} variants`);

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

