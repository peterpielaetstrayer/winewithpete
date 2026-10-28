import { expect, test } from '@playwright/test';

test('Explore has honest deduplicated content and no mobile overflow', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.getByRole('heading', { name: 'A good evening starts somewhere.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '4 experiences' })).toBeVisible();
  await expect(page.locator('[data-testid="explore-results"] > article')).toHaveCount(4);
  await expect(page.locator('[data-experience-id="giscours-vertical"]')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  const width = await page.evaluate(() => ({ screen: window.innerWidth, actual: document.documentElement.scrollWidth }));
  expect(width.actual).toBeLessThanOrEqual(width.screen + 2);
});

test('search ignores accents and clear action restores catalog', async ({ page }) => {
  await page.goto('/explore');
  await page.getByRole('searchbox', { name: 'Search the collection' }).fill('chateau');
  await expect(page.getByRole('heading', { name: '1 experience' })).toBeVisible();
  await expect(page.locator('[data-experience-id="giscours-vertical"]')).toBeVisible();
  await expect(page.locator('[data-experience-id="better-taco-night"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.locator('[data-testid="explore-results"] > article')).toHaveCount(4);
});

test('task and format filters compose, and empty results can be reset', async ({ page }) => {
  await page.goto('/explore');
  await page.getByRole('button', { name: /^Taste/ }).click();
  await expect(page.locator('[data-testid="explore-results"] > article')).toHaveCount(1);
  await page.getByRole('combobox', { name: 'Filter by format' }).selectOption('recipe');
  await expect(page.getByText('Nothing on this shelf yet.')).toBeVisible();
  await page.getByRole('button', { name: 'See the whole collection' }).click();
  await expect(page.locator('[data-testid="explore-results"] > article')).toHaveCount(4);
  await page.getByRole('combobox', { name: 'Filter by format' }).selectOption('print');
  await expect(page.locator('[data-testid="explore-results"] > article')).toHaveCount(2);
});

test('visitors can navigate to a real recipe and alternate printed format', async ({ page }) => {
  await page.goto('/explore');
  const taco = page.locator('[data-experience-id="better-taco-night"]');
  await expect(taco.getByRole('link', { name: 'Cook with the guide' })).toHaveAttribute('href', '/guides/better-taco-night');
  await taco.getByRole('link', { name: /Printable recipe/ }).click();
  await expect(page.getByRole('heading', { name: 'The Perfect Bean & Cheese Burrito' })).toBeVisible();
  await expect(page.getByText('Kitchen-test draft.', { exact: true })).toBeVisible();
});

test('Explore is reachable from the navigation without removing Journal', async ({ page, isMobile }) => {
  await page.goto('/journal');
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Explore' }).click();
  } else {
    await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Explore' }).click();
  }
  await expect(page).toHaveURL(/\/explore$/);
  await expect(page.getByRole('heading', { name: 'A good evening starts somewhere.' })).toBeVisible();
});

test('photographic v0.3 keeps public-safe image fallback and editorial wayfinding', async ({ page }) => {
  const missingImages: string[] = [];
  page.on('request', req => {
    if (req.url().includes('/images/explore-v03/')) missingImages.push(req.url());
  });
  await page.goto('/explore');
  await expect(page.locator('[data-explore-design="photographic-v03"]')).toHaveAttribute('data-photo-mode', 'public-safe-fallbacks');
  await expect(page.getByRole('heading', { name: /Food is part of it/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Before the first guest arrives.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Explore Taste' })).toBeVisible();
  expect(missingImages).toEqual([]);
});

test('photographic lane filters the original catalog without duplicates', async ({ page }) => {
  await page.goto('/explore');
  await page.getByRole('button', { name: 'Explore Taste' }).click();
  await expect(page.getByRole('heading', { name: '1 experience' })).toBeVisible();
  await expect(page.locator('[data-testid="explore-results"] > article')).toHaveCount(1);
  await expect(page.locator('[data-experience-id="giscours-vertical"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Everything' }).click();
  await expect(page.locator('[data-testid="explore-results"] > article')).toHaveCount(4);
});
