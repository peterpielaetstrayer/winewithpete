import type { Metadata } from 'next';
import Link from 'next/link';
import { wineNoticingFields } from '@/data/guides/learn-to-notice-wine';
import './print.css';

export const metadata: Metadata = {
  title: 'Learn to Notice Wine · Printable Tasting Card | Wine With Pete',
  description: 'A one-page field card for noticing, describing and revisiting a drink in your own words.',
  robots: { index: false, follow: false },
};

export default function PrintWineNoticingCard() {
  return <div className="bg-[#f4efe7] text-[#211d19]">
    <article id="wwp-noticing-print" className="mx-auto max-w-3xl px-5 py-10 sm:px-10 sm:py-14">
      <div className="wwp-noticing-print-controls flex flex-wrap items-center justify-between gap-4 border-b border-black/15 pb-6">
        <Link href="/guides/learn-to-notice-wine" className="text-sm text-[#913e2c] underline underline-offset-4">← Back to the interactive lesson</Link>
        <p className="text-sm text-[#675a50]">Print this page, or choose “Save as PDF.”</p>
      </div>
      <header className="mt-8 border-b-2 border-[#913e2c] pb-7">
        <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#913e2c]">Wine With Pete · A personal tasting card</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Learn to Notice Wine</h1>
        <p className="mt-3 font-crimson text-xl text-[#675a50]">Describe first. Compare later. Stay curious.</p>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#675a50]">Choose a glass of wine or an aromatic nonalcoholic drink. Look, smell, taste if you wish, pause, then return. No right answers and no special vocabulary required.</p>
      </header>
      <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {wineNoticingFields.map(({ key, label }) => <div key={key} className={`wwp-noticing-field break-inside-avoid border-b border-[#4c3d33]/30 pb-3 ${key === 'invitation' ? 'sm:col-span-2' : ''}`}>
          <h2 className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#913e2c]">{label}</h2>
          <div aria-hidden="true" className="h-12 border-b border-dotted border-[#4c3d33]/15" />
        </div>)}
      </section>
      <footer className="mt-8 border-t border-[#4c3d33]/30 pt-5">
        <p className="font-crimson text-lg italic text-[#675a50]">Next time, notice again. That&apos;s the practice.</p>
        <p className="mt-2 text-[10px] text-[#77695c]">Try it with someone else: notice separately, then compare without correcting each other.</p>
        <p className="mt-2 text-[10px] text-[#77695c]">Personal reflection, not a tasting grade</p>
      </footer>
    </article>
  </div>;
}
