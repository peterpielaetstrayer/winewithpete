'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Clipboard, Printer, Wine } from 'lucide-react';
import {
  blankWineNoticingNote,
  wineNoticingChapters,
  wineNoticingFields,
  wineNoticingNoteText,
  type WineNoticingChapter,
  type WineNoticingNote,
} from '@/data/guides/learn-to-notice-wine';

const storageKey = 'wwp-learn-to-notice-wine-v1';
const eyebrow = 'text-[10px] font-semibold uppercase tracking-[.22em] text-[#96482f]';
const primary = 'inline-flex min-h-12 items-center justify-center gap-2 bg-[#913e2c] px-5 py-3 text-xs font-semibold uppercase tracking-[.13em] text-white transition-colors hover:bg-[#713020] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#913e2c]';
const secondary = 'inline-flex min-h-12 items-center justify-center gap-2 border border-[#211d19]/25 bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[.13em] text-[#211d19] transition-colors hover:bg-[#e7dfd2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#913e2c]';

function isNote(value: unknown): value is Record<keyof WineNoticingNote, string> {
  return typeof value === 'object' && value !== null && wineNoticingFields.every(
    ({ key }) => typeof (value as Record<string, unknown>)[key] === 'string',
  );
}

function NoteField({ id, label, hint, value, onChange, rows = 3 }: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (next: string) => void;
  rows?: number;
}) {
  return <div>
    <label htmlFor={id} className="block font-serif text-2xl leading-tight text-[#292018]">{label}</label>
    <p id={`${id}-hint`} className="mt-2 max-w-xl text-sm leading-6 text-[#695f55]">{hint}</p>
    <textarea id={id} rows={rows} maxLength={600} aria-describedby={`${id}-hint`} value={value}
      onChange={event => onChange(event.target.value)}
      className="mt-4 block w-full resize-y rounded-none border border-[#66513f]/30 bg-[#fffdf8] p-4 text-base leading-7 text-[#292018] outline-none placeholder:text-[#807367] focus-visible:border-[#913e2c] focus-visible:ring-2 focus-visible:ring-[#913e2c]/20"
      placeholder="Write what you notice, in your own words…" />
  </div>;
}

