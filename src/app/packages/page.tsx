'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth-provider';
import { canAccessPackage, isPremiumContent, getAvailableServingSizes, shouldShowPackage } from '@/lib/access-control';
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
    // Check if package should be visible (but not necessarily accessible)
    if (!shouldShowPackage(pkg, member)) return false;
    
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

    if (canAccessContent(pkg)) {
      // User can access this package, navigate to it
      window.location.href = `/packages/${pkg.slug}`;
    } else {
      // User cannot access this package, show paywall
      setPaywallModal({ isOpen: true, packageData: pkg });
    }
  };

  const handleUpgrade = async (tier: 'premium' | 'founder') => {
    try {
      await upgradeSubscription(tier);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-ember/5">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ember mx-auto mb-4"></div>
            <p className="text-black/60">Loading packages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-ember/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
            Wine & Fire Packages
          </h1>
          <p className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto px-4">
            Curated experiences that bring together the warmth of fire, the richness of wine, and the joy of gathering.
          </p>
        </div>

        {/* Upgrade Prompts for Free Members */}
        {member?.subscription_tier === 'free' && (
          <div className="mb-8 md:mb-12 p-6 md:p-8 bg-gradient-to-r from-ember/10 to-amber-500/10 rounded-2xl border border-ember/20">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-4">
                Unlock Premium Packages
              </h2>
              <p className="text-black/70 mb-6 max-w-2xl mx-auto text-sm md:text-base">
                Upgrade to access intermediate and advanced packages with exclusive recipes, wine pairings, and serving options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleUpgrade('premium')}
                  className="group bg-ember text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:bg-ember/90 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-ember/25 text-sm md:text-base"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Upgrade to Premium - $19/month</span>
                  </div>
                </button>
                <button
                  onClick={() => handleUpgrade('founder')}
                  className="group bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25 text-sm md:text-base"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Upgrade to Founder - $39/month</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Navigation */}
        <div className="mb-6 md:mb-8">
          <nav className="flex flex-wrap gap-2 justify-center px-4">
            {packageTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setFilter(type.id)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all duration-200 text-sm md:text-base ${
                  filter === type.id
                    ? 'bg-ember text-white shadow-lg shadow-ember/25'
                    : 'bg-white/80 text-black/70 hover:bg-ember/10 hover:text-ember'
                }`}
              >
                {type.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredPackages.map((pkg) => {
            const canAccess = canAccessContent(pkg);
            const isLocked = !canAccess;
            
            return (
              <div 
                key={pkg.id} 
                onClick={() => handlePackageClick(pkg)}
                className={`group ${canAccess ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`card-enhanced animate-scale-in h-full ${isLocked ? 'opacity-75' : ''}`}>
                  {/* Package Image */}
                  <div className="aspect-video relative overflow-hidden">
                    {pkg.cover_url ? (
                      <Image
                        src={pkg.cover_url}
                        alt={pkg.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`object-cover transition-transform duration-300 ${canAccess ? 'group-hover:scale-105' : ''}`}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-ember/10 to-ember/5 flex items-center justify-center">
                        <svg className="w-16 h-16 text-ember/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Lock Overlay for Premium Content */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium">
                            {getRequiredTier(pkg) === 'premium' ? 'Premium' : 'Founder'} Required
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Package Type Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="outline" className="bg-white/90 text-ember border-ember">
                        {pkg.package_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* Package Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-black group-hover:text-ember transition-colors">
                        {pkg.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          pkg.difficulty_level === 'beginner' ? 'bg-green-500' :
                          pkg.difficulty_level === 'intermediate' ? 'bg-ember' : 'bg-amber-500'
                        }`}></div>
                        <span className="text-sm text-black/60 capitalize">
                          {pkg.difficulty_level}
                        </span>
                      </div>
                    </div>

                    {pkg.description && (
                      <p className="text-black/70 mb-4 line-clamp-3">{pkg.description}</p>
                    )}

                    {/* Recipe Count & Serving Sizes */}
                    <div className="flex items-center justify-between text-sm text-black/60">
                      <span>
                        {(pkg.recipes as any[])?.length || 0} recipes
                      </span>
                      <span>
                        {canAccess ? (
                          <>
                            Serves {getAvailableServingSizes(pkg, member).join(', ')}
                            {member?.subscription_tier === 'free' && isPremiumContent(pkg) && (
                              <span className="text-amber-600 ml-1">(limited)</span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">
                            Upgrade to see serving sizes
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Tags */}
                    {pkg.tags && pkg.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {pkg.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-ember/10 text-ember text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {pkg.tags.length > 3 && (
                          <span className="px-3 py-1 bg-black/10 text-black/60 text-xs rounded-full">
                            +{pkg.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Wine Pairing */}
                    {pkg.wine_pairing && (
                      <div className="mt-4 text-sm text-ember">
                        🍷 Paired with {pkg.wine_pairing.wine}
                      </div>
                    )}

                    {/* Upgrade Button for Locked Packages */}
                    {isLocked && (
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
            );
          })}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-black/40 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-black/60 mb-2">No packages found</h3>
            <p className="text-black/40">Try adjusting your filter or check back later for new packages.</p>
          </div>
        )}
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={paywallModal.isOpen}
        onClose={() => setPaywallModal({ isOpen: false, packageData: null })}
        packageData={paywallModal.packageData}
      />
    </div>
  );
}