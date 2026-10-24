import type { Metadata } from 'next';
import Link from 'next/link';

import { groups, steps, supportedBatches, guideStatus } from '@/data/guides/better-taco-night';
import { ingredientText } from '@/lib/guides/quantity';

export const metadata: Metadata = {
  title: 'Bean & Cheese Burrito · Kitchen-Test Recipe | Wine With Pete',
  description: 'An accessible, print-friendly kitchen test edition of the Better Taco Night bean and cheese burrito.',
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ servings?: string }>;
};

export default async function PrintTacoGuide({ searchParams }: PageProps) {
  const params = await searchParams;
  const value = Number(params.servings);
  const servings = supportedBatches.some(n => n === value) ? value : 6;

  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <article id="wwp-print-guide" className="mx-auto max-w-4xl px-5 py-12 sm:px-10 sm:py-16">
        <div className="wwp-print-controls mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-black/15 pb-6">
          <Link href="/guides/better-taco-night" className="text-sm text-[#9c3d24] hover:underline">← Back to interactive guide</Link>
          <p className="text-sm text-black/60">Print this page or choose “Save as PDF” in your browser.</p>
        </div>
        <header className="border-b border-[#211d19]/25 pb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-[#9c3d24]">Wine With Pete · Cravings, Rebuilt / 01</p>
          <h1 className="mt-5 font-serif text-4xl leading-[1.07] sm:text-6xl">The Perfect Bean & Cheese Burrito</h1>
          <p className="mt-5 font-crimson text-xl leading-7 text-black/65">Silky beans. Tangy, mild red sauce. Finely shredded cheddar. A soft tortilla.</p>
          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <span><strong>Batch:</strong> {servings} burritos</span>
            <span><strong>Estimated time:</strong> ~35 minutes</span>
          </div>
          <p className="mt-5 border-l-2 border-[#9c3d24] pl-4 text-sm leading-6 text-black/65"><strong>Kitchen-test draft.</strong> {guideStatus} Do not treat these amounts as a validated final recipe.</p>
        </header>

        <section className="mt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-[#9c3d24]">Shopping & preparation</p>
          <h2 className="mt-3 font-serif text-3xl">Ingredients</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {groups.map(group => (
              <section key={group.name} className="break-inside-avoid">
                <h3 className="border-b border-black/20 pb-2 font-serif text-xl">{group.name}</h3>
                <ul className="mt-3 space-y-2">
                  {group.items.map(item => (
                    <li key={item.id} className="flex items-start gap-3 text-sm leading-6">
                      <span aria-hidden className="mt-[7px] h-3 w-3 shrink-0 border border-black/35"/>
                      <span>{ingredientText(item, servings)}{item.note ? <span className="block text-xs text-black/55">{item.note}</span> : null}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-black/25 pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-[#9c3d24]">Kitchen method</p>
          <h2 className="mt-3 font-serif text-3xl">Cook it with care.</h2>
          <ol className="mt-5 divide-y divide-black/15">
            {steps.map((step, index) => (
              <li key={step.title} className="break-inside-avoid py-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#9c3d24]">Step {String(index + 1).padStart(2,'0')} of {steps.length}</p>
                  <span className="text-xs text-black/55">{step.time}</span>
                </div>
                <h3 className="mt-2 font-serif text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-7">{step.instruction}</p>
                <p className="mt-3 text-sm leading-6 text-black/65"><strong>Look for:</strong> {step.cue}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 break-inside-avoid border-t border-black/20 py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-[#9c3d24]">Taste & remember</p>
          <h2 className="mt-3 font-serif text-2xl">Your kitchen notes</h2>
          <div className="mt-5 space-y-5">
            <div className="h-10 border-b border-dotted border-black/40"/>
            <div className="h-10 border-b border-dotted border-black/40"/>
          </div>
          <p className="mt-8 font-crimson text-lg italic">Food is part of it. The table is the point.</p>
        </section>
      </article>
    </main>
  );
}
