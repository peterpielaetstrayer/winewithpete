'use client';

import Image from 'next/image';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import type { CatalogIntent } from '@/lib/explore/catalog';

/**
 * Copyright / consent gate: the GitHub repository is public.
 * The original Google Photos remain private. Do not put photographic derivatives
 * in this repo or activate this flag until image context and publication rights
 * have been approved. Local approved review builds may copy the private asset pack.
 */
export const EXPLORE_PHOTOS_ENABLED = process.env.NEXT_PUBLIC_WWP_EXPLORE_PHOTOS === 'true';

export type ExplorePhoto = 'hero-seoul-bowl' | 'from-fire' | 'wine-table' | 'set-table' |
  'work-service' | 'ingredients' | 'fire-wings' | 'outside-cheese';

const gradients: Record<ExplorePhoto, string> = {
  'hero-seoul-bowl': 'from-[#39281e] via-[#4a3026] to-[#8c5c45]',
  'from-fire': 'from-[#231a15] via-[#6c3529] to-[#b56e40]',
  'wine-table': 'from-[#372023] via-[#67333a] to-[#8d6852]',
  'set-table': 'from-[#4e3529] via-[#7e6451] to-[#a58b72]',
  'work-service': 'from-[#392921] via-[#796252] to-[#c19a75]',
  'ingredients': 'from-[#29362c] via-[#59744c] to-[#b1a17b]',
  'fire-wings': 'from-[#432319] via-[#995136] to-[#cb894d]',
  'outside-cheese': 'from-[#2d372a] via-[#667b58] to-[#b3aa7f]',
};

export function EditorialPhoto({
  photo, alt, className = '', sizes = '100vw', priority = false, position = 'object-center',
}: {
  photo: ExplorePhoto; alt: string; className?: string; sizes?: string; priority?: boolean; position?: string;
}) {
  if (!EXPLORE_PHOTOS_ENABLED) {
    return (
      <div aria-hidden="true" data-photo-placeholder={photo}
        className={'absolute inset-0 bg-gradient-to-br ' + gradients[photo] + ' ' + className} />
    );
  }

  return <Image data-editorial-photo={photo}
    src={'/images/explore-v03/' + photo + '.webp'} alt={alt} fill priority={priority}
    sizes={sizes} className={'object-cover ' + position + ' ' + className} />;
}

type IntentItem = {
  intent: Exclude<CatalogIntent, 'all'>;
  label: string;
  subtitle: string;
  photo: ExplorePhoto;
  alt: string;
};

const lanes: readonly IntentItem[] = [
  { intent: 'cook', label: 'Cook', subtitle: 'The hands and the heat', photo: 'from-fire', alt: 'Outdoor cooking over a glowing fire' },
  { intent: 'taste', label: 'Taste', subtitle: 'Wine, flavor, discovery', photo: 'wine-table', alt: 'Wine, glasses and menus set on a dinner table' },
  { intent: 'gather', label: 'Gather', subtitle: 'Make room for people', photo: 'set-table', alt: 'A dinner table set with menus and glassware' },
  { intent: 'read', label: 'Stories', subtitle: 'A seat at another table', photo: 'work-service', alt: 'Small plated dishes being prepared for guests' },
];

