'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth-provider';
import type { Package, ShoppingItem, Ingredient } from '@/lib/types';

// Utility functions for shopping list aggregation
function aggregateShoppingList(
  packageData: Package,
  servingSize: number = 4
): ShoppingItem[] {
  if (!packageData.recipes) return [];

  const aggregated: Map<string, ShoppingItem> = new Map();

  (packageData.recipes as any[]).forEach((packageRecipe) => {
    if (!packageRecipe.recipe?.ingredients) return;

    const recipe = packageRecipe.recipe;
    const scaleFactor = (servingSize / recipe.serves_base) * packageRecipe.serves_factor;

    recipe.ingredients.forEach((ingredient: Ingredient) => {
      const key = `${ingredient.item}_${ingredient.unit}`;
      const scaledAmount = ingredient.amount * scaleFactor;

      if (aggregated.has(key)) {
        const existing = aggregated.get(key)!;
        existing.amount += scaledAmount;
      } else {
        aggregated.set(key, {
          item: ingredient.item,
          amount: scaledAmount,
          unit: ingredient.unit,
          notes: ingredient.notes,
        });
      }
    });
  });

  return Array.from(aggregated.values()).sort((a, b) => a.item.localeCompare(b.item));
}

function formatShoppingAmount(amount: number): string {
  // Round to reasonable precision
  if (amount % 1 === 0) return amount.toString();
  if (amount < 1) return amount.toFixed(2).replace(/\.?0+$/, '');
  return amount.toFixed(1).replace(/\.0$/, '');
}

