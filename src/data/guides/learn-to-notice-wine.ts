/** A short, beginner-friendly sensory exercise. No prescribed tasting notes. */
export const wineNoticingChapters = [
  { id: 'begin', label: 'Begin', minutes: '1 minute' },
  { id: 'notice', label: 'Notice', minutes: '3 minutes' },
  { id: 'name', label: 'Find words', minutes: '2 minutes' },
  { id: 'return', label: 'Return', minutes: '3 minutes' },
  { id: 'keep', label: 'Keep', minutes: '2 minutes' },
] as const;

export type WineNoticingChapter = (typeof wineNoticingChapters)[number]['id'];

export type WineNoticingNote = {
  drink: string;
  appearance: string;
  aroma: string;
  taste: string;
  association: string;
  secondLook: string;
  invitation: string;
};

export const blankWineNoticingNote: WineNoticingNote = {
  drink: '',
  appearance: '',
  aroma: '',
  taste: '',
  association: '',
  secondLook: '',
  invitation: '',
};

export const wineNoticingFields: { key: keyof WineNoticingNote; label: string }[] = [
  { key: 'drink', label: 'What I chose' },
  { key: 'appearance', label: 'What I saw' },
  { key: 'aroma', label: 'What I smelled' },
  { key: 'taste', label: 'What I tasted or felt' },
  { key: 'association', label: 'What it reminded me of' },
  { key: 'secondLook', label: 'What changed when I returned' },
  { key: 'invitation', label: 'A question to bring to the table' },
];

export function wineNoticingNoteText(note: WineNoticingNote): string {
  return [
    'Wine With Pete · Learn to Notice Wine',
    'A personal tasting note — no right answers',
    '',
    ...wineNoticingFields.map(({ key, label }) => `${label}: ${note[key].trim() || '—'}`),
    '',
    'Food is part of it. The table is the point.',
  ].join('\n');
}
