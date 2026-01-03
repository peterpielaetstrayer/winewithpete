'use client';

import { useState } from 'react';

export function BaselineMethodForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/baseline-method/subscribe', {
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

      if (response.ok && result.success) {
        setIsSubmitted(true);
        // Redirect to Gumroad after a brief delay
        setTimeout(() => {
          window.open(result.gumroad_url || 'https://8413493499309.gumroad.com/l/baseline-method', '_blank');
        }, 1500);
      } else {
        const errorMsg = result.error || result.details || 'Failed to subscribe. Please try again.';
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Baseline Method subscription error:', err);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4">
        <div className="bg-dr-sage/20 border border-dr-sage/40 rounded-lg p-6">
          <p className="text-dr-charcoal font-medium mb-2">
            ✓ Check your email for the download link
          </p>
          <p className="text-sm text-dr-charcoal/70">
            We&apos;re redirecting you to Gumroad now...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg border border-dr-charcoal/20 bg-white text-dr-charcoal focus:outline-none focus:ring-2 focus:ring-dr-terracotta focus:border-transparent"
        />
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 py-3 rounded-lg border border-dr-charcoal/20 bg-white text-dr-charcoal focus:outline-none focus:ring-2 focus:ring-dr-terracotta focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !email}
        className="w-full bg-dr-terracotta hover:bg-dr-terracotta/90 text-white text-lg px-10 py-6 rounded-lg font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSubmitting ? 'Sending...' : 'Get the Baseline Method'}
      </button>
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
      <p className="text-sm text-dr-charcoal/60 text-center">
        Free / Pay-What-You-Want
      </p>
    </form>
  );
}

