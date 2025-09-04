'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';

export default function StorePage(){
  const [loading, setLoading] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [tipAmount, setTipAmount] = useState<number>(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCheckout = async (productId: string, productPrice: number) => {
    setLoading(productId);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          customAmount: productPrice === 0 ? tipAmount : undefined,
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

  const ProductCard = ({ 
    title, 
    price, 
    description, 
    badge, 
    featured = false,
    comingSoon = false,
    productId,
    productPrice = 0,
    imagePath
  }: {
    title: string;
    price: string;
    description: string;
    badge?: string;
    featured?: boolean;
    comingSoon?: boolean;
    re solidproductId?: string;
    productPrice?: number;
    imagePath?: string;
  }) => (
    <div className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-lg transition-all duration-300 ${featured ? 'md:col-span-2' : ''}`}>
      {badge && (
        <Badge className="absolute top-4 left-4 z-10 bg-ember text-white">
          {badge}
        </Badge>
      )}
      {comingSoon && (
        <Badge className="absolute top-4 right-4 z-10 bg-gray-500 text-white">
          Coming Soon
        </Badge>
      )}
      <div className={`aspect-square bg-gray-100 relative overflow-hidden ${featured ? 'md:aspect-[4/3]' : ''}`}>
        {imagePath ? (
          <img 
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${imagePath}`}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-sm">Product Image</div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        <p className="text-sm text-black/70 mb-4 line-clamp-2">{description}</p>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xl font-serif text-ember">{price}</span>
            <Button 
              className="btn-ember px-4 py-2 rounded-full text-sm self-start sm:self-auto"
              disabled={comingSoon || loading === productId}
              onClick={() => productId && handleCheckout(productId, productPrice)}
            >
              {loading === productId ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : comingSoon ? 'Coming Soon' : productPrice === 0 ? 'Get Free Recipe' : 'Buy Now'}
            </Button>
          </div>
          
          {/* Tip input for free products */}
          {productPrice === 0 && !comingSoon && (
            <div className="space-y-2">
              <label className="text-sm text-black/70">Optional tip to support the community:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={tipAmount || ''}
                  onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ember focus:border-transparent"
                />
                <span className="text-sm text-black/70 self-center">USD</span>
              </div>
              <p className="text-xs text-black/50">Any amount helps support creating more content!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4 text-charcoal">Wine With Pete Store</h1>
        <p className="text-lg text-black/70 max-w-2xl mx-auto">
          Digital recipe cards, guides, and e-books for the slow living community. 
          Quality over quantity, meaning over mass production.
        </p>
      </div>

      {/* Featured Free Recipe Card */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-serif text-charcoal">Featured Recipe Card</h2>
          <Badge className="bg-green-600 text-white">
            Free with Optional Tip
          </Badge>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsLoading ? (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border animate-pulse md:col-span-2">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ) : (
            products
              .filter(product => product.product_type === 'recipe_card' && product.is_active && product.price === 0)
              .map((product, index) => (
                <ProductCard
                  key={product.id}
                  title={product.name}
                  price={product.price === 0 ? "Free (Pay What You Want)" : `$${product.price}`}
                  description={product.description || ''}
                  badge="Free Sample"
                  featured={true}
                  productId={product.id}
                  productPrice={product.price}
                  imagePath={product.image_path}
                />
              ))
          )}
        </div>
      </div>

      {/* Digital Recipe Cards */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-serif text-charcoal">Full Recipe Collections</h2>
          <Badge variant="outline" className="text-ember border-ember">
            Coming Soon
          </Badge>
        </div>
        {productsLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter(product => product.product_type === 'recipe_card' && product.is_active)
              .map((product, index) => (
                <ProductCard
                  key={product.id}
                  title={product.name}
                  price={product.price === 0 ? "Free (Pay What You Want)" : `$${product.price}`}
                  description={product.description || ''}
                  badge={product.price === 0 ? "Free Sample" : index === 0 ? "Popular" : index === 1 ? "New" : undefined}
                  productId={product.id}
                  productPrice={product.price}
                  imagePath={product.image_path}
                />
              ))}
            {/* Show message if no products */}
            {products.filter(product => product.product_type === 'recipe_card' && product.is_active).length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-black/70 mb-4">No recipe cards available yet.</p>
                <p className="text-sm text-black/50">Check back soon for our first collection!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guides & E-books */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-serif text-charcoal">Guides & E-books</h2>
          <Badge variant="outline" className="text-ember border-ember">
            Coming Soon
          </Badge>
        </div>
        <div className="text-center py-12">
          <p className="text-black/70 mb-4">More guides and e-books coming soon!</p>
          <p className="text-sm text-black/50">We're working on bringing you thoughtful digital resources.</p>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="mb-16">
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
          <h3 className="text-2xl font-serif font-medium mb-4 text-charcoal">More Coming Soon</h3>
          <p className="text-black/70 mb-6 max-w-2xl mx-auto">
            We&apos;re working on bringing you more thoughtful digital products that align with our mission. 
            Think individual recipe cards, fire-starting guides, and curated wine education materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <Button variant="outline" className="border-ember text-ember hover:bg-ember hover:text-white rounded-full px-6">
                Get Notified
              </Button>
            </Link>
            <Link href="/join">
              <Button className="btn-ember px-6 rounded-full">
                Join the Circle
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="text-center bg-white rounded-2xl p-12 border">
        <h3 className="text-2xl font-serif font-medium mb-4 text-charcoal">Our Store Philosophy</h3>
        <p className="text-black/70 mb-6 max-w-3xl mx-auto">
          We believe in quality over quantity. Every digital product we offer is carefully crafted 
          to enhance your slow living journey. No mass production, no meaningless content. 
          Just thoughtful resources that bring people together around fire, food, and conversation.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <img src="/images/icons/icon-fire.png" alt="Quality First" className="w-10 h-10" />
            </div>
            <h4 className="font-medium mb-2 text-charcoal">Quality First</h4>
            <p className="text-sm text-black/70">Every resource is crafted for quality and alignment with our values.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <img src="/images/icons/icon-growth.png" alt="Slow & Sustainable" className="w-10 h-10" />
            </div>
            <h4 className="font-medium mb-2 text-charcoal">Slow & Sustainable</h4>
            <p className="text-sm text-black/70">We prioritize thoughtful consumption and digital sustainability.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <img src="/images/icons/icon-connection.png" alt="Community Focused" className="w-10 h-10" />
            </div>
            <h4 className="font-medium mb-2 text-charcoal">Community Focused</h4>
            <p className="text-sm text-black/70">Resources that bring people together and enhance connection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
