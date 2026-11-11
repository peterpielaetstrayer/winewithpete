/**
 * Wine With Pete Explore · curated content manifest.
 *
 * One record per experience, with multiple ways of using it underneath.
 * Entries must have an existing, verifiable primary route in the repo.
 * Internal source PDFs, gated members-only artifacts and hypothetical work are excluded.
 */
export type Intent = 'cook' | 'taste' | 'gather' | 'read';
export type Format = 'recipe' | 'interactive' | 'print' | 'story';
export type PublicationStatus = 'public' | 'prototype';

export type ExperienceLink = {
  format: Format;
  label: string;
  href: string;
  prototype?: boolean;
};

export type Experience = {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  note: string;
  intents: readonly Intent[];
  tags: readonly string[];
  links: readonly ExperienceLink[];
  primaryHref: string;
  status: PublicationStatus;
  minutes?: number;
  spotlight?: string;
  rank: number;
};

export const experiences: readonly Experience[] = [
  {
    id: 'better-taco-night',
    title: 'The Better Taco Night',
    eyebrow: 'Cravings, Rebuilt · No. 01',
    summary: 'Build a silky bean-and-cheese burrito, from shopping list to the shared table.',
    note: 'Kitchen-test draft. Recipe and photography are not yet final.',
    intents: ['cook', 'gather'],
    tags: ['burrito', 'bean', 'cheese', 'taco night', 'weeknight', 'comfort food', 'quick'],
    links: [
      { format: 'interactive', label: 'Cook with the guide', href: '/guides/better-taco-night', prototype: true },
      { format: 'print', label: 'Printable recipe', href: '/guides/better-taco-night/print', prototype: true },
    ],
    primaryHref: '/guides/better-taco-night',
    status: 'prototype',
    minutes: 35,
    spotlight: '01',
    rank: 1,
  },
  {
    id: 'chipotle-lime-fire-wings',
    title: 'Chipotle Lime Fire Wings',
    eyebrow: 'Field recipe · From the fire',
    summary: 'Smoke, lime, chipotle and cilantro. A recipe built for summer tables and eating with your hands.',
    note: 'Existing public field recipe.',
    intents: ['cook', 'gather'],
    tags: ['wings', 'fire', 'grill', 'chicken', 'outdoors', 'summer', 'chipotle'],
    links: [
      { format: 'recipe', label: 'Cook the recipe', href: '/recipes/chipotle-lime-fire-wings' },
    ],
    primaryHref: '/recipes/chipotle-lime-fire-wings',
    status: 'public',
    rank: 2,
  },
  {
    id: 'giscours-vertical',
    title: 'Château Giscours Vertical',
    eyebrow: 'Table archive · May 2026',
    summary: 'Four vintages, one table, and an evening designed to make room for shared observation.',
    note: 'Historical table story. An optional tasting board is an experimental companion, not the main experience.',
    intents: ['taste', 'gather', 'read'],
    tags: ['wine', 'vertical', 'tasting', 'red wine', 'Bordeaux', 'Margaux', '2015', '2016', '2017', '2018'],
    links: [
      { format: 'story', label: 'Read the table story', href: '/tables/chateau-giscours-vertical' },
      { format: 'interactive', label: 'Optional tasting board', href: '/tables/chateau-giscours-vertical/board', prototype: true },
      { format: 'print', label: 'Blank tasting sheet', href: '/tables/chateau-giscours-vertical/board/print', prototype: true },
    ],
    primaryHref: '/tables/chateau-giscours-vertical',
    status: 'public',
    spotlight: '2015—18',
    rank: 3,
  },
  {
    id: 'seoul-bowl-table',
    title: 'The Seoul Bowl Table',
    eyebrow: 'Table archive · June 2026',
    summary: 'Korean barbecue bowls, four sauces, and what happened when everyone helped build the meal.',
    note: 'Historical table story. There is no standalone cooking guide for this dinner yet.',
    intents: ['gather', 'read'],
    tags: ['Korean', 'barbecue', 'bowls', 'sauces', 'hosting', 'choice', 'table'],
    links: [
      { format: 'story', label: 'Read the table story', href: '/tables/seoul-bowl-table' },
    ],
    primaryHref: '/tables/seoul-bowl-table',
    status: 'public',
    rank: 4,
  },
];
