'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function JoinPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const contentType = response.headers.get('content-type');
      const result = contentType?.includes('application/json')
        ? await response.json()
        : { error: 'Subscription service returned an unexpected response.' };

      if (response.ok) {
        if (result.already_subscribed) {
          setError("You're already at the Founding Table. Keep an eye on your inbox for the next note.");
          setEmail('');
        } else {
          setIsSubmitted(true);
        }
      } else {
        setError(result.error || result.details || 'Failed to subscribe. Please try again.');
      }
    } catch (subscriptionError) {
      console.error('Newsletter subscription error:', subscriptionError);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="flex min-h-[72vh] items-center bg-[#f4efe7] px-5 py-20 text-[#211d19] sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-4xl border-y border-black/15 py-16 text-center md:py-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Founding Table</p>
          <h1 className="mx-auto mt-6 max-w-[12ch] font-serif text-5xl leading-[1.02] tracking-[-0.03em] sm:text-6xl">
            There&apos;s a chair for you.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl font-crimson text-2xl leading-9 text-black/65">
            You&apos;re on the list. The next note, invitation, recipe, or experiment will find you there.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link href="/journal" className="inline-flex min-h-12 items-center justify-center bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Enter the Journal
            </Link>
            <Link href="/gather" className="border-b border-black/40 pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/70">
              Explore Gather →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_.95fr] lg:items-end lg:gap-24">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Founding Table</p>
            <h1 className="mt-5 max-w-[10ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
              Pull up a chair.
            </h1>
            <p className="mt-7 max-w-2xl font-crimson text-2xl leading-9 text-black/68 sm:text-[1.6rem] sm:leading-10">
              The closer circle around Wine With Pete—new tables, invitations, field notes, essays, recipes, and things still being built.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="border-y border-black/20 py-8 md:py-10">
            <label htmlFor="founding-table-email" className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9c3d24]">
              Your email
            </label>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                id="founding-table-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
                required
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'founding-table-error' : 'founding-table-note'}
                className="min-h-12 flex-1 border border-black/25 bg-transparent px-4 text-base outline-none transition-colors placeholder:text-black/35 focus:border-[#9c3d24]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-12 bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#7f301f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Joining…' : 'Join the Table'}
              </button>
            </div>
            {error ? (
              <p id="founding-table-error" className="mt-3 text-sm text-[#9c3d24]" role="alert">{error}</p>
            ) : (
              <p id="founding-table-note" className="mt-3 text-xs leading-5 text-black/45">Occasional notes. No spam. Leave whenever you like.</p>
            )}
          </form>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">What might arrive</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">
              Not another content schedule. Notes worth sending.
            </h2>
          </div>

          <div className="border-y border-black/15">
            {[
              ['Invitations', 'Early notice when a community table, pilot dinner, collaboration, or other gathering opens.'],
              ['From the Journal', 'New essays, table stories, recipes, field notes, and films when there is something worth sharing.'],
              ['Behind the work', 'Menus, experiments, lessons, unfinished ideas, and the process of building Wine With Pete in public.'],
              ['Early objects', 'Guides, releases, and future Objects From the Table before they are broadly announced.'],
            ].map(([title, body]) => (
              <div key={title} className="grid gap-3 border-b border-black/10 py-8 last:border-b-0 sm:grid-cols-[190px_1fr] sm:gap-8">
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="max-w-2xl text-base leading-7 text-black/58">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#211d19] px-5 py-20 text-[#f4efe7] sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-serif text-4xl leading-[1.08] tracking-[-0.025em] sm:text-5xl md:text-6xl">
            You do not need to understand every part of Wine With Pete to belong at the table.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">While you&apos;re here</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">See what the table is becoming.</h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/journal" className="inline-flex min-h-12 items-center justify-center bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Read the Journal
            </Link>
            <Link href="/gather" className="inline-flex min-h-12 items-center justify-center border border-black/30 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#211d19]">
              Explore Gather
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
