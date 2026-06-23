'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function JoinPage(){
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
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
        if (result.already_subscribed) {
          setError('You\'re already on the Founding Table! Check your email for our latest updates.');
          setEmail('');
        } else {
          setIsSubmitted(true);
          setError(null);
        }
      } else {
        const errorMsg = result.error || result.details || 'Failed to subscribe';
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Image src="/images/icons/icon-connection.png" alt="Welcome" width={48} height={48} />
            </div>
            <h1 className="text-3xl font-serif font-medium mb-4 text-charcoal">Welcome to the Founding Table</h1>
            <p className="text-lg text-black/70 mb-6">
              You&apos;re on the list. Check your email for a welcome note—and we&apos;ll reach out
              when pilot dinners and invitations open up.
            </p>
            <div className="space-y-4">
              <a 
                href="https://winewithpete.substack.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-ember px-8 py-4 rounded-full text-lg font-medium inline-block"
              >
                Read Latest Essays
              </a>
              <div className="text-sm text-black/60">
                <p>While you wait, explore essays on Substack.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Join the Founding Table
          </h1>
          <p className="text-xl text-black/70 leading-relaxed mb-8 max-w-2xl mx-auto">
            The list for invite-only pilot dinners, essays, gathering notes, and the community
            layer behind Wine With Pete. A closer circle than the public site.
          </p>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-2xl px-4">
          <div className="bg-cream rounded-2xl p-8 shadow-sm border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-medium mb-4 text-charcoal">
                Get on the list
              </h2>
              <p className="text-black/70 mb-2">
                Join with your email. You&apos;ll receive a welcome note and your free Fire Ritual recipe card.
              </p>
              <p className="text-sm text-black/60">
                Different from Substack—this is the inside track for gatherings, pilots, and community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input 
                    type="email"
                    placeholder="your@email.com" 
                    value={email} 
                    onChange={e => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="flex-1"
                    required
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'email-error' : undefined}
                  />
                  {error && (
                    <p id="email-error" className="text-sm text-red-600 mt-2" role="alert">
                      {error}
                    </p>
                  )}
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-ember px-8 py-4 rounded-full text-lg font-medium"
                >
                  {isSubmitting ? 'Joining...' : 'Join the Founding Table'}
                </Button>
              </div>
              <p className="text-sm text-black/60 text-center">
                We respect your privacy. Unsubscribe anytime. No spam, just thoughtful content.
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-serif font-medium text-center mb-12 text-charcoal">
            What You&apos;ll Receive
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <img src="/images/icons/icon-connection.png" alt="" className="w-12 h-12" aria-hidden />
              </div>
              <h3 className="text-xl font-medium mb-4 text-charcoal">Pilot Invitations</h3>
              <p className="text-black/70 leading-relaxed">
                First access to invite-only pilot dinners and privately hosted gathering experiments.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <img src="/images/icons/icon-writing.png" alt="" className="w-12 h-12" aria-hidden />
              </div>
              <h3 className="text-xl font-medium mb-4 text-charcoal">Essays & Notes</h3>
              <p className="text-black/70 leading-relaxed">
                Writing on gathering design, connection, and the work behind signature table experiences.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <img src="/images/icons/icon-fire.png" alt="" className="w-12 h-12" aria-hidden />
              </div>
              <h3 className="text-xl font-medium mb-4 text-charcoal">Gathering Notes</h3>
              <p className="text-black/70 leading-relaxed">
                Recipe cards, hosting insights, and practical notes for privately hosted evenings.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <img src="/images/icons/icon-growth.png" alt="" className="w-12 h-12" aria-hidden />
              </div>
              <h3 className="text-xl font-medium mb-4 text-charcoal">Community Layer</h3>
              <p className="text-black/70 leading-relaxed">
                Reflections from gatherings, conversations, and the community forming around the work.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-serif font-medium text-center mb-12 text-charcoal">
            Founding Table vs. Substack
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h3 className="text-xl font-medium mb-4 text-ember">Founding Table</h3>
              <ul className="space-y-3 text-black/70">
                <li>• Invite-only pilot dinner invitations</li>
                <li>• Gathering notes and hosting insights</li>
                <li>• Recipe cards for privately hosted evenings</li>
                <li>• Community reflections and early access</li>
                <li>• More personal and intimate tone</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h3 className="text-xl font-medium mb-4 text-ember">Substack Essays</h3>
              <ul className="space-y-3 text-black/70">
                <li>• Weekly long-form philosophical essays</li>
                <li>• Deep dives into specific topics</li>
                <li>• More structured and researched content</li>
                <li>• Focus on challenging assumptions</li>
                <li>• Public platform for broader reach</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-black/60 mb-4 text-sm">
              Ready to plan or book a privately hosted gathering?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="border-2 border-ember text-ember hover:bg-ember hover:text-white rounded-full px-6 py-3">
                <Link href="/plan">Plan a Gathering</Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-ember text-ember hover:bg-ember hover:text-white rounded-full px-6 py-3">
                <Link href="/signature-table">Book a Signature Table</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
