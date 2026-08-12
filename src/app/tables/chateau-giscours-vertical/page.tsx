import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Château Giscours Vertical | Wine With Pete',
  description:
    'The first Red Wine Exploration Board: four vintages of Château Giscours around one table, with food, shared observation, and conversation.',
  alternates: { canonical: '/tables/chateau-giscours-vertical' },
};

const menu = [
  'Mushroom toast',
  'Pear & prosciutto',
  'New York strip',
  'Duck-fat potatoes',
  'Broccolini',
  'Cheese',
  'Chocolate tart',
];

export default function GiscoursTablePage() {
  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Link href="/tables" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9c3d24]">
            ← Table Archive
          </Link>
          <p className="mt-12 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">
            May 23, 2026 · Red Wine Exploration Board No. 01
          </p>
          <h1 className="mt-5 max-w-[12ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
            Château Giscours Vertical
          </h1>
          <p className="mt-8 max-w-3xl font-crimson text-2xl leading-9 text-black/68 sm:text-[1.65rem] sm:leading-10">
            Four vintages — 2015 through 2018 — around one table, with dinner built to give the wines enough time and space to change.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[.7fr_1.3fr] md:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">The idea</p>
          </div>
          <div className="max-w-2xl space-y-6 font-crimson text-xl leading-8 text-black/72">
            <p>
              This evening became the first prototype for what Wine With Pete now calls the Red Wine Exploration Board: a repeatable gathering format built around comparative tasting, shared observation, food, and conversation.
            </p>
            <p>
              A vertical tasting can become technical very quickly. The point of this table was different: let four vintages of the same wine become a shared object of attention, then let the evening unfold around them.
            </p>
            <p>
              The bottles gave everyone something concrete to notice together — age, structure, fruit, texture, preference, surprise — without turning dinner into a classroom.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#eee4d7] px-5 py-16 sm:px-8 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-[.7fr_1.3fr] md:gap-20">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">The menu</p>
            </div>
            <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {menu.map((item, index) => (
                <div key={item} className="flex items-baseline gap-4 border-b border-black/15 pb-4">
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-black/35">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-serif text-2xl">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[.7fr_1.3fr] md:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">What stayed with me</p>
          </div>
          <div className="max-w-2xl">
            <p className="font-serif text-3xl leading-[1.16] sm:text-4xl">
              The wine worked best when it stopped being the subject of the evening and became part of the table&apos;s rhythm.
            </p>
            <p className="mt-7 text-base leading-7 text-black/60">
              That became the lesson worth repeating. The Exploration Board can provide enough structure to help people notice together without turning the table into a class. The archive will eventually hold the full photo sequence and printed tasting material from this evening; for now, this note preserves the first version of the format.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#211d19] px-5 py-16 text-[#f4efe7] sm:px-8 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d78959]">Next table</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">The Seoul Bowl Table</h2>
          </div>
          <Link href="/tables/seoul-bowl-table" className="border-b border-[#d78959] pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Read the table note →
          </Link>
        </div>
      </section>
    </main>
  );
}