'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type InterestOption = {
  value: string;
  label: string;
};

const interestOptions: InterestOption[] = [
  {
    value: 'future_updates',
    label: 'Keep me posted about future dinners and recipes.',
  },
  {
    value: 'seat_open',
    label: 'I’d like to be considered for an invitation if seats open.',
  },
  {
    value: 'host_or_collaborate',
    label: 'I may want to host or collaborate on a future table.',
  },
];

export function TainoFireTableInterestForm() {
  const searchParams = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [selectedInterestTypes, setSelectedInterestTypes] = useState<string[]>(['future_updates']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const utm = useMemo(
    () => ({
      source: searchParams.get('utm_source') || undefined,
      medium: searchParams.get('utm_medium') || undefined,
      campaign: searchParams.get('utm_campaign') || undefined,
    }),
    [searchParams]
  );

  const toggleInterestType = (value: string) => {
    setSelectedInterestTypes((current) =>
      current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (selectedInterestTypes.length === 0) {
      setError('Choose at least one way you’d like to be included.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/gatherings/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          location: location || undefined,
          interestTypes: selectedInterestTypes,
          note: note || undefined,
          source: 'taino_fire_table',
          pagePath: '/gatherings/taino-fire-table',
          newsletterOptIn: true,
          utm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.details || 'Failed to submit. Please try again.');
        return;
      }

      setIsSubmitted(true);
      setName('');
      setEmail('');
      setLocation('');
      setNote('');
      setSelectedInterestTypes(['future_updates']);
    } catch (submitError) {
      console.error('Taíno Fire Table interest submission failed:', submitError);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border text-center">
        <div className="w-16 h-16 mx-auto mb-5 bg-ember/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif font-medium mb-3 text-charcoal">Thank you</h3>
        <p className="text-black/70 leading-relaxed max-w-xl mx-auto">
          Thank you — you&apos;re on the list. I&apos;ll send future dinner notes, recipes, and
          invitations as this table develops.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border">
      <h2 className="text-2xl md:text-3xl font-serif font-medium text-charcoal mb-4">
        Join the Founding Table
      </h2>
      <p className="text-black/70 leading-relaxed mb-8">
        Get future recipes, dinner notes, and first notice about private Wine With Pete tables.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="taino-name" className="block text-sm font-medium mb-2 text-charcoal">
            Name
          </label>
          <Input
            id="taino-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="focus-ring"
          />
        </div>

        <div>
          <label htmlFor="taino-email" className="block text-sm font-medium mb-2 text-charcoal">
            Email
          </label>
          <Input
            id="taino-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="focus-ring"
          />
        </div>

        <div>
          <label htmlFor="taino-location" className="block text-sm font-medium mb-2 text-charcoal">
            Location (optional)
          </label>
          <Input
            id="taino-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State"
            className="focus-ring"
          />
        </div>

        <div>
          <p className="block text-sm font-medium mb-3 text-charcoal">
            How would you like to be included?
          </p>
          <div className="space-y-3">
            {interestOptions.map((option) => (
              <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedInterestTypes.includes(option.value)}
                  onChange={() => toggleInterestType(option.value)}
                  className="mt-1 h-4 w-4 rounded border-black/20 text-ember focus:ring-ember"
                />
                <span className="text-black/80 leading-relaxed">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="taino-note" className="block text-sm font-medium mb-2 text-charcoal">
            Optional note
          </label>
          <Textarea
            id="taino-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Guest count, location, hosting idea, dietary notes, or why this table interests you."
            className="focus-ring min-h-28"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || !name || !email}
          className="btn-ember w-full py-4 rounded-full text-lg font-medium"
        >
          {isSubmitting ? 'Joining...' : 'Join the Interest List'}
        </Button>

        <p className="text-sm text-black/60 leading-relaxed text-center">
          Joining the interest list does not guarantee a seat. It simply lets me know you would
          like to hear more as this table develops.
        </p>
      </form>
    </div>
  );
}
