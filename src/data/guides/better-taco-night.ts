import type { GuideIngredient } from '@/lib/guides/quantity';

export type IngredientGroup = { name: string; items: GuideIngredient[] };
export type CookingStep = { eyebrow: string; title: string; time: string; instruction: string; cue: string };

export const guideStatus = 'Kitchen-test draft: not yet taste-tested or approved for publication.';
export const defaultBatch = 6;
export const supportedBatches = [3, 6, 9, 12] as const;

export const groups: IngredientGroup[] = [
  { name: 'For the silky beans', items: [
    { id: 'beans', name: 'low-sodium pinto beans, drained and rinsed', quantity: 2, unit: '15-oz cans' },
    { id: 'liquid', name: 'water or unsalted stock', quantity: .75, unit: 'cup', note: 'Add more liquid a little at a time if the beans are too thick' },
    { id: 'oil', name: 'avocado oil', quantity: 2, unit: 'tsp' },
    { id: 'onionpowder', name: 'onion powder', quantity: .5, unit: 'tsp' },
    { id: 'garlicpowder', name: 'garlic powder', quantity: .5, unit: 'tsp' },
    { id: 'beancumin', name: 'ground cumin', quantity: .25, unit: 'tsp' },
    { id: 'beanchili', name: 'mild chili powder', quantity: .25, unit: 'tsp' },
    { id: 'acid', name: 'lime juice or mild vinegar', quantity: 1, unit: 'tsp', note: 'Taste and adjust the acidity gradually at the end' },
    { id: 'salt', name: 'salt', note: 'To taste' },
  ]},
  { name: 'For the mild red sauce', items: [
    { id: 'tomato', name: 'no-salt-added plain tomato sauce', quantity: 1, unit: 'cup' },
    { id: 'saucewater', name: 'water', quantity: .5, unit: 'cup' },
    { id: 'saucechili', name: 'mild chili powder', quantity: 1.5, unit: 'tsp' },
    { id: 'saucecumin', name: 'ground cumin', quantity: .5, unit: 'tsp' },
    { id: 'sauceonion', name: 'onion powder', quantity: .5, unit: 'tsp' },
    { id: 'saucegarlic', name: 'garlic powder', quantity: .25, unit: 'tsp' },
    { id: 'paprika', name: 'sweet paprika', quantity: .25, unit: 'tsp' },
    { id: 'vinegar', name: 'white vinegar', quantity: 1, unit: 'tsp', note: 'Up to 2 tsp; add after simmering' },
    { id: 'saucesalt', name: 'salt and optional tiny pinch of sugar', note: 'To taste' },
  ]},
  { name: 'To bring it together', items: [
    { id: 'tortillas', name: 'soft flour tortillas, 9–10 inches', quantity: 6 },
    { id: 'cheddar', name: 'finely shredded cheddar', quantity: .75, unit: 'cup' },
    { id: 'whiteonion', name: 'very finely minced white onion', quantity: 0.333, unit: 'cup' },
  ]},
];

export const steps: CookingStep[] = [
  { eyebrow: '01 / Start with the beans', title: 'Warm them gently.', time: '10–12 min',
    instruction: 'Put the rinsed beans in a saucepan with the measured water or stock, the oil, and all the bean spices. Simmer gently for 10–12 minutes, stirring occasionally.',
    cue: 'The liquid should be hot and the beans should be easy to mash. Do not let the pan cook dry.' },
  { eyebrow: '02 / Find the texture', title: 'Make the beans silky.', time: '2 min',
    instruction: 'Use an immersion blender until completely smooth. Add liquid a little at a time until the beans are loose and spreadable. Finish with lime juice or mild vinegar and salt to taste.',
    cue: 'Our target is the almost impossibly smooth texture of the familiar drive-through burrito. This is not chunky refried beans.' },
  { eyebrow: '03 / Build the red sauce', title: 'Tangy, not smoky.', time: '12–15 min',
    instruction: 'Whisk the tomato sauce, water, chili powder, cumin, onion powder, garlic powder, paprika, and optional pinch of sugar in a small pan. Simmer gently. Remove from heat, then add vinegar and salt to taste.',
    cue: 'Keep this sauce mild and pourable. Avoid smoked paprika: we want tang, not barbecue notes.' },
  { eyebrow: '04 / Assemble', title: 'Keep it beautifully simple.', time: '5 min',
    instruction: 'Warm each tortilla until very flexible. Spoon about ½ cup warm beans into a compact strip, then add 1–2 tablespoons red sauce, 2 tablespoons cheddar, and about 1 tablespoon minced white onion. Fold in the sides and roll snugly.',
    cue: 'The filling should feel generous, but not so full that the tortilla tears. A soft tortilla matters more here than a toasted one.' },
  { eyebrow: '05 / Finish & gather', title: 'Let the tortilla relax.', time: '1 min',
    instruction: 'Place seam-side down and rest under a clean towel for about a minute, or briefly cover in a warm pan. Serve immediately, with extra warm sauce on the side.',
    cue: 'Before changing anything, taste the classic build. It gives us a clear baseline for the next kitchen test.' },
];
