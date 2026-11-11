'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getFeaturedRecipes } from '@/data/recipes';
import type { Product } from '@/lib/types';

const featuredRecipes = getFeaturedRecipes();

export default function RecipesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=digital');
        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error('Failed to fetch digital products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productImageUrl = (product: Product) => {
    if (!product.image_path) return null;
    if (product.image_path.startsWith('http')) return product.image_path;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${product.image_path}`;
  };

  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.9fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Journal · Recipes & Guides</p>
            <h1 className="mt-5 max-w-[10ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
              Things worth making and passing on.
            </h1>
          </div>
          <p className="max-w-xl font-crimson text-2xl leading-9 text-black/68 sm:text-[1.55rem] sm:leading-10 lg:justify-self-end">
            Field recipes, practical guides, and designed resources that come out of real tables, fires, and experiments.
          </p>
        </div>
      </section>

      {featuredRecipes.length > 0 && (
        <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Field Recipes</p>
                <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Built to be cooked, not admired from a distance.</h2>
              </div>

              <div className="border-y border-black/15">
                {featuredRecipes.map((recipe, index) => (
                  <Link
                    key={recipe.slug}
                    href={`/recipes/${recipe.slug}`}
                    className="group grid gap-5 border-b border-black/10 py-8 last:border-b-0 sm:grid-cols-[70px_1fr] sm:gap-7"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9c3d24]">{String(index + 1).padStart(2, '0')}</p>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">{recipe.meta.occasion}</p>
                      <h3 className="mt-2 font-serif text-3xl leading-[1.08] transition-colors group-hover:text-[#9c3d24] sm:text-4xl">{recipe.title}</h3>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-black/58">{recipe.subtitle}</p>
                      <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-[#9c3d24]">Cook the recipe →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-black/10 bg-[#eee4d7] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Guides</p>
              <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Deeper objects from the same world.</h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-black/58">
                Some ideas need more room than a recipe page. Guides can hold the full process, variations, visual instruction, and the details worth keeping.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-6 text-black/60">
                Published field recipes are free to read and cook—no account required. We are preparing existing guides for free access; direct downloads are temporarily paused while we verify delivery and publication readiness.
              </p>
            </div>

            <div>
              {productsLoading ? (
                <div className="border-y border-black/15 py-10 text-sm text-black/45">Checking the guide shelf…</div>
              ) : products.length > 0 ? (
                <div className="border-y border-black/15">
                  {products.map((product) => {
                    const imageUrl = productImageUrl(product);
                    return (
                      <article key={product.id} className="grid gap-6 border-b border-black/10 py-8 last:border-b-0 sm:grid-cols-[160px_1fr_auto] sm:items-center">
                        <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              fill
                              sizes="160px"
                              className="object-cover"
                              unoptimized={imageUrl.startsWith('http')}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-black/32">Wine With Pete Guide</div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-serif text-3xl leading-[1.08]">{product.name}</h3>
                          {product.description && <p className="mt-3 max-w-xl text-sm leading-6 text-black/56">{product.description}</p>}
                          <p className="mt-3 text-sm font-medium text-[#9c3d24]">Free-access release in preparation · Download not yet available</p>
                        </div>
                        <Link
                          href="/join"
                          className="inline-flex min-h-11 items-center justify-center border border-[#9c3d24] px-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#9c3d24] transition-colors hover:bg-[#9c3d24] hover:text-white"
                        >
                          Get updates
                        </Link>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="border-y border-black/15 py-10">
                  <p className="font-serif text-3xl leading-[1.12]">The guide shelf is still being built.</p>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-black/58">
                    New guides will appear here when they are ready to be useful—not simply because the site needs more products.
                  </p>
                  <Link href="/join" className="mt-6 inline-block border-b border-[#9c3d24] pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#9c3d24]">
                    Join the Founding Table for new releases →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#211d19] px-5 py-20 text-[#f4efe7] sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d78959]">The Journal</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Recipes are one way the table travels.</h2>
          </div>
          <Link href="/journal" className="inline-flex min-h-12 items-center justify-center border border-white/25 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Back to the Journal
          </Link>
        </div>
      </section>


    </main>
  );
}
