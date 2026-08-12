import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tables | Wine With Pete',
  description:
    'A growing archive of Wine With Pete tables, formats, experiments, menus, places, and people.',
  alternates: { canonical: '/tables' },
};

const tables = [
  {
    title: 'Knife & Fire',
    place: 'Virginia Beach',
    date: 'April 11, 2026',
    format: null,
    status: 'Archive note',
    copy:
      'An early Wine With Pete pilot built around live fire: clams, skewers, steak, cobbler, and an evening designed to move with the fire rather than fight it.',
    href: null,
  },
  {
    title: 'Château Giscours Vertical',
    place: 'Virginia Beach',
    date: 'May 23, 2026',
    format: 'Red Wine Exploration Board No. 01',
    status: 'Read the table note',
    copy:
      'Four vintages of Château Giscours around one table, with a menu designed to give the wines room to change over the course of the evening.',
    href: '/tables/chateau-giscours-vertical',
  },
  {
    title: 'The Seoul Bowl Table',
    place: 'Virginia Beach',
    date: 'June 27, 2026',
    format: null,
    status: 'Read the table note',
    copy:
      'A build-your-own Korean barbecue table centered on shared bowls, four sauces, texture, and the simple pleasure of everyone reaching into the middle.',
    href: '/tables/seoul-bowl-table',
  },
];

export default function TablesPage() {
  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Table Archive</p>
          <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_.85fr] lg:items-end lg:gap-20">
            <h1 className="max-w-[11ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
              A record of the tables that made the work real.
            </h1>
            <p className="max-w-xl font-crimson text-2xl leading-9 text-black/68 sm:text-[1.6rem] sm:leading-10">
              Not a portfolio of perfect dinners. A growing memory of menus, fires, experiments, formats, places, people, and what each evening taught us.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:px-12 md:py-16 lg:px-16">
        <div className="mx-auto max-w-7xl border-t border-black/15">
          {tables.map((table, index) => {
            const content = (
              <>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9c3d24]">Table {String(index + 1).padStart(2, '0')}</p>
                  <p className="mt-3 text-sm leading-6 text-black/48">{table.date}</p>
                </div>
                <div>
                  {table.format && (
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9c3d24]">
                      Format · {table.format}
                    </p>
                  )}
                  <h2 className="font-serif text-4xl leading-[1.04] tracking-[-0.02em] sm:text-5xl">{table.title}</h2>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-black/46">{table.place}</p>
                </div>
                <div className="max-w-xl md:pt-1">
                  <p className="text-base leading-7 text-black/62">{table.copy}</p>
                  <p className={`mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] ${table.href ? 'text-[#9c3d24]' : 'text-black/38'}`}>
                    {table.status}{table.href ? ' →' : ''}
                  </p>
                </div>
              </>
            );

            return table.href ? (
              <Link
                key={table.title}
                href={table.href}
                data-analytics-event="table_open"
                data-analytics-category="journal"
                data-analytics-label={table.title}
                className="group grid gap-7 border-b border-black/15 py-12 transition-colors hover:bg-black/[0.025] md:grid-cols-[150px_1fr_.8fr] md:gap-12 md:px-3 md:py-16"
              >
                {content}
              </Link>
            ) : (
              <article key={table.title} className="grid gap-7 border-b border-black/15 py-12 md:grid-cols-[150px_1fr_.8fr] md:gap-12 md:py-16">
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-5 pb-20 pt-8 sm:px-8 md:px-12 md:pb-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 border-y border-black/15 py-12 md:grid-cols-[.7fr_1.3fr] md:items-start md:gap-16 md:py-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Archive in progress</p>
          </div>
          <div className="max-w-3xl">
            <p className="font-serif text-3xl leading-[1.12] sm:text-4xl">
              Some tables remain singular. Others reveal formats worth repeating.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-black/58">
              Each record can eventually hold its menu, photographs, wine, recipes, reflections, and the details worth remembering. When an evening produces a repeatable Wine With Pete format, that lineage can live here too. Knife & Fire stays in the record while its original photography is being tracked down; it does not need to delay the archive around it.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#211d19] px-5 py-20 text-[#f4efe7] sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d78959]">Make another table</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">The archive grows by gathering again.</h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/gather" className="inline-flex min-h-12 items-center justify-center bg-[#a64225] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Gather with Wine With Pete
            </Link>
            <Link href="/journal" className="inline-flex min-h-12 items-center justify-center border border-white/25 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Back to the Journal
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}