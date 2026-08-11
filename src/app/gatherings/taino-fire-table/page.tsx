import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { TainoFireTableInterestForm } from './taino-fire-table-interest-form';

export const metadata: Metadata = {
  title: 'Taíno Fire Table | Wine With Pete',
  description:
    'A Puerto Rican–Nordic Wine With Pete table rooted in achiote, live-fire cooking, roots, sea, curated wines, ancestry, and conversation.',
  alternates: { canonical: '/gatherings/taino-fire-table' },
  openGraph: {
    title: 'Taíno Fire Table | Wine With Pete',
    description: 'An experimental Wine With Pete table rooted in fire, food, wine, ancestry, and conversation.',
    url: 'https://winewithpete.me/gatherings/taino-fire-table',
    siteName: 'Wine With Pete',
    type: 'website',
  },
};

const tableElements = [
  ['Fire & Smoke', 'Live-fire cooking, char, ember, and food that still feels tied to the elements.'],
  ['Roots & Sea', 'A Puerto Rican–Nordic direction built around achiote, roots, seafood, preserved flavors, and shared plates.'],
  ['Wine as an Arc', 'Bottles chosen to support the movement of the meal rather than behave like isolated pairings.'],
  ['Conversation', 'A table designed for presence, memory, inheritance, and the things people carry home.'],
];

export default function TainoFireTablePage() {
  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="relative isolate min-h-[78vh] overflow-hidden bg-black text-white">
        <Image
          src="/images/hero/hero-campfire.png.png"
          alt="Live fire at a Wine With Pete table"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-65"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,6,5,.88)_0%,rgba(8,6,5,.64)_48%,rgba(8,6,5,.24)_100%)]" />

        <div className="mx-auto flex min-h-[78vh] max-w-7xl items-end px-5 pb-16 pt-28 sm:px-8 md:px-12 md:pb-20 lg:items-center lg:px-16 lg:pb-10">
          <div className="max-w-4xl">
            <Link href="/gatherings" className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55 hover:text-white">
              ← Community Tables
            </Link>
            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e5a17b]">Featured Table</p>
            <h1 className="mt-5 font-serif text-[clamp(3.4rem,7vw,7rem)] font-medium leading-[.92] tracking-[-0.045em]">
              Taíno Fire Table
            </h1>
            <p className="mt-7 max-w-2xl font-crimson text-2xl leading-9 text-white/76 sm:text-3xl sm:leading-10">
              A Puerto Rican–Nordic table built around fire, ancestry, roots, sea, wine, and conversation.
            </p>
            <p className="mt-7 max-w-3xl text-[10px] font-semibold uppercase leading-6 tracking-[0.2em] text-white/48 sm:text-xs">
              Achiote · live fire · roots & sea · shared plates · curated wines · conversation
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">The idea</p>
          </div>
          <div className="max-w-4xl">
            <p className="font-serif text-4xl leading-[1.08] tracking-[-0.02em] sm:text-5xl">
              What happens when a table uses food to explore inheritance without turning ancestry into costume?
            </p>
            <div className="mt-9 max-w-3xl space-y-6 font-crimson text-xl leading-8 text-black/66 sm:text-2xl sm:leading-9">
              <p>
                Taíno Fire Table is an experimental Wine With Pete concept: Puerto Rican ingredients and memory meeting a Nordic instinct for preservation, restraint, smoke, roots, and sea.
              </p>
              <p>
                The aim is not to stage a theme dinner. It is to let the meal ask questions about place, migration, memory, and what we inherit—while still being generous enough to simply be a good evening around the table.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#eee4d7] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">The table</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Four threads, one evening.</h2>
          </div>
          <div className="border-y border-black/15">
            {tableElements.map(([title, body], index) => (
              <div key={title} className="grid gap-4 border-b border-black/10 py-8 last:border-b-0 sm:grid-cols-[70px_190px_1fr] sm:gap-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9c3d24]">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="max-w-2xl text-base leading-7 text-black/58">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">As it develops</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">This is a living table, not a finished product page.</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-black/58">
              The menu, location, scale, and final form can evolve through testing. The interest list is a way to follow the table, signal that you might want a seat, or raise your hand to host or collaborate.
            </p>
          </div>
          <TainoFireTableInterestForm />
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#211d19] px-5 py-20 text-[#f4efe7] sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_.9fr] md:items-end md:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d78959]">Keep exploring</p>
            <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.05] sm:text-5xl">One table is only one expression of the larger work.</h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row md:justify-self-end">
            <Link href="/tables" className="inline-flex min-h-12 items-center justify-center bg-[#a64225] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Table Archive
            </Link>
            <Link href="/gather" className="inline-flex min-h-12 items-center justify-center border border-white/25 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Explore Gather
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
