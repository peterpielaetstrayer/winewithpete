'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';

export default function RecipesPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Don't set products to empty - let placeholder show
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCheckoutClick = (product: Product) => {
    setSelectedProduct(product);
    setShowCheckoutForm(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(selectedProduct.id);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantity: 1,
          customerEmail: customerEmail,
          customerName: customerName,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout failed:', data.error);
        alert('Checkout failed. Please try again.');
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
    setCustomerEmail('');
    setCustomerName('');
  };

  // Placeholder products for when store is empty
  const placeholderProducts = [
    {
      id: 'placeholder-1',
      name: 'Fire Ritual Recipe Bundle',
      description: 'Essential recipes for your first gathering. Pre-prep friendly, fire-tested, and designed for community.',
      price: 0,
      product_type: 'bundle' as const,
      is_active: true,
      image_path: null,
      file_path: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'placeholder-2',
      name: 'Conversation Starters Guide',
      description: 'Questions and prompts for deeper dialogue. Designed to spark meaningful conversations around the fire.',
      price: 0,
      product_type: 'guide' as const,
      is_active: true,
      image_path: null,
      file_path: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'placeholder-3',
      name: 'Hosting Handbook',
      description: 'How to create meaningful gatherings in your community. Practical guidance for hosting your own events.',
      price: 0,
      product_type: 'guide' as const,
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
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-display animate-fade-in">Recipes & Guides</h1>
        <p className="mt-4 text-black/80 animate-fade-in max-w-2xl mx-auto">
          Digital resources for fire cooking and building community around honest conversation.
        </p>
      </div>

      {/* Coming Soon Message */}
      {showPlaceholderMessage && (
        <div className="bg-cream rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-serif font-medium mb-4 text-charcoal">
            Recipe Bundles Coming Soon
          </h2>
          <p className="text-black/70 leading-relaxed mb-6 max-w-2xl mx-auto">
            We&apos;re curating our first collection of fire-friendly recipes and guides. 
            Stay connected to be notified when they&apos;re available.
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
                      unoptimized={product.image_path.startsWith('http')} // Unoptimized for Printful URLs to avoid domain issues
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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
                        {product.product_type.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                  
                  {product.description && (
                    <p className="text-black/70 mb-4 line-clamp-3">{product.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold">
                      {product.price === 0 ? 'Free' : `$${product.price}`}
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
                        {loading === product.id ? 'Processing...' : 'Get It'}
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
              <div className="bg-white rounded-2xl p-8 w-full max-w-md relative animate-scale-in">
                {/* Close button */}
                <button
                  onClick={closeCheckoutForm}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Form */}
                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-serif font-medium mb-2">Complete Your Purchase</h2>
                    <p className="text-black/70">{selectedProduct.name}</p>
                    <p className="text-xl font-semibold mt-2">
                      {selectedProduct.price === 0 ? 'Free' : `$${selectedProduct.price}`}
                    </p>
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
        <h2 className="text-section mb-6">Why We Build This</h2>
        <p className="text-black/80 max-w-3xl mx-auto mb-8">
          Every product here is designed to help you create meaningful connections. 
          Whether it&apos;s a recipe card for your next fire gathering or a guide to deeper conversations, 
          these tools are built for real people, real moments, real community.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-ember/10 rounded-full flex items-center justify-center">
              <Image
                src="/images/icons/icon-fire.png"
                alt="Fire"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <h3 className="font-medium mb-2">Gather Around Fire</h3>
            <p className="text-sm text-black/70">Recipes and guides for open-fire cooking</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-ember/10 rounded-full flex items-center justify-center">
              <Image
                src="/images/icons/icon-connection.png"
                alt="Connection"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <h3 className="font-medium mb-2">Build Connection</h3>
            <p className="text-sm text-black/70">Tools for deeper, more honest conversations</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-ember/10 rounded-full flex items-center justify-center">
              <Image
                src="/images/icons/icon-community.png"
                alt="Community"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <h3 className="font-medium mb-2">Grow Community</h3>
            <p className="text-sm text-black/70">Resources for building lasting relationships</p>
          </div>
        </div>
      </div>
    </div>
  );
}