export default function PackageDetailPage() {
  const params = useParams();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [servingSize, setServingSize] = useState(4);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const { member } = useAuth();

  useEffect(() => {
    async function loadData() {
      if (!params.slug) return;
      
      try {

        // Load package data
        const { data: pkg, error } = await supabase
          .from('packages')
          .select('*')
          .eq('slug', params.slug as string)
          .single();

        if (error) throw error;

        // Load recipe details
        if (pkg?.recipes) {
          const recipeIds = (pkg.recipes as any[]).map(r => r.recipe_id);
          const { data: recipes } = await supabase
            .from('recipes')
            .select('*')
            .in('id', recipeIds);

          if (recipes) {
            pkg.recipes = (pkg.recipes as any[]).map(pr => ({
              ...pr,
              recipe: recipes.find(r => r.id === pr.recipe_id)
            }));
          }
        }

        setPackageData(pkg);
        
        // Set default serving size
        if (pkg?.serving_sizes?.length > 0) {
          setServingSize(pkg.serving_sizes[0]);
        }
      } catch (error) {
        console.error('Error loading package:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.slug]);

  // Update shopping list when serving size changes
  useEffect(() => {
    if (packageData) {
      const aggregated = aggregateShoppingList(packageData, servingSize);
      setShoppingList(aggregated);
    }
  }, [packageData, servingSize]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: packageData?.name,
          text: packageData?.description || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-display animate-fade-in">Loading Package...</h1>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-display">Package Not Found</h1>
          <p className="mt-4 text-black/80">
            The package you're looking for doesn't exist or isn't available.
          </p>
          <Link href="/packages" className="btn-ember mt-6 inline-block">
            Browse All Packages
          </Link>
        </div>
      </div>
    );
  }

  // Check access permissions
  const hasAccess = member || packageData.published;

  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-display">Members Only</h1>
          <p className="mt-4 text-black/80">
            This package is available to members only.
          </p>
          <Link href="/join" className="btn-ember mt-6 inline-block">
            Join Wine With Pete
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/packages" 
          className="text-ember hover:underline mb-4 inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Packages
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Package Image */}
          <div className="lg:w-1/3">
            <div className="aspect-square relative overflow-hidden rounded-2xl">
              {packageData.cover_url ? (
                <Image
                  src={packageData.cover_url}
                  alt={packageData.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-ember/10 to-ember/5 flex items-center justify-center">
                  <svg className="w-24 h-24 text-ember/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Package Info */}
          <div className="lg:w-2/3">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="text-ember border-ember">
                {packageData.package_type.replace('_', ' ')}
              </Badge>
              {!packageData.published && (
                <Badge className="bg-ember text-white">Members Only</Badge>
              )}
            </div>

            <h1 className="text-display mb-4">{packageData.name}</h1>
            
            {packageData.description && (
              <p className="text-black/80 mb-6 text-lg leading-relaxed">
                {packageData.description}
              </p>
            )}

            {/* Serving Size Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Serving Size</label>
              <div className="flex gap-2">
                {packageData.serving_sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setServingSize(size)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      servingSize === size
                        ? 'bg-ember text-white'
                        : 'bg-black/5 text-black/70 hover:bg-black/10'
                    }`}
                  >
                    {size} people
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {member && (
                <Button className="btn-ember">
                  Add to My Hub
                </Button>
              )}
              <Button variant="outline" onClick={handlePrint}>
                Print Package
              </Button>
              <Button variant="outline" onClick={handleShare}>
                Share
              </Button>
            </div>

            {/* Tags */}
            {packageData.tags && packageData.tags.length > 0 && (
              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {packageData.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="text-sm bg-black/5 text-black/60 px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wine Pairing */}
      {packageData.wine_pairing && (
        <div className="bg-cream rounded-2xl p-8 mb-8">
          <h2 className="text-section mb-4">🍷 Wine Pairing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-2">{packageData.wine_pairing.wine}</h3>
              <p className="text-black/80">{packageData.wine_pairing.reasoning}</p>
              {packageData.wine_pairing.temp && (
                <p className="text-sm text-black/60 mt-2">
                  Serve at {packageData.wine_pairing.temp}
                </p>
              )}
            </div>
            {packageData.wine_pairing.alternates && packageData.wine_pairing.alternates.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Alternative Pairings</h4>
                <ul className="text-black/80">
                  {packageData.wine_pairing.alternates.map((alt, index) => (
                    <li key={index}>• {alt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shopping List */}
      <div className="bg-white border border-black/10 rounded-2xl p-8 mb-8">
        <h2 className="text-section mb-6">
          🛒 Shopping List 
          <span className="text-base font-normal text-black/60 ml-2">
            (for {servingSize} people)
          </span>
        </h2>
        
        {shoppingList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shoppingList.map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-black/5 rounded-lg">
                <input type="checkbox" className="mr-3 h-4 w-4 text-ember" />
                <div className="flex-1">
                  <div className="font-medium">{item.item}</div>
                  <div className="text-sm text-black/60">
                    {formatShoppingAmount(item.amount)} {item.unit}
                    {item.notes && <span className="text-black/40"> ({item.notes})</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-black/60">No shopping list available for this package.</p>
        )}
      </div>

      {/* Recipes */}
      <div className="space-y-8">
        <h2 className="text-section">🔥 Recipes</h2>
        
        {packageData.recipes && (packageData.recipes as any[]).map((packageRecipe, index) => {
          const recipe = packageRecipe.recipe;
          if (!recipe) return null;

          const scaleFactor = (servingSize / recipe.serves_base) * packageRecipe.serves_factor;

          return (
            <div key={index} className="card-enhanced">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-serif font-medium">{recipe.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-black/60">
                    {recipe.cook_time_minutes && (
                      <span>⏱️ {recipe.cook_time_minutes} min</span>
                    )}
                    <Badge variant="outline">{recipe.difficulty}</Badge>
                  </div>
                </div>

                {recipe.description && (
                  <p className="text-black/80 mb-6">{recipe.description}</p>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Ingredients */}
                  <div>
                    <h4 className="font-medium mb-4">Ingredients</h4>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient: any, idx: number) => (
                        <li key={idx} className="flex justify-between items-start">
                          <span>{ingredient.item}</span>
                          <span className="text-black/60 ml-4 text-right">
                            {formatShoppingAmount(ingredient.amount * scaleFactor)} {ingredient.unit}
                            {ingredient.notes && (
                              <div className="text-xs text-black/40">({ingredient.notes})</div>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="font-medium mb-4">Instructions</h4>
                    <ol className="space-y-3">
                      {recipe.instructions.map((instruction: string, idx: number) => (
                        <li key={idx} className="flex">
                          <span className="flex-shrink-0 w-6 h-6 bg-ember/10 text-ember rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-black/80">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Recipe Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-black/10">
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag: string, idx: number) => (
                        <span 
                          key={idx}
                          className="text-xs bg-ember/10 text-ember px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          body { font-size: 12pt; }
          h1 { font-size: 20pt; }
          h2 { font-size: 16pt; }
          h3 { font-size: 14pt; }
        }
      `}</style>
    </div>
  );
}
