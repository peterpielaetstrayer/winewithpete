import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { RecipePrintButton } from '@/components/recipe-print-button';
import { notFound } from 'next/navigation';

import {
  getAllRecipeSlugs,
  getRecipeBySlug,
  type PublicRecipe,
} from '@/data/recipes';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllRecipeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) return { title: 'Recipe Not Found' };

  return {
    title: `${recipe.title} | Wine With Pete`,
    description: recipe.subtitle,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: {
      title: `${recipe.title} | Wine With Pete`,
      description: recipe.subtitle,
      url: `https://winewithpete.me/recipes/${recipe.slug}`,
      siteName: 'Wine With Pete',
      type: 'article',
    },
  };
}


function CookingSummary({ items }: { items: PublicRecipe['cookingSummary'] }) {
  if (!items?.length) return null;

  return (
    <dl className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 border-t border-black/15 pt-3">
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9c3d24]">{item.label}</dt>
          <dd className="mt-1 text-base font-medium leading-6 text-[#211d19]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function FireCue({ text }: { text: string }) {
  return (
    <aside className="mt-5 border-l-2 border-[#9c3d24] bg-[#eee4d7]/50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9c3d24]">Live-fire cue</p>
      <p className="mt-2 text-[16px] leading-7 text-[#453b34]">{text}</p>
    </aside>
  );
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  const metaEntries = [
    ['Format', recipe.meta.format],
    ['Occasion', recipe.meta.occasion],
    ['Flavor', recipe.meta.flavor],
    ['Best with', recipe.meta.bestWith],
    ['Status', recipe.meta.status],
  ];

  return (
    <div className="wwp-recipe-print bg-[#f4efe7] text-[#211d19]">
      {/* Atmospheric fire photography is decorative, not a photograph of this recipe. */}
      <section className="wwp-print-hide relative isolate overflow-hidden bg-[#211d19] text-[#f4efe7]">
        <Image
          src="/images/hero/hero-campfire.png.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(105deg,rgba(16,12,9,.95)_0%,rgba(24,16,12,.84)_65%,rgba(16,12,9,.72)_100%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14 md:px-12 lg:px-16 lg:pb-20">
          <Link
            href="/recipes"
            className="inline-flex min-h-11 items-center text-sm font-medium text-[#f4efe7] underline decoration-[#d78959] underline-offset-8 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            ← Recipes & Guides
          </Link>
          <div className="mt-8 grid items-end gap-9 lg:grid-cols-[1.12fr_.88fr] lg:gap-16">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e5a17b]">Field recipe · From the fire</p>
              <h1 className="mt-4 max-w-[15ch] font-serif text-[clamp(2.35rem,6vw,4.75rem)] font-medium leading-[1.05] tracking-[-0.025em]">
                {recipe.title}
              </h1>
              <p className="mt-6 max-w-2xl font-crimson text-[clamp(1.25rem,2.3vw,1.7rem)] leading-[1.4] text-[#f4efe7]/90">
                {recipe.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="#ingredients"
                  className="inline-flex min-h-12 items-center justify-center bg-[#a64225] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#85351f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  View ingredients
                </Link>
                <Link
                  href="#method"
                  className="inline-flex min-h-12 items-center justify-center border border-[#f4efe7]/65 px-5 py-3 text-sm font-semibold text-white hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Jump to method ↓
                </Link>
              </div>
            </div>
            <div className="bg-[#f4efe7] p-5 text-[#211d19] sm:p-7">
              <h2 className="mb-5 font-serif text-2xl leading-tight sm:text-3xl">Cooking at a glance</h2>
              <CookingSummary items={recipe.cookingSummary} />
            </div>
          </div>
        </div>
      </section>

      <section className="wwp-print-hide border-b border-black/10 px-5 py-8 sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <dl className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {metaEntries.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9c3d24]">{label}</dt>
                <dd className="mt-2 text-sm leading-6 text-[#50443c]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto hidden max-w-7xl px-5 pt-5 print:block">
        <p className="text-xs uppercase tracking-wider">Wine With Pete · Field recipe</p>
        <h1 className="mt-3 font-serif text-4xl">{recipe.title}</h1>
        <p className="mt-2">{recipe.subtitle}</p>
        {recipe.cookingSummary && (
          <p className="mt-3 text-sm">
            {recipe.cookingSummary.map((item) => item.label + ': ' + item.value).join(' · ')}
          </p>
        )}
      </div>

      <section className="wwp-print-content px-5 pb-16 pt-12 sm:px-8 sm:pt-16 md:px-12 lg:px-16 lg:pb-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.76fr_1.24fr] lg:gap-20">
          <aside id="ingredients" className="scroll-mt-8 lg:sticky lg:top-8 lg:self-start">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-serif text-3xl leading-tight sm:text-4xl">Ingredients</h2>
              <div className="wwp-print-hide"><RecipePrintButton /></div>
            </div>
            <ul className="mt-7 divide-y divide-black/10 border-y border-black/15">
              {recipe.ingredients.map((item) => (
                <li key={item} className="py-3 text-[17px] leading-7 text-[#453b34]">{item}</li>
              ))}
            </ul>
          </aside>

          <div id="method" className="scroll-mt-8">
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">Method</h2>
            <ol className="mt-4">
              {recipe.method.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[2.25rem_1fr] gap-4 border-b border-black/12 py-7 sm:grid-cols-[2.75rem_1fr] sm:gap-6">
                  <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9c3d24] text-sm font-semibold text-white sm:h-11 sm:w-11">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-2xl leading-[1.2] sm:text-3xl">{step.title}</h3>
                    <p className="mt-3 text-[17px] leading-[1.7] text-[#453b34]">{step.body}</p>
                    {step.fireCue && <FireCue text={step.fireCue} />}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="wwp-print-content border-y border-black/10 bg-[#eee4d7] px-5 py-14 sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[.55fr_1.45fr] lg:gap-16">
          <h2 className="font-serif text-3xl text-[#9c3d24]">Pete&apos;s note</h2>
          <div className="max-w-3xl space-y-5 font-crimson text-[21px] leading-[1.5] text-[#3d322b]">
            {recipe.petesNote.split('\n\n').map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="wwp-print-hide bg-[#211d19] px-5 py-14 text-[#f4efe7] sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#e5a17b]">More from the fire</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">{recipe.ctaText}</h2>
          </div>
          <Link
            href="/join"
            className="inline-flex min-h-12 shrink-0 items-center justify-center bg-[#a64225] px-6 text-sm font-semibold text-white hover:bg-[#85351f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Join the Founding Table
          </Link>
        </div>
      </section>
    </div>
  );
}
