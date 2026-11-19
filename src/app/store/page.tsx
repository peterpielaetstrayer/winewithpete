import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Objects | Wine With Pete',
  description: 'Objects from the Wine With Pete world. The merchandise shop is not open yet; explore free recipes and guides or join the Founding Table for future releases.',
  alternates: { canonical: '/store' },
};

export default function StorePage() {
  return (
    <div className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.25em] text-[#9c3d24]">Objects · Wine With Pete</p>
            <h1 className="mt-5 max-w-[12ch] font-serif text-5xl leading-[.98] tracking-[-.035em] sm:text-6xl md:text-7xl">
              Things worth keeping around the table.
            </h1>
          </div>
          <p className="max-w-xl font-crimson text-2xl leading-9 text-black/68 sm:text-[1.6rem] sm:leading-10">
            Not merchandise for its own sake. Useful and beautiful things that make sense in the life we are building around food, wine, and gathering.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-20">
          <figure className="relative aspect-[4/5] overflow-hidden bg-black">
            <Image
              src="/images/explore-v03/outside-cheese.webp"
              alt="A small cheese board laid out outdoors"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </figure>
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[.25em] text-[#9c3d24]">The shelf is taking shape</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Nothing for sale here today.</h2>
            <p className="mt-7 text-lg leading-8 text-black/65">
              The merchandise shop is not open yet. When an object is genuinely ready—something to use, wear, share, or return to—it will have a place here. We won&apos;t list mock products or send you into an unfinished checkout.
            </p>
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link href="/explore" className="inline-flex min-h-12 items-center justify-center bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[.16em] text-white hover:bg-[#7b311d]">
                Explore free guides and recipes
              </Link>
              <Link href="/join" className="inline-flex min-h-12 items-center border-b border-[#9c3d24] text-xs font-semibold uppercase tracking-[.16em] text-[#9c3d24]">
                Join the Founding Table →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#211d19] px-5 py-16 text-[#f4efe7] sm:px-8 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <p className="max-w-3xl font-serif text-3xl leading-[1.1] sm:text-4xl">For now, the best thing to take home is something you can make.</p>
          <Link href="/recipes" className="inline-flex min-h-12 shrink-0 items-center border-b border-[#d78959] text-xs font-semibold uppercase tracking-[.16em] text-[#e5a17b]">
            Browse recipes and guides →
          </Link>
        </div>
      </section>
    </div>
  );
}
