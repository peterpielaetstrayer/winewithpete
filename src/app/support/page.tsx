'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function SupportPage(){
  const [loading, setLoading] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  const handleSupportPayment = async (amount: number, description: string) => {
    if (!customerEmail || !customerName) {
      setShowForm(description);
      return;
    }

    setLoading(description);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: `support-${amount}`,
          quantity: 1,
          customerEmail: customerEmail,
          customerName: customerName,
          customAmount: amount,
          customDescription: description,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Support payment failed:', data.error);
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Support payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const Tier = ({title, price, note, buttonText, amount}:{title:string; price:string; note:string; buttonText:string; amount:number}) => {
    const isFormOpen = showForm === title;
    const isProcessing = loading === title;

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-3 h-3 rounded-full bg-[var(--wwp-ember)] flex-shrink-0 mt-2"></div>
            <div>
              <div className="font-medium text-lg">{title}</div>
              <div className="text-sm text-black/70 mt-1">{price}</div>
              <div className="text-sm text-black/60 mt-2">{note}</div>
            </div>
          </div>
          <div className="flex-shrink-0">
            {!isFormOpen ? (
              <Button 
                className="btn-ember rounded-full px-6"
                onClick={() => setShowForm(title)}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : buttonText}
              </Button>
            ) : (
              <div className="space-y-3 min-w-[200px]">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="focus-ring"
                />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="focus-ring"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowForm(null);
                      setCustomerEmail('');
                      setCustomerName('');
                    }}
                    className="flex-1 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSupportPayment(amount, title)}
                    disabled={!customerEmail || !customerName || isProcessing}
                    className="btn-ember flex-1 text-sm"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
          Support Wine With Pete
        </h1>
        <p className="text-xl text-black/70 leading-relaxed max-w-2xl mx-auto italic">
          This work is built on stories, sips, firelight, and real support.
        </p>
      </div>
      
      <div className="space-y-4 text-black/80 leading-relaxed mb-12">
        <p>
          If you&apos;ve ever read something here that made you pause, breathe, or feel a little less alone, thank you. That means we met.
        </p>
        <p>
          You can help this project grow by supporting it financially, one glass at a time. Whether it&apos;s a single cup of coffee or a deeper investment in the long-term vision, every bit fuels the writing, the conversations, and the future.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-serif font-medium text-center mb-8 text-charcoal">
          Ways to Support
        </h2>
        
        <div className="space-y-4">
          <Tier 
            title="Buy Me a Coffee" 
            price="$5 – One-Time" 
            note="A small gesture that helps keep the fire burning. Supports one community gathering."
            buttonText="Give $5"
            amount={5}
          />
          <Tier 
            title="Buy Me a Glass of Wine" 
            price="$7/month – Recurring" 
            note="Monthly support for the community. Enables weekly essays, event planning, and keeps the conversation flowing."
            buttonText="Give Monthly"
            amount={7}
          />
          <Tier 
            title="Support the Vision" 
            price="$50 – One-Time" 
            note="For those who believe in building something lasting. Helps fund larger events, partnerships, and community growth."
            buttonText="Give $50"
            amount={50}
          />
        </div>
      </div>

      {/* Other Ways to Support */}
      <div className="bg-cream rounded-2xl p-8 text-center">
        <h3 className="text-xl font-serif font-medium mb-4 text-charcoal">
          Other Ways to Support
        </h3>
        <div className="space-y-3 text-black/70">
          <p>
            <Link href="/join" className="text-ember hover:text-ember-light underline">
              Subscribe to our newsletter
            </Link>
            {' '}and share it with others who might find value in it.
          </p>
          <p>
            <Link href="/gatherings" className="text-ember hover:text-ember-light underline">
              Attend or host a gathering
            </Link>
            {' '}in your area.
          </p>
          <p>
            <Link href="/recipes" className="text-ember hover:text-ember-light underline">
              Purchase a recipe bundle
            </Link>
            {' '}when available.
          </p>
        </div>
      </div>
    </div>
  );
}