export default function LearnToNoticeWinePage() {
  const [chapter, setChapter] = useState<WineNoticingChapter>('begin');
  const [note, setNote] = useState<WineNoticingNote>(blankWineNoticingNote);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);
  const chapterIndex = wineNoticingChapters.findIndex(item => item.id === chapter);
  const lastChapter = chapterIndex === wineNoticingChapters.length - 1;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (isNote(parsed)) {
          const restored = Object.fromEntries(wineNoticingFields.map(({ key }) => [key, parsed[key].slice(0, 600)]));
          setNote(restored as WineNoticingNote);
          setSaved(true);
        }
      }
    } catch {
      // The experience works without storage, including private browsing modes.
    }
  }, []);

  useEffect(() => {
    if (hasNavigated.current) headingRef.current?.focus();
  }, [chapter]);

  function updateNote(key: keyof WineNoticingNote, value: string) {
    setNote(old => ({ ...old, [key]: value }));
    setSaved(false);
    setNotice('');
  }

  function navigate(next: WineNoticingChapter) {
    hasNavigated.current = true;
    setChapter(next);
    setNotice('');
    const target = document.getElementById('noticing-content');
    target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  function saveNote() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(note));
      setSaved(true);
      setNotice('Saved in this browser only. It does not sync or get sent to Wine With Pete.');
    } catch {
      setSaved(false);
      setNotice('This browser cannot save locally. Copy your note to keep it.');
    }
  }

  async function copyNote() {
    try {
      await navigator.clipboard.writeText(wineNoticingNoteText(note));
      setNotice('Your tasting note was copied.');
    } catch {
      setNotice('Copying is unavailable here. You can select and copy the note below.');
    }
  }

  return (
    <div className="min-h-screen bg-[#f4efe7] text-[#211d19]">
      <section className="overflow-hidden border-b border-white/10 bg-[#2e211e] text-[#f5ede3]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-[1.3fr_.7fr] md:items-end md:px-12 md:py-20 lg:px-16">
          <div>
            <Link href="/explore" className="inline-flex min-h-11 items-center gap-2 text-xs text-[#e3c9b5] underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4ab85]"><ArrowLeft size={15} aria-hidden/> Back to Explore</Link>
            <p className="mt-9 text-[10px] font-semibold uppercase tracking-[.25em] text-[#e1a77c]">Wine With Pete · An introduction to tasting</p>
            <h1 className="mt-5 max-w-[14ch] font-serif text-[clamp(3.2rem,7vw,6.5rem)] leading-[.96] tracking-[-.055em]">Learn to <span className="italic text-[#e6b49b]">notice</span> wine.</h1>
            <p className="mt-6 max-w-2xl font-crimson text-2xl leading-8 text-[#e7d9cb] sm:text-3xl sm:leading-10">Before anyone tells you what you&apos;re supposed to taste, see what you notice for yourself.</p>
          </div>
          <aside className="border-l border-white/25 pl-6">
            <div className="flex items-center gap-3 text-[#e1a77c]"><Wine size={23} strokeWidth={1.4} aria-hidden/><span className="text-[10px] font-semibold uppercase tracking-[.18em]">Field lesson · Working preview</span></div>
            <p className="mt-5 font-serif text-3xl">One drink. A few minutes. Your own words.</p>
            <p className="mt-4 text-sm leading-7 text-[#dccbc0]">A beginner-friendly guided exercise you can repeat with another glass, another day, or another person.</p>
            <p className="mt-4 text-xs leading-6 text-[#d0b8a8]">Wine is optional. Tea, juice, or another aromatic nonalcoholic drink works for the observation practice too. If choosing wine, please drink responsibly; this activity requires no particular amount.</p>
          </aside>
        </div>
      </section>

      <section id="noticing-content" className="scroll-mt-4">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 md:px-12 lg:px-16">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#211d19]/15 pb-6">
            <p className={eyebrow}>Your noticing journey · Step {chapterIndex + 1} of {wineNoticingChapters.length}</p>
            <p className="text-xs text-[#685a51]">About 10–15 minutes · Go at your own pace</p>
          </div>
          <nav className="mt-6 grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="Lesson chapters">
            {wineNoticingChapters.map((item, index) => <button key={item.id} type="button"
              onClick={() => navigate(item.id)} aria-current={item.id === chapter ? 'step' : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 border px-1 py-2 text-center text-[10px] leading-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#913e2c] sm:min-h-16 sm:text-xs ${item.id === chapter ? 'border-[#913e2c] bg-[#913e2c] text-white' : 'border-[#8d7a69]/30 bg-[#fbf7f0] text-[#55483e] hover:border-[#913e2c]/70'}`}>
              <span className="font-semibold">{String(index + 1).padStart(2, '0')}</span>
              <span>{item.label}</span>
            </button>)}
          </nav>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(260px,.43fr)] lg:gap-16">
            <div className="min-w-0">
              {chapter === 'begin' && <article>
                <p className={eyebrow}>01 · Before the first sip</p>
                <h2 ref={headingRef} tabIndex={-1} className="mt-5 font-serif text-4xl leading-[1.06] outline-none sm:text-6xl">Start with what&apos;s in front of you.</h2>
                <p className="mt-7 max-w-2xl font-crimson text-2xl leading-9 text-[#5e5147]">Maybe you know the grape. Maybe you picked a bottle because the label caught your eye. That&apos;s plenty to begin with.</p>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#584e44]">Set your drink down somewhere comfortable. You can use a glass of wine, or try the same exercise with tea or juice. For the next few minutes, let someone else worry about tasting notes and proper terminology. We&apos;re interested in what you actually experience.</p>
                <div className="mt-9 max-w-xl border-l-2 border-[#913e2c] bg-[#ebe0d3] p-6">
                  <label htmlFor="wine-drink" className="block font-serif text-2xl">What are you tasting?</label>
                  <p id="wine-drink-hint" className="mt-2 text-sm leading-6 text-[#695f55]">A name, a grape, a color, or simply “the tea I made.” It&apos;s optional.</p>
                  <input id="wine-drink" aria-describedby="wine-drink-hint" type="text" maxLength={120} value={note.drink} onChange={event => updateNote('drink', event.target.value)}
                    placeholder="The glass in front of me…" className="mt-4 min-h-12 w-full border border-[#66513f]/30 bg-[#fffdf8] px-4 py-3 text-base outline-none focus-visible:border-[#913e2c] focus-visible:ring-2 focus-visible:ring-[#913e2c]/20" />
                </div>
              </article>}

              {chapter === 'notice' && <article>
                <p className={eyebrow}>02 · Observe without judging</p>
                <h2 ref={headingRef} tabIndex={-1} className="mt-5 font-serif text-4xl leading-[1.06] outline-none sm:text-6xl">Look. Smell. Taste, if you like.</h2>
                <p className="mt-6 max-w-2xl text-base leading-8 text-[#584e44]">Take a moment with each sense. There&apos;s no need to swirl like a professional or identify a mystery ingredient. An ordinary, honest description is enough.</p>
                <div className="mt-9 space-y-9">
                  <NoteField id="wine-appearance" label="What do you see?" hint="Color, brightness, how the light passes through it—or something else you notice." value={note.appearance} onChange={value => updateNote('appearance', value)}/>
                  <NoteField id="wine-aroma" label="What does it smell like to you?" hint="Smell once. Pause. Smell again. A familiar fruit, a place, a spice, or simply “fresh” is a fine beginning." value={note.aroma} onChange={value => updateNote('aroma', value)}/>
                  <NoteField id="wine-taste" label="What happens when you taste it?" hint="If you choose to sip, notice what feels bright, soft, dry, sweet, sharp or lingering. You can also leave this blank." value={note.taste} onChange={value => updateNote('taste', value)}/>
                </div>
              </article>}

              {chapter === 'name' && <article>
                <p className={eyebrow}>03 · Make a language of your own</p>
                <h2 ref={headingRef} tabIndex={-1} className="mt-5 font-serif text-4xl leading-[1.06] outline-none sm:text-6xl">The words can come from anywhere.</h2>
                <p className="mt-7 max-w-2xl font-crimson text-2xl leading-9 text-[#5e5147]">A tasting note can start with a memory before it ever sounds like a wine label.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="border border-[#8d7a69]/25 bg-[#fdf9f3] p-6"><p className={eyebrow}>Common tasting categories</p><p className="mt-3 font-serif text-2xl">Fruit. Flowers. Spice. Texture.</p><p className="mt-3 text-sm leading-6 text-[#695f55]">These can help you compare notes later, but you don&apos;t have to force a match.</p></div>
                  <div className="border border-[#8d7a69]/25 bg-[#e9dfd2] p-6"><p className={eyebrow}>A personal description</p><p className="mt-3 font-serif text-2xl">“Like the orange peel on my cutting board.”</p><p className="mt-3 text-sm leading-6 text-[#695f55]">A specific association can be useful even when you don&apos;t know the formal word.</p></div>
                </div>
                <div className="mt-9"><NoteField id="wine-association" label="What does this remind you of?" hint="A food, a person, a season, a place, or nothing in particular. Don't invent a note because someone else might expect it." value={note.association} onChange={value => updateNote('association', value)}/></div>
              </article>}

              {chapter === 'return' && <article>
                <p className={eyebrow}>04 · Look again</p>
                <h2 ref={headingRef} tabIndex={-1} className="mt-5 font-serif text-4xl leading-[1.06] outline-none sm:text-6xl">Now come back to the glass.</h2>
                <p className="mt-6 max-w-2xl text-base leading-8 text-[#584e44]">Let it sit for a minute. Before you return, read what you wrote the first time. Then smell it again, look again, or take another small sip if you want. What stands out now?</p>
                <div className="mt-8 border border-[#8d7a69]/25 bg-[#e9dfd2] p-6 sm:p-8">
                  <p className={eyebrow}>Your first impression</p>
                  {note.appearance.trim() || note.aroma.trim() || note.taste.trim() ?
                    <dl className="mt-5 grid gap-5 sm:grid-cols-3">
                      {([
                        { label: 'Saw', value: note.appearance },
                        { label: 'Smelled', value: note.aroma },
                        { label: 'Tasted or felt', value: note.taste },
                      ]).map(item => <div key={item.label} className="min-w-0">
                        <dt className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#765747]">{item.label}</dt>
                        <dd className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#493e35]">{item.value.trim() || 'Not written down'}</dd>
                      </div>)}
                    </dl> :
                    <p className="mt-3 text-sm leading-7 text-[#5e5147]">Nothing written down yet? That&apos;s fine. Remember your first impression as best you can, then try again.</p>}
                </div>
                <p className="mt-6 max-w-2xl font-crimson text-xl leading-8 text-[#5e5147]">Maybe the drink changed a little. Maybe you&apos;re paying attention differently. Maybe nothing changed at all. You don&apos;t have to explain it away.</p>
                <div className="mt-9 space-y-9">
                  <NoteField id="wine-second" label="What changed? What stayed?" hint="Compare this moment with your own first words. A difference is worth noticing, and so is a familiar impression." value={note.secondLook} onChange={value => updateNote('secondLook', value)}/>
                </div>
              </article>}

              {chapter === 'keep' && <article>
                <p className={eyebrow}>05 · Remember and return</p>
                <h2 ref={headingRef} tabIndex={-1} className="mt-5 font-serif text-4xl leading-[1.06] outline-none sm:text-6xl">You have a tasting note. In your own words.</h2>
                <p className="mt-6 max-w-2xl text-base leading-8 text-[#584e44]">This doesn&apos;t make you an expert. It gives you a starting point you can come back to. Keep this note, try another drink on another day, and see whether you notice something different.</p>
                <div className="mt-8 border-l-2 border-[#913e2c] bg-[#ebe0d3] p-6 sm:p-8">
                  <p className={eyebrow}>Bring it to the table</p>
                  <h3 className="mt-3 font-serif text-3xl leading-tight">Next time, try it with someone.</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[#584e44]">Sit down with a friend and a drink of your choice. Take a moment to notice separately before swapping descriptions. You might pick up on completely different things. Neither person needs to be right.</p>
                  <div className="mt-6"><NoteField id="wine-invitation" label="What would you ask them?" hint="Something open-ended works best: “What does this remind you of?” or “Did you notice anything different the second time?”" value={note.invitation} onChange={value => updateNote('invitation', value)}/></div>
                </div>
                <div className="mt-8 border border-[#8d7a69]/30 bg-[#fffdf8] p-6 sm:p-9">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#8d7a69]/20 pb-4"><p className={eyebrow}>Your first noticing card</p><p className="font-crimson text-lg italic text-[#76665a]">An observation, not a grade</p></div>
                  <div className="mt-6 space-y-5">
                    {wineNoticingFields.map(field => <div key={field.key}>
                      <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#913e2c]">{field.label}</p>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-7 text-[#4e433b]">{note[field.key].trim() || <span className="italic text-[#8b7b70]">Unwritten—and that&apos;s fine.</span>}</p>
                    </div>)}
                  </div>
                  <p className="mt-7 border-t border-[#8d7a69]/20 pt-5 font-crimson text-xl italic text-[#604e41]">Next time, notice again. That&apos;s the practice.</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={copyNote} className={primary}><Clipboard size={16} aria-hidden/> Copy my note</button>
                  <button type="button" onClick={saveNote} className={secondary}>{saved ? <Check size={16} aria-hidden/> : <BookOpen size={16} aria-hidden/>} Save on this device</button>
                  <Link href="/guides/learn-to-notice-wine/print" className={secondary}><Printer size={16} aria-hidden/> Blank printable card</Link>
                </div>
                {notice && <p role="status" className="mt-4 max-w-xl text-sm leading-6 text-[#783521]">{notice}</p>}
                <p className="mt-5 max-w-xl text-xs leading-6 text-[#75665a]">Only an explicit save stores your note in this browser. It is not sent to Wine With Pete, synced between devices or backed up. Copy it elsewhere if you want to keep it.</p>
              </article>}

              <div className="mt-12 flex items-center justify-between gap-3 border-t border-[#211d19]/15 pt-6">
                {chapterIndex > 0 ? <button type="button" className={secondary} onClick={() => navigate(wineNoticingChapters[chapterIndex - 1].id)}><ArrowLeft size={16} aria-hidden/> Back</button> : <span aria-hidden="true"/>}
                {!lastChapter ? <button type="button" className={primary} onClick={() => navigate(wineNoticingChapters[chapterIndex + 1].id)}>Continue <ArrowRight size={16} aria-hidden/></button> : <Link href="/explore" className={secondary}>Back to Explore <ArrowRight size={16} aria-hidden/></Link>}
              </div>
            </div>

            <aside className="self-start border-t-2 border-[#913e2c] bg-[#ebe0d3] p-6 sm:p-8 lg:sticky lg:top-8">
              <p className={eyebrow}>A little encouragement</p>
              <p className="mt-5 font-serif text-3xl leading-tight">You can notice something before you know what to call it.</p>
              <p className="mt-5 font-crimson text-xl leading-8 text-[#655345]">Taste is personal, but we can still learn from each other. Describe first. Compare later. Stay curious.</p>
              <div className="mt-7 border-t border-[#655345]/20 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#6c5b4b]">This part should take</p>
                <p className="mt-2 font-serif text-2xl">{wineNoticingChapters[chapterIndex].minutes}</p>
              </div>
              <p className="mt-6 text-xs leading-6 text-[#766558]">This is a preview of one activity, not the complete Art of Learning [Wine] course. The exercise doesn&apos;t require special knowledge, a purchase, or an account.</p>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
