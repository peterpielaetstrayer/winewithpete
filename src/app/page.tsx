'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FeaturedEssay } from '@/lib/types';
import { analyticsEvents } from '@/lib/analytics';
import { useState, useEffect } from 'react';

export default function Home() {
  const [featuredEssays, setFeaturedEssays] = useState<FeaturedEssay[]>([]);
  const [essaysLoading, setEssaysLoading] = useState(true);

  useEffect(() => {
    fetch('/api/essays')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeaturedEssays(data.data || []);
        }
      })
      .catch(err => console.error('Failed to fetch essays:', err))
      .finally(() => setEssaysLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[75vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-campfire.png.png"
            alt="Privately hosted gathering around fire and wine"
            fill
            className="object-cover scale-105"
            style={{ opacity: 0.6 }}
            priority
            sizes="100vw"
          />
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 4px)`,
              mixBlendMode: 'overlay',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-hero text-white leading-relaxed mb-6 tracking-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            Privately hosted gatherings, thoughtfully designed.
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4 leading-relaxed">
            Wine With Pete helps you create signature table experiences—in host homes and chosen spaces.
          </p>
          <p className="text-lg text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto">
            Plan a gathering blueprint, book a privately hosted Signature Table, or join the Founding
            Table—for invitations, essays, and the community ahead.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button asChild className="btn-ember text-white rounded-full px-8 py-4 text-lg font-medium focus-ring">
              <Link href="/plan">Plan a Gathering</Link>
            </Button>
            <Button asChild variant="outline" className="bg-white/95 border-2 border-white text-charcoal hover:bg-white hover:text-ember rounded-full px-8 py-4 text-lg font-medium focus-ring shadow-lg">
              <Link href="/signature-table">Book a Signature Table</Link>
            </Button>
            <Button asChild variant="outline" className="bg-white/10 border-2 border-white/80 text-white hover:bg-white hover:text-charcoal rounded-full px-8 py-4 text-lg font-medium focus-ring">
              <Link href="/join">Join the Founding Table</Link>
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--wwp-cream)] to-transparent"></div>
      </div>

      {/* Mission Statement Section */}
      <div 
        className="bg-white py-20 -mt-20 relative z-20 rounded-t-3xl"
        style={{
          boxShadow: '0 -10px 40px rgba(0,0,0,0.1), 0 10px 40px rgba(91,35,32,0.05)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-t-3xl"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(91,35,32,0.03) 10px, rgba(91,35,32,0.03) 11px)`
          }}
        ></div>
        <div className="mx-auto max-w-3xl px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-charcoal animate-fade-in tracking-tight">
            Gathering design for people who want more than a dinner party
          </h2>
          <p className="text-xl text-black/70 leading-relaxed max-w-2xl mx-auto animate-fade-in">
            We work with hosts who care about conversation, atmosphere, and the slow unfolding of a
            real evening—not a preset menu dropped at the door.
          </p>
        </div>
      </div>

      {/* What This Is / Who It's For / How It Works */}
      <div className="bg-[var(--wwp-cream)] space-section">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center animate-fade-in">
              <h2 className="text-xl font-serif font-medium mb-4 text-charcoal">What This Is</h2>
              <p className="text-black/70 leading-relaxed">
                Wine With Pete is gathering design for privately hosted experiences—custom blueprints
                you execute, or signature tables Pete hosts in your space.
              </p>
            </div>
            
            <div className="text-center animate-fade-in">
              <h2 className="text-xl font-serif font-medium mb-4 text-charcoal">Who It&apos;s For</h2>
              <p className="text-black/70 leading-relaxed">
                Hosts with a home or chosen space who want depth—milestone dinners, founder tables,
                intimate friend groups, and evenings that stay with people.
              </p>
            </div>
            
            <div className="text-center animate-fade-in">
              <h2 className="text-xl font-serif font-medium mb-4 text-charcoal">How It Works</h2>
              <p className="text-black/70 leading-relaxed">
                Choose a blueprint to plan your own gathering, book a signature table with Pete, or
                join the Founding Table for pilots, essays, and future invitations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Three Doors */}
      <div className="bg-white space-content">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-section text-center mb-16 text-charcoal animate-fade-in tracking-tight">
            Three ways in
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/plan" className="group animate-scale-in">
              <div 
                className="card-enhanced bg-white rounded-2xl p-8 text-center h-full relative overflow-hidden"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(91,35,32,0.1), 0 0 0 1px rgba(91,35,32,0.05)',
                  background: 'linear-gradient(to bottom, #ffffff, #faf9f7)'
                }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl opacity-[0.015] pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(91,35,32,0.05) 1px, rgba(91,35,32,0.05) 2px)`
                  }}
                ></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Image src="/images/icons/icon-growth.png" alt="" width={48} height={48} aria-hidden />
                  </div>
                  <h3 className="text-xl font-medium mb-4 text-charcoal tracking-tight">Plan a Gathering</h3>
                  <p className="text-black/70 leading-relaxed mb-4">
                    A custom gathering blueprint—menu direction, wine, flow, and conversation—for
                    your privately hosted evening.
                  </p>
                  <div className="text-sm text-ember font-medium group-hover:text-ember-light transition-colors duration-300">
                    Get a blueprint →
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/signature-table" className="group animate-scale-in">
              <div 
                className="card-enhanced bg-white rounded-2xl p-8 text-center h-full relative overflow-hidden"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(91,35,32,0.1), 0 0 0 1px rgba(91,35,32,0.05)',
                  background: 'linear-gradient(to bottom, #ffffff, #faf9f7)'
                }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl opacity-[0.015] pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(91,35,32,0.05) 1px, rgba(91,35,32,0.05) 2px)`
                  }}
                ></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Image src="/images/icons/icon-wine.png" alt="" width={48} height={48} aria-hidden />
                  </div>
                  <h3 className="text-xl font-medium mb-4 text-charcoal tracking-tight">Book a Signature Table</h3>
                  <p className="text-black/70 leading-relaxed mb-4">
                    Pete designs and hosts a privately hosted signature table experience in your home
                    or chosen space.
                  </p>
                  <div className="text-sm text-ember font-medium group-hover:text-ember-light transition-colors duration-300">
                    Inquire about hosting →
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/join" className="group animate-scale-in">
              <div 
                className="card-enhanced bg-white rounded-2xl p-8 text-center h-full relative overflow-hidden"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(91,35,32,0.1), 0 0 0 1px rgba(91,35,32,0.05)',
                  background: 'linear-gradient(to bottom, #ffffff, #faf9f7)'
                }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl opacity-[0.015] pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(91,35,32,0.05) 1px, rgba(91,35,32,0.05) 2px)`
                  }}
                ></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Image src="/images/icons/icon-connection.png" alt="" width={48} height={48} aria-hidden />
                  </div>
                  <h3 className="text-xl font-medium mb-4 text-charcoal tracking-tight">Join the Founding Table</h3>
                  <p className="text-black/70 leading-relaxed mb-4">
                    The list for invite-only pilots, essays, gathering notes, and the community
                    layer behind the work.
                  </p>
                  <div className="text-sm text-ember font-medium group-hover:text-ember-light transition-colors duration-300">
                    Join the list →
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Essay Section — secondary layer */}
      <div className="bg-[var(--wwp-cream)] space-content">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-section text-center mb-4 text-charcoal animate-fade-in tracking-tight">
            From the Founding Table
          </h2>
          <p className="text-center text-black/60 mb-12 max-w-xl mx-auto">
            Essays and writing for those building toward slower, more meaningful gatherings.
          </p>
          
          {essaysLoading ? (
            <div className="text-center py-8 text-black/60">Loading essays...</div>
          ) : featuredEssays.length > 0 ? (
            <div className="space-y-8 mb-8">
              {featuredEssays.slice(0, 3).map((essay, index) => (
                <div key={essay.id}>
                  {index > 0 && (
                    <div className="text-center mb-6">
                      <p className="text-black/50 italic text-sm font-serif">
                        Then explore this...
                      </p>
                    </div>
                  )}
                  
                  <div 
                    className="bg-white rounded-2xl p-6 relative overflow-hidden hover:shadow-xl transition-all duration-300"
                    style={{
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(91,35,32,0.1), 0 0 0 1px rgba(91,35,32,0.05)',
                      background: 'linear-gradient(to bottom, #ffffff, #faf9f7)'
                    }}
                  >
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-[0.015] pointer-events-none"
                      style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(91,35,32,0.05) 1px, rgba(91,35,32,0.05) 2px)`
                      }}
                    ></div>
                    <div className="relative z-10">
                      {essay.image_url && (
                        <div className="mb-4 -mx-6 -mt-6">
                          <img 
                            src={essay.image_url} 
                            alt={essay.title ? `${essay.title} - Featured essay image` : 'Featured essay image'} 
                            className="w-full h-48 object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-serif font-medium mb-2 text-charcoal tracking-tight">
                        {essay.title || 'Untitled Essay'}
                      </h3>
                      {essay.excerpt && (
                        <p className="text-black/70 leading-relaxed mb-4">
                          {essay.excerpt}
                        </p>
                      )}
                      <a 
                        href={essay.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ember font-medium hover:text-ember-light transition-colors"
                        onClick={() => analyticsEvents.essayClicked(essay.title || 'Untitled', essay.url)}
                      >
                        Read essay →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="bg-white rounded-2xl p-8 mb-8 relative overflow-hidden"
              style={{
                boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(91,35,32,0.1), 0 0 0 1px rgba(91,35,32,0.05)',
                background: 'linear-gradient(to bottom, #ffffff, #faf9f7)'
              }}
            >
              <div className="relative z-10">
                <p className="text-black/70 leading-relaxed mb-6">
                  We&apos;re curating essays for the Founding Table. Explore the full archive on Substack in the meantime.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://winewithpete.substack.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-ember px-6 py-3 rounded-full text-center"
                  >
                    Read on Substack
                  </a>
                  <Button asChild variant="outline" className="border-2 border-ember text-ember hover:bg-ember hover:text-white rounded-full px-6 py-3">
                    <Link href="/essays">Browse All Essays</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <Button asChild variant="outline" className="border-2 border-ember text-ember hover:bg-ember hover:text-white rounded-full px-6 py-3">
              <Link href="/essays">
                {featuredEssays.length > 0 ? 'Browse All Essays' : 'Explore Essays'}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Founding Table CTA */}
      <div className="bg-white space-section relative">
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(91,35,32,0.02) 20px, rgba(91,35,32,0.02) 21px)`
          }}
        ></div>
        <div className="mx-auto max-w-2xl px-4 relative z-10">
          <div 
            className="bg-cream rounded-2xl p-12 text-center relative overflow-hidden"
            style={{
              boxShadow: '0 8px 30px rgba(0,0,0,0.1), 0 2px 8px rgba(91,35,32,0.08), 0 0 0 1px rgba(91,35,32,0.05)',
              background: 'linear-gradient(to bottom, #f6f3ef, #f0ebe5)'
            }}
          >
            <div 
              className="absolute inset-0 rounded-2xl opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(91,35,32,0.03) 2px, rgba(91,35,32,0.03) 4px)`
              }}
            ></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-serif font-medium mb-4 text-charcoal tracking-tight">
                Join the Founding Table
              </h2>
              <p className="text-lg text-black/70 mb-8 leading-relaxed">
                Get on the list for invite-only pilot dinners, gathering notes, essays, and early
                access as the community layer grows.
              </p>
              <Button asChild className="btn-ember px-8 py-4 rounded-full text-lg font-medium">
                <Link href="/join">Join the Founding Table</Link>
              </Button>
              <p className="text-sm text-black/60 mt-6">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
