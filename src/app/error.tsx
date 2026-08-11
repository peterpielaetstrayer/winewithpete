'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="flex min-h-[72vh] items-center bg-[#f4efe7] px-5 py-20 text-[#211d19] sm:px-8 md:px-12 lg:px-16">
      <div className="mx-auto w-full max-w-5xl border-y border-black/15 py-16 md:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Something slipped</p>
        <div className="mt-6 grid gap-10 md:grid-cols-[1.15fr_.85fr] md:items-end md:gap-16">
          <h1 className="max-w-[10ch] font-serif text-5xl leading-[.98] tracking-[-0.035em] sm:text-6xl">
            The page hit a snag.
          </h1>
          <div className="max-w-lg">
            <p className="font-crimson text-2xl leading-9 text-black/65">
              Try the page again. If it keeps happening, the main Wine With Pete paths are still available below.
            </p>
            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={reset}
                className="min-h-12 bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white"
              >
                Try again
              </button>
              <Link href="/" className="border-b border-black/35 pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/65">
                Return home →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
