'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FeaturedEssay } from '@/lib/types';
import { analyticsEvents } from '@/lib/analytics';
import { useState, useEffect } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
      } else {
        const errorMsg = result.error || result.details || 'Failed to subscribe';
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[75vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Campfire Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-campfire.png.png"
            alt="Community gathering around campfire"
            fill
            className="object-cover scale-105"
            style={{ opacity: 0.6 }}
            priority
            sizes="100vw"
          />
          {/* Subtle texture overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 4px)`,
              mixBlendMode: 'overlay',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-hero text-white leading-relaxed mb-6 tracking-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            In a world that moves too fast, we create space for something different.
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4 leading-relaxed">
            Fire, food, and conversations that stay with you long after the embers die.
          </p>
          <p className="text-lg text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto">
            We gather around open flames to pause, listen, and turn toward what matters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link href="/join">
              <Button className="btn-ember text-white rounded-full px-8 py-4 text-lg font-medium focus-ring">
                Join the Circle
              </Button>
            </Link>
            <Link href="/start-here">
              <Button variant="outline" className="bg-white/95 border-2 border-white text-charcoal hover:bg-white hover:text-ember rounded-full px-8 py-4 text-lg font-medium focus-ring shadow-lg">
                Start Here
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--wwp-cream)] to-transparent"></div>
      </div>

      {/* Mission Statement Section */}
      <div 
        className="bg-white py-20 -mt-20 relative z-20 rounded-t-3xl"
        style={{
          boxShadow: '0 -10px 40px rgba(0,0,0,0.1), 0 10px 40px rgba(91,35,32,0.05)'
        }}
      >
        {/* Subtle texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-t-3xl"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(91,35,32,0.03) 10px, rgba(91,35,32,0.03) 11px)`
          }}
        ></div>
        <div className="mx-auto max-w-3xl px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-charcoal animate-fade-in tracking-tight">
            A movement toward slower, more meaningful connections
          </h2>
          <p className="text-xl text-black/70 leading-relaxed max-w-2xl mx-auto animate-fade-in">
            In a world that moves too fast, we create spaces where people can slow down, 
            share stories, and build genuine connections around fire, food, and honest conversation.
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
                Wine With Pete is a community built around open-fire food, thoughtful wine, and salon-style conversation. 
                We create spaces where people can slow down, share stories, and build genuine connections.
              </p>
            </div>
            
            <div className="text-center animate-fade-in">
              <h2 className="text-xl font-serif font-medium mb-4 text-charcoal">Who It&apos;s For</h2>
              <p className="text-black/70 leading-relaxed">
                For those who feel disconnected in a hyper-connected world. 
                For people who value depth over breadth, quality over quantity, and conversations that stay with you long after the fire burns out.
              </p>
            </div>
            
            <div className="text-center animate-fade-in">
              <h2 className="text-xl font-serif font-medium mb-4 text-charcoal">How It Works</h2>
              <p className="text-black/70 leading-relaxed">
                Read our weekly essays. Stay connected for recipes and insights. 
                Attend gatherings in your area. Cook together. Talk honestly. Build something real.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Pathways (3 Cards) */}
      <div className="bg-white space-content">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-section text-center mb-16 text-charcoal animate-fade-in tracking-tight">
            Choose Your Path
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Read - Essays */}
            <Link href="/essays" className="group animate-scale-in">
              <div 
                className="card-enhanced bg-white rounded-2xl p-8 text-center h-full relative overflow-hidden"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(91,35,32,0.1), 0 0 0 1px rgba(91,35,32,0.05)',
                  background: 'linear-gradient(to bottom, #ffffff, #faf9f7)'
                }}
              >
                {/* Texture overlay */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-[0.015] pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(91,35,32,0.05) 1px, rgba(91,35,32,0.05) 2px)`
                  }}
                ></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Image src="/images/icons/icon-writing.png" alt="Writing" width={48} height={48} />
                  </div>
                  <h3 className="text-xl font-medium mb-4 text-charcoal tracking-tight">Read</h3>
                  <p className="text-black/70 leading-relaxed mb-4">
                    Weekly essays exploring philosophy, connection, and the stories we tell.
                  </p>
                  <div className="text-sm text-ember font-medium group-hover:text-ember-light transition-colors duration-300">
                    Read Essays →
                  </div>
                </div>
              </div>
            </Link>

            {/* Gather - Events */}
            <Link href="/gatherings" className="group animate-scale-in">
              <div 
                className="card-enhanced bg-white rounded-2xl p-8 text-center h-full relative overflow-hidden"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(91,35,32,0.1), 0 0 0 1px rgba(91,35,32,0.05)',
                  background: 'linear-gradient(to bottom, #ffffff, #faf9f7)'
                }}
              >
                {/* Texture overlay */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-[0.015] pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(91,35,32,0.05) 1px, rgba(91,35,32,0.05) 2px)`
                  }}
                ></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Image src="/images/icons/icon-fire.png" alt="Fire" width={48} height={48} />
                  </div>
                  <h3 className="text-xl font-medium mb-4 text-charcoal tracking-tight">Gather</h3>
                  <p className="text-black/70 leading-relaxed mb-4">
                    Open Fire Sundays and curated salon events. Bring food, share stories, slow down.
                  </p>
                  <div className="text-sm text-ember font-medium group-hover:text-ember-light transition-colors duration-300">
                    See Gatherings →
                  </div>
                </div>
              </div>
            </Link>

            {/* Cook - Recipes */}
            <Link href="/recipes" className="group animate-scale-in">
              <div 
                className="card-enhanced bg-white rounded-2xl p-8 text-center h-full relative overflow-hidden"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(91,35,32,0.1), 0 0 0 1px rgba(91,35,32,0.05)',
                  background: 'linear-gradient(to bottom, #ffffff, #faf9f7)'
                }}
              >
                {/* Texture overlay */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-[0.015] pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(91,35,32,0.05) 1px, rgba(91,35,32,0.05) 2px)`
                  }}
                ></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Image src="/images/icons/icon-wine.png" alt="Wine" width={48} height={48} />
                  </div>
                  <h3 className="text-xl font-medium mb-4 text-charcoal tracking-tight">Cook</h3>
                  <p className="text-black/70 leading-relaxed mb-4">
                    Fire-friendly recipes and guides for building community around honest conversation.
                  </p>
                  <div className="text-sm text-ember font-medium group-hover:text-ember-light transition-colors duration-300">
                    Explore Recipes →
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Essay Section */}
      <div className="bg-[var(--wwp-cream)] space-content">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-section text-center mb-12 text-charcoal animate-fade-in tracking-tight">
            Start with one essay
          </h2>
          
          {essaysLoading ? (
            <div className="text-center py-8 text-black/60">Loading essays...</div>
          ) : featuredEssays.length > 0 ? (
            <div className="space-y-8 mb-8">
              {featuredEssays.slice(0, 3).map((essay, index) => (
                <div key={essay.id}>
                  {/* Narrative flow text between essays */}
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
                    {/* Texture overlay */}
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
                            alt={essay.title || ''} 
                            className="w-full h-48 object-cover"
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
              {/* Texture overlay */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-[0.015] pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(91,35,32,0.05) 1px, rgba(91,35,32,0.05) 2px)`
                }}
              ></div>
              <div className="relative z-10">
                <p className="text-black/70 leading-relaxed mb-6">
                  We&apos;re curating a selection of flagship essays to help you get started. 
                  In the meantime, explore our full archive on Substack.
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
                  <Link href="/essays">
                    <Button variant="outline" className="border-2 border-ember text-ember hover:bg-ember hover:text-white rounded-full px-6 py-3">
                      Browse All Essays
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <Link href="/essays">
              <Button variant="outline" className="border-2 border-ember text-ember hover:bg-ember hover:text-white rounded-full px-6 py-3">
                {featuredEssays.length > 0 ? 'Browse All Essays' : 'Explore More'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Email Capture Section with Lead Magnet */}
      <div className="bg-white space-section relative">
        {/* Subtle background texture */}
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
            {/* Texture overlay */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(91,35,32,0.03) 2px, rgba(91,35,32,0.03) 4px)`
              }}
            ></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-serif font-medium mb-4 text-charcoal tracking-tight">
                Get a free Fire Ritual recipe card
              </h2>
              <p className="text-lg text-black/70 mb-8 leading-relaxed">
                Join 200+ people exploring slow living, one fire at a time. 
                Weekly insights, recipe cards, and invitations to gather.
              </p>
              
              {!isSubmitted ? (
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 focus-ring"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className="btn-ember px-8 py-4 rounded-full text-lg font-medium"
                    >
                      {isSubmitting ? 'Joining...' : 'Join Circle'}
                    </Button>
                  </div>
                  <p className="text-sm text-black/60">
                    We respect your privacy. Unsubscribe anytime. No spam, just thoughtful content.
                  </p>
                </form>
              ) : (
                <div 
                  className="bg-white rounded-lg p-6"
                  style={{
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }}
                >
                  <p className="text-ember font-medium mb-2 text-lg">✓ Welcome to the Circle!</p>
                  <p className="text-black/70">
                    Check your email for your welcome message and free recipe card.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
