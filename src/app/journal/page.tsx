import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Journal | Wine With Pete',
  description:
    'The Wine With Pete Journal: tables, essays, recipes, guides, and field notes from a world built around food, wine, fire, hospitality, and conversation.',
  alternates: { canonical: '/journal' },
};

const sections = [
  {
    eyebrow: 'Tables',
    title: 'The gatherings themselves.',
    body:
      'Menus, photographs, places, ideas, and reflections from the evenings that make Wine With Pete real. The archive is meant to become part portfolio, part cultural memory.',
    href: '/tables',
    cta: 'Enter the Table Archive',
    image: '/images/events/events-community-gathering.png.png',
    imageAlt: 'A Wine With Pete gathering around the table',
  },
  {
    eyebrow: 'Essays',
    title: 'The ideas underneath the table.',
    body:
      'Writing about gathering, friendship, attention, hospitality, culture, technology, ritual, and the forces that shape how we live with one another.',
    href: '/essays',
    cta: 'Read the essays',
    image: '/images/about/about-pete-beach-fire.png.png',
    imageAlt: 'Wine With Pete around an outdoor fire',
  },
  {
    eyebrow: 'Recipes & Guides',
    title: 'Things worth making and passing on.',
    body:
      'Field recipes, practical guides, and designed resources built from real meals and experiments—not a separate recipe site, but the useful layer of the same world.',
    href: '/recipes',
    cta: 'Explore recipes and guides',
    image: '/images/hero/hero-campfire.png.png',
    imageAlt: 'Cooking over a Wine With Pete fire',
  },
];

export default function JournalPage() {
  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">The Journal</p>
          <div className="mt-5 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:gap-20">
            <h1 className="max-w-[11ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
              A record of the world around the table.
            </h1>
            <p className="max-w-xl font-crimson text-2xl leading-9 text-black/68 sm:text-[1.6rem] sm:leading-10">
              Food, wine, fire, places, people, and the ideas that surface when we pay attention to how we gather.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-24 md:space-y-32">
          {sections.map((section, index) => (
            <article key={section.title} className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-16">
              <div className={`relative min-h-[380px] overflow-hidden bg-black sm:min-h-[520px] ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </div>
              <div className={`max-w-xl ${index % 2 === 1 ? 'lg:order-1 lg:justify-self-end' : ''}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">{section.eyebrow}</p>
                <h2 className="mt-5 font-serif text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">{section.title}</h2>
                <p className="mt-6 text-lg leading-8 text-black/64">{section.body}</p>
                <Link href={section.href} className="mt-8 inline-block border-b border-[#9c3d24] pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9c3d24]">
                  {section.cta} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-black px-5 py-24 text-white sm:px-8 md:px-12 md:py-32 lg:px-16">
        <Image src="/images/hero/hero-campfire.png.png" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e5a17b]">An editorial principle</p>
          <blockquote className="mt-7 font-serif text-4xl leading-[1.08] tracking-[-0.025em] sm:text-5xl md:text-6xl">
            The Journal should not invent a world for Wine With Pete. It should notice the one being built.
          </blockquote>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">As the archive grows</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">More forms can enter without changing the center.</h2>
          </div>
          <div className="border-y border-black/15 py-2">
            {[
              ['Field Notes', 'Short observations from places, wines, meals, fires, experiments, and people.'],
              ['Films', 'Monologues, gathering films, food stories, and cultural histories when video is the right medium.'],
              ['Guides', 'Designed resources that go deeper than a post and can live as useful objects in their own right.'],
            ].map(([title, body]) => (
              <div key={title} className="grid gap-3 border-b border-black/10 py-7 last:border-b-0 sm:grid-cols-[180px_1fr] sm:gap-8">
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="max-w-2xl text-sm leading-6 text-black/58">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#eee4d7] px-5 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Founding Table</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Stay close to the work as it grows.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-black/62">
              New tables, essays, recipes, field notes, and invitations can arrive there first.
            </p>
          </div>
          <Link href="/join" className="inline-flex min-h-12 items-center justify-center bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Join the Founding Table
          </Link>
        </div>
      </section>
    </main>
  );
}
