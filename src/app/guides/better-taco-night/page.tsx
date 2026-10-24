'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ClipboardList, Coffee, Heart, Minus, Plus, Wine } from 'lucide-react';
import { ingredientText } from '@/lib/guides/quantity';
import { groups, steps, supportedBatches } from '@/data/guides/better-taco-night';

type Panel = 'story' | 'ingredients' | 'cook' | 'taste' | 'table';

const panels: { id: Panel; label: string }[] = [
  { id: 'story', label: 'Start' },
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'cook', label: 'Cook' },
  { id: 'taste', label: 'Taste & Pair' },
  { id: 'table', label: 'The Table' },
];

export default function BetterTacoNight() {
  const [panel, setPanel] = useState<Panel>('story');
  const [servings, setServings] = useState(6);
  const [checked, setChecked] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');
  const [progressLoaded, setProgressLoaded] = useState(false);
  const totalItems = useMemo(() => groups.reduce((n, g) => n + g.items.length, 0), []);
  const completed = checked.length;

  useEffect(() => {
    try {
      const oldNote = window.localStorage.getItem('wwp-field-guide-taco-note-v1');
      if (oldNote) setNote(oldNote);
      const raw = window.localStorage.getItem('wwp-field-guide-taco-progress-v1');
      if (raw) {
        const previous: unknown = JSON.parse(raw);
        if (previous && typeof previous === 'object') {
          const data = previous as { servings?: unknown; checked?: unknown; step?: unknown };
          if (typeof data.servings === 'number' && supportedBatches.some(batch => batch === data.servings)) {
            setServings(data.servings);
          }
          if (Array.isArray(data.checked)) {
            const validIds = new Set(groups.flatMap(group => group.items.map(item => item.id)));
            setChecked(data.checked.filter((id): id is string => typeof id === 'string' && validIds.has(id)));
          }
          if (typeof data.step === 'number' && Number.isInteger(data.step) && data.step >= 0 && data.step < steps.length) {
            setStep(data.step);
          }
        }
      }
    } catch {
      // Browsers may disable storage. The guide is still usable without it.
    } finally {
      setProgressLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!progressLoaded) return;
    try {
      window.localStorage.setItem('wwp-field-guide-taco-progress-v1', JSON.stringify({ servings, checked, step }));
    } catch {
      // Persistence is optional; never block cooking because of storage.
    }
  }, [progressLoaded, servings, checked, step]);

  function changePanel(next: Panel) {
    setPanel(next);
    setNotice('');
    document.getElementById('field-guide-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function copyList() {
    const list = 'Wine With Pete · The Better Taco Night · ' + servings + ' burritos\n\n' +
      groups.map(g => g.name + '\n' + g.items.map(i => (checked.includes(i.id) ? '[x] ' : '[ ] ') + ingredientText(i, servings) + (i.note ? ' (' + i.note + ')' : '')).join('\n')).join('\n\n');
    try {
      await navigator.clipboard.writeText(list);
      setNotice('Shopping list copied.');
    } catch {
      setNotice('Clipboard unavailable. You can select and copy the list above.');
    }
  }

  function saveNote() {
    try {
      window.localStorage.setItem('wwp-field-guide-taco-note-v1', note);
      setSaved(true);
    } catch {
      setSaved(false);
      setNotice('Local storage is unavailable on this device. Copy your note before leaving.');
    }
  }

  const eyebrow = 'text-[10px] font-semibold uppercase tracking-[.22em] text-[#9c3d24]';
  const primary = 'inline-flex min-h-12 items-center justify-center gap-2 bg-[#9c3d24] px-5 py-3 text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-[#7d301e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9c3d24]';
  const secondary = 'inline-flex min-h-12 items-center justify-center gap-2 border border-[#211d19]/20 px-5 py-3 text-xs font-semibold uppercase tracking-[.14em] transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9c3d24]';

  return (
    <main className="min-h-screen bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 bg-[#211d19] px-5 py-12 text-[#f4efe7] sm:px-8 sm:py-20 md:px-12 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_.55fr] md:items-end">
          <div>
            <Link href="/recipes" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-white/60 hover:text-white"><ArrowLeft size={14} /> Journal / Recipes & Guides</Link>
            <p className="mt-12 text-[10px] uppercase tracking-[.28em] text-[#e0a47a]">Field guide no. 01 · Cravings, Rebuilt</p>
            <h1 className="mt-5 max-w-[12ch] font-serif text-5xl leading-[.99] tracking-[-.04em] sm:text-7xl">The Better Taco Night.</h1>
            <p className="mt-7 max-w-xl font-crimson text-2xl leading-8 text-white/75">Rebuilding familiar cravings with better care, and giving ordinary dinners a reason to become something more.</p>
          </div>
          <div className="border-l border-white/20 pl-6">
            <p className="text-[10px] uppercase tracking-[.18em] text-[#e0a47a]">The first kitchen experiment</p>
            <h2 className="mt-5 font-serif text-3xl leading-tight">The perfect bean & cheese burrito.</h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/65">Silky pinto beans. Mild red sauce. Finely shredded cheddar. A very soft tortilla. Nothing unnecessary.</p>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[.16em] text-[#e0a47a]">Prototype · Not yet kitchen-tested</p>
          </div>
        </div>
      </section>

      <section id="field-guide-content" className="scroll-mt-3">
        <nav aria-label="Field guide chapters" className="sticky top-0 z-20 border-b border-black/10 bg-[#f4efe7]/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 sm:px-8">
            {panels.map(item => (
              <button key={item.id} type="button" onClick={() => changePanel(item.id)} aria-current={panel === item.id ? 'step' : undefined}
                className={'shrink-0 border-b-2 px-3 py-4 text-[11px] font-semibold transition sm:px-5 ' + (panel === item.id ? 'border-[#9c3d24] text-[#9c3d24]' : 'border-transparent text-black/55 hover:text-black')}>
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16 md:px-12">
          {panel === 'story' && <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <p className={eyebrow}>01 · The craving</p>
              <h2 className="mt-5 max-w-[14ch] font-serif text-4xl leading-[1.1] sm:text-6xl">Sometimes the simplest food stays with you.</h2>
              <p className="mt-7 max-w-2xl font-crimson text-2xl leading-9 text-black/70">A bean burrito is hardly a grand culinary achievement. And yet: when the beans are smooth, the sauce tastes just right, and the tortilla is warm, it scratches an itch that much fancier food can miss.</p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-black/65">This first Wine With Pete field guide starts with that pleasure. We are testing an at-home version with more control over our ingredients, without pretending we have already perfected it.</p>
              <button type="button" onClick={() => changePanel('ingredients')} className={primary + ' mt-8'}>Start with the ingredients <ArrowRight size={16}/></button>
            </div>
            <aside className="bg-[#eae0d3] p-7 sm:p-9">
              <p className={eyebrow}>The brief</p>
              <div className="mt-6 grid grid-cols-2 gap-6 border-b border-black/15 pb-7">
                <div><p className="font-serif text-3xl">{servings}</p><p className="mt-1 text-xs text-black/60">Burritos</p></div>
                <div><p className="font-serif text-3xl">~35</p><p className="mt-1 text-xs text-black/60">Minutes</p></div>
              </div>
              <p className={eyebrow + ' mt-8'}>What we are rebuilding</p>
              <ol className="mt-4 space-y-4">
                {['Ultra-smooth pinto beans', 'Mild, tangy red sauce', 'Finely shredded cheddar', 'A warm, soft tortilla', 'A whisper of white onion'].map((s, i) => <li key={s} className="flex gap-4 border-b border-black/10 pb-3 text-sm"><span className="font-serif text-[#9c3d24]">{String(i + 1).padStart(2, '0')}</span>{s}</li>)}
              </ol>
              <p className="mt-8 border-l-2 border-[#9c3d24] pl-4 font-crimson text-xl italic leading-7 text-black/70">The test isn&apos;t whether it tastes expensive. It&apos;s whether you want another.</p>
            </aside>
          </div>}

          {panel === 'ingredients' && <div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr]">
            <div>
              <p className={eyebrow}>02 · Prepare</p>
              <h2 className="mt-4 font-serif text-4xl sm:text-5xl">A good night begins before the stove.</h2>
              <p className="mt-6 text-base leading-7 text-black/65">Check what you have, then copy the rest. All quantities are based on the untested six-burrito kitchen draft.</p>
              <div className="mt-8 flex items-center justify-between border-y border-black/15 py-5">
                <span className="text-xs font-semibold uppercase tracking-[.14em]">Burritos</span>
                <div className="flex items-center gap-5">
                  <button type="button" className={secondary + ' !min-h-10 !px-3'} disabled={servings <= 3} aria-label="Make fewer burritos" onClick={() => setServings(v => Math.max(3, v - 3))}><Minus size={16}/></button>
                  <span className="min-w-5 text-center font-serif text-3xl">{servings}</span>
                  <button type="button" className={secondary + ' !min-h-10 !px-3'} disabled={servings >= 12} aria-label="Make more burritos" onClick={() => setServings(v => Math.min(12, v + 3))}><Plus size={16}/></button>
                </div>
              </div>
              <p className="mt-4 text-xs text-black/55">{completed} of {totalItems} ingredients checked</p>
              <button type="button" onClick={copyList} className={primary + ' mt-5 w-full'}><ClipboardList size={16}/> Copy shopping list</button>
              {notice && <p role="status" className="mt-3 text-sm text-[#9c3d24]">{notice}</p>}
            </div>
            <div className="divide-y divide-black/15 border-t border-black/15">
              {groups.map(group => <section key={group.name} className="py-7">
                <h3 className="font-serif text-2xl">{group.name}</h3>
                <div className="mt-5 space-y-2">
                  {group.items.map(item => <label key={item.id} className="flex cursor-pointer items-start gap-3 py-2">
                    <input type="checkbox" checked={checked.includes(item.id)} onChange={() => setChecked(old => old.includes(item.id) ? old.filter(x => x !== item.id) : [...old, item.id])}
                      className="mt-1 h-5 w-5 shrink-0 accent-[#9c3d24]"/>
                    <span className={'text-sm leading-6 ' + (checked.includes(item.id) ? 'text-black/40 line-through' : 'text-black/75')}>
                      {ingredientText(item, servings)}
                      {item.note && <span className="block text-xs text-black/45">{item.note}</span>}
                    </span>
                  </label>)}
                </div>
              </section>)}
              <div className="pt-7"><button type="button" onClick={() => changePanel('cook')} className={primary}>Go to cooking mode <ArrowRight size={16}/></button></div>
            </div>
          </div>}

          {panel === 'cook' && <div className="mx-auto max-w-3xl">
            <p className={eyebrow}>03 · The kitchen</p>
            <h2 className="mt-5 font-serif text-4xl sm:text-5xl">Cook with attention.</h2>
            <p className="mt-3 text-sm text-black/60">One step at a time. No scrolling through a wall of instructions.</p>
            <div aria-label={'Step ' + (step + 1) + ' of ' + steps.length} className="mt-9 flex gap-1.5">
              {steps.map((_, i) => <button key={i} type="button" aria-label={'Go to step ' + (i + 1)} aria-current={i === step ? 'step' : undefined} onClick={() => setStep(i)} className={'h-2 min-w-0 flex-1 rounded-sm ' + (i <= step ? 'bg-[#9c3d24]' : 'bg-black/15')}/>)}
            </div>
            <article className="mt-8 border border-black/15 bg-[#f8f4ed] p-7 sm:p-12" aria-live="polite">
              <div className="flex flex-wrap items-center justify-between gap-3"><p className={eyebrow}>{steps[step].eyebrow}</p><p className="text-xs text-black/45">{steps[step].time}</p></div>
              <h3 className="mt-5 font-serif text-4xl leading-[1.08] sm:text-5xl">{steps[step].title}</h3>
              <p className="mt-8 text-lg leading-8 text-black/80">{steps[step].instruction}</p>
              <aside className="mt-10 border-l-2 border-[#9c3d24] bg-[#eee5d8] px-5 py-5">
                <p className={eyebrow}>What to look for</p>
                <p className="mt-2 font-crimson text-xl leading-7 text-black/70">{steps[step].cue}</p>
              </aside>
            </article>
            <div className="mt-7 flex justify-between gap-3">
              <button type="button" disabled={step === 0} onClick={() => setStep(v => Math.max(0, v - 1))} className={secondary + ' disabled:opacity-35'}><ArrowLeft size={16}/> Previous</button>
              <button type="button" onClick={() => step === steps.length - 1 ? changePanel('taste') : setStep(v => v + 1)} className={primary}>{step === steps.length - 1 ? 'Taste it' : 'Next step'} <ArrowRight size={16}/></button>
            </div>
            <p className="mt-8 text-xs leading-6 text-black/45">Future kitchen tests: a gluten-free tortilla variant. Einkorn contains gluten and is a separate experiment.</p>
          </div>}

          {panel === 'taste' && <div className="grid gap-12 lg:grid-cols-[1fr_.9fr]">
            <div>
              <p className={eyebrow}>04 · Taste & Pair</p>
              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">What is worth changing? What is worth keeping?</h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-black/65">The point of this first batch is to discover whether we&apos;ve captured the original craving. Taste the classic version before adding extras.</p>
              <div className="mt-8 border-y border-black/15 py-7">
                <h3 className="font-serif text-2xl">How close did we get?</h3>
                <p className="mt-2 text-sm text-black/55">Your own assessment, from one to five. Not a published taste-test result.</p>
                <div className="mt-5 flex gap-2" role="group" aria-label="Rate the burrito from one to five">
                  {[1,2,3,4,5].map(n => <button key={n} type="button" aria-pressed={score === n} onClick={() => setScore(n)}
                    className={'h-12 w-12 border font-serif text-xl ' + (score === n ? 'border-[#9c3d24] bg-[#9c3d24] text-white' : 'border-black/20 hover:bg-black/5')}>{n}</button>)}
                </div>
                {score && <p className="mt-3 text-sm text-[#9c3d24]">Your current score: {score} / 5.</p>}
              </div>
              <button type="button" onClick={() => changePanel('table')} className={primary + ' mt-8'}>Bring it to the table <ArrowRight size={16}/></button>
            </div>
            <aside className="bg-[#eae0d3] p-7 sm:p-9">
              <p className={eyebrow}>Pairing explorations</p>
              <h3 className="mt-4 font-serif text-3xl">Pour what helps the food.</h3>
              <p className="mt-3 text-sm leading-7 text-black/60">These are suggestions to test, not claimed tasting results. No pairing is required.</p>
              <div className="mt-7 divide-y divide-black/15 border-t border-black/15">
                {[{name:'Garnacha / Grenache',body:'Juicy fruit and gentle tannin to try with beans and mild chile.',icon:'wine'},
                  {name:'Dry rosé',body:'A chilled, fresh counterpoint to the warm tortilla and cheddar.',icon:'wine'},
                  {name:'Sparkling water + lime',body:'A bright nonalcoholic companion that keeps the focus on the food.',icon:'water'}].map(p => <div key={p.name} className="flex gap-4 py-5">
                    <div className="mt-1 text-[#9c3d24]">{p.icon === 'water' ? <Coffee size={22}/> : <Wine size={22}/>}</div>
                    <div><p className="font-serif text-xl">{p.name}</p><p className="mt-1 text-sm leading-6 text-black/60">{p.body}</p></div>
                  </div>)}
              </div>
              <p className={eyebrow + ' mt-6'}>After the baseline</p>
              <p className="mt-3 text-sm leading-7 text-black/65">Try a little heat, a greener sauce, or a different tortilla. Change one thing at a time so you know what made the difference.</p>
            </aside>
          </div>}

          {panel === 'table' && <div className="grid gap-12 lg:grid-cols-[1fr_.9fr]">
            <div>
              <p className={eyebrow}>05 · Gather & Remember</p>
              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">The recipe ends. The evening doesn&apos;t have to.</h2>
              <p className="mt-7 max-w-2xl font-crimson text-2xl leading-9 text-black/70">Maybe it&apos;s just a weeknight burrito. Maybe you make six, ask someone over, and find that the best part of dinner has nothing to do with the beans.</p>
              <div className="mt-8 border-l-2 border-[#9c3d24] pl-5"><p className={eyebrow}>A small invitation</p><p className="mt-3 font-serif text-2xl">Who would you make an extra place for?</p></div>
            </div>
            <div className="bg-[#eae0d3] p-7 sm:p-9">
              <Heart className="text-[#9c3d24]" size={25}/>
              <h3 className="mt-5 font-serif text-3xl">A note from your table.</h3>
              <p className="mt-3 text-sm leading-7 text-black/60">Who came? What was said? What would you make again?</p>
              <label htmlFor="table-note" className="mt-7 block text-xs font-semibold uppercase tracking-[.15em]">What do you want to remember?</label>
              <textarea id="table-note" rows={6} maxLength={3000} value={note} onChange={e => {setNote(e.target.value);setSaved(false);}}
                placeholder="A small detail worth keeping…" className="mt-3 w-full resize-y border border-black/20 bg-[#f8f4ed] p-4 text-base leading-7 outline-none focus:border-[#9c3d24]"/>
              <button type="button" onClick={saveNote} className={primary + ' mt-4 w-full'}><Check size={16}/> Save on this device</button>
              {saved && <p role="status" className="mt-3 text-sm text-[#9c3d24]">Saved locally on this device.</p>}
              {notice && <p role="alert" className="mt-3 text-sm text-[#9c3d24]">{notice}</p>}
              <p className="mt-4 text-xs leading-5 text-black/50">Private prototype: this note stays in this browser. It is not submitted to Wine With Pete, synced, or backed up.</p>
              <Link href="/journal" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[#9c3d24] hover:underline"><BookOpen size={16}/> Return to the Journal</Link>
            </div>
          </div>}
        </div>
      </section>

      <footer className="border-t border-black/10 bg-[#211d19] px-5 py-14 text-[#f4efe7] sm:px-8 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[10px] uppercase tracking-[.24em] text-[#e0a47a]">Wine With Pete · Field Guides</p><p className="mt-3 max-w-xl font-serif text-2xl">Food is part of it. The table is the point.</p></div>
          <Link href="/join" className="inline-flex min-h-11 items-center gap-2 border-b border-[#e0a47a] text-xs uppercase tracking-[.14em] text-[#f4efe7]">Join the Founding Table <ArrowRight size={16}/></Link>
        </div>
      </footer>
    </main>
  );
}
