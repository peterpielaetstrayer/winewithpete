import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';

import { buildInquiryMailto, contactEmail } from '@/lib/inquiry-mailto';

const inquiryMailto = buildInquiryMailto(
  'Plan a Gathering — Blueprint Inquiry',
  'What kind of gathering are you imagining?'
);

export const metadata: Metadata = {
  title: 'Gathering Blueprint | Wine With Pete',
  description:
    'A custom Wine With Pete gathering blueprint for hosts who want to bring the evening to life themselves: menu direction, wine, flow, conversation, and atmosphere.',
  alternates: { canonical: '/plan' },
  openGraph: {
    title: 'Gathering Blueprint | Wine With Pete',
    description: 'A custom gathering plan shaped around your people, place, menu, wine, and the kind of evening you want to create.',
    url: 'https://winewithpete.me/plan',
  },
};

export default function PlanPage() {
  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.9fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Gathering Blueprint</p>
            <h1 className="mt-5 max-w-[10ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
              Your table. Your people. A plan built for the evening.
            </h1>
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <p className="font-crimson text-2xl leading-9 text-black/68 sm:text-[1.55rem] sm:leading-10">
              Wine With Pete designs the gathering. You bring it to life in your own home or chosen space.
            </p>
            <a href={inquiryMailto} className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Start a blueprint inquiry
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">What arrives</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">The architecture for a gathering you can actually host.</h2>
          </div>

          <div className="border-y border-black/15">
            {[
              ['The gathering idea', 'A clear concept for the evening shaped around the occasion, guests, setting, and what you want the table to feel like.'],
              ['Food & wine direction', 'A practical menu and wine arc built for your space and your ability to execute—not complexity for its own sake.'],
              ['Flow & conversation', 'A suggested rhythm for arrival, serving, transitions, and conversation so the night has shape without feeling scripted.'],
              ['Atmosphere & details', 'Notes on the table, lighting, music, fire, service, and the small choices that help the evening feel like one coherent thing.'],
            ].map(([title, body], index) => (
              <div key={title} className="grid gap-4 border-b border-black/10 py-8 last:border-b-0 sm:grid-cols-[70px_190px_1fr] sm:gap-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9c3d24]">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="max-w-2xl text-base leading-7 text-black/58">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#eee4d7] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20">
          <div className="relative min-h-[500px] overflow-hidden bg-black sm:min-h-[640px]">
            <Image
              src="/images/about/about-pete-beach-fire.png.png"
              alt="Planning a Wine With Pete gathering around fire and hospitality"
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
          </div>

          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">How it works</p>
            <div className="mt-6 border-y border-black/15">
              {[
                ['01', 'Tell Pete about the evening', 'Who is coming, where you are hosting, what the occasion is, and what you want people to remember.'],
                ['02', 'The blueprint takes shape', 'Pete turns those constraints into one coherent gathering plan rather than a pile of disconnected recommendations.'],
                ['03', 'You host it', 'The blueprint stays with you. Use it for the evening, adapt it as needed, and keep what is useful for future tables.'],
              ].map(([number, title, body]) => (
                <div key={number} className="border-b border-black/10 py-7 last:border-b-0">
                  <div className="flex items-baseline gap-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9c3d24]">{number}</span>
                    <h3 className="font-serif text-2xl">{title}</h3>
                  </div>
                  <p className="mt-3 pl-10 text-base leading-7 text-black/58">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">What it is not</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">A blueprint is design, not drop-off catering.</h2>
          </div>
          <div className="max-w-3xl">
            <p className="font-serif text-3xl leading-[1.12] sm:text-4xl">
              You remain the host. That is part of the point.
            </p>
            <div className="mt-7 space-y-5 text-lg leading-8 text-black/62">
              <p>
                The blueprint is for people who want expert help thinking through the whole gathering while keeping the act of hosting in their own hands.
              </p>
              <p>
                It works especially well for milestone dinners, intimate friend groups, first salons, leadership tables, and hosts who know they want the evening to feel different but do not want to invent every detail from scratch.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#211d19] px-5 py-20 text-[#f4efe7] sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end lg:gap-20">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d78959]">Start the conversation</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">What kind of evening are you imagining?</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/58">
              Send a few lines about your location, guest count, occasion, and the table you have in mind. We&apos;ll start there.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <a href={inquiryMailto} className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#a64225] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email Pete
            </a>
            <p className="mt-3 text-xs text-white/42">{contactEmail}</p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-sm text-white/52">
          Want Pete to host the evening instead?{' '}
          <Link href="/signature-table" className="border-b border-white/35 text-white/82">Explore the Signature Table →</Link>
        </div>
      </section>
    </main>
  );
}
