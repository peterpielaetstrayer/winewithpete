'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { analyticsEvents } from '@/lib/analytics';
import type { FeaturedEssay } from '@/lib/types';

export default function EssaysPage() {
  const [featuredEssays, setFeaturedEssays] = useState<FeaturedEssay[]>([]);
  const [essaysLoading, setEssaysLoading] = useState(true);

  useEffect(() => {
    fetch('/api/essays')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) setFeaturedEssays(data.data || []);
      })
      .catch((error) => console.error('Failed to fetch essays:', error))
      .finally(() => setEssaysLoading(false));
  }, []);

  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.9fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Journal · Essays</p>
            <h1 className="mt-5 max-w-[10ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
              The ideas underneath the table.
            </h1>
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <p className="font-crimson text-2xl leading-9 text-black/68 sm:text-[1.55rem] sm:leading-10">
              Writing about gathering, attention, culture, technology, truth, hospitality, and what it takes to remain human with one another.
            </p>
            <a
              href="https://winewithpete.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block border-b border-[#9c3d24] pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9c3d24]"
            >
              Full essay archive on Substack →
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Start here</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">A few doors into the thinking.</h2>
          </div>

          <div className="border-y border-black/15">
            {essaysLoading ? (
              <p className="py-10 text-sm text-black/45">Loading essays…</p>
            ) : featuredEssays.length > 0 ? (
              featuredEssays.map((essay, index) => (
                <a
                  key={essay.id}
                  href={essay.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analyticsEvents.essayClicked(essay.title || 'Untitled', essay.url)}
                  className="group grid gap-5 border-b border-black/10 py-8 last:border-b-0 sm:grid-cols-[70px_1fr] sm:gap-7"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9c3d24]">{String(index + 1).padStart(2, '0')}</p>
                  <div>
                    <h3 className="font-serif text-3xl leading-[1.08] transition-colors group-hover:text-[#9c3d24] sm:text-4xl">
                      {essay.title || 'Untitled Essay'}
                    </h3>
                    {essay.excerpt && <p className="mt-4 max-w-2xl text-base leading-7 text-black/58">{essay.excerpt}</p>}
                    <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-[#9c3d24]">Read essay →</span>
                  </div>
                </a>
              ))
            ) : (
              <div className="py-10">
                <p className="font-serif text-3xl">The featured shelf is being recut.</p>
                <p className="mt-4 max-w-xl text-base leading-7 text-black/58">The full archive remains available on Substack while the Journal is reorganized around the new Wine With Pete world.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#211d19] px-5 py-20 text-[#f4efe7] sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d78959]">Why write</p>
          <p className="mt-7 font-serif text-4xl leading-[1.08] tracking-[-0.025em] sm:text-5xl md:text-6xl">
            A table gives ideas somewhere to land. Writing gives the table something to carry forward.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Keep wandering</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">The essays are one room in the Journal.</h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/journal" className="inline-flex min-h-12 items-center justify-center bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Back to the Journal
            </Link>
            <Link href="/join" className="inline-flex min-h-12 items-center justify-center border border-black/30 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#211d19]">
              Join the Founding Table
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
