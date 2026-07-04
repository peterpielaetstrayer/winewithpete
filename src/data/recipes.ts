export type RecipeMeta = {
  format: string;
  occasion: string;
  flavor: string;
  bestWith: string;
  status: string;
};

export type CookingSummaryItem = {
  label: string;
  value: string;
};

export type RecipeMethodStep = {
  title: string;
  body: string;
  fireCue?: string;
};

export type PublicRecipe = {
  slug: string;
  title: string;
  subtitle: string;
  featured: boolean;
  meta: RecipeMeta;
  ingredients: string[];
  cookingSummary?: CookingSummaryItem[];
  method: RecipeMethodStep[];
  petesNote: string;
  ctaText: string;
};

export const recipes: PublicRecipe[] = [
  {
    slug: 'chipotle-lime-fire-wings',
    title: 'Chipotle Lime Fire Wings',
    subtitle:
      'Smoke, lime, chipotle, agave, and cilantro — wings built for fire, summer tables, and people eating with their hands.',
    featured: true,
    meta: {
      format: 'Fire-grilled wings',
      occasion: 'Fourth of July / summer gathering',
      flavor: 'Smoke · lime · chipotle · agave · cilantro',
      bestWith: 'Bright rosé, Mexican lager, sparkling wine, or margaritas',
      status: 'Public field recipe · July 2026',
    },
    ingredients: [
      '4 pounds chicken wings, split into flats and drums',
      '3 limes, juiced',
      'Zest of 1 lime',
      '2–3 chipotle peppers in adobo, plus 2–3 tablespoons adobo sauce',
      '1–2 serrano peppers, stemmed',
      '3–4 garlic cloves, or 1 teaspoon garlic powder',
      '1/4 small onion, roughly chopped, or 1 teaspoon onion powder',
      '1/2 cup chopped cilantro',
      '1 tablespoon neutral oil',
      '1 1/2 tablespoons Diamond Crystal kosher salt, or about 2 1/4 teaspoons Morton kosher salt',
      '2–3 tablespoons agave',
      'Extra lime wedges, for serving',
      'Extra cilantro, for finishing',
    ],
    cookingSummary: [
      { label: 'Grill temp', value: '375–425°F' },
      { label: 'Cook time', value: '25–35 minutes' },
      { label: 'Turn', value: 'Every 5–7 minutes' },
      { label: 'Internal temp', value: '165°F minimum, 175–185°F preferred' },
    ],
    method: [
      {
        title: 'Marinate the wings.',
        body: 'In a blender, combine the lime juice, lime zest, chipotle peppers, adobo sauce, serrano peppers, garlic or garlic powder, onion or onion powder, cilantro, oil, and salt. Blend until mostly smooth. Toss the wings with the marinade in a large bowl or bag, making sure they are well coated. Refrigerate for at least 4 hours, ideally overnight.',
      },
      {
        title: 'Build the fire.',
        body: 'Prepare a grill, smoker, or live-fire setup for medium to medium-high heat. If using a grill with a lid thermometer, aim for about 375–425°F. Red oak works beautifully here. You want enough heat to render the skin and enough smoke to make the wings taste like they came from outside.',
        fireCue:
          'If cooking over wood or coals, hold your palm about 5 inches above the cooking grate over the cooking zone. You should be able to keep it there for about 4–5 seconds before pulling away. If you have to pull away after 1–2 seconds, the fire is too hot. If you can hold it there much longer than 6–7 seconds, build more heat.',
      },
      {
        title: 'Cook the wings.',
        body: 'Cook the wings for about 25–35 minutes, turning every 5–7 minutes, until the skin is deeply browned, lightly charred in spots, and the thickest part of the wing reaches at least 165°F. For a more tender, rendered wing, aim closer to 175–185°F.',
      },
      {
        title: 'Glaze at the end.',
        body: 'Toss the hot wings with agave, a squeeze of fresh lime, and more chopped cilantro. Return them to the grill briefly if you want the glaze to tighten and caramelize.',
      },
      {
        title: 'Serve immediately.',
        body: 'Finish with lime wedges, fresh cilantro, and plenty of napkins.',
      },
    ],
    petesNote:
      'For a balanced version, use 2–3 chipotle peppers from the can plus a few spoonfuls of adobo sauce. For a deeper, smokier, spicier Wine With Pete version, use the whole can of chipotles in adobo. Serranos add fresh green heat, so adjust them to taste. Fresh garlic and onion give the marinade more body and depth, but garlic powder and onion powder work well when you want to keep it simple.',
    ctaText:
      'Join the Founding Table for future recipes, dinner notes, and private gathering invites.',
  },
];

export function getRecipeBySlug(slug: string): PublicRecipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export function getFeaturedRecipes(): PublicRecipe[] {
  return recipes.filter((r) => r.featured);
}

export function getAllRecipeSlugs(): string[] {
  return recipes.map((r) => r.slug);
}
