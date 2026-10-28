'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Check, ChefHat, Compass, FileText, Search, SlidersHorizontal, Sparkles, Users, Wine, X } from 'lucide-react';

import { experiences, type Experience } from '@/data/explore/experiences';
import { PAGE_SIZE, queryExperiences, visiblePage, type CatalogIntent, type CatalogFormat, type CatalogOrder } from '@/lib/explore/catalog';
import { EditorialPhoto, ExploreEditorial, EXPLORE_PHOTOS_ENABLED } from '@/components/explore/explore-editorial';

const intentions: { value: CatalogIntent; label: string; description: string; icon: typeof Compass }[] = [
  { value: 'all', label: 'Everything', description: 'Browse the collection', icon: Compass },
  { value: 'cook', label: 'Cook', description: 'Make something good', icon: ChefHat },
  { value: 'taste', label: 'Taste', description: 'Explore wine & flavor', icon: Wine },
  { value: 'gather', label: 'Gather', description: 'Bring people together', icon: Users },
  { value: 'read', label: 'Stories', description: 'A seat at another table', icon: BookOpen },
];

const coverThemes: Record<string, { background: string; foreground: string; label: string; monogram: string }> = {
  'better-taco-night': { background: '#853d2f', foreground: '#f8e3cc', label: 'CRAVINGS, REBUILT', monogram: '01' },
  'chipotle-lime-fire-wings': { background: '#333a29', foreground: '#f0e4c8', label: 'COOK / WITH FIRE', monogram: 'FIRE' },
  'giscours-vertical': { background: '#4a292f', foreground: '#f3ddc1', label: 'RED WINE / EXPLORATION', monogram: '4' },
  'seoul-bowl-table': { background: '#ac7a51', foreground: '#292217', label: 'FROM THE TABLE', monogram: 'SEOUL' },
};

