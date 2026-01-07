'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExpandableSection } from '@/components/expandable-section';
import { ToastContainer, showToast } from '@/components/toast';
import { FeaturedEssay, Product } from '@/lib/types';
import { analyticsEvents } from '@/lib/analytics';

// Inline email form component
function InlineEmailForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        analyticsEvents.newsletterSignup();
        showToast('Welcome to the Circle! Check your email.', 'success');
        setEmail('');
        onSuccess();
      } else {
        showToast(result.error || 'Something went wrong. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Failed to subscribe. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-full bg-white/95 text-[#1f1f1f] border border-[#1f1f1f]/15 focus:outline-none focus:ring-2 focus:ring-[#c98a2b]/50"
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={isSubmitting || !email}
        className="w-full py-3 px-6 rounded-full bg-[#c98a2b] text-white font-medium hover:bg-[#b87a1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Joining...' : 'Join'}
      </button>
      <Link 
        href="/join" 
        className="block text-center text-[#f6f3ef]/80 hover:text-[#f6f3ef] text-sm transition-colors"
        onClick={() => analyticsEvents.startPageButtonClicked('View Full Join Page')}
      >
        View full page →
      </Link>
    </form>
  );
}

// Product preview component
function ProductPreview({ product }: { product: Product }) {
  const handleGetIt = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast('Checkout failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Checkout failed. Please try again.', 'error');
    }
  };

  const imageUrl = product.image_path?.startsWith('http') 
    ? product.image_path 
    : product.image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/product-images/${product.image_path}`
    : null;

  return (
    <div className="bg-white/10 rounded-lg p-4 space-y-3">
      {imageUrl && (
        <div className="relative w-full aspect-video rounded overflow-hidden bg-white/5">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <div>
        <h4 className="font-medium text-[#f6f3ef] mb-1">{product.name}</h4>
        {product.description && product.description !== product.name && (
          <p className="text-sm text-[#f6f3ef]/80 mb-2 line-clamp-2">{product.description}</p>
        )}
        <p className="text-[#f6f3ef] font-medium mb-3">${product.price.toFixed(2)}</p>
        <button
          onClick={handleGetIt}
          className="w-full py-2 px-4 rounded-full bg-[#c98a2b] text-white text-sm font-medium hover:bg-[#b87a1f] transition-colors"
        >
          Get It
        </button>
      </div>
    </div>
  );
}

// Essay preview component
function EssayPreview({ essay }: { essay: FeaturedEssay }) {
  return (
    <div className="bg-white/10 rounded-lg p-4 space-y-3">
      {essay.image_url && (
        <div className="relative w-full aspect-video rounded overflow-hidden bg-white/5">
          <img
            src={essay.image_url}
            alt={essay.title || 'Essay image'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div>
        <h4 className="font-medium text-[#f6f3ef] mb-1">{essay.title || 'Untitled Essay'}</h4>
        {essay.excerpt && (
          <p className="text-sm text-[#f6f3ef]/80 mb-3 line-clamp-3">{essay.excerpt}</p>
        )}
        <a
          href={essay.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-2 px-4 rounded-full bg-[#c98a2b] text-white text-sm font-medium hover:bg-[#b87a1f] transition-colors"
          onClick={() => analyticsEvents.essayClicked(essay.title || 'Untitled', essay.url)}
        >
          Read Essay →
        </a>
      </div>
      <Link
        href="/essays"
        className="block text-center text-[#f6f3ef]/80 hover:text-[#f6f3ef] text-sm transition-colors"
        onClick={() => analyticsEvents.startPageButtonClicked('Browse All Essays')}
      >
        Browse all essays →
      </Link>
    </div>
  );
}

export function StartPageContent() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [featuredEssay, setFeaturedEssay] = useState<FeaturedEssay | null>(null);
  const [featuredRecipes, setFeaturedRecipes] = useState<Product[]>([]);
  const [featuredMerch, setFeaturedMerch] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all featured data
    Promise.all([
      fetch('/api/essays?featured=true').then(r => r.json()),
      fetch('/api/products?featured=true&category=digital').then(r => r.json()),
      fetch('/api/products?featured=true&category=physical').then(r => r.json()),
    ]).then(([essaysRes, recipesRes, merchRes]) => {
      if (essaysRes.success && essaysRes.data?.length > 0) {
        setFeaturedEssay(essaysRes.data[0]);
      }
      if (recipesRes.success) {
        setFeaturedRecipes(recipesRes.data?.slice(0, 3) || []);
      }
      if (merchRes.success && merchRes.data?.length > 0) {
        setFeaturedMerch(merchRes.data[0]);
      }
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch featured data:', err);
      setLoading(false);
    });
  }, []);

  const handleToggle = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <>
      <ToastContainer />
      <div className="space-y-10">
        {/* Connect & Belong */}
        <ExpandableSection
          id="join"
          title="Connect & Belong"
          buttonText="Join the Circle"
          buttonHref="/join"
          isExpanded={expandedSection === 'join'}
          onToggle={handleToggle}
        >
          <InlineEmailForm onSuccess={() => setExpandedSection(null)} />
        </ExpandableSection>

        {/* Section separator */}
        <div className="h-px bg-[#f6f3ef]/10"></div>

        {/* Make Something Delicious */}
        <ExpandableSection
          id="recipes"
          title="Make Something Delicious"
          buttonText="Recipes & Guides"
          buttonHref="/recipes"
          isExpanded={expandedSection === 'recipes'}
          onToggle={handleToggle}
        >
          {loading ? (
            <div className="text-center text-[#f6f3ef]/60 py-4">Loading...</div>
          ) : featuredRecipes.length > 0 ? (
            <div className="space-y-4">
              {featuredRecipes.map((product) => (
                <ProductPreview key={product.id} product={product} />
              ))}
              <Link
                href="/recipes"
                className="block text-center text-[#f6f3ef]/80 hover:text-[#f6f3ef] text-sm transition-colors"
                onClick={() => analyticsEvents.startPageButtonClicked('View All Recipes')}
              >
                View all recipes & guides →
              </Link>
            </div>
          ) : (
            <div className="text-center text-[#f6f3ef]/60 py-4">
              <p className="mb-3">Featured recipes coming soon.</p>
              <Link
                href="/recipes"
                className="text-[#f6f3ef]/80 hover:text-[#f6f3ef] text-sm transition-colors"
              >
                Browse all recipes →
              </Link>
            </div>
          )}
        </ExpandableSection>

        {/* Section separator */}
        <div className="h-px bg-[#f6f3ef]/10"></div>

        {/* Shop Merch */}
        <ExpandableSection
          id="merch"
          title="Shop Merch"
          buttonText="Browse Store"
          buttonHref="/store"
          isExpanded={expandedSection === 'merch'}
          onToggle={handleToggle}
        >
          {loading ? (
            <div className="text-center text-[#f6f3ef]/60 py-4">Loading...</div>
          ) : featuredMerch ? (
            <div className="space-y-4">
              <ProductPreview product={featuredMerch} />
              <Link
                href="/store"
                className="block text-center text-[#f6f3ef]/80 hover:text-[#f6f3ef] text-sm transition-colors"
                onClick={() => analyticsEvents.startPageButtonClicked('View All Merch')}
              >
                Browse full store →
              </Link>
            </div>
          ) : (
            <div className="text-center text-[#f6f3ef]/60 py-4">
              <p className="mb-3">Featured merch coming soon.</p>
              <Link
                href="/store"
                className="text-[#f6f3ef]/80 hover:text-[#f6f3ef] text-sm transition-colors"
              >
                Browse store →
              </Link>
            </div>
          )}
        </ExpandableSection>

        {/* Section separator */}
        <div className="h-px bg-[#f6f3ef]/10"></div>

        {/* Explore Ideas & Stories */}
        <ExpandableSection
          id="essays"
          title="Explore Ideas & Stories"
          buttonText="Read an Essay"
          buttonHref="/essays"
          isExpanded={expandedSection === 'essays'}
          onToggle={handleToggle}
        >
          {loading ? (
            <div className="text-center text-[#f6f3ef]/60 py-4">Loading...</div>
          ) : featuredEssay ? (
            <EssayPreview essay={featuredEssay} />
          ) : (
            <div className="text-center text-[#f6f3ef]/60 py-4">
              <p className="mb-3">Featured essay coming soon.</p>
              <Link
                href="/essays"
                className="text-[#f6f3ef]/80 hover:text-[#f6f3ef] text-sm transition-colors"
              >
                Browse all essays →
              </Link>
            </div>
          )}
        </ExpandableSection>

        {/* Section separator */}
        <div className="h-px bg-[#f6f3ef]/10"></div>

        {/* Return to Your Foundation */}
        <ExpandableSection
          id="baseline"
          title="Return to Your Foundation"
          buttonText="The Baseline Method"
          buttonHref="/baseline-method"
          isExpanded={expandedSection === 'baseline'}
          onToggle={handleToggle}
        >
          <div className="bg-white/10 rounded-lg p-4 space-y-3">
            <div className="relative w-full aspect-[8.5/11] rounded overflow-hidden bg-white/5">
              <img
                src="/images/baseline-method/quickstart/1.png"
                alt="Baseline Method Quick Start Preview"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-sm text-[#f6f3ef]/80 mb-3">
              A condensed guide to get started today. Return to your baseline through simple, daily anchors.
            </p>
            <div className="space-y-2">
              <Link
                href="/baseline-method/quickstart"
                className="block w-full py-2 px-4 rounded-full bg-[#c98a2b] text-white text-sm font-medium hover:bg-[#b87a1f] transition-colors text-center"
                onClick={() => analyticsEvents.baselineMethodQuickstartViewed()}
              >
                View Quick Start →
              </Link>
              <Link
                href="/baseline-method"
                className="block text-center text-[#f6f3ef]/80 hover:text-[#f6f3ef] text-sm transition-colors"
                onClick={() => analyticsEvents.startPageButtonClicked('Get Full Baseline Method')}
              >
                Get full guide →
              </Link>
            </div>
          </div>
        </ExpandableSection>

        {/* Section separator */}
        <div className="h-px bg-[#f6f3ef]/10"></div>

        {/* Join In Person */}
        <ExpandableSection
          id="gatherings"
          title="Join In Person"
          buttonText="See Gatherings"
          buttonHref="/gatherings"
          isExpanded={expandedSection === 'gatherings'}
          onToggle={handleToggle}
        >
          <div className="text-center text-[#f6f3ef]/60 py-4">
            <p className="mb-3">Upcoming gatherings will appear here.</p>
            <Link
              href="/gatherings"
              className="text-[#f6f3ef]/80 hover:text-[#f6f3ef] text-sm transition-colors"
              onClick={() => analyticsEvents.startPageButtonClicked('View All Gatherings')}
            >
              View all gatherings →
            </Link>
          </div>
        </ExpandableSection>
      </div>
    </>
  );
}
