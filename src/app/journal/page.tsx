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
    eyebrow: 'From the Table · May 2026',
    title: 'Four vintages, one long table.',
    body:
      'At the Château Giscours Vertical, four vintages and a carefully paced menu gave everyone something to notice, compare, and talk about. Here is the evening as it happened.',
    href: '/tables/chateau-giscours-vertical',
    cta: 'Read the Giscours table story',
    image: '/images/tables/giscours-exploration-board.webp',
    imageAlt: 'The Château Giscours tasting board from the actual Wine With Pete dinner',
  },
  {
    eyebrow: 'From the Table · June 2026',
    title: 'A meal everyone helped build.',
    body:
      'The Seoul Bowl Table brought Korean barbecue, sauces, greens, and choices into the middle of the room. The best part was watching people make the meal their own.',
    href: '/tables/seoul-bowl-table',
    cta: 'Read the Seoul Bowl story',
    image: '/images/explore-v03/hero-seoul-bowl.webp',
    imageAlt: 'The actual Seoul Bowl gathering with shared food and printed menus',
  },
  {
    eyebrow: 'Cook with the work · Field guide preview',
    title: 'Make a better taco night.',
    body:
      'Start with the bean-and-cheese burrito companion: shopping list, cooking steps, and a printable edition. It is an open kitchen-test draft, ready to try and improve.',
    href: '/guides/better-taco-night',
    cta: 'Try the interactive guide',
    image: '/images/explore-v03/ingredients.webp',
    imageAlt: 'Ingredients laid out before a Wine With Pete cooking session; not a photograph of the unfinished guide recipe',
  },
];

export default function JournalPage() {
  return (
    <div className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">The Journal</p>
          <div className="mt-5 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:gap-20">
            <h1 className="max-w-[11ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
              A record of the world around the table.
            </h1>
            <div className="max-w-xl">
              <p className="font-crimson text-2xl leading-9 text-black/68 sm:text-[1.6rem] sm:leading-10">
                Food, wine, fire, places, people, and the ideas that surface when we pay attention to how we gather.
              </p>
              <Link href="/explore" className="mt-7 inline-flex min-h-11 items-center border-b border-[#9c3d24] text-xs font-semibold uppercase tracking-[.16em] text-[#9c3d24]">
                Find something to cook, taste or share →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-8 pt-12 sm:px-8 md:px-12 md:pb-12 md:pt-16 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 border-b border-black/15 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Start with what is here</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">Real tables. Something to make.</h2>
          </div>
          <nav aria-label="Journal shelves" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#9c3d24]">
            <Link href="/tables" className="min-h-11 content-center underline underline-offset-4">Table archive</Link>
            <Link href="/essays" className="min-h-11 content-center underline underline-offset-4">Essays</Link>
            <Link href="/recipes" className="min-h-11 content-center underline underline-offset-4">Recipes &amp; guides</Link>
          </nav>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 md:px-12 md:pb-28 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-20 md:space-y-28">
          {sections.map((section, index) => (
            <article key={section.title} className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-16">
              <div className={`relative min-h-[265px] overflow-hidden bg-black sm:min-h-[440px] ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
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
    </div>
  );
}
