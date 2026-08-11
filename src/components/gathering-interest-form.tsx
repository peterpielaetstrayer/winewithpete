'use client';

import { useState } from 'react';

export function GatheringInterestForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [interestType, setInterestType] = useState<'attend' | 'host' | 'collaborate'>('attend');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/gatherings/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    } catch (submissionError) {
      console.error('Gathering interest error:', submissionError);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="border-y border-black/15 py-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9c3d24]">Interest received</p>
        <h3 className="mt-4 font-serif text-3xl">We&apos;ll keep your place in mind.</h3>
        <p className="mt-4 max-w-xl text-base leading-7 text-black/58">
          When a table is announced near you—or an opportunity fits what you selected—we&apos;ll know where to find you.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-y border-black/15 py-8">
      <div className="grid gap-5 sm:grid-cols-2">
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
        <legend className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">I&apos;m interested in</legend>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
          {[
            ['attend', 'Attending'],
            ['host', 'Hosting'],
            ['collaborate', 'Collaborating'],
          ].map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 text-sm text-black/65">
              <input
                type="radio"
                name="interestType"
                value={value}
                checked={interestType === value}
                onChange={() => setInterestType(value as 'attend' | 'host' | 'collaborate')}
                className="accent-[#9c3d24]"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {error && <p className="mt-5 text-sm text-[#9c3d24]" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting || !email || !name}
        className="mt-7 min-h-12 bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Sending…' : 'Raise my hand'}
      </button>
    </form>
  );
}
