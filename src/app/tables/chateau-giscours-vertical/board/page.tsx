'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, NotebookPen, Printer, Wine } from 'lucide-react';
import { emptyBoard, tastingPrompts, verticalVintages, type BoardNotes, type TastingField, type Vintage } from '@/data/guides/giscours-exploration';

const storageKey = 'wwp-giscours-exploration-v01';
type View = 'observe' | 'compare';

export default function GiscoursExplorationBoard() {
  const [vintage, setVintage] = useState<Vintage>('2015');
  const [view, setView] = useState<View>('observe');
  const [notes, setNotes] = useState<BoardNotes>(emptyBoard);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const old = parsed as Record<string, unknown>;
          const next = emptyBoard();
          for (const year of verticalVintages) {
            const entry = old[year];
            if (entry && typeof entry === 'object') {
              const fields = entry as Record<string, unknown>;
              for (const prompt of tastingPrompts) {
                const value = fields[prompt.key];
                if (typeof value === 'string') next[year][prompt.key] = value.slice(0, 1200);
              }
            }
          }
          setNotes(next);
        }
      }
    } catch {
      setStorageError(true);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(notes));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [ready, notes]);

  function changeNote(field: TastingField, value: string) {
    setNotes(previous => ({
      ...previous,
      [vintage]: { ...previous[vintage], [field]: value },
    }));
  }

  return (
    <main className="min-h-screen bg-[#f4efe7] text-[#211d19]">
      <section className="bg-[#211d19] px-5 py-14 text-[#f4efe7] sm:px-8 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <Link href="/tables/chateau-giscours-vertical" className="inline-flex min-h-11 items-center gap-2 text-[11px] uppercase tracking-[.16em] text-white/75 hover:text-white"><ArrowLeft size={16}/> Back to the table story</Link>
          <p className="mt-12 text-[11px] font-semibold uppercase tracking-[.25em] text-[#e0a47a]">Wine With Pete · Red Wine Exploration Board No. 01</p>
          <div className="mt-5 grid gap-10 md:grid-cols-[1.1fr_.7fr] md:items-end">
            <h1 className="font-serif text-5xl leading-[.99] tracking-[-.04em] sm:text-7xl">Four vintages. One conversation.</h1>
            <div className="border-l border-white/20 pl-6">
              <h2 className="font-serif text-2xl">Château Giscours · 2015–2018</h2>
              <p className="mt-4 max-w-sm font-crimson text-xl leading-7 text-white/70">A quiet place to notice what changes from one glass to the next.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:px-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.6fr_1.4fr]">
          <aside className="lg:pr-9">
            <p className="text-[11px] font-semibold uppercase tracking-[.23em] text-[#9c3d24]">The invitation</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">Not a test of expertise.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-black/65">Tasting is a way of paying attention together. No scores to match, no correct descriptors, and no tasting notes invented for you. Compare what you actually notice.</p>
            <div className="mt-7 space-y-3 border-t border-black/15 pt-6">
              <Link href="/tables/chateau-giscours-vertical/board/print" className="inline-flex min-h-12 items-center gap-2 border-b border-[#9c3d24] text-xs font-semibold uppercase tracking-[.15em] text-[#9c3d24]"><Printer size={16}/> Print a blank tasting board <ArrowRight size={15}/></Link>
              <p className="max-w-sm text-xs leading-6 text-black/55">The printable is a blank worksheet, not an export of private notes from this browser.</p>
            </div>
            <p className="mt-8 text-xs leading-6 text-black/55"><strong>Privacy:</strong> Notes are stored only in this browser. They are not sent to Wine With Pete or shared with other guests. Clearing browser data will erase them.</p>
            {storageError && <p role="alert" className="mt-3 text-sm text-[#9c3d24]">Local saving is unavailable. Copy your observations elsewhere before leaving.</p>}
          </aside>

          <div>
            <div className="flex flex-wrap justify-between gap-4 border-b border-black/15 pb-6">
              <div role="group" aria-label="Board mode" className="flex gap-2">
                <button type="button" aria-pressed={view === 'observe'} onClick={() => setView('observe')} className={'min-h-12 border px-5 text-xs font-semibold uppercase tracking-[.12em] ' + (view === 'observe' ? 'border-[#9c3d24] bg-[#9c3d24] text-white' : 'border-black/20 text-black/65')}>Observe</button>
                <button type="button" aria-pressed={view === 'compare'} onClick={() => setView('compare')} className={'min-h-12 border px-5 text-xs font-semibold uppercase tracking-[.12em] ' + (view === 'compare' ? 'border-[#9c3d24] bg-[#9c3d24] text-white' : 'border-black/20 text-black/65')}>Compare</button>
              </div>
              <div className="flex items-center gap-2 text-xs text-black/50"><NotebookPen size={16}/> {ready ? storageError ? 'Device-only draft' : 'Saved to this browser' : 'Loading notes'}</div>
            </div>

            {view === 'observe' ? (
              <section aria-label="Record vintage observations" className="mt-8">
                <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#9c3d24]">Choose your glass</p>
                <div className="mt-4 grid grid-cols-4 gap-2" role="group" aria-label="Select vintage">
                  {verticalVintages.map(year => (
                    <button key={year} type="button" aria-pressed={vintage === year} onClick={() => setVintage(year)}
                      className={'min-h-14 border font-serif text-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9c3d24] ' + (vintage === year ? 'border-[#9c3d24] bg-[#9c3d24] text-white' : 'border-black/20 text-black/65 hover:bg-black/5')}>
                      {year}
                    </button>
                  ))}
                </div>
                <div className="mt-7 bg-[#ebe2d6] p-6 sm:p-9">
                  <div className="flex items-start justify-between gap-4 border-b border-black/15 pb-5">
                    <div><p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#9c3d24]">Your observations</p><h3 className="mt-3 font-serif text-4xl">{vintage}</h3></div>
                    <Wine size={30} className="text-[#9c3d24]" aria-hidden/>
                  </div>
                  <div className="mt-6 grid gap-6">
                    {tastingPrompts.map(prompt => (
                      <label key={prompt.key} className="block">
                        <span className="block font-serif text-xl">{prompt.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-black/60">{prompt.guidance}</span>
                        <textarea rows={3} maxLength={1200} value={notes[vintage][prompt.key]} onChange={event => changeNote(prompt.key, event.target.value)}
                          className="mt-3 w-full resize-y border border-black/20 bg-[#f8f4ee] px-4 py-3 text-base leading-7 outline-none focus:border-[#9c3d24]" placeholder="Your own words…"/>
                      </label>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button type="button" onClick={() => setView('compare')} className="inline-flex min-h-12 items-center gap-2 bg-[#9c3d24] px-5 py-3 text-xs font-semibold uppercase tracking-[.14em] text-white">Compare your notes <ArrowRight size={16}/></button>
                  </div>
                </div>
              </section>
            ) : (
              <section aria-label="Four-vintage comparison" className="mt-8">
                <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#9c3d24]">Compare what you noticed</p>
                <h3 className="mt-3 font-serif text-3xl">The four glasses, side by side.</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {verticalVintages.map(year => (
                    <article key={year} className="border border-black/15 bg-[#f9f5ef] p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-3 border-b border-black/15 pb-4">
                        <h4 className="font-serif text-3xl">{year}</h4>
                        <button type="button" onClick={() => {setVintage(year);setView('observe');}} className="min-h-11 border-b border-[#9c3d24] text-xs font-semibold uppercase tracking-[.1em] text-[#9c3d24]">Edit notes</button>
                      </div>
                      <dl className="mt-4 space-y-4">
                        {tastingPrompts.map(prompt => (
                          <div key={prompt.key}>
                            <dt className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#9c3d24]">{prompt.title}</dt>
                            <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-black/70">{notes[year][prompt.key] || 'No note yet'}</dd>
                          </div>
                        ))}
                      </dl>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#211d19] px-5 py-12 text-[#f4efe7] sm:px-8 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <p className="font-serif text-2xl">Let the wine begin the conversation, not end it.</p>
          <Link href="/tables/chateau-giscours-vertical" className="inline-flex min-h-11 items-center gap-2 border-b border-[#e0a47a] text-xs font-semibold uppercase tracking-[.15em]"><BookOpen size={16}/> Read the original table note</Link>
        </div>
      </footer>
    </main>
  );
}
