'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

import { EventCard } from '@/components/event-card';
import { GatheringInterestForm } from '@/components/gathering-interest-form';
import { buildInquiryMailto, contactEmail } from '@/lib/inquiry-mailto';
import type { Event } from '@/lib/types';

const contactMailto = buildInquiryMailto('Wine With Pete — Gathering Inquiry');

export default function GatheringsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data.data || data.events || []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.9fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Community Tables</p>
            <h1 className="mt-5 max-w-[10ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
              Sometimes we open the table.
            </h1>
          </div>
          <p className="max-w-xl font-crimson text-2xl leading-9 text-black/68 sm:text-[1.55rem] sm:leading-10 lg:justify-self-end">
            Public tables, fire gatherings, pilots, and collaborations for people who want to enter Wine With Pete without commissioning a private evening.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <Link href="/gatherings/taino-fire-table" className="group grid gap-10 border-y border-black/15 py-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-16 lg:py-14">
            <div className="relative min-h-[420px] overflow-hidden bg-black sm:min-h-[560px]">
              <Image
                src="/images/events/events-community-gathering.png.png"
                alt="Wine With Pete community gathering"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
              />
            </div>
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Featured Table</p>
              <h2 className="mt-5 font-serif text-4xl leading-[1.04] tracking-[-0.025em] transition-colors group-hover:text-[#9c3d24] sm:text-5xl">
                Taíno Fire Table
              </h2>
              <p className="mt-6 text-lg leading-8 text-black/62">
                A Puerto Rican–Nordic feast rooted in achiote, live-fire cooking, roots, sea, curated wines, and conversation.
              </p>
              <span className="mt-8 inline-block border-b border-[#9c3d24] pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9c3d24]">
                Enter the table →
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#eee4d7] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Recurring forms</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Different tables ask different things of us.</h2>
          </div>

          <div className="space-y-20 md:space-y-28">
            <article className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div className="relative min-h-[430px] overflow-hidden bg-black sm:min-h-[560px]">
                <Image
                  src="/images/hero/hero-campfire.png.png"
                  alt="Gathering around open fire"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Open Fire</p>
                <h3 className="mt-5 font-serif text-4xl leading-[1.05]">Casual. Outside. Built around the fire.</h3>
                <p className="mt-6 text-lg leading-8 text-black/62">
                  The looser end of Wine With Pete: cooking outside, letting the fire set the pace, and making enough room for people to arrive as they are.
                </p>
              </div>
            </article>

            <article className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div className="relative min-h-[430px] overflow-hidden bg-black sm:min-h-[560px] lg:order-2">
                <Image
                  src="/images/about/about-pete-beach-fire.png.png"
                  alt="Intimate gathering with wine and conversation"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="max-w-xl lg:order-1 lg:justify-self-end">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Salon Tables</p>
                <h3 className="mt-5 font-serif text-4xl leading-[1.05]">Smaller rooms. Longer conversations.</h3>
                <p className="mt-6 text-lg leading-8 text-black/62">
                  Shared meals where the question in the room matters. More intimate, more deliberate, and still loose enough for the evening to become something no one planned.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Upcoming</p>
              <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">When the next table opens, it will live here.</h2>
            </div>
            <div>
              {loading ? (
                <div className="border-y border-black/15 py-12 text-sm text-black/48">Checking the table calendar…</div>
              ) : events.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {events.map((event) => <EventCard key={event.id} event={event} />)}
                </div>
              ) : (
                <div className="border-y border-black/15 py-10">
                  <p className="font-serif text-3xl leading-[1.12]">Nothing public is on the calendar right now.</p>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-black/58">
                    Community Tables are seasonal and place-dependent. Add your name below and we&apos;ll know where people are interested in gathering next.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#eee4d7] px-5 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Raise your hand</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Attend, host, or build something together.</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-black/58">
              The interest list helps us understand where people are and what kind of table they want to help make possible.
            </p>
          </div>
          <GatheringInterestForm />
        </div>
      </section>

      <section className="bg-[#211d19] px-5 py-20 text-[#f4efe7] sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_.8fr] md:items-end md:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d78959]">A private table instead?</p>
            <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.05] sm:text-5xl">Bring your own people. We&apos;ll help shape the evening.</h2>
          </div>
          <div className="flex flex-col gap-4 md:items-start md:justify-self-end">
            <Link href="/gather" className="inline-flex min-h-12 items-center justify-center bg-[#a64225] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Explore Gather
            </Link>
            <a href={contactMailto} className="inline-flex items-center gap-2 text-sm text-white/58 hover:text-white">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {contactEmail}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
