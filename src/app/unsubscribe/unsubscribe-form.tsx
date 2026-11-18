'use client';

import Link from 'next/link';
import { useState } from 'react';

export function UnsubscribeForm({ subscriberId, token }: { subscriberId: string; token: string }) {
  const [status, setStatus] = useState<'ready' | 'pending' | 'success' | 'error'>('ready');

  async function unsubscribe() {
    setStatus('pending');
    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: subscriberId, token }),
      });
      setStatus(response.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mt-10">
      {status === 'success' ? (
        <p className="font-crimson text-xl text-[#315b43]" role="status">
          You&apos;ve been unsubscribed. You won&apos;t receive future Founding Table emails.
        </p>
      ) : (
        <>
          <p className="text-sm leading-6 text-black/60">
            {subscriberId && token
              ? 'Confirm below to stop receiving Founding Table notes and invitations.'
              : 'This link is incomplete. Please use the unsubscribe link in an email from Pete.'}
          </p>
          {status === 'error' && (
            <p className="mt-4 text-sm text-[#9c3d24]" role="alert">
              We couldn&apos;t complete that request. Please try again or email pete@winewithpete.me for help.
            </p>
          )}
          <button
            type="button"
            onClick={unsubscribe}
            disabled={!subscriberId || !token || status === 'pending'}
            className="mt-7 min-h-12 bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#7f301f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'pending' ? 'Updating…' : 'Unsubscribe'}
          </button>
        </>
      )}
      <p className="mt-8 text-sm text-black/60">
        <Link href="/explore" className="border-b border-black/35 pb-1 hover:border-black">Explore Wine With Pete</Link>
      </p>
    </div>
  );
}
