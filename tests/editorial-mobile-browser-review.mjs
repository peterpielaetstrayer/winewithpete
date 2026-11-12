import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const base = process.env.WWP_REVIEW_BASE_URL || 'http://127.0.0.1:3109';
const browser = await chromium.launch({ headless: true });
const viewports = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'desktop', width: 1366, height: 900 },
];

await mkdir('review-screenshots', { recursive: true });

try {
  for (const size of viewports) {
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin === base) return route.continue();
      return route.abort();
    });

    await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await expect(page.getByRole('heading', { level: 1, name: /Rebuilding the table/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Start exploring/i })).toBeVisible();
    await expect(page.locator('#begin a[href="/journal"]')).toHaveCount(1);
    await expect(page.locator('#begin a[href="/recipes"]')).toHaveCount(1);
    await expect(page.locator('#begin a[href="/tables"]')).toHaveCount(1);
    await expect(page.locator('header a[href="/explore"]')).toHaveCount(size.name === 'phone' ? 0 : 1);

    if (size.name === 'phone') {
      await page.getByRole('button', { name: 'Open menu' }).click();
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Explore' })).toBeVisible();
      await page.getByRole('button', { name: 'Close menu' }).click();
    }

    const discoveryPrecedesThesis = await page.locator('#begin').evaluate((el) =>
      el.nextElementSibling?.textContent?.includes('Why the table') ?? false
    );
    if (!discoveryPrecedesThesis) {
      throw new Error(size.name + ': Read/Make/Remember must appear immediately after the hero');
    }
    await loadImagesForScreenshot(page);
    await checkOverflow(page, size.name + ' homepage');
    await page.screenshot({ path: 'review-screenshots/wwp-home-' + size.name + '.png', fullPage: true });

    await page.goto(base + '/explore', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await expect(page.getByRole('heading', { level: 1, name: 'A good evening starts somewhere.' })).toBeVisible();
    await expect(page.locator('[data-experience-id]')).toHaveCount(4);
    if (await page.getByRole('main').count() !== 1) {
      throw new Error(size.name + ': Explore must use exactly one main landmark');
    }
    await checkOverflow(page, size.name + ' Explore');
    await page.screenshot({ path: 'review-screenshots/wwp-explore-' + size.name + '.png', fullPage: true });

    await page.goto(base + '/recipes/chipotle-lime-fire-wings', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await expect(page.getByRole('heading', { level: 1, name: 'Chipotle Lime Fire Wings' })).toBeVisible();
    if (await page.getByRole('main').count() !== 1) {
      throw new Error(size.name + ': recipe must use exactly one main landmark');
    }

    await expect(page.getByText('375–425°F', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Print recipe' })).toBeVisible();
    await page.getByRole('link', { name: 'View ingredients' }).click();
    await expect(page).toHaveURL(/#ingredients$/);
    await expect(page.locator('#ingredients')).toBeVisible();
    await page.getByRole('link', { name: /Jump to method/i }).click();
    await expect(page).toHaveURL(/#method$/);
    await expect(page.locator('#method')).toBeVisible();
    await expect(page.getByText('4 pounds chicken wings, split into flats and drums')).toBeVisible();
    const ingredientFont = await page.locator('#ingredients li').first().evaluate(
      el => parseFloat(getComputedStyle(el).fontSize)
    );
    if (ingredientFont < 16) {
      throw new Error(size.name + ': ingredient font too small (' + ingredientFont + 'px)');
    }

    await loadImagesForScreenshot(page);
    await checkOverflow(page, size.name + ' recipe');
    await page.screenshot({ path: 'review-screenshots/wwp-recipe-' + size.name + '.png', fullPage: true });
    await page.emulateMedia({ media: 'print' });
    const heroDisplay = await page.locator('.wwp-recipe-print .wwp-print-hide').first().evaluate(
      el => getComputedStyle(el).display
    );
    if (heroDisplay !== 'none') {
      throw new Error(size.name + ': dark recipe hero was not hidden in print view');
    }
    await expect(page.getByRole('heading', { level: 1, name: 'Chipotle Lime Fire Wings' })).toBeVisible();
    console.log(size.name + ': homepage and recipe UI, anchors, print and overflow passed');
    await context.close();
  }
} finally {
  await browser.close();
}

async function checkOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    pageWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  if (overflow.pageWidth > overflow.viewportWidth + 2) {
    throw new Error(label + ' horizontal overflow: ' + JSON.stringify(overflow));
  }
}

async function loadImagesForScreenshot(page) {
  const images = page.locator('img');
  const count = await images.count();
  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    if (!(await img.isVisible())) continue;
    await img.scrollIntoViewIfNeeded({ timeout: 5000 });
    await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0), { timeout: 7000 }).toBeTruthy();
  }
}
