import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gather | Wine With Pete',
  description:
    'Ways to gather with Wine With Pete: privately hosted Signature Tables, custom Gathering Blueprints, and occasional Community Tables.',
  alternates: { canonical: '/gather' },
};

const pathways = [
  {
    eyebrow: 'Signature Table',
    title: 'Pete designs and hosts the table.',
    body:
      'A privately hosted Wine With Pete evening shaped around your people, place, food, wine, and reason for gathering. The aim is not simply to serve dinner. It is to give the evening a point of view and a rhythm of its own.',
    href: '/signature-table',
    cta: 'Explore the Signature Table',
    image: '/images/events/events-community-gathering.png.png',
    imageAlt: 'A Wine With Pete gathering around the table',
  },
  {
    eyebrow: 'Gathering Blueprint',
    title: 'Your table. Your people. A plan built for the evening.',
    body:
      'For hosts who want to bring the gathering to life themselves. Wine With Pete shapes the menu direction, wine, atmosphere, pacing, and gathering structure into a practical blueprint for the night.',
    href: '/plan',
    cta: 'Plan your gathering',
    image: '/images/about/about-pete-beach-fire.png.png',
    imageAlt: 'A gathering shaped around fire and hospitality',
  },
];

export default function GatherPage() {
  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-end lg:gap-20">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Gather</p>
              <h1 className="mt-5 max-w-[10ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
                Give the evening a reason to exist.
              </h1>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="font-crimson text-2xl leading-9 text-black/72 sm:text-[1.65rem] sm:leading-10">
                The best gatherings are not complicated for the sake of being impressive. They are intentional about who is there, what is shared, how the evening moves, and what people carry home with them.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-24 md:space-y-32">
          {pathways.map((pathway, index) => (
            <article
              key={pathway.title}
              className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16"
            >
              <div className={`relative min-h-[430px] overflow-hidden bg-black sm:min-h-[560px] ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <Image
                  src={pathway.image}
                  alt={pathway.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className={`max-w-xl ${index % 2 === 1 ? 'lg:order-1 lg:justify-self-end' : ''}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">{pathway.eyebrow}</p>
                <h2 className="mt-5 font-serif text-4xl font-medium leading-[1.04] tracking-[-0.025em] sm:text-5xl">
                  {pathway.title}
                </h2>
                <p className="mt-7 text-lg leading-8 text-black/65">{pathway.body}</p>
                <Link
                  href={pathway.href}
                  className="mt-8 inline-block border-b border-[#9c3d24] pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9c3d24]"
                >
                  {pathway.cta} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#211d19] px-5 py-20 text-[#f4efe7] sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[.8fr_1.2fr] md:items-center md:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d78959]">Community Tables</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Sometimes we open the table.</h2>
          </div>
          <div className="max-w-2xl">
            <p className="font-crimson text-xl leading-8 text-white/68 sm:text-2xl sm:leading-9">
              Not every Wine With Pete gathering is commissioned privately. From time to time, there are public tables, fire gatherings, pilots, and collaborations that make room for people who might not otherwise meet.
            </p>
            <Link href="/gatherings" className="mt-7 inline-block border-b border-[#d78959] pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#e5a17b]">
              Explore community tables →
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">The point of view</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">A table should feel like it could only have happened this way.</h2>
          </div>
          <div className="grid gap-px border-y border-black/15 bg-black/15 sm:grid-cols-3">
            {[
              ['People before performance', 'The guests and the reason for gathering come before spectacle.'],
              ['Atmosphere has a job', 'Food, wine, fire, music, pacing, and place should support the same evening.'],
              ['Leave room for life', 'A good plan creates conditions for spontaneity rather than scripting every moment.'],
            ].map(([title, body]) => (
              <div key={title} className="bg-[#f4efe7] px-6 py-8 sm:px-7 sm:py-10">
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-black/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#eee4d7] px-5 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Start here</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Have people in mind already?</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-black/62">
              Start with the kind of gathering you want to create. We can figure out the table from there.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/signature-table" className="inline-flex min-h-12 items-center justify-center bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Host a Signature Table
            </Link>
            <Link href="/plan" className="inline-flex min-h-12 items-center justify-center border border-black/30 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#211d19]">
              Get a Blueprint
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
