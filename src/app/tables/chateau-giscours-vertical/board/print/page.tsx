import type { Metadata } from 'next';
import Link from 'next/link';
import { tastingPrompts, verticalVintages } from '@/data/guides/giscours-exploration';
import './print.css';

export const metadata: Metadata = {
  title: 'Printable Red Wine Exploration Board | Wine With Pete',
  robots: { index: false, follow: false },
};

export default function PrintExplorationBoard() {
  return (
    <main className="bg-[#f4efe7] px-5 py-10 text-[#211d19] sm:px-10">
      <article id="wwp-print-board" className="mx-auto max-w-5xl">
        <div className="wwp-board-print-controls flex flex-wrap items-center justify-between gap-4 border-b border-black/15 pb-6">
          <Link href="/tables/chateau-giscours-vertical/board" className="text-sm text-[#9c3d24] hover:underline">← Interactive tasting board</Link>
          <p className="text-sm text-black/60">Print this worksheet or use your browser’s “Save as PDF”.</p>
        </div>
        <header className="mt-9 border-b border-black/20 pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#9c3d24]">Wine With Pete · Red Wine Exploration Board No. 01</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight">Four vintages. One conversation.</h1>
          <p className="mt-3 font-crimson text-xl text-black/65">Château Giscours · 2015–2018 · A blank worksheet for your own observations.</p>
          <p className="mt-4 text-xs leading-5 text-black/55">No scores or tasting results are provided. The original event note lives in the public Table Archive. This sheet is for personal, independent use.</p>
        </header>
        <div className="mt-8 grid grid-cols-2 gap-5">
          {verticalVintages.map(year => (
            <section key={year} className="wwp-vintage-sheet break-inside-avoid border border-black/20 p-5">
              <h2 className="border-b border-black/20 pb-3 font-serif text-3xl">{year}</h2>
              {tastingPrompts.map(prompt => (
                <div key={prompt.key} className="mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#9c3d24]">{prompt.title}</p>
                  <div className="mt-3 h-10 border-b border-dotted border-black/30"/>
                </div>
              ))}
            </section>
          ))}
        </div>
        <p className="mt-8 font-crimson text-xl italic">The table is the point.</p>
      </article>
    </main>
  );
}