function ExperienceCard({ experience }: { experience: Experience }) {
  const cover = coverThemes[experience.id] ?? coverThemes['chipotle-lime-fire-wings'];
  const hasVerifiedCover = EXPLORE_PHOTOS_ENABLED && experience.id === 'seoul-bowl-table';
  const primary = experience.links.find(link => link.href === experience.primaryHref)!;
  const others = experience.links.filter(link => link.href !== experience.primaryHref);

  return (
    <article data-experience-id={experience.id} className="group flex h-full min-w-0 flex-col overflow-hidden border border-black/15 bg-[#faf7f1]">
      <Link href={experience.primaryHref} aria-label={'Open ' + experience.title} className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9c3d24]">
        <div className="relative flex aspect-[16/9] min-h-[180px] flex-col justify-between overflow-hidden p-6 sm:p-7" style={{ backgroundColor: cover.background, color: cover.foreground }}>
          {hasVerifiedCover && <EditorialPhoto photo="hero-seoul-bowl" alt="Shared dishes laid out for the Seoul Bowl Table" sizes="(max-width: 639px) 100vw, 50vw" />}
          {hasVerifiedCover && <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/35" aria-hidden="true"/>}
          <p className="relative z-10 text-[10px] font-semibold uppercase tracking-[.27em]">{cover.label}</p>
          <span aria-hidden className="absolute -right-6 -top-20 select-none font-serif text-[clamp(9rem,20vw,15rem)] font-medium leading-none opacity-[.14]">{cover.monogram}</span>
          <div className="relative z-10 flex items-end justify-between">
            <span className="max-w-[14ch] font-crimson text-lg italic leading-6 opacity-85">Wine With Pete</span>
            <ArrowUpRight size={24} strokeWidth={1.4} aria-hidden />
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.20em] text-[#9c3d24]">{experience.eyebrow}</p>
          {experience.minutes && <p className="shrink-0 text-xs text-black/55">{experience.minutes} min</p>}
        </div>
        <h3 className="mt-4 font-serif text-[clamp(1.8rem,3.5vw,2.3rem)] leading-[1.09] tracking-[-.025em]">{experience.title}</h3>
        <p className="mt-4 max-w-md text-sm leading-7 text-black/65">{experience.summary}</p>
        {experience.status === 'prototype' && <p className="mt-4 border-l-2 border-[#9c3d24] pl-3 text-xs leading-5 text-[#7b3a2b]">Kitchen-test preview · Not a final recipe</p>}
        <div className="mt-auto pt-8">
          <Link href={experience.primaryHref} className="inline-flex min-h-11 items-center gap-2 border-b border-[#9c3d24] pb-1 text-xs font-semibold uppercase tracking-[.15em] text-[#9c3d24] hover:text-[#672718] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9c3d24]">
            {primary.label} <ArrowRight size={16} aria-hidden/>
          </Link>
          {others.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-black/10 pt-4">
              {others.map(link => (
                <Link key={link.href} href={link.href} className="inline-flex min-h-10 items-center gap-1 text-xs text-black/65 underline decoration-black/25 underline-offset-4 hover:text-[#9c3d24]">
                  {link.format === 'print' ? <FileText size={14} aria-hidden/> : <Sparkles size={14} aria-hidden/>}
                  {link.label}{link.prototype ? ' · Preview' : ''}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ExplorePage() {
  const [term, setTerm] = useState('');
  const [intent, setIntent] = useState<CatalogIntent>('all');
  const [format, setFormat] = useState<CatalogFormat>('all');
  const [order, setOrder] = useState<CatalogOrder>('curated');
  const [pages, setPages] = useState(1);
  const results = useMemo(() => queryExperiences(experiences, { term, intent, format, order }), [term, intent, format, order]);
  const visible = useMemo(() => visiblePage(results, pages), [results, pages]);
  const hasFilters = term.length > 0 || intent !== 'all' || format !== 'all' || order !== 'curated';

  function selectIntent(value: CatalogIntent) { setIntent(value); setPages(1); }
  function selectEditorialIntent(value: CatalogIntent) { selectIntent(value); document.getElementById('explore-collection')?.scrollIntoView({ behavior: 'smooth' }); }
  function selectFormat(value: CatalogFormat) { setFormat(value); setPages(1); }
  function selectOrder(value: CatalogOrder) { setOrder(value); setPages(1); }
  function clearFilters() { setTerm(''); setIntent('all'); setFormat('all'); setOrder('curated'); setPages(1); }

  return (
    <main data-explore-design="photographic-v03" data-photo-mode={EXPLORE_PHOTOS_ENABLED ? 'private-assets' : 'public-safe-fallbacks'} className="bg-[#f4efe7] text-[#211d19]">
      <section className="relative isolate min-h-[560px] overflow-hidden bg-[#211d19] text-[#f4efe7] md:min-h-[690px]">
        <div className="absolute inset-0 -z-20">
          {EXPLORE_PHOTOS_ENABLED
            ? <EditorialPhoto photo="hero-seoul-bowl" alt="A shared meal from the Seoul Bowl Table" priority sizes="(max-width: 768px) 100vw, 60vw" position="object-[65%_45%]"/>
            : <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-[#241a16] via-[#644232] to-[#9e7055]"/>}
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(21,16,13,.94)_0%,rgba(21,16,13,.75)_45%,rgba(21,16,13,.22)_100%)]"/>
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 md:px-12 md:pb-24 md:pt-32 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[.25em] text-[#e6aa82]">Wine With Pete · Explore</p>
          <h1 className="mt-7 max-w-[12ch] font-serif text-[clamp(3.8rem,7.4vw,8rem)] leading-[.94] tracking-[-.06em]">A good evening starts somewhere.</h1>
          <p className="mt-7 max-w-xl font-crimson text-2xl leading-9 text-white/80">Find a recipe to make, a wine to explore, a table to gather around, or a story worth spending time with.</p>
          <a href="#explore-collection" className="mt-9 inline-flex min-h-12 items-center gap-3 border-b border-[#e6aa82] text-xs font-semibold uppercase tracking-[.15em] text-[#f5d0b3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6aa82]">
            Find your starting point <ArrowRight size={16}/>
          </a>
        </div>
      </section>

      <ExploreEditorial onSelectIntent={selectEditorialIntent} />

      <section id="explore-collection" className="scroll-mt-8 px-5 py-12 sm:px-8 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 border-b border-black/15 pb-8 lg:grid-cols-[.65fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-[#9c3d24]">Find your way in</p>
              <h2 className="mt-4 font-serif text-3xl leading-[1.13] sm:text-4xl">What sounds good today?</h2>
            </div>
            <div className="max-w-2xl">
              <label htmlFor="explore-search" className="block text-xs font-semibold uppercase tracking-[.16em] text-black/65">Search the collection</label>
              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/50" size={20} aria-hidden/>
                <input id="explore-search" type="search" value={term} onChange={event => { setTerm(event.target.value); setPages(1); }}
                  placeholder="Try 'wings', 'wine', or 'taco night'"
                  className="min-h-14 w-full border border-black/20 bg-[#fffdf8] py-3 pl-12 pr-11 text-base text-[#211d19] outline-none placeholder:text-black/40 focus:border-[#9c3d24] focus:ring-2 focus:ring-[#9c3d24]/15"/>
                {term && <button type="button" aria-label="Clear search" onClick={() => {setTerm('');setPages(1);}} className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-black/60 focus-visible:outline-2 focus-visible:outline-[#9c3d24]"><X size={18}/></button>}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5" role="group" aria-label="Explore by purpose">
            {intentions.map(item => {
              const Icon = item.icon;
              const selected = intent === item.value;
              return <button type="button" key={item.value} aria-pressed={selected} onClick={() => selectIntent(item.value)}
                className={'flex min-h-[94px] flex-col items-start justify-center border px-4 py-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9c3d24] sm:min-h-[110px] sm:px-5 ' + (selected ? 'border-[#9c3d24] bg-[#9c3d24] text-white' : 'border-black/15 bg-[#faf7f1] text-[#211d19] hover:border-[#9c3d24]/60')}>
                <div className="flex w-full items-center justify-between"><Icon size={21} strokeWidth={1.5} aria-hidden/>{selected && <Check size={16} aria-hidden/>}</div>
                <span className="mt-3 font-serif text-xl leading-none">{item.label}</span>
                <span className={'mt-2 hidden text-xs sm:block ' + (selected ? 'text-white/75' : 'text-black/50')}>{item.description}</span>
              </button>;
            })}
          </div>

          <div className="mt-11 flex flex-wrap items-end justify-between gap-5 border-b border-black/15 pb-6">
            <div aria-live="polite" aria-atomic="true">
              <p className="text-[10px] font-semibold uppercase tracking-[.23em] text-[#9c3d24]">The collection</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">{results.length} {results.length === 1 ? 'experience' : 'experiences'}</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-black/55">Each experience appears once, even when it includes a story, interactive tool, or printable edition.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
              <label className="min-w-0 flex-1 text-xs font-medium text-black/65 sm:flex-none">
                <span className="mb-2 flex items-center gap-2"><SlidersHorizontal size={15} aria-hidden/> Format</span>
                <select aria-label="Filter by format" value={format} onChange={event => selectFormat(event.target.value as CatalogFormat)} className="min-h-12 w-full border border-black/20 bg-[#faf7f1] px-4 text-sm text-[#211d19] outline-none focus:border-[#9c3d24] sm:min-w-40">
                  <option value="all">All formats</option><option value="recipe">Recipes</option><option value="interactive">Interactive</option><option value="print">Printable</option><option value="story">Stories</option>
                </select>
              </label>
              <label className="min-w-0 flex-1 text-xs font-medium text-black/65 sm:flex-none">
                <span className="mb-2 block">Sort</span>
                <select aria-label="Sort experiences" value={order} onChange={event => selectOrder(event.target.value as CatalogOrder)} className="min-h-12 w-full border border-black/20 bg-[#faf7f1] px-4 text-sm text-[#211d19] outline-none focus:border-[#9c3d24] sm:min-w-40">
                  <option value="curated">Curated</option><option value="az">A to Z</option>
                </select>
              </label>
            </div>
          </div>

          {hasFilters && <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-xs text-black/55">Showing matches for your selections</p>
            <button type="button" onClick={clearFilters} className="inline-flex min-h-11 items-center gap-2 px-2 text-xs font-semibold text-[#9c3d24] underline underline-offset-4"><X size={14} aria-hidden/> Clear filters</button>
          </div>}

          {results.length > 0 ? (
            <>
              <div data-testid="explore-results" className="mt-7 grid gap-5 sm:grid-cols-2 xl:gap-7">
                {visible.map(item => <ExperienceCard key={item.id} experience={item}/>)}
              </div>
              <div className="mt-9 flex flex-col items-center gap-4 border-t border-black/15 pt-7">
                <p className="text-sm text-black/55">Showing {visible.length} of {results.length} experiences</p>
                {visible.length < results.length && <button type="button" onClick={() => setPages(n => n + 1)} className="inline-flex min-h-12 items-center gap-3 border border-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[.16em] text-[#9c3d24] hover:bg-[#9c3d24] hover:text-white">Show {Math.min(PAGE_SIZE, results.length - visible.length)} more <ArrowRight size={16}/></button>}
              </div>
            </>
          ) : (
            <div role="status" className="mt-7 border border-black/15 bg-[#faf7f1] px-6 py-14 text-center">
              <Search size={26} className="mx-auto text-[#9c3d24]" aria-hidden/>
              <h3 className="mt-5 font-serif text-3xl">Nothing on this shelf yet.</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-black/60">Try a different word or clear the filters. We only show experiences that actually exist.</p>
              <button type="button" onClick={clearFilters} className="mt-6 min-h-12 border-b border-[#9c3d24] px-3 text-xs font-semibold uppercase tracking-[.15em] text-[#9c3d24]">See the whole collection</button>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#eae0d3] px-5 py-14 sm:px-8 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-[1fr_.9fr] md:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#9c3d24]">What this is becoming</p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight sm:text-4xl">Not a bigger library for its own sake. More reasons to come together.</h2>
          </div>
          <div className="max-w-lg">
            <p className="font-crimson text-xl leading-8 text-black/70">A recipe might become dinner. A story might spark an idea. A tasting note might start a conversation. Choose what helps, leave the rest.</p>
            <Link href="/journal" className="mt-5 inline-flex min-h-11 items-center gap-2 border-b border-[#9c3d24] text-xs font-semibold uppercase tracking-[.14em] text-[#9c3d24]">Read the Journal <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
