import type { Metadata } from 'next';
import Link from 'next/link';
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
    <dl className="grid gap-px border-y border-black/15 bg-black/15 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-[#f4efe7] px-5 py-5">
          <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9c3d24]">{item.label}</dt>
          <dd className="mt-2 text-sm font-medium leading-6 text-black/70">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function FireCue({ text }: { text: string }) {
  return (
    <aside className="mt-5 border-l-2 border-[#9c3d24] pl-5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9c3d24]">Live-fire cue</p>
      <p className="mt-2 text-sm leading-6 text-black/60">{text}</p>
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
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <Link href="/recipes" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45 hover:text-[#9c3d24]">
            ← Recipes & Guides
          </Link>
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-end lg:gap-20">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Field Recipe</p>
              <h1 className="mt-5 max-w-[11ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
                {recipe.title}
              </h1>
            </div>
            <p className="max-w-xl font-crimson text-2xl leading-9 text-black/68 sm:text-[1.55rem] sm:leading-10 lg:justify-self-end">
              {recipe.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 md:px-12 md:py-16 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 border-y border-black/15 py-6 sm:grid-cols-2 lg:grid-cols-5">
            {metaEntries.map(([label, value]) => (
              <dl key={label}>
                <dt className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9c3d24]">{label}</dt>
                <dd className="mt-2 text-sm leading-6 text-black/60">{value}</dd>
              </dl>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 md:px-12 md:pb-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <CookingSummary items={recipe.cookingSummary} />

          <div className="mt-16 grid gap-14 lg:grid-cols-[.78fr_1.22fr] lg:gap-24">
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Ingredients</p>
              <ul className="mt-6 divide-y divide-black/10 border-y border-black/15">
                {recipe.ingredients.map((item) => (
                  <li key={item} className="py-3 text-sm leading-6 text-black/64">{item}</li>
                ))}
              </ul>
            </aside>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Method</p>
              <ol className="mt-2">
                {recipe.method.map((step, index) => (
                  <li key={step.title} className="grid gap-5 border-b border-black/12 py-9 sm:grid-cols-[60px_1fr] sm:gap-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9c3d24]">{String(index + 1).padStart(2, '0')}</p>
                    <div>
                      <h2 className="font-serif text-3xl leading-[1.08]">{step.title}</h2>
                      <p className="mt-4 text-base leading-7 text-black/62">{step.body}</p>
                      {step.fireCue && <FireCue text={step.fireCue} />}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#eee4d7] px-5 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.65fr_1.35fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Pete&apos;s note</p>
          </div>
          <div className="max-w-4xl space-y-6 font-crimson text-xl leading-8 text-black/66 sm:text-2xl sm:leading-9">
            {recipe.petesNote.split('\n\n').map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#211d19] px-5 py-20 text-[#f4efe7] sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d78959]">More from the fire</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">{recipe.ctaText}</h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/join" className="inline-flex min-h-12 items-center justify-center bg-[#a64225] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Join the Founding Table
            </Link>
            <Link href="/journal" className="inline-flex min-h-12 items-center justify-center border border-white/25 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Back to the Journal
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
