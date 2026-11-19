import assert from 'node:assert/strict';
import test from 'node:test';

import { experiences } from '../src/data/explore/experiences.ts';
import { PAGE_SIZE, normalizeSearch, queryExperiences, validateCatalog, visiblePage } from '../src/lib/explore/catalog.ts';

test('catalog has unique verified destinations and one entry per experience', () => {
  assert.deepEqual(validateCatalog(experiences), []);
  assert.equal(experiences.length, 5);
  const wineLesson = experiences.find(item => item.id === 'learn-to-notice-wine');
  assert.equal(wineLesson?.status, 'public');
  assert.ok(wineLesson?.links.every(link => !link.prototype));
  assert.equal(wineLesson?.previewLabel, undefined);
  assert.deepEqual(experiences.find(item => item.id === 'giscours-vertical')?.links, [
    { format: 'story', label: 'Read the table story', href: '/tables/chateau-giscours-vertical' },
  ]);
});

test('accent-agnostic title and flexible keyword search work', () => {
  assert.equal(normalizeSearch(' Château  Giscours '), 'chateau giscours');
  assert.deepEqual(queryExperiences(experiences, { term: 'chateau' }).map(item => item.id), ['giscours-vertical']);
  assert.deepEqual(queryExperiences(experiences, { term: 'red  wine' }).map(item => item.id), ['giscours-vertical']);
  assert.deepEqual(queryExperiences(experiences, { term: 'chipotle wings' }).map(item => item.id), ['chipotle-lime-fire-wings']);
  assert.deepEqual(queryExperiences(experiences, { term: 'notice wine' }).map(item => item.id), ['learn-to-notice-wine']);
  assert.deepEqual(queryExperiences(experiences, { term: 'alien moon' }), []);
});

test('task intentions and delivery formats intersect without duplicating entries', () => {
  assert.deepEqual(queryExperiences(experiences, { intent: 'taste' }).map(item => item.id), ['learn-to-notice-wine', 'giscours-vertical']);
  assert.deepEqual(queryExperiences(experiences, { intent: 'read' }).map(item => item.id), ['giscours-vertical', 'seoul-bowl-table']);
  assert.deepEqual(queryExperiences(experiences, { format: 'print' }).map(item => item.id), ['better-taco-night', 'learn-to-notice-wine']);
  assert.deepEqual(queryExperiences(experiences, { intent: 'gather', format: 'interactive' }).map(item => item.id), ['better-taco-night']);
  assert.deepEqual(queryExperiences(experiences, { intent: 'read', format: 'recipe' }), []);
});

test('A-Z order and pagination preserve predictable browse behavior', () => {
  assert.deepEqual(queryExperiences(experiences, { order: 'az' }).map(item => item.title), [
    'Château Giscours Vertical', 'Chipotle Lime Fire Wings', 'Learn to Notice Wine', 'The Better Taco Night', 'The Seoul Bowl Table',
  ]);
  assert.equal(PAGE_SIZE, 12);
  assert.equal(visiblePage(experiences, 1).length, 5);
});

test('500 generated test records remain filterable, paginated and unique', () => {
  const exemplar = experiences[0];
  const synthetic = Array.from({ length: 500 }, (_, i) => ({
    ...exemplar,
    id: 'simulation-' + String(i).padStart(3, '0'),
    title: 'Simulated Dinner ' + String(i).padStart(3, '0'),
    primaryHref: '/simulation/dinner-' + i,
    links: [{ format: 'interactive', label: 'Test companion', href: '/simulation/dinner-' + i }],
    rank: i,
    tags: ['simulation', i % 2 === 0 ? 'summer' : 'winter'],
    intents: [i % 2 === 0 ? 'cook' : 'read'],
  }));
  assert.deepEqual(validateCatalog(synthetic), []);
  assert.equal(queryExperiences(synthetic, { intent: 'cook' }).length, 250);
  assert.equal(queryExperiences(synthetic, { term: 'winter' }).length, 250);
  const all = queryExperiences(synthetic, { intent: 'all', format: 'all' });
  assert.equal(visiblePage(all, 1).length, 12);
  assert.equal(visiblePage(all, 2).length, 24);
  assert.equal(visiblePage(all, 42).length, 500);
  assert.equal(new Set(all.map(item => item.id)).size, 500);
});

test('integrity checks identify duplicate IDs, paths and unsupported sources', () => {
  const original = experiences[0];
  const issues = validateCatalog([{ ...original, primaryHref: 'https://private.example' }, original, original]);
  assert.ok(issues.some(issue => issue.includes('Nonlocal primary destination')));
  assert.ok(issues.some(issue => issue.includes('Duplicate experience id')));
});
