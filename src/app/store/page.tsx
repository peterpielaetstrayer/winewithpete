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

  const handleCheckout = async (productId: string) => {
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
    image, 
    description, 
    badge, 
    featured = false,
    comingSoon = false,
    productId
  }: {
    title: string;
    price: string;
    image: string;
    description: string;
    badge?: string;
    featured?: boolean;
    comingSoon?: boolean;
    productId?: string;
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
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Product Image</div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        <p className="text-sm text-black/70 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-xl font-serif text-ember">{price}</span>
          <Button 
            className="btn-ember px-4 py-2 rounded-full text-sm self-start sm:self-auto"
            disabled={comingSoon || loading === productId}
            onClick={() => productId && handleCheckout(productId)}
          >
            {loading === productId ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : comingSoon ? 'Coming Soon' : 'Buy Now'}
          </Button>
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

      {/* Digital Recipe Cards */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-serif text-charcoal">Fire-Friendly Recipe Cards</h2>
          <Badge variant="outline" className="text-ember border-ember">
            Digital Downloads
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
                  price={`$${product.price}`}
                  image="/fire-recipes.jpg" // You can add product images later
                  description={product.description || ''}
                  badge={index === 0 ? "Popular" : index === 1 ? "New" : undefined}
                  productId={product.id}
                />
              ))}
            {/* Fallback products if none in database */}
            {products.length === 0 && (
              <>
                <ProductCard
                  title="Open Fire Sunday Collection"
                  price="$12.99"
                  image="/fire-recipes.jpg"
                  description="5 carefully crafted recipes designed for cooking over open fire. Includes wine pairings and conversation starters."
                  badge="Popular"
                  productId="open-fire-collection"
                />
                <ProductCard
                  title="Pre-Prep Recipe Cards"
                  price="$8.99"
                  image="/prep-recipes.jpg"
                  description="3 recipes designed to be prepped the night before and cooked at the fire. Perfect for busy schedules."
                  badge="New"
                  productId="pre-prep-cards"
                />
              </>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            title="The Art of Learning [WINE]"
            price="$19.99"
            image="/wine-learning-ebook.jpg"
            description="A comprehensive guide for adult learners using wine as a medium. Teaches how to learn, taste, and appreciate wine systematically."
            comingSoon={true}
          />
          <ProductCard
            title="Fire Setup & Safety Guide"
            price="$9.99"
            image="/fire-guide.jpg"
            description="Complete guide to building and maintaining safe fires for cooking and gathering. Includes safety tips and equipment recommendations."
            comingSoon={true}
          />
          <ProductCard
            title="Conversation Starter Cards"
            price="$14.99"
            image="/conversation-cards.jpg"
            description="50 thoughtful questions designed to spark deeper conversations around the fire. Perfect for intimate gatherings."
            comingSoon={true}
          />
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
