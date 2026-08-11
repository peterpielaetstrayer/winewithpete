import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';

import { buildInquiryMailto, contactEmail } from '@/lib/inquiry-mailto';

const inquiryMailto = buildInquiryMailto('Signature Table Inquiry');

export const metadata: Metadata = {
  title: 'Signature Table | Wine With Pete',
  description:
    'A privately hosted Wine With Pete table designed and hosted around your people, place, food, wine, and reason for gathering.',
  alternates: { canonical: '/signature-table' },
  openGraph: {
    title: 'Signature Table | Wine With Pete',
    description: 'A privately hosted Wine With Pete table designed and hosted around your people and place.',
    url: 'https://winewithpete.me/signature-table',
  },
};

export default function SignatureTablePage() {
  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-[1600px] lg:min-h-[78vh] lg:grid-cols-[.88fr_1.12fr]">
          <div className="flex items-center px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Signature Table</p>
              <h1 className="mt-5 max-w-[9ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
                Pete designs and hosts the table.
              </h1>
              <p className="mt-7 max-w-xl font-crimson text-2xl leading-9 text-black/68 sm:text-[1.55rem] sm:leading-10">
                A privately hosted Wine With Pete evening shaped around your people, your place, and the reason you want everyone there.
              </p>
              <a
                href={inquiryMailto}
                className="mt-9 inline-flex min-h-12 items-center justify-center gap-3 bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Inquire about a table
              </a>
            </div>
          </div>

          <div className="relative min-h-[520px] bg-black lg:min-h-full">
            <Image
              src="/images/events/events-community-gathering.png.png"
              alt="A Wine With Pete gathering around the table"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">What you&apos;re booking</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Not a menu dropped into a room.</h2>
          </div>
          <div className="max-w-4xl">
            <p className="font-serif text-3xl leading-[1.12] sm:text-4xl">
              The food is part of the evening. So are the wine, the pacing, the room, the guests, and the conversation.
            </p>
            <div className="mt-8 max-w-3xl space-y-5 text-lg leading-8 text-black/62">
              <p>
                Signature Tables are small by design—typically six to twelve guests—so the evening can breathe and everyone can still belong to the same conversation.
              </p>
              <p>
                Pete works from the setting outward: who is coming, why you are gathering, what the space can support, what should be cooked or poured, and where the night needs structure versus room to unfold on its own.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#eee4d7] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">How the evening takes shape</p>
              <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Designed enough to feel intentional. Loose enough to feel alive.</h2>
            </div>
            <div className="border-y border-black/15">
              {[
                ['01', 'The reason', 'We begin with the people, the occasion, the setting, and what you hope the evening makes possible.'],
                ['02', 'The table', 'Pete shapes the food direction, wine arc, atmosphere, pacing, and the practical flow of the room.'],
                ['03', 'The hosting', 'On the night, Pete helps hold the arc of the gathering so you can be present with your own guests.'],
                ['04', 'The space between', 'The plan creates conditions for conversation without turning dinner into a facilitated workshop.'],
              ].map(([number, title, body]) => (
                <div key={number} className="grid gap-4 border-b border-black/10 py-8 last:border-b-0 sm:grid-cols-[70px_170px_1fr] sm:gap-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9c3d24]">{number}</p>
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="max-w-2xl text-base leading-7 text-black/58">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20">
          <div className="relative min-h-[480px] overflow-hidden bg-black sm:min-h-[620px]">
            <Image
              src="/images/about/about-pete-beach-fire.png.png"
              alt="Wine With Pete around fire"
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">A good fit</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">When the occasion deserves more than reservations.</h2>
            <div className="mt-7 space-y-4 text-lg leading-8 text-black/62">
              <p>Milestone dinners with close friends or family.</p>
              <p>Founder or leadership tables where the conversation matters as much as the meal.</p>
              <p>Small groups who want an evening with a real point of view in a home or chosen space.</p>
            </div>
            <p className="mt-7 text-sm leading-6 text-black/48">Availability is limited and location-dependent. An inquiry is the first step so we can make sure the table is a good fit.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#211d19] px-5 py-20 text-[#f4efe7] sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end lg:gap-20">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d78959]">Inquire</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Tell Pete who is coming and why you want them around the table.</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/58">
              Include your location, approximate guest count, preferred dates, and a few lines about the evening you have in mind.
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
          Prefer to host the evening yourself?{' '}
          <Link href="/plan" className="border-b border-white/35 text-white/82">Explore a Gathering Blueprint →</Link>
        </div>
      </section>
    </main>
  );
}
