import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

const primaryPages = [
  'src/app/page.tsx',
  'src/app/about/page.tsx',
  'src/app/journal/page.tsx',
  'src/app/gather/page.tsx',
  'src/app/gatherings/page.tsx',
  'src/app/gatherings/taino-fire-table/page.tsx',
  'src/app/signature-table/page.tsx',
  'src/app/plan/page.tsx',
  'src/app/tables/page.tsx',
  'src/app/recipes/[slug]/page.tsx',
];

test('primary editorial surfaces do not portray legacy illustrated scenes as real gatherings', () => {
  for (const path of primaryPages) {
    const source = read(path);
    assert.doesNotMatch(source, /events-community-gathering\.png\.png|about-pete-beach-fire\.png\.png|hero-campfire\.png\.png/, path);
  }
});

test('sitewide photographic paths reuse approved public derivatives, not private originals', () => {
  for (const path of primaryPages) {
    const source = read(path);
    const photos = [...source.matchAll(/\/images\/explore-v03\/([\w-]+\.webp)/g)];
    for (const [, filename] of photos) {
      assert.ok(existsSync(resolve(root, 'public/images/explore-v03', filename)), `${path}: ${filename} missing`);
    }
  }
});

test('homepage opens the existing free Explore catalog from its hero and entryways', () => {
  const home = read('src/app/page.tsx');
  assert.match(home, /eyebrow: 'Explore'/);
  assert.match(home, /href: '\/explore'/);
  assert.match(home, /href="\/explore"/);
});

test('shared header has a legible home scrim and visible keyboard access', () => {
  const header = read('src/components/site-header.tsx');
  const layout = read('src/app/layout.tsx');
  assert.match(header, /bg-black\/60/);
  assert.match(header, /text-\[#ffd4b6\]/);
  assert.match(header, /focus-visible:outline-2/);
  assert.match(layout, /Skip to content/);
  assert.match(layout, /href="#site-content"/);
  assert.match(layout, /id="site-content" tabIndex=\{-1\}/);
});

test('root layout owns the only main landmark across every page and state', () => {
  const layout = read('src/app/layout.tsx');
  assert.equal([...layout.matchAll(/<main\b/g)].length, 1);
  assert.match(layout, /<main id="site-content" tabIndex=\{-1\} className="flex-1">\{children\}<\/main>/);

  const collectTsx = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectTsx(path) : entry.name.endsWith('.tsx') ? [path] : [];
  });

  for (const absolutePath of collectTsx(resolve(root, 'src/app'))) {
    const path = relative(root, absolutePath);
    if (path === 'src/app/layout.tsx') continue;
    assert.doesNotMatch(read(path), /<\/?main\b/i, `${path}: nested main landmark`);
  }
});

test('Table Archive uses event-specific verified photographs without inventing Knife & Fire photos', () => {
  const archive = read('src/app/tables/page.tsx');
  assert.match(archive, /giscours-bottles-menu\.webp/);
  assert.match(archive, /hero-seoul-bowl\.webp/);
  assert.match(archive, /title: 'Knife & Fire'[\s\S]*?image: null/);
});

test('store never shows simulated products as purchasable inventory', () => {
  const store = read('src/app/store/page.tsx');
  assert.doesNotMatch(store, /placeholderProducts|Wine Bear T-Shirt|Wine Bear Cap|\/api\/checkout|Add to Cart/);
  assert.match(store, /Nothing for sale here today/);
  assert.match(store, /The merchandise shop is not open yet/);
});

test('legacy Start landing page does not send visitors to unavailable checkout', () => {
  const start = read('src/app/start/start-page-content.tsx');
  assert.doesNotMatch(start, /Shop Merch|Get It|Browse all merch|\/api\/checkout/);
  assert.match(start, /The merchandise shop is not open yet/);
  assert.doesNotMatch(start, /Featured recipes coming soon|Featured essay coming soon/);
});

test('unused ConvertKit endpoint never reports a fictitious subscription', () => {
  const route = read('src/app/api/convertkit/subscribe/route.ts');
  assert.doesNotMatch(route, /success:\s*true|placeholder-api-key|api\.convertkit\.com/);
  assert.match(route, /status:\s*410/);
});

test('future Taíno concept imagery is not described as a documented event', () => {
  const concept = read('src/app/gatherings/taino-fire-table/page.tsx');
  const listing = read('src/app/gatherings/page.tsx');
  assert.match(concept, /This table is a concept in development/);
  assert.match(listing, /Table in development/);
  assert.match(listing, /not a scheduled or bookable event/);
  assert.match(listing, /Explore the idea/);
  assert.doesNotMatch(listing, /Featured Table/);
});

test('completed table stories invite readers to gather without losing the story trail', () => {
  for (const path of ['src/app/tables/chateau-giscours-vertical/page.tsx', 'src/app/tables/seoul-bowl-table/page.tsx']) {
    const story = read(path);
    assert.match(story, /href="\/gather"/);
    assert.match(story, /Explore ways to gather/);
  }
  assert.match(read('src/app/tables/chateau-giscours-vertical/page.tsx'), /href="\/tables\/seoul-bowl-table"/);
  assert.match(read('src/app/tables/seoul-bowl-table/page.tsx'), /href="\/tables\/chateau-giscours-vertical"/);
});

test('gathering interest does not silently become newsletter consent', () => {
  const handler = read('src/app/api/gatherings/interest/route.ts');
  const conceptForm = read('src/app/gatherings/taino-fire-table/taino-fire-table-interest-form.tsx');
  assert.match(handler, /newsletterOptIn: payload\.newsletterOptIn \?\? false/);
  assert.match(conceptForm, /newsletterOptIn: false/);
});

test('the admin link-preview fetcher is gated and does not allow local URL fetching', () => {
  const handler = read('src/app/api/og-metadata/route.ts');
  const admin = read('src/app/admin/page.tsx');
  assert.match(handler, /await verifyAdmin\(request\)/);
  assert.match(handler, /targetUrl\.protocol !== 'https:'/);
  assert.match(handler, /redirect: 'error'/);
  assert.match(admin, /Authorization.*Bearer/);
});
