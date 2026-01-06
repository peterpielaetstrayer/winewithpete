'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FeaturedEssay } from '@/lib/types';
import { useState, useEffect } from 'react';

export default function EssaysPage(){
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
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Essays & Writings
          </h1>
          <p className="text-xl text-black/70 leading-relaxed mb-8">
            Weekly philosophical essays exploring disconnection, truth, and the search for something real. 
            Deep dives into the stories we tell and the beliefs we inherit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://winewithpete.substack.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-ember px-8 py-4 rounded-full text-lg font-medium text-center"
            >
              Read on Substack
            </a>
            <Link href="/join">
              <Button variant="outline" className="border-2 border-ember text-ember hover:bg-ember hover:text-white rounded-full px-8 py-4 text-lg font-medium">
                Stay Connected
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Essays Section */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-serif font-medium text-center mb-12 text-charcoal">
            Start Here
          </h2>
          
          <div className="space-y-8 mb-16">
            {essaysLoading ? (
              <div className="text-center py-8 text-black/60">Loading essays...</div>
            ) : featuredEssays.length > 0 ? (
              featuredEssays.map((essay, index) => (
                <div key={essay.id}>
                  {/* Narrative flow text between essays */}
                  {index === 0 && (
                    <div className="text-center mb-6">
                      <p className="text-black/50 italic text-sm font-serif">
                        Start your journey here...
                      </p>
                    </div>
                  )}
                  {index > 0 && (
                    <div className="text-center mb-6">
                      <p className="text-black/50 italic text-sm font-serif">
                        Then continue with this...
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-md transition-shadow">
                    {essay.image_url && (
                      <div className="mb-6 -mx-8 -mt-8">
                        <img 
                          src={essay.image_url} 
                          alt={essay.title || ''} 
                          className="w-full h-64 object-cover rounded-t-2xl"
                        />
                      </div>
                    )}
                    <h3 className="text-2xl font-serif font-medium mb-3 text-charcoal">
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
                    >
                      Read essay →
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-2xl font-serif font-medium mb-3 text-charcoal">
                  Featured Essays Coming Soon
                </h3>
                <p className="text-black/70 leading-relaxed mb-4">
                  We're curating a selection of flagship essays to help you get started. 
                  In the meantime, explore our full archive on Substack.
                </p>
                <a 
                  href="https://winewithpete.substack.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-ember font-medium hover:text-ember-light transition-colors"
                >
                  Browse All Essays →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Substack Embed */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <iframe
              src="https://winewithpete.substack.com/embed"
              className="w-full h-[800px]"
              title="Wine With Pete Substack"
            />
          </div>
        </div>
      </div>

      {/* About the Essays */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-serif font-medium text-center mb-12 text-charcoal">
            What You&apos;ll Find Here
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-medium mb-4 text-ember">Philosophical Explorations</h3>
              <p className="text-black/70 leading-relaxed mb-6">
                Essays that challenge assumptions and explore the deeper questions of human connection, 
                truth, and meaning in our disconnected world.
              </p>
              
              <h3 className="text-xl font-medium mb-4 text-ember">Wine as a Medium</h3>
              <p className="text-black/70 leading-relaxed">
                Using wine as a lens to explore broader themes of culture, tradition, 
                and the art of slowing down in a fast world.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4 text-ember">Conversation Starters</h3>
              <p className="text-black/70 leading-relaxed mb-6">
                Writings designed to spark deeper dialogue and reflection, 
                whether you&apos;re reading alone or discussing with others.
              </p>
              
              <h3 className="text-xl font-medium mb-4 text-ember">Community Stories</h3>
              <p className="text-black/70 leading-relaxed">
                Reflections on gatherings, conversations, and the moments of connection 
                that happen around fire and food.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border">
            <h2 className="text-2xl font-serif font-medium mb-4 text-charcoal">
              Get Weekly Essays Delivered
            </h2>
            <p className="text-black/70 mb-6">
              Stay connected for weekly insights, recipe cards, and event updates.
            </p>
            <Link href="/join">
              <Button className="btn-ember px-8 py-4 rounded-full text-lg font-medium">
                Join the Circle
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

