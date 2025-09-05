'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';

export default function StorePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      console.log('Products fetched:', data);
      setProducts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCheckout = async (product: Product) => {
    setLoading(product.id);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          customerEmail: 'customer@example.com', // TODO: Collect from user
          customerName: 'Customer', // TODO: Collect from user
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

  if (productsLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-display animate-fade-in">The Store</h1>
          <p className="mt-4 text-black/80 animate-fade-in">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-display animate-fade-in">The Store</h1>
        <p className="mt-4 text-black/80 animate-fade-in max-w-2xl mx-auto">
          Digital guides, recipe cards, and resources for building community around fire, food, and honest conversation.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {products.map((product) => (
          <div key={product.id} className="card-enhanced animate-scale-in">
            {/* Product Image */}
            <div className="aspect-square relative overflow-hidden">
              {product.image_path ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${product.image_path}`}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
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
                <Badge variant="outline" className="text-ember border-ember">
                  {product.product_type.replace('_', ' ')}
                </Badge>
              </div>
              
              {product.description && (
                <p className="text-black/70 mb-4 line-clamp-3">{product.description}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold">
                  {product.price === 0 ? 'Free' : `$${product.price}`}
                </div>
                
                <Button
                  onClick={() => handleCheckout(product)}
                  disabled={loading === product.id}
                  className="btn-ember focus-ring"
                >
                  {loading === product.id ? 'Processing...' : 'Get It'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Philosophy Section */}
      <div className="text-center bg-cream rounded-2xl p-12">
        <h2 className="text-section mb-6">Why We Build This</h2>
        <p className="text-black/80 max-w-3xl mx-auto mb-8">
          Every product here is designed to help you create meaningful connections. 
          Whether it's a recipe card for your next fire gathering or a guide to deeper conversations, 
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