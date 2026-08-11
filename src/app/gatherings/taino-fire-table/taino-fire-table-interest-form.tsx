'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type InterestOption = {
  value: string;
  label: string;
};

const interestOptions: InterestOption[] = [
  { value: 'future_updates', label: 'Keep me posted as the table develops.' },
  { value: 'seat_open', label: 'Consider me if invitations or seats open.' },
  { value: 'host_or_collaborate', label: 'I may want to host or collaborate on a future table.' },
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
      current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (selectedInterestTypes.length === 0) {
      setError('Choose at least one way you would like to be included.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/gatherings/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      <div className="border-y border-black/15 py-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9c3d24]">You&apos;re on the list</p>
        <h3 className="mt-4 font-serif text-3xl leading-[1.08]">We&apos;ll keep you close to the table.</h3>
        <p className="mt-4 max-w-xl text-base leading-7 text-black/58">
          Future dinner notes, recipes, invitation updates, and other developments can find you here as the concept takes shape.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-y border-black/15 py-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9c3d24]">Interest list</p>
      <h3 className="mt-4 font-serif text-3xl leading-[1.08] sm:text-4xl">Raise your hand for this table.</h3>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">Name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="mt-2 min-h-12 w-full border border-black/20 bg-transparent px-4 outline-none focus:border-[#9c3d24]"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 min-h-12 w-full border border-black/20 bg-transparent px-4 outline-none focus:border-[#9c3d24]"
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">Location <span className="font-normal normal-case tracking-normal text-black/35">optional</span></span>
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="City, State"
          className="mt-2 min-h-12 w-full border border-black/20 bg-transparent px-4 outline-none placeholder:text-black/30 focus:border-[#9c3d24]"
        />
      </label>

      <fieldset className="mt-6">
        <legend className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">How would you like to be included?</legend>
        <div className="mt-4 space-y-3">
          {interestOptions.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-black/65">
              <input
                type="checkbox"
                checked={selectedInterestTypes.includes(option.value)}
                onChange={() => toggleInterestType(option.value)}
                className="mt-1 accent-[#9c3d24]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-6 block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">A note <span className="font-normal normal-case tracking-normal text-black/35">optional</span></span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Why this table interests you, a hosting idea, dietary context, or anything else worth knowing."
          rows={4}
          className="mt-2 w-full border border-black/20 bg-transparent p-4 outline-none placeholder:text-black/30 focus:border-[#9c3d24]"
        />
      </label>

      {error && <p className="mt-5 text-sm text-[#9c3d24]" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting || !name || !email}
        className="mt-7 min-h-12 bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Sending…' : 'Join the interest list'}
      </button>
      <p className="mt-4 max-w-xl text-xs leading-5 text-black/42">Interest does not guarantee a seat; it tells us you want to hear more as the table develops.</p>
    </form>
  );
}
