'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function JoinPage(){
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Integrate with Supabase for email collection
    // For now, just simulate success
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <img src="/images/icons/icon-connection.png" alt="Welcome" className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-serif font-medium mb-4 text-charcoal">Welcome to the Circle</h1>
            <p className="text-lg text-black/70 mb-6">
              You&apos;re now part of our community. Check your email for a welcome message and your first newsletter.
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
                <p>While you wait, explore our latest writings on Substack.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Join the Circle
          </h1>
          <p className="text-xl text-black/70 leading-relaxed mb-8">
            Get weekly philosophical insights, recipe cards, event updates, and personal musings. 
            A more intimate space for those who want to stay connected to the community.
          </p>
        </div>
      </div>

      {/* What You'll Get */}
      <div className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-serif font-medium text-center mb-12 text-charcoal">
            What You&apos;ll Receive
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <img src="/images/icons/icon-writing.png" alt="Philosophical Musings" className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-charcoal">Philosophical Musings</h3>
              <p className="text-black/70 leading-relaxed">
                Weekly insights on connection, truth, and the search for something real in our disconnected world.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <img src="/images/icons/icon-fire.png" alt="Recipe Cards" className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-charcoal">Recipe Cards</h3>
              <p className="text-black/70 leading-relaxed">
                Fire-friendly recipes designed for pre-prep and easy cooking at gatherings.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <img src="/images/icons/icon-connection.png" alt="Event Updates" className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-charcoal">Event Updates</h3>
              <p className="text-black/70 leading-relaxed">
                Invitations to Open Fire Sundays and curated salon events in your area.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <img src="/images/icons/icon-growth.png" alt="Community Insights" className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-charcoal">Community Insights</h3>
              <p className="text-black/70 leading-relaxed">
                Reflections on gatherings, conversations, and the moments of connection that matter.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-2xl px-4">
          <div className="bg-cream rounded-2xl p-8 shadow-sm border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-medium mb-4 text-charcoal">
                Join Our Newsletter
              </h2>
              <p className="text-black/70">
                Different from my Substack essays, this is my personal newsletter for the community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input 
                  type="email"
                  placeholder="your@email.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-ember px-8 py-4 rounded-full text-lg font-medium"
                >
                  {isSubmitting ? 'Joining...' : 'Join Circle'}
                </Button>
              </div>
              <p className="text-sm text-black/60 text-center">
                We respect your privacy. Unsubscribe anytime. No spam, just thoughtful content.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Difference from Substack */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-serif font-medium text-center mb-12 text-charcoal">
            Newsletter vs. Substack Essays
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h3 className="text-xl font-medium mb-4 text-ember">Newsletter</h3>
              <ul className="space-y-3 text-black/70">
                <li>• Weekly philosophical insights and musings</li>
                <li>• Recipe cards and cooking tips</li>
                <li>• Event updates and invitations</li>
                <li>• Community reflections and stories</li>
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
        </div>
      </div>
    </div>
  );
}
