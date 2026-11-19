import assert from 'node:assert/strict';
import test from 'node:test';

import {
  blankWineNoticingNote, wineNoticingChapters, wineNoticingFields, wineNoticingNoteText,
} from '../src/data/guides/learn-to-notice-wine.ts';

test('beginner exercise has five distinct navigable stages', () => {
  assert.deepEqual(wineNoticingChapters.map(chapter => chapter.id), ['begin', 'notice', 'name', 'return', 'keep']);
  assert.equal(new Set(wineNoticingChapters.map(chapter => chapter.id)).size, wineNoticingChapters.length);
});

test('all reflection prompts are represented in the optional, copyable note', () => {
  assert.deepEqual(wineNoticingFields.map(field => field.key), Object.keys(blankWineNoticingNote));
  const note = wineNoticingNoteText({ ...blankWineNoticingNote, aroma: 'Orange peel in the kitchen.' });
  assert.match(note, /What I smelled: Orange peel in the kitchen\./);
  assert.match(note, /What I tasted or felt: —/);
  assert.match(note, /no right answers/i);
});
