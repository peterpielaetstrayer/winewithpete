import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const experience = join(root, 'public/experiences/set-a-table');
const html = readFileSync(join(experience, 'index.html'), 'utf8');
const css = readFileSync(join(experience, 'styles.css'), 'utf8');
const js = readFileSync(join(experience, 'app.js'), 'utf8');
const config = readFileSync(join(root, 'next.config.ts'), 'utf8');

test('the public gathering experience is discoverable at a clean Explore route', () => {
  assert.match(config, /source: '\/guides\/set-a-table'/);
  assert.match(config, /destination: '\/experiences\/set-a-table\/index\.html'/);
  assert.match(html, /href="\/explore"/);
  assert.doesNotMatch(html, /PRIVATE PROTOTYPE|private preview|noindex,nofollow/i);
  assert.match(html, /rel="canonical" href="https:\/\/winewithpete\.me\/guides\/set-a-table"/);
});

test('all five movements and output actions remain in the shipped experience', () => {
  for (let n = 0; n < 5; n++) assert.match(html, new RegExp(`data-step="${n}"`));
  assert.match(html, /id="score-preview"/);
  assert.match(html, /data-download/);
  assert.match(html, /data-print/);
  assert.match(js, /localStorage\.setItem/);
  assert.match(js, /localStorage\.removeItem/);
});

test('every referenced local script, stylesheet and photo is present', () => {
  const references = [...html.matchAll(/(?:src|href)="(\/(?:experiences\/set-a-table|images\/explore-v03)\/[^"#]+)"/g)]
    .map(match => match[1]);
  const cssPhoto = css.match(/url\('([^']+\.webp)'\)/)?.[1];
  if (cssPhoto) references.push(cssPhoto);
  assert.ok(references.length >= 6);
  for (const reference of references) assert.ok(existsSync(join(root, 'public', reference)), `Missing ${reference}`);
});