export function ExploreEditorial({ onSelectIntent }: { onSelectIntent: (intent: CatalogIntent) => void }) {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-14 pt-16 sm:px-8 md:grid-cols-[1.3fr_.8fr] md:items-end md:gap-20 md:px-12 md:pb-20 md:pt-24 lg:px-16">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.23em] text-[#a14e34]">A way of being together</p>
          <h2 className="mt-5 max-w-3xl font-serif text-[clamp(2.7rem,5.4vw,5.8rem)] leading-[1.02] tracking-[-.055em]">
            Food is part of it.<br/><span className="italic text-[#9f5037]">The table is the point.</span>
          </h2>
        </div>
        <p className="max-w-lg pb-2 font-crimson text-xl leading-8 text-[#5e4e43] md:text-2xl md:leading-9">
          A meal is never just a meal. There is the planning, the making, the first pour, and everything that happens once people sit down.
        </p>
      </section>

      <section aria-label="Ways to explore" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 md:px-12 md:pb-24 lg:px-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5 border-t border-[#9b8c7e]/50 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-[#6c5546]">Where would you like to begin?</p>
          <p className="max-w-sm font-crimson text-lg italic leading-6 text-[#776657]">Follow an appetite, a memory, or an idea.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {lanes.map((item, index) => (
            <button key={item.intent} type="button" aria-label={'Explore ' + item.label}
              onClick={() => onSelectIntent(item.intent)}
              className="group relative isolate flex min-h-[245px] flex-col justify-between overflow-hidden bg-[#3f2b24] p-4 text-left text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9c3d24] sm:min-h-[320px] sm:p-6 md:min-h-[400px]">
              <EditorialPhoto photo={item.photo} alt={item.alt}
                sizes="(max-width: 767px) 50vw, 25vw"
                className="transition-transform duration-700 motion-safe:group-hover:scale-[1.045]"/>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/85"/>
              <span className="relative text-[10px] font-semibold uppercase tracking-[.23em] text-white/90">{String(index + 1).padStart(2, '0')} / Explore</span>
              <span className="relative flex w-full items-end justify-between gap-2">
                <span>
                  <span className="block font-serif text-[clamp(2.25rem,4vw,4.5rem)] leading-none tracking-[-.05em]">{item.label}</span>
                  <span className="mt-3 block max-w-[13rem] font-crimson text-base leading-5 text-white/85 sm:text-lg">{item.subtitle}</span>
                </span>
                <ArrowDownRight size={24} strokeWidth={1.35} aria-hidden className="mb-1 shrink-0"/>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid min-w-0 bg-[#30221d] text-[#f6e9de] md:grid-cols-[1.05fr_1fr]">
        <div className="relative isolate min-h-[330px] overflow-hidden md:min-h-[535px]">
          <EditorialPhoto photo="work-service" alt="A sequence of small plates being prepared for service"
            sizes="(max-width: 767px) 100vw, 55vw" position="object-[center_45%]" />
        </div>
        <div className="flex flex-col justify-center px-7 py-14 sm:px-12 md:px-14 md:py-20 lg:px-20">
          <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#dea582]">The moments before</p>
          <h2 className="mt-6 max-w-xl font-serif text-[clamp(2.7rem,5vw,5.2rem)] leading-[.99] tracking-[-.05em]">
            Before the first guest arrives.
          </h2>
          <p className="mt-7 max-w-xl font-crimson text-xl leading-8 text-[#e1cfc1]">
            The cutting boards, the quiet decisions, the last plate. The hours that go into an evening are part of the story worth sharing.
          </p>
          <a href="#explore-collection" className="mt-8 inline-flex min-h-12 w-fit items-center gap-3 border-b border-[#d6a080] text-xs font-semibold uppercase tracking-[.15em] text-[#f3d0b5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3d0b5]">
            Explore the collection <ArrowRight size={16} aria-hidden/>
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.23em] text-[#a14e34]">From the archive</p>
            <h2 className="mt-4 font-serif text-[clamp(2.5rem,5vw,4.8rem)] leading-[1.04] tracking-[-.05em]">The little things are the big things.</h2>
          </div>
          <p className="max-w-sm font-crimson text-lg leading-7 text-[#716052]">A few details from real meals. Not every moment needs to become a recipe.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {([
            { photo: 'fire-wings', alt: 'A generous platter of cooked food intended for sharing', heading: 'Something for everyone to reach for', note: 'The pleasure of passing a plate.' },
            { photo: 'ingredients', alt: 'Ingredients and herbs laid out during cooking preparation', heading: 'The work before the table', note: 'Making something good starts long before dinner.' },
            { photo: 'outside-cheese', alt: 'Cheese and a knife on a board outdoors among trees', heading: 'Reasons to linger', note: 'Sometimes the best part is simply staying a little longer.' },
          ] as const).map((item, index) => (
            <article key={item.photo}>
              <div className="relative min-h-[245px] overflow-hidden bg-[#4c392e] sm:aspect-[4/3]">
                <EditorialPhoto photo={item.photo} alt={item.alt} sizes="(max-width: 639px) 100vw, 33vw" />
              </div>
              <div className="mt-5 flex items-start gap-4">
                <span className="pt-1 text-[10px] font-semibold tracking-[.18em] text-[#a04d35]">0{index + 1}</span>
                <div><h3 className="font-serif text-2xl leading-[1.1]">{item.heading}</h3><p className="mt-2 font-crimson text-lg leading-6 text-[#776658]">{item.note}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
