import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Seoul Bowl Table | Wine With Pete',
  description:
    'A Wine With Pete table note on Korean barbecue bowls, four sauces, shared choice, and designing a dinner that invites everyone into the middle.',
  alternates: { canonical: '/tables/seoul-bowl-table' },
};

const principles = [
  {
    title: 'Choice without fragmentation',
    body: 'Everyone could build a bowl differently, but the ingredients still lived in the center of one shared table.',
  },
  {
    title: 'Sauce as conversation',
    body: 'Four sauces created easy comparison, preference, recommendation, and passing back and forth without needing a formal prompt.',
  },
  {
    title: 'The center stays active',
    body: 'Bowls, toppings, meat, vegetables, and sauces kept hands moving across the table instead of locking each person into a finished plate.',
  },
];

export default function SeoulBowlTablePage() {
  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Link href="/tables" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9c3d24]">
            ← Table Archive
          </Link>
          <p className="mt-12 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">June 27, 2026 · Table Note</p>
          <h1 className="mt-5 max-w-[12ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
            The Seoul Bowl Table
          </h1>
          <p className="mt-8 max-w-3xl font-crimson text-2xl leading-9 text-black/68 sm:text-[1.65rem] sm:leading-10">
            Korean barbecue bowls, four sauces, and a table designed around the simple pleasure of everyone reaching into the middle.
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
              This table began with a practical question: what happens when dinner is structured less like a sequence of individual plates and more like a landscape everyone has to participate in?
            </p>
            <p>
              The answer was a build-your-own Korean barbecue table. The meal offered choice, but the choice itself created interaction — asking what someone tried, passing a sauce, reaching for another topping, rebuilding the next bowl a little differently.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#eee4d7] px-5 py-16 sm:px-8 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">What the format did</p>
          <div className="mt-8 grid gap-px bg-black/15 md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.title} className="bg-[#f4efe7] p-7 sm:p-9">
                <h2 className="font-serif text-2xl leading-tight">{principle.title}</h2>
                <p className="mt-5 text-sm leading-6 text-black/62">{principle.body}</p>
              </article>
            ))}
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
              Personalization does not have to isolate people. Sometimes giving everyone more agency makes the shared table more alive.
            </p>
            <p className="mt-7 text-base leading-7 text-black/60">
              That is a design principle worth carrying forward: the meal can leave room for preference while still giving everyone reasons to pass, compare, recommend, and look up from their own plate.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#211d19] px-5 py-16 text-[#f4efe7] sm:px-8 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d78959]">Previous table</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Château Giscours Vertical</h2>
          </div>
          <Link href="/tables/chateau-giscours-vertical" className="border-b border-[#d78959] pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Read the table note →
          </Link>
        </div>
      </section>
    </main>
  );
}
