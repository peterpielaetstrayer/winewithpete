'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function GatheringInterestForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [interestType, setInterestType] = useState<'attend' | 'host' | 'collaborate'>('attend');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/gatherings/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          location: location || undefined,
          interestType: interestType || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
        setName('');
        setLocation('');
        setInterestType('attend');
      } else {
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error('Gathering interest error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-ember/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-serif font-medium mb-2 text-charcoal">Thank You</h3>
          <p className="text-black/70">
            We&apos;ll notify you when gatherings are announced in your area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border">
      <h3 className="text-2xl font-serif font-medium mb-4 text-charcoal">
        Let us know you&apos;re interested
      </h3>
      <p className="text-black/70 mb-6">
        We&apos;ll notify you when gatherings are announced in your area. You can also express interest in hosting or collaborating.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-charcoal">
            Name *
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="focus-ring"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-charcoal">
            Email *
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="focus-ring"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2 text-charcoal">
            Location (optional)
          </label>
          <Input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State"
            className="focus-ring"
          />
          <p className="text-sm text-black/60 mt-1">Help us plan gatherings in your area</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-charcoal">
            I&apos;m interested in:
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="interestType"
                value="attend"
                checked={interestType === 'attend'}
                onChange={() => setInterestType('attend')}
                className="w-4 h-4 text-ember focus:ring-ember"
              />
              <span className="text-black/80">Attending a gathering</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="interestType"
                value="host"
                checked={interestType === 'host'}
                onChange={() => setInterestType('host')}
                className="w-4 h-4 text-ember focus:ring-ember"
              />
              <span className="text-black/80">Hosting a gathering</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="interestType"
                value="collaborate"
                checked={interestType === 'collaborate'}
                onChange={() => setInterestType('collaborate')}
                className="w-4 h-4 text-ember focus:ring-ember"
              />
              <span className="text-black/80">Collaborating on events</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || !email || !name}
          className="btn-ember w-full py-4 rounded-full text-lg font-medium"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Interest'}
        </Button>
      </form>
    </div>
  );
}

