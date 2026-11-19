'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RejoinForm({ id, token }: { id: string; token: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLink = Boolean(id && token);

  const confirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/newsletter/rejoin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token }),
      });
      const result = await response.json();
      if (response.ok && result.success) setConfirmed(true);
      else setError(result.error || 'We could not confirm your return. Please try again.');
    } catch {
      setError('We could not confirm your return. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[72vh] items-center bg-[#f4efe7] px-5 py-20 text-[#211d19] sm:px-8">
      <div className="mx-auto w-full max-w-2xl border-y border-black/15 py-16 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Founding Table</p>
        <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-[-0.03em]">{confirmed ? 'Welcome back.' : 'A seat is waiting.'}</h1>
        <p className="mx-auto mt-6 max-w-lg font-crimson text-2xl leading-9 text-black/65">
          {confirmed
            ? "You're back on the list for occasional notes, recipes, and invitations."
            : hasLink
              ? 'You asked to return to the Founding Table. Confirm below to receive emails again.'
              : 'This confirmation link is missing something. You can request a fresh one from the Join page.'}
        </p>
        {!confirmed && hasLink && (
          <button
            type="button"
            onClick={confirm}
            disabled={submitting}
            className="mt-8 min-h-12 bg-[#9c3d24] px-7 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:opacity-60"
          >
            {submitting ? 'Confirming…' : 'Confirm my return'}
          </button>
        )}
        {error && <p role="alert" className="mx-auto mt-5 max-w-lg text-sm text-[#9c3d24]">{error}</p>}
        <p className="mt-10 text-sm text-black/60">
          <Link href={confirmed ? '/journal' : '/join'} className="border-b border-black/40 pb-1">
            {confirmed ? 'Visit the Journal' : 'Return to Join'}
          </Link>
        </p>
      </div>
    </main>
  );
}
