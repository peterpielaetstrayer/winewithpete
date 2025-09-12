'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth-provider';
import { canAccessPackage, isPremiumContent, getAvailableServingSizes } from '@/lib/access-control';
import { useSubscription } from '@/hooks/use-subscription';
import PaywallModal from '@/components/paywall-modal';
import { Star, Crown } from 'lucide-react';
import type { Package } from '@/lib/types';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [paywallModal, setPaywallModal] = useState<{
    isOpen: boolean;
    packageData: Package | null;
  }>({ isOpen: false, packageData: null });
  
  const { member } = useAuth();
  const { upgradeSubscription, getRequiredTier, canAccessContent } = useSubscription();

  useEffect(() => {
    async function loadData() {
      try {
        // Load packages - if member, show all; if not, show only published
        let query = supabase
          .from('packages')
          .select('*')
          .order('created_at', { ascending: false });

        if (!member) {
          query = query.eq('published', true);
        }

        const { data: packagesData } = await query;
        setPackages(packagesData || []);
      } catch (error) {
        console.error('Error loading packages:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [member]);

  const filteredPackages = packages.filter(pkg => {
    // Check if user can access this package
    if (!canAccessPackage(pkg, member)) return false;
    
    if (filter === 'all') return true;
    return pkg.package_type === filter;
  });

  const packageTypes = [
    { id: 'all', label: 'All Packages' },
    { id: 'open_fire_menu', label: 'Open-Fire Menus' },
    { id: 'pairing_guide', label: 'Pairing Guides' },
    { id: 'gathering_kit', label: 'Gathering Kits' }
  ];

  const handlePackageClick = (pkg: Package) => {
    if (!member) {
      // Redirect to join page for non-members
      window.location.href = '/join';
      return;
    }

    if (!canAccessContent(pkg)) {
      // Show paywall modal
      setPaywallModal({ isOpen: true, packageData: pkg });
      return;
    }

    // Allow access to package
    window.location.href = `/packages/${pkg.slug}`;
  };

  const handleUpgrade = (tier: 'premium' | 'founder') => {
    upgradeSubscription(tier);
  };

  const closePaywallModal = () => {
    setPaywallModal({ isOpen: false, packageData: null });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-display animate-fade-in">Loading Packages...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-display animate-fade-in">Open-Fire Packages</h1>
        <p className="mt-4 text-black/80 animate-fade-in max-w-2xl mx-auto">
          Curated collections of recipes, shopping lists, and wine pairings designed for cooking over open fire.
          {!member && (
            <span className="block mt-2 text-ember">
              <Link href="/join" className="underline hover:no-underline">
                Join as a member
              </Link> to access all packages.
            </span>
          )}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <nav className="flex flex-wrap justify-center gap-2">
          {packageTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFilter(type.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === type.id
                  ? 'bg-ember text-white'
                  : 'bg-black/5 text-black/70 hover:bg-black/10'
              }`}
            >
              {type.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPackages.map((pkg) => (
          <div 
            key={pkg.id} 
            onClick={() => handlePackageClick(pkg)}
            className="group cursor-pointer"
          >
            <div className="card-enhanced animate-scale-in h-full">
              {/* Package Image */}
              <div className="aspect-video relative overflow-hidden">
                {pkg.cover_url ? (
                  <Image
                    src={pkg.cover_url}
                    alt={pkg.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-ember/10 to-ember/5 flex items-center justify-center">
                    <svg className="w-16 h-16 text-ember/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                )}
                
                {/* Package Type Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="bg-white/90 text-ember border-ember">
                    {pkg.package_type.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Premium & Difficulty Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {isPremiumContent(pkg) && (
                    <Badge className="bg-amber-500 text-white">
                      Premium
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-white/90 text-ember border-ember capitalize">
                    {pkg.difficulty_level}
                  </Badge>
                </div>
              </div>

              {/* Package Info */}
              <div className="p-6">
                <h3 className="text-xl font-serif font-medium mb-2 group-hover:text-ember transition-colors">
                  {pkg.name}
                </h3>
                
                {pkg.description && (
                  <p className="text-black/70 mb-4 line-clamp-3">{pkg.description}</p>
                )}

                {/* Recipe Count & Serving Sizes */}
                <div className="flex items-center justify-between text-sm text-black/60">
                  <span>
                    {(pkg.recipes as any[])?.length || 0} recipes
                  </span>
                  <span>
                    Serves {getAvailableServingSizes(pkg, member).join(', ')}
                    {member?.subscription_tier === 'free' && isPremiumContent(pkg) && (
                      <span className="text-amber-600 ml-1">(limited)</span>
                    )}
                  </span>
                </div>

                {/* Tags */}
                {pkg.tags && pkg.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pkg.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-black/5 text-black/60 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {pkg.tags.length > 3 && (
                      <span className="text-xs text-black/40">
                        +{pkg.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Wine Pairing Hint */}
                {pkg.wine_pairing && (
                  <div className="mt-4 text-sm text-ember">
                    🍷 Paired with {pkg.wine_pairing.wine}
                  </div>
                )}

                {/* Upgrade Button for Free Members */}
                {member?.subscription_tier === 'free' && !canAccessContent(pkg) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <div className={`w-2 h-2 rounded-full ${
                          getRequiredTier(pkg) === 'premium' ? 'bg-ember' : 'bg-amber-500'
                        }`}></div>
                        <p className="text-sm text-gray-600">
                          Requires {getRequiredTier(pkg) === 'premium' ? 'Premium' : 'Founder'} membership
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade(getRequiredTier(pkg) as 'premium' | 'founder');
                        }}
                        className={`group w-full text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                          getRequiredTier(pkg) === 'premium' 
                            ? 'bg-ember text-white hover:bg-ember/90 hover:shadow-lg hover:shadow-ember/25' 
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 hover:shadow-lg hover:shadow-amber-500/25'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {getRequiredTier(pkg) === 'premium' ? (
                            <Star className="w-4 h-4" />
                          ) : (
                            <Crown className="w-4 h-4" />
                          )}
                          <span>Upgrade to {getRequiredTier(pkg) === 'premium' ? 'Premium' : 'Founder'}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-black/40 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-black/60 mb-2">No packages found</h3>
          <p className="text-black/50">
            {filter === 'all' 
              ? 'No packages available at the moment.' 
              : 'No packages match the selected filter.'}
          </p>
        </div>
      )}

      {/* Upgrade Prompts for Free Members */}
      {member?.subscription_tier === 'free' && (
        <div className="mt-16 relative overflow-hidden">
          <div className="bg-gradient-to-br from-ember/5 via-amber-50/50 to-ember/10 rounded-3xl p-12 text-center border border-ember/20 shadow-lg">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-ember rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-400 rounded-full translate-x-12 translate-y-12"></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-ember/30 rounded-full -translate-x-8 -translate-y-8"></div>
            </div>
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-ember/10 text-ember rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                Free Member
              </div>
              
              <h2 className="text-3xl font-serif font-bold mb-4 bg-gradient-to-r from-ember to-amber-600 bg-clip-text text-transparent">
                Unlock Premium Packages
              </h2>
              
              <p className="text-black/80 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
                You're currently on the Free tier. Upgrade to Premium or Founder to access intermediate and advanced packages, 
                scale recipes to larger serving sizes, and get exclusive wine pairing recommendations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <button
                  onClick={() => handleUpgrade('premium')}
                  className="group relative px-8 py-4 bg-ember text-white rounded-xl font-semibold hover:bg-ember/90 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-ember/25"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-5 h-5" />
                    <span>Upgrade to Premium</span>
                  </div>
                  <div className="text-sm opacity-90 mt-1">$19/month</div>
                </button>
                
                <button
                  onClick={() => handleUpgrade('founder')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5" />
                    <span>Upgrade to Founder</span>
                  </div>
                  <div className="text-sm opacity-90 mt-1">$39/month</div>
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-black/60">
                <span>Need help choosing?</span>
                <Link 
                  href="/subscription" 
                  className="text-ember hover:text-ember/80 font-medium underline hover:no-underline transition-colors"
                >
                  Compare all plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action for Non-Members */}
      {!member && (
        <div className="mt-16 bg-cream rounded-2xl p-12 text-center">
          <h2 className="text-section mb-6">Join the Community</h2>
          <p className="text-black/80 max-w-2xl mx-auto mb-8">
            Become a member to access our complete library of open-fire packages, 
            scale recipes to any serving size, and get exclusive wine pairing recommendations.
          </p>
          <Link href="/join" className="btn-ember">
            Join Wine With Pete
          </Link>
        </div>
      )}

      {/* Paywall Modal */}
      {paywallModal.packageData && (
        <PaywallModal
          isOpen={paywallModal.isOpen}
          onClose={closePaywallModal}
          currentTier={member?.subscription_tier || 'free'}
          requiredTier={getRequiredTier(paywallModal.packageData)}
          contentName={paywallModal.packageData.name}
          onUpgrade={handleUpgrade}
        />
      )}
    </div>
  );
}
