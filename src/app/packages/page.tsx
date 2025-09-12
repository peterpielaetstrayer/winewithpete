'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth-provider';
import type { Package } from '@/lib/types';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { member } = useAuth();

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
    if (filter === 'all') return true;
    return pkg.package_type === filter;
  });

  const packageTypes = [
    { id: 'all', label: 'All Packages' },
    { id: 'open_fire_menu', label: 'Open-Fire Menus' },
    { id: 'pairing_guide', label: 'Pairing Guides' },
    { id: 'gathering_kit', label: 'Gathering Kits' }
  ];

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
          <Link 
            key={pkg.id} 
            href={`/packages/${pkg.slug}`}
            className="group"
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

                {/* Member-only indicator */}
                {!member && !pkg.published && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-ember text-white">
                      Members Only
                    </Badge>
                  </div>
                )}
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
                    Serves {pkg.serving_sizes.join(', ')}
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
              </div>
            </div>
          </Link>
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
    </div>
  );
}
