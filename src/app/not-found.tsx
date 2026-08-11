import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[72vh] items-center bg-[#f4efe7] px-5 py-20 text-[#211d19] sm:px-8 md:px-12 lg:px-16">
      <div className="mx-auto w-full max-w-5xl border-y border-black/15 py-16 md:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">404 · Wrong turn</p>
        <div className="mt-6 grid gap-10 md:grid-cols-[1.15fr_.85fr] md:items-end md:gap-16">
          <h1 className="max-w-[10ch] font-serif text-5xl leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
            This chair isn&apos;t at the table anymore.
          </h1>
          <div className="max-w-lg">
            <p className="font-crimson text-2xl leading-9 text-black/65">
              The page may have moved as Wine With Pete has changed. The main table is still easy to find.
            </p>
            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
              <Link href="/" className="inline-flex min-h-12 items-center justify-center bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Return home
              </Link>
              <Link href="/journal" className="border-b border-black/35 pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/65">
                Enter the Journal →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
