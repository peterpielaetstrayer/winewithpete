import type { Metadata } from 'next';
import Image from 'next/image';
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
          <div className="mt-12 grid items-center gap-8 md:grid-cols-[1.1fr_.9fr] md:gap-14">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">
                May 23, 2026 · Red Wine Exploration Board No. 01
              </p>
              <h1 className="mt-5 max-w-[12ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
                Château Giscours Vertical
              </h1>
              <p className="mt-8 max-w-3xl font-crimson text-2xl leading-9 text-black/68 sm:text-[1.65rem] sm:leading-10">
                Four vintages around one table, from 2015 through 2018. We planned dinner around giving the wines time to open up.
              </p>
            </div>
            <figure>
              <Image
                src="/images/tables/giscours-bottles-menu.webp"
                alt="Château Giscours bottles and glasses beside the printed dinner menu"
                width={602}
                height={800}
                sizes="(max-width: 767px) 94vw, 480px"
                className="h-auto w-full"
              />
              <figcaption className="mt-3 text-sm leading-6 text-black/65">
                Bottles, glasses and the printed menu before the tasting.
              </figcaption>
            </figure>
          </div>
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

      <figure className="mx-auto max-w-3xl px-5 pb-12 sm:px-8 md:pb-16">
        <Image
          src="/images/tables/giscours-exploration-board.webp"
          alt="A shared serving board surrounded by glasses of red wine and printed tasting materials"
          width={1050}
          height={990}
          sizes="(max-width: 768px) 94vw, 704px"
          className="h-auto w-full"
        />
        <figcaption className="mt-3 text-sm leading-6 text-black/65">
          Poured wines and the printed tasting sheets at the Giscours table.
        </figcaption>
      </figure>

      <section className="border-y border-black/10 bg-[#eee4d7] px-5 py-16 sm:px-8 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-[.7fr_1.3fr] md:gap-20">
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">From the menu</h2>
              <figure className="mt-6 max-w-sm">
              <Image
                src="/images/tables/giscours-opening-bites.webp"
                alt="Mushroom toasts and skewered bites beside the tasting place settings"
                width={602}
                height={800}
                sizes="(max-width: 767px) 94vw, 480px"
                className="h-auto w-full"
              />
              <figcaption className="mt-3 text-sm leading-6 text-black/65">
                Opening bites at the Giscours table.
              </figcaption>
            </figure>
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
              As the wines opened, everyone could compare how they tasted and talk about what surprised them.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl items-center gap-8 px-5 pb-16 sm:px-8 md:grid-cols-2 md:gap-14 md:px-12 md:pb-24 lg:px-16">
        <figure className="max-w-md">
              <Image
                src="/images/tables/giscours-cheese-chocolate.webp"
                alt="Cheeses and chocolate tarts on a wooden serving board"
                width={602}
                height={800}
                sizes="(max-width: 767px) 94vw, 480px"
                className="h-auto w-full"
              />
              <figcaption className="mt-3 text-sm leading-6 text-black/65">
                Cheese and chocolate tarts to close the meal.
              </figcaption>
            </figure>
        <div>
          <h2 className="font-serif text-3xl">The end of the meal</h2>
          <p className="mt-4 max-w-md text-base leading-7 text-black/65">
            Cheese and chocolate tarts gave us one more reason to stay at the table and return to the wines.
          </p>
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