import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  getAllRecipeSlugs,
  getRecipeBySlug,
  type PublicRecipe,
} from '@/data/recipes';

const cardSurfaceStyle = {
  boxShadow:
    '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(91,35,32,0.1), 0 0 0 1px rgba(91,35,32,0.05)',
  background: 'linear-gradient(to bottom, #ffffff, #faf9f7)',
} as const;

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

function MetaRow({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`text-center sm:text-left ${className}`}>
      <dt className="text-xs font-medium uppercase tracking-wider text-ember mb-1.5">{label}</dt>
      <dd className="text-sm text-charcoal leading-relaxed">{value}</dd>
    </div>
  );
}

function CookingSummary({ items }: { items: PublicRecipe['cookingSummary'] }) {
  if (!items?.length) return null;

  return (
    <div className="mb-10 p-5 md:p-6 bg-cream/50 rounded-xl border border-ember/10">
      <p className="text-xs font-medium uppercase tracking-widest text-ember/80 mb-4 text-center md:text-left">
        At a glance
      </p>
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-black/50 mb-1">
              {item.label}
            </dt>
            <dd className="text-sm font-medium text-charcoal leading-snug">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function FireCueCallout({ text }: { text: string }) {
  return (
    <div className="mt-3 p-4 bg-ember/5 rounded-lg border border-ember/15 border-l-4 border-l-ember">
      <p className="text-xs font-medium uppercase tracking-widest text-ember mb-2">Live-fire cue</p>
      <p className="text-sm text-black/75 leading-relaxed">{text}</p>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: PublicRecipe }) {
  return (
    <article
      className="rounded-2xl p-6 md:p-10 relative overflow-hidden border border-ember/5"
      style={cardSurfaceStyle}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(91,35,32,0.05) 1px, rgba(91,35,32,0.05) 2px)`,
        }}
      />

      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-widest text-ember/80 mb-6 text-center">
          Wine With Pete · Field Recipe
        </p>

        <CookingSummary items={recipe.cookingSummary} />

        <div className="grid md:grid-cols-2 gap-10 md:gap-14 lg:gap-16 mb-10">
          <section>
            <h2 className="text-xl font-serif font-medium text-charcoal mb-4 border-b border-ember/10 pb-2">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((item) => (
                <li key={item} className="text-black/75 leading-relaxed flex gap-2">
                  <span className="text-ember mt-1.5 shrink-0">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-medium text-charcoal mb-4 border-b border-ember/10 pb-2">
              Method
            </h2>
            <ol className="space-y-5">
              {recipe.method.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-ember/10 text-ember text-sm font-medium flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-medium text-charcoal mb-1">{step.title}</h3>
                    <p className="text-black/75 leading-relaxed">{step.body}</p>
                    {step.fireCue && <FireCueCallout text={step.fireCue} />}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section className="bg-cream/60 rounded-xl p-6 md:p-8 border border-ember/5">
          <h2 className="text-lg font-serif font-medium text-charcoal mb-3">Pete&apos;s Note</h2>
          {recipe.petesNote.split('\n\n').map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-black/75 leading-relaxed italic mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </section>
      </div>
    </article>
  );
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  const metaEntries: { label: string; value: string }[] = [
    { label: 'Format', value: recipe.meta.format },
    { label: 'Occasion', value: recipe.meta.occasion },
    { label: 'Flavor', value: recipe.meta.flavor },
    { label: 'Best with', value: recipe.meta.bestWith },
    { label: 'Status', value: recipe.meta.status },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-ember/5">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Link
            href="/recipes"
            className="text-sm text-ember hover:text-ember-light transition-colors font-medium"
          >
            ← All recipes
          </Link>
        </div>
      </div>

      <div className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center animate-fade-in">
          <p className="text-xs font-medium uppercase tracking-widest text-ember/80 mb-4">
            Field Recipe
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-5">
            {recipe.title}
          </h1>
          <p className="text-lg md:text-xl text-black/70 leading-relaxed max-w-2xl mx-auto">
            {recipe.subtitle}
          </p>
        </div>
      </div>

      <div className="py-10 md:py-12">
        <div className="mx-auto max-w-4xl px-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mb-10 p-6 md:p-8 bg-white rounded-xl border border-ember/5 shadow-sm">
            {metaEntries.map((entry) => (
              <MetaRow
                key={entry.label}
                label={entry.label}
                value={entry.value}
                className={entry.label === 'Best with' ? 'lg:col-span-2' : ''}
              />
            ))}
          </dl>

          <RecipeCard recipe={recipe} />
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="bg-cream rounded-2xl p-10 shadow-sm border border-ember/5">
            <h2 className="text-2xl font-serif font-medium mb-4 text-charcoal">
              More from the fire
            </h2>
            <p className="text-black/70 mb-8 leading-relaxed">{recipe.ctaText}</p>
            <Button asChild className="btn-ember px-8 py-4 rounded-full text-lg font-medium">
              <Link href="/join">Join the Founding Table</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
