'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { featuredEssays, hasFeaturedEssays } from '@/data/featured-essays';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Campfire Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-campfire.png.png"
            alt="Community gathering around campfire"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-hero text-white leading-relaxed mb-6">
            Fire, food, and the slow unfolding of conversation.
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
            We gather around open flames to pause, listen, and turn toward what matters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link href="/join">
              <Button className="btn-ember text-white rounded-full px-8 py-4 text-lg font-medium focus-ring">
                Join the Circle
              </Button>
            </Link>
            <Link href="/start-here">
              <Button variant="outline" className="bg-ember/20 border-ember text-ember hover:bg-ember hover:text-white rounded-full px-8 py-4 text-lg font-medium focus-ring">
                Start Here
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--wwp-cream)] to-transparent"></div>
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
          <h2 className="text-section text-center mb-16 text-charcoal animate-fade-in">
            Choose Your Path
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Read - Essays */}
            <Link href="/essays" className="group animate-scale-in">
              <div className="card-enhanced bg-white rounded-2xl p-8 shadow-sm border text-center h-full">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Image src="/images/icons/icon-writing.png" alt="Writing" width={48} height={48} />
                </div>
                <h3 className="text-xl font-medium mb-4 text-charcoal">Read</h3>
                <p className="text-black/70 leading-relaxed mb-4">
                  Weekly essays exploring philosophy, connection, and the stories we tell.
                </p>
                <div className="text-sm text-ember font-medium group-hover:text-ember-light transition-colors duration-300">
                  Read Essays →
                </div>
              </div>
            </Link>

            {/* Gather - Events */}
            <Link href="/gatherings" className="group animate-scale-in">
              <div className="card-enhanced bg-white rounded-2xl p-8 shadow-sm border text-center h-full">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Image src="/images/icons/icon-fire.png" alt="Fire" width={48} height={48} />
                </div>
                <h3 className="text-xl font-medium mb-4 text-charcoal">Gather</h3>
                <p className="text-black/70 leading-relaxed mb-4">
                  Open Fire Sundays and curated salon events. Bring food, share stories, slow down.
                </p>
                <div className="text-sm text-ember font-medium group-hover:text-ember-light transition-colors duration-300">
                  See Gatherings →
                </div>
              </div>
            </Link>

            {/* Cook - Recipes */}
            <Link href="/recipes" className="group animate-scale-in">
              <div className="card-enhanced bg-white rounded-2xl p-8 shadow-sm border text-center h-full">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Image src="/images/icons/icon-wine.png" alt="Wine" width={48} height={48} />
                </div>
                <h3 className="text-xl font-medium mb-4 text-charcoal">Cook</h3>
                <p className="text-black/70 leading-relaxed mb-4">
                  Fire-friendly recipes and guides for building community around honest conversation.
                </p>
                <div className="text-sm text-ember font-medium group-hover:text-ember-light transition-colors duration-300">
                  Explore Recipes →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Essay Section */}
      <div className="bg-[var(--wwp-cream)] space-content">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-section text-center mb-12 text-charcoal animate-fade-in">
            Start with one essay
          </h2>
          
          {hasFeaturedEssays ? (
            <div className="space-y-6 mb-8">
              {featuredEssays.slice(0, 3).map((essay, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-serif font-medium mb-2 text-charcoal">
                    {essay.title}
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
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border mb-8">
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
          )}
          
          <div className="text-center">
            <Link href="/essays">
              <Button variant="outline" className="border-2 border-ember text-ember hover:bg-ember hover:text-white rounded-full px-6 py-3">
                {hasFeaturedEssays ? 'Browse All Essays' : 'Explore More'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Email Capture Section with Lead Magnet */}
      <div className="bg-white space-section">
        <div className="mx-auto max-w-2xl px-4">
          <div className="bg-cream rounded-2xl p-12 shadow-sm border text-center">
            <h2 className="text-3xl font-serif font-medium mb-4 text-charcoal">
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
              <div className="bg-white rounded-lg p-6">
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
  );
}
