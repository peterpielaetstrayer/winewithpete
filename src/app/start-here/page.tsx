'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Image from 'next/image';

export default function StartHerePage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
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
        body: JSON.stringify({ email, name }),
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
        // Check if it's a duplicate subscription
        if (result.already_subscribed) {
          alert('You\'re already subscribed! Check your email for our latest updates.');
          setEmail(''); // Clear the form
          setName(''); // Clear the form
        } else {
          setIsSubmitted(true);
        }
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
    <div className="min-h-screen bg-cream">
      {/* Welcome Section */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Welcome to Wine With Pete
          </h1>
          <p className="text-xl text-black/70 leading-relaxed mb-4">
            Here&apos;s how to begin.
          </p>
          <p className="text-lg text-black/60 max-w-2xl mx-auto">
            We gather around fire, food, and the slow unfolding of conversation. 
            This path will help you discover what we&apos;re about and how to get involved.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4 space-y-16">
          {/* Step 1: Read One Essay */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-ember/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-serif font-semibold text-ember">1</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-serif font-medium mb-3 text-charcoal">
                  Read one essay
                </h2>
                <p className="text-black/70 leading-relaxed mb-6">
                  Start with our latest writing to understand what we&apos;re about. 
                  Our essays explore disconnection, truth, and the search for something real.
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
                      Browse Essays
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Join the Circle */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-ember/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-serif font-semibold text-ember">2</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-serif font-medium mb-3 text-charcoal">
                  Join the Circle
                </h2>
                <p className="text-black/70 leading-relaxed mb-4">
                  Get weekly insights, recipe cards, and invitations to gather. 
                  When you join, you&apos;ll receive a free Fire Ritual recipe card.
                </p>
                
                {!isSubmitted ? (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="btn-ember px-8 py-3 rounded-full"
                      >
                        {isSubmitting ? 'Joining...' : 'Join Circle'}
                      </Button>
                    </div>
                    <p className="text-sm text-black/60">
                      Get your free Fire Ritual recipe card when you join.
                    </p>
                  </form>
                ) : (
                  <div className="bg-cream rounded-lg p-4">
                    <p className="text-ember font-medium mb-2">✓ You&apos;re in!</p>
                    <p className="text-sm text-black/70">
                      Check your email for your welcome message and free recipe card.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Try One Recipe */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-ember/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-serif font-semibold text-ember">3</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-serif font-medium mb-3 text-charcoal">
                  Try one recipe
                </h2>
                <p className="text-black/70 leading-relaxed mb-6">
                  Experience the practice of fire cooking with our curated recipes. 
                  These are designed for pre-prep and easy cooking at gatherings.
                </p>
                <Link href="/recipes">
                  <Button className="btn-ember px-6 py-3 rounded-full">
                    Explore Recipes
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Step 4: Express Interest in Gathering */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-ember/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-serif font-semibold text-ember">4</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-serif font-medium mb-3 text-charcoal">
                  Express interest in a gathering
                </h2>
                <p className="text-black/70 leading-relaxed mb-6">
                  Let us know if you&apos;d like to attend, host, or collaborate on a gathering in your area. 
                  We&apos;ll notify you when events are announced.
                </p>
                <Link href="/gatherings">
                  <Button className="btn-ember px-6 py-3 rounded-full">
                    See Gatherings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-serif font-medium mb-6 text-charcoal">
            You&apos;re on your way
          </h2>
          <p className="text-lg text-black/70 leading-relaxed mb-8 max-w-2xl mx-auto">
            You&apos;ve taken the first steps. Continue exploring, reading, and connecting. 
            The best conversations happen when we slow down and turn toward what matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/essays">
              <Button variant="outline" className="border-2 border-ember text-ember hover:bg-ember hover:text-white rounded-full px-8 py-4 text-lg font-medium">
                Read More Essays
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="border-2 border-ember text-ember hover:bg-ember hover:text-white rounded-full px-8 py-4 text-lg font-medium">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

