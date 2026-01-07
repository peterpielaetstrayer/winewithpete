'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Product, PrintfulVariant } from '@/lib/types';
import { extractPriceFromVariant } from '@/lib/printful-utils';
import { SHIPPING_COST } from '@/lib/constants';

export default function StorePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<PrintfulVariant | null>(null);
  const [selectedVariantType, setSelectedVariantType] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [displayImageIndex, setDisplayImageIndex] = useState(0);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset display index when variant changes
  useEffect(() => {
    if (selectedVariant) {
      setDisplayImageIndex(0);
    }
  }, [selectedVariant]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?category=physical');
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Don't set products to empty - let placeholder show
    } finally {
      setProductsLoading(false);
    }
  };

  // Helper function to group variants by color/variant type
  const getVariantTypes = (variants: PrintfulVariant[]): string[] => {
    const types = new Set<string>();
    variants.forEach((v) => {
      // Group by color if available, otherwise by name
      const type = v.color || v.name || 'Default';
      types.add(type);
    });
    return Array.from(types);
  };
  
  // Helper function to get sizes for a selected variant type
  const getSizesForVariantType = (variants: PrintfulVariant[], variantType: string): PrintfulVariant[] => {
    return variants.filter((v) => {
      const type = v.color || v.name || 'Default';
      return type === variantType;
    });
  };

  const handleCheckoutClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setDisplayImageIndex(0);
    setSelectedVariantType(null); // Reset variant type selection
    setSelectedVariant(null); // Reset variant selection
    
    setShowCheckoutForm(true);
  };
  
  // Calculate current price based on selected variant
  const getCurrentPrice = () => {
    if (!selectedProduct) return 0;
    
    if (selectedVariant) {
      // Extract price from variant using shared utility
      return extractPriceFromVariant(selectedVariant);
    }
    
    return selectedProduct.price;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    // Validate variant selection if variants exist
    if (selectedProduct.printful_sync_data?.variants && selectedProduct.printful_sync_data.variants.length > 0) {
      const variantTypes = getVariantTypes(selectedProduct.printful_sync_data.variants);
      if (variantTypes.length > 1 && !selectedVariantType) {
        alert('Please select a style/color');
        return;
      }
      if (!selectedVariant) {
        alert('Please select a size');
        return;
      }
    }

    setLoading(selectedProduct.id);
    try {
      const requestBody = {
        productId: selectedProduct.id,
        quantity: 1,
        customerEmail: customerEmail,
        customerName: customerName,
        ...(selectedVariant?.id && { 
          printfulVariantId: String(selectedVariant.id) // Convert to string if exists
        }),
        ...(selectedVariant && getCurrentPrice() !== selectedProduct.price && getCurrentPrice() > 0 && {
          customAmount: getCurrentPrice() // Only send if variant price differs from product price
        }),
      };
      
      console.log('Checkout request body:', requestBody);
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Checkout response:', data);
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout failed:', data.error, data.details);
        const errorMessage = data.details && Array.isArray(data.details) 
          ? data.details.join(', ')
          : data.error || 'Checkout failed. Please try again.';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const closeCheckoutForm = () => {
    setShowCheckoutForm(false);
    setSelectedProduct(null);
    setSelectedVariant(null);
    setSelectedImageIndex(0);
    setCustomerEmail('');
    setCustomerName('');
  };

  // Placeholder products for when store is empty
  const placeholderProducts = [
    {
      id: 'placeholder-1',
      name: 'Wine Bear T-Shirt',
      description: 'Show your love for slow living and meaningful conversation. Soft, comfortable, and designed for those who gather around fire.',
      price: 0,
      product_type: 'merch' as const,
      is_active: true,
      image_path: null,
      file_path: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'placeholder-2',
      name: 'Wine Bear Cap',
      description: 'A classic cap featuring the Wine Bear. Perfect for your next gathering or everyday wear.',
      price: 0,
      product_type: 'merch' as const,
      is_active: true,
      image_path: null,
      file_path: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const displayProducts = products.length > 0 ? products : placeholderProducts;
  const showPlaceholderMessage = products.length === 0 && !productsLoading;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Cross-link to Recipes */}
      <div className="text-center mb-6">
        <Link 
          href="/recipes" 
          className="inline-flex items-center gap-2 text-ember hover:text-ember-light transition-colors text-sm font-medium"
        >
          Looking for recipes & guides? <span className="underline">Browse Recipes</span> →
        </Link>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-display animate-fade-in">Wine With Pete Merch</h1>
        <p className="mt-4 text-black/80 animate-fade-in max-w-2xl mx-auto">
          Wearable reminders of slow living, meaningful conversation, and the warmth of gathering around fire.
        </p>
      </div>

      {/* Coming Soon Message */}
      {showPlaceholderMessage && (
        <div className="bg-cream rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-serif font-medium mb-4 text-charcoal">
            New Merch Coming Soon
          </h2>
          <p className="text-black/70 leading-relaxed mb-6 max-w-2xl mx-auto">
            We&apos;re curating our first collection of Wine With Pete merchandise. 
            Stay connected to be notified when new items are available.
          </p>
          <Link href="/join">
            <Button className="btn-ember px-8 py-4 rounded-full text-lg font-medium">
              Stay Connected for Updates
            </Button>
          </Link>
        </div>
      )}

      {/* Products Grid */}
      {productsLoading ? (
        <div className="text-center py-12">
          <p className="text-black/60">Loading products...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {displayProducts.map((product) => (
              <div 
                key={product.id} 
                className="card-enhanced animate-scale-in cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => !showPlaceholderMessage && handleCheckoutClick(product)}
              >
                {/* Product Image */}
                <div className="aspect-square relative overflow-hidden rounded-t-2xl">
                  {product.image_path ? (
                    <Image
                      src={
                        product.image_path.startsWith('http') 
                          ? product.image_path // Direct URL from Printful
                          : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${product.image_path}` // Supabase storage
                      }
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      unoptimized={product.image_path.startsWith('http')}
                      onError={(e) => {
                        console.error('Image failed to load:', product.image_path);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-serif font-medium">{product.name}</h3>
                    {showPlaceholderMessage && (
                      <Badge variant="outline" className="text-ember border-ember">
                        Coming Soon
                      </Badge>
                    )}
                    {!showPlaceholderMessage && (
                      <Badge variant="outline" className="text-ember border-ember">
                        {'product_category' in product && product.product_category === 'wine_bear' ? 'Wine Bear' : product.product_type.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                  
                  {product.description && product.description !== product.name && (
                    <p className="text-black/70 mb-4 line-clamp-3">{product.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold">
                      {product.price === 0 ? 'TBD' : `$${product.price.toFixed(2)}`}
                    </div>
                    
                    {showPlaceholderMessage ? (
                      <Link href="/join" onClick={(e) => e.stopPropagation()}>
                        <Button className="btn-ember focus-ring">
                          Get Notified
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckoutClick(product);
                        }}
                        disabled={loading === product.id}
                        className="btn-ember focus-ring"
                      >
                        {loading === product.id ? 'Processing...' : 'Add to Cart'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Modal */}
          {showCheckoutForm && selectedProduct && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-2xl w-full max-w-lg relative animate-scale-in max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                  onClick={closeCheckoutForm}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full p-1 shadow-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Product Images - Show ONLY the selected variant's mockup images */}
                {(() => {
                  const syncData = selectedProduct.printful_sync_data;
                  const allImages: string[] = Array.isArray(syncData?.all_images) ? syncData.all_images : [];
                  
                  // If a variant is selected, show ONLY its mockup images
                  let imagesToShow: string[] = [];
                  
                  if (selectedVariant && Array.isArray(syncData?.variant_images)) {
                    const variantImageData = syncData.variant_images.find(
                      (vi) => vi.variant_id === selectedVariant.id
                    );
                    
                    // Debug logging
                    console.log('Selected Variant:', selectedVariant.id, selectedVariant.size, selectedVariant.color);
                    console.log('Variant Image Data:', variantImageData);
                    console.log('Variant Image Data Keys:', variantImageData ? Object.keys(variantImageData) : 'null');
                    console.log('Variant Image Data.images:', variantImageData?.images);
                    console.log('Variant Image Data.images type:', typeof variantImageData?.images);
                    console.log('Variant Image Data.images length:', variantImageData?.images?.length);
                    console.log('All Variant Images:', syncData.variant_images);
                    console.log('All Images Array:', allImages);
                    
                    if (variantImageData?.images && variantImageData.images.length > 0) {
                      // Show ONLY the selected variant's images
                      // Don't filter against allImages - use variant images directly
                      imagesToShow = variantImageData.images;
                      console.log('Images to Show for Variant:', imagesToShow);
                      console.log('Variant images count:', imagesToShow.length);
                    } else {
                      // Fallback: if no variant images found, use all images
                      imagesToShow = allImages;
                      console.log('No variant images found, using all images');
                      console.log('Reason:', !variantImageData ? 'variantImageData is null' : !variantImageData.images ? 'variantImageData.images is missing' : variantImageData.images.length === 0 ? 'variantImageData.images is empty array' : 'unknown');
                    }
                  } else {
                    // No variant selected, show all images
                    imagesToShow = allImages;
                    console.log('No variant selected, showing all images');
                  }
                  
                  // Get current image to display
                  let currentImage: string | null = selectedProduct.image_path;
                  if (imagesToShow.length > 0) {
                    // Always use displayImageIndex, which is reset when variant changes
                    const currentDisplayIndex = Math.min(displayImageIndex, imagesToShow.length - 1);
                    const imageAtIndex = imagesToShow[currentDisplayIndex] || imagesToShow[0];
                    if (imageAtIndex) {
                      currentImage = imageAtIndex;
                    }
                  }
                  
                  console.log('Current Image to Display:', currentImage);
                  console.log('Display Image Index:', displayImageIndex);
                  
                  if (!currentImage) return null;
                  
                  // If we have multiple images, show a gallery; otherwise show single image
                  if (imagesToShow.length > 1) {
                    return (
                      <div className="w-full">
                        {/* Main Image */}
                        <div className="h-48 md:h-64 relative overflow-hidden rounded-t-2xl bg-gray-50">
                          <Image
                            key={`variant-${selectedVariant?.id || 'none'}-img-${displayImageIndex}`}
                            src={currentImage.startsWith('http') ? currentImage : currentImage}
                            alt={selectedProduct.name}
                            fill
                            className="object-contain"
                            unoptimized={currentImage.startsWith('http')}
                          />
                        </div>
                        {/* Thumbnail Gallery - Clickable */}
                        <div className="px-4 pt-2 pb-4">
                          <p className="text-xs text-black/60 mb-2">
                            {imagesToShow.length} mockup{imagesToShow.length > 1 ? 's' : ''} available - Click to view
                            {selectedVariant && (
                              <span className="block text-ember mt-1">
                                Showing mockups for: {selectedVariant.size || selectedVariant.color || 'selected variant'}
                              </span>
                            )}
                          </p>
                          <div className="flex gap-2 overflow-x-auto">
                            {imagesToShow.map((img: string, idx: number) => {
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    const originalIndex = allImages.findIndex((allImg: string) => allImg === img);
                                    if (originalIndex >= 0) {
                                      setSelectedImageIndex(originalIndex);
                                    }
                                    // Update display index to match clicked thumbnail
                                    setDisplayImageIndex(idx);
                                  }}
                                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                                    displayImageIndex === idx
                                      ? 'border-ember ring-2 ring-ember/30'
                                      : 'border-ember/30 hover:border-ember/50'
                                  }`}
                                  title={`Mockup ${idx + 1}`}
                                >
                                  <img
                                    src={img.startsWith('http') ? img : img}
                                    alt={`${selectedProduct.name} mockup ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  } else if (imagesToShow.length === 1) {
                    // Single image
                    return (
                      <div className="w-full h-48 md:h-64 relative overflow-hidden rounded-t-2xl bg-gray-50">
                        <Image
                          key={`variant-${selectedVariant?.id || 'none'}-single`}
                          src={imagesToShow[0].startsWith('http') ? imagesToShow[0] : imagesToShow[0]}
                          alt={selectedProduct.name}
                          fill
                          className="object-contain"
                          unoptimized={imagesToShow[0].startsWith('http')}
                        />
                        {selectedVariant && (
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {selectedVariant.size || selectedVariant.color || 'Selected variant'}
                          </div>
                        )}
                      </div>
                    );
                  } else if (selectedProduct.image_path) {
                    // Fallback to product image
                    return (
                      <div className="w-full h-48 md:h-64 relative overflow-hidden rounded-t-2xl bg-gray-50">
                        <Image
                          src={
                            selectedProduct.image_path.startsWith('http') 
                              ? selectedProduct.image_path
                              : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${selectedProduct.image_path}`
                          }
                          alt={selectedProduct.name}
                          fill
                          className="object-contain"
                          unoptimized={selectedProduct.image_path.startsWith('http')}
                        />
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Form */}
                <form onSubmit={handleCheckoutSubmit} className="space-y-6 p-8">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-2xl font-serif font-medium">Complete Your Purchase</h2>
                      <Badge variant="outline" className="text-ember border-ember">
                        {'product_category' in selectedProduct && selectedProduct.product_category === 'wine_bear' ? 'Wine Bear' : selectedProduct.product_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-medium text-charcoal mb-2">{selectedProduct.name}</h3>
                    {selectedProduct.description && (
                      <p className="text-black/70 leading-relaxed mb-4">{selectedProduct.description}</p>
                    )}
                    
                    {/* Variant Selection - Two Step: Style/Color then Size */}
                    {selectedProduct.printful_sync_data?.variants && selectedProduct.printful_sync_data.variants.length > 0 && (() => {
                      const variants = selectedProduct.printful_sync_data.variants;
                      const variantTypes = getVariantTypes(variants);
                      
                      // If we have multiple variant types (colors), show two-step selection
                      if (variantTypes.length > 1) {
                        return (
                          <div className="mb-4 space-y-4">
                            {/* Step 1: Select Variant Type (Color/Style) */}
                            <div>
                              <label className="block text-sm font-medium text-black/80 mb-2">
                                Select Style/Color *
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {variantTypes.map((type) => {
                                  const isSelected = selectedVariantType === type;
                                  // Get first variant of this type to show preview
                                  const firstVariantOfType = variants.find((v: PrintfulVariant) => {
                                    const vType = v.color || v.name || 'Default';
                                    return vType === type;
                                  });
                                  
                                  return (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => {
                                        setSelectedVariantType(type);
                                        setSelectedVariant(null); // Reset size selection
                                        setDisplayImageIndex(0); // Reset display index
                                        
                                        // Auto-select first size of this variant type
                                        const sizesForType = getSizesForVariantType(variants, type);
                                        if (sizesForType.length > 0) {
                                          setSelectedVariant(sizesForType[0]);
                                          
                                          // Update image to match selected variant
                                          const variantImageData = selectedProduct.printful_sync_data?.variant_images?.find(
                                            (vi: any) => vi.variant_id === sizesForType[0].id
                                          );
                                          
                                          if (variantImageData?.images && variantImageData.images.length > 0) {
                                            const allImages = selectedProduct.printful_sync_data?.all_images || [];
                                            const firstVariantImage = variantImageData.images[0];
                                            const imgIndex = allImages.findIndex((img: string) => img === firstVariantImage);
                                            if (imgIndex >= 0) {
                                              setSelectedImageIndex(imgIndex);
                                            }
                                          }
                                        }
                                      }}
                                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                                        isSelected
                                          ? 'border-ember bg-ember/10 ring-2 ring-ember/20'
                                          : 'border-black/10 hover:border-ember/50 bg-white'
                                      }`}
                                    >
                                      <div className="font-medium text-sm">{type}</div>
                                      {firstVariantOfType && extractPriceFromVariant(firstVariantOfType) > 0 && (
                                        <div className="text-xs text-black/60 mt-1">
                                          From ${extractPriceFromVariant(firstVariantOfType).toFixed(2)}
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {/* Step 2: Select Size (only show if variant type is selected) */}
                            {selectedVariantType && (() => {
                              const sizesForType = getSizesForVariantType(variants, selectedVariantType);
                              
                              return (
                                <div>
                                  <label className="block text-sm font-medium text-black/80 mb-2">
                                    Select Size *
                                  </label>
                                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {sizesForType.map((variant: PrintfulVariant) => {
                                      const isSelected = selectedVariant?.id === variant.id;
                                      const sizeName = variant.size || variant.name || 'Standard';
                                      const variantPrice = extractPriceFromVariant(variant);
                                      
                                      return (
                                        <button
                                          key={variant.id}
                                          type="button"
                                          onClick={() => {
                                            setSelectedVariant(variant);
                                            setDisplayImageIndex(0); // Reset display index when size changes
                                            
                                            // Update image to match selected variant
                                            const variantImageData = selectedProduct.printful_sync_data?.variant_images?.find(
                                              (vi: any) => vi.variant_id === variant.id
                                            );
                                            
                                            if (variantImageData?.images && variantImageData.images.length > 0) {
                                              const allImages = selectedProduct.printful_sync_data?.all_images || [];
                                              const firstVariantImage = variantImageData.images[0];
                                              const imgIndex = allImages.findIndex((img: string) => img === firstVariantImage);
                                              if (imgIndex >= 0) {
                                                setSelectedImageIndex(imgIndex);
                                              }
                                            }
                                          }}
                                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                                            isSelected
                                              ? 'border-ember bg-ember/10 ring-2 ring-ember/20'
                                              : 'border-black/10 hover:border-ember/50 bg-white'
                                          }`}
                                        >
                                          <div className="font-medium text-sm">{sizeName}</div>
                                          {variantPrice > 0 && (
                                            <div className="text-xs text-black/60 mt-1">
                                              ${variantPrice.toFixed(2)}
                                            </div>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {!selectedVariant && (
                                    <p className="text-xs text-red-600 mt-1">Please select a size</p>
                                  )}
                                </div>
                              );
                            })()}
                            
                            {!selectedVariantType && (
                              <p className="text-xs text-red-600 mt-1">Please select a style/color first</p>
                            )}
                          </div>
                        );
                      }
                      
                      // Fallback: If only one variant type, show sizes directly
                      return (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-black/80 mb-2">
                            Select Size *
                          </label>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {variants.map((variant: PrintfulVariant, idx: number) => {
                              const isSelected = selectedVariant?.id === variant.id;
                              const sizeName = variant.size || variant.name || `Option ${idx + 1}`;
                              const variantPrice = extractPriceFromVariant(variant);
                              
                              return (
                                <button
                                  key={variant.id || idx}
                                  type="button"
                                  onClick={() => {
                                    setSelectedVariant(variant);
                                    setDisplayImageIndex(0); // Reset display index when size changes
                                    
                                    // Get variant-specific images
                                    const variantImageData = selectedProduct.printful_sync_data?.variant_images?.find(
                                      (vi: any) => vi.variant_id === variant.id
                                    );
                                    
                                    if (variantImageData?.images && variantImageData.images.length > 0) {
                                      const allImages = selectedProduct.printful_sync_data?.all_images || [];
                                      const firstVariantImage = variantImageData.images[0];
                                      const imgIndex = allImages.findIndex((img: string) => img === firstVariantImage);
                                      if (imgIndex >= 0) {
                                        setSelectedImageIndex(imgIndex);
                                      }
                                    }
                                  }}
                                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                                    isSelected
                                      ? 'border-ember bg-ember/10 ring-2 ring-ember/20'
                                      : 'border-black/10 hover:border-ember/50 bg-white'
                                  }`}
                                >
                                  <div className="font-medium text-sm">{sizeName}</div>
                                  {variantPrice > 0 && (
                                    <div className="text-xs text-black/60 mt-1">
                                      ${variantPrice.toFixed(2)}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          {!selectedVariant && (
                            <p className="text-xs text-red-600 mt-1">Please select a size</p>
                          )}
                        </div>
                      );
                    })()}
                    
                    {/* Price Breakdown */}
                    <div className="space-y-2 border-t border-black/10 pt-4 mt-4">
                      <div className="flex items-center justify-between text-base">
                        <span className="text-black/70">Product Price:</span>
                        <span className="font-medium">
                          {(() => {
                            const currentPrice = getCurrentPrice();
                            return currentPrice === 0 ? 'TBD' : `$${currentPrice.toFixed(2)}`;
                          })()}
                        </span>
                      </div>
                      {selectedProduct.product_type === 'physical' && (
                        <>
                          <div className="flex items-center justify-between text-base">
                            <span className="text-black/70">Shipping:</span>
                            <span className="font-medium">${SHIPPING_COST.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-xl font-semibold text-ember border-t border-black/10 pt-2 mt-2">
                            <span>Total:</span>
                            <span>
                              {(() => {
                                const currentPrice = getCurrentPrice();
                                const total = currentPrice + SHIPPING_COST;
                                return currentPrice === 0 ? 'TBD' : `$${total.toFixed(2)}`;
                              })()}
                            </span>
                          </div>
                          <p className="text-xs text-black/60 mt-2">
                            * Shipping calculated at checkout. US only.
                          </p>
                        </>
                      )}
                      {selectedProduct.product_type !== 'physical' && (
                        <div className="flex items-center justify-between text-xl font-semibold text-ember border-t border-black/10 pt-2 mt-2">
                          <span>Total:</span>
                          <span>
                            {(() => {
                              const currentPrice = getCurrentPrice();
                              return currentPrice === 0 ? 'TBD' : `$${currentPrice.toFixed(2)}`;
                            })()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="focus-ring"
                      />
                    </div>

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Your Name"
                        required
                        className="focus-ring"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeCheckoutForm}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading === selectedProduct.id || !customerEmail || !customerName}
                      className="btn-ember flex-1"
                    >
                      {loading === selectedProduct.id ? 'Processing...' : 'Continue to Payment'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* Philosophy Section */}
      <div className="text-center bg-cream rounded-2xl p-12">
        <h2 className="text-section mb-6">Wear What Matters</h2>
        <p className="text-black/80 max-w-3xl mx-auto mb-8">
          Every piece in our collection is designed to remind you of what matters: 
          slowing down, gathering around fire, and building real connections. 
          Wear these pieces as a quiet signal to others who value the same things.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-ember/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Quality Materials</h3>
            <p className="text-sm text-black/70">Thoughtfully sourced, comfortable, built to last</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-ember/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Community Signal</h3>
            <p className="text-sm text-black/70">A quiet way to recognize others who value slow living</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-ember/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Support the Mission</h3>
            <p className="text-sm text-black/70">Your purchase helps us create more gatherings and content</p>
          </div>
        </div>
      </div>
    </div>
  );
}

