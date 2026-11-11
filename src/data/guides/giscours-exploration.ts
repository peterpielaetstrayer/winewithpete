/**
 * Public-domain experiential prompts for a Wine With Pete tasting board.
 * The date and vintage selection already appear in the public Table Archive;
 * this file contains no private notes, unpublished PDF, or invented tasting results.
 */
export const verticalVintages = ['2015', '2016', '2017', '2018'] as const;
export type Vintage = typeof verticalVintages[number];

export const tastingPrompts = [
  { key: 'aroma', title: 'On the nose', guidance: 'What do you notice first? What changes with time?' },
  { key: 'palate', title: 'On the palate', guidance: 'Where does the flavor travel? What lingers?' },
  { key: 'texture', title: 'Structure & texture', guidance: 'Describe the body, acidity, tannin and overall feel in your own words.' },
  { key: 'reflection', title: 'A note worth remembering', guidance: 'Surprises, questions, preferences or the conversation this wine started.' },
] as const;

export type TastingField = typeof tastingPrompts[number]['key'];
export type TastingNotes = Record<TastingField, string>;
export type BoardNotes = Record<Vintage, TastingNotes>;

export function emptyTastingNotes(): TastingNotes {
  return { aroma: '', palate: '', texture: '', reflection: '' };
}
export function emptyBoard(): BoardNotes {
  return {
    '2015': emptyTastingNotes(),
    '2016': emptyTastingNotes(),
    '2017': emptyTastingNotes(),
    '2018': emptyTastingNotes(),
  };
}
