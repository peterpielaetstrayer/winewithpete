import { expect, test } from '@playwright/test';

test('keyboard visitors can skip the shared navigation on the homepage', async ({ page }) => {
  await page.goto('/');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#site-content$/);
  await expect(page.locator('#site-content')).toBeVisible();
});

test('editorial and utility pages expose exactly one main landmark', async ({ page }) => {
  for (const route of ['/', '/explore', '/join', '/plan', '/guides/better-taco-night/print', '/guides/learn-to-notice-wine', '/guides/learn-to-notice-wine/print', '/rejoin']) {
    await page.goto(route);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveAttribute('id', 'site-content');
  }
});

test('Explore has honest deduplicated content and no mobile overflow', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.getByRole('heading', { name: 'A good evening starts somewhere.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '5 experiences' })).toBeVisible();
  await expect(page.locator('[data-testid="explore-results"] > article')).toHaveCount(5);
  await expect(page.locator('[data-experience-id="giscours-vertical"]')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index, follow/);
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
  await expect(page.locator('[data-testid="explore-results"] > article')).toHaveCount(5);
});

test('task and format filters compose, and empty results can be reset', async ({ page }) => {
  await page.goto('/explore');
  await page.getByRole('button', { name: 'Taste', exact: true }).click();
  await expect(page.locator('[data-testid="explore-results"] > article')).toHaveCount(2);
  await expect(page.locator('[data-experience-id="learn-to-notice-wine"]')).toBeVisible();
  await page.getByText('Format & sort').click();
  await page.getByRole('combobox', { name: 'Filter by format' }).selectOption('recipe');
  await expect(page.getByText('Nothing on this shelf yet.')).toBeVisible();
  await page.getByRole('button', { name: 'See the whole collection' }).click();
  await expect(page.locator('[data-testid="explore-results"] > article')).toHaveCount(5);
  await page.getByRole('combobox', { name: 'Filter by format' }).selectOption('print');
  await expect(page.locator('[data-testid="explore-results"] > article')).toHaveCount(2);
  await expect(page.locator('[data-experience-id="better-taco-night"]')).toBeVisible();
  await expect(page.locator('[data-experience-id="learn-to-notice-wine"]')).toBeVisible();
});

test('visitors can navigate to a real recipe and alternate printed format', async ({ page }) => {
  await page.goto('/explore');
  const taco = page.locator('[data-experience-id="better-taco-night"]');
  await expect(taco.getByRole('link', { name: 'Cook with the guide' })).toHaveAttribute('href', '/guides/better-taco-night');
  await taco.getByRole('link', { name: /Printable recipe/ }).click();
  await expect(page.getByRole('heading', { name: 'The Perfect Bean & Cheese Burrito' })).toBeVisible();
  await expect(page.getByText('Kitchen-test draft.', { exact: true })).toBeVisible();
});

test('Recipes & Guides shelves the available Better Taco Night field guide', async ({ page }) => {
  await page.goto('/recipes');
  await expect(page.getByRole('heading', { name: 'The Better Taco Night' })).toBeVisible();
  await expect(page.getByText('kitchen-test draft, not a finalized recipe', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Cook with the guide' })).toHaveAttribute('href', '/guides/better-taco-night');
  await expect(page.getByRole('link', { name: 'Printable draft' })).toHaveAttribute('href', '/guides/better-taco-night/print');
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

test('approved editorial photos load at real browser widths', async ({ page }) => {
  await page.goto('/explore');
  const keys = [
    'hero-seoul-bowl', 'from-fire', 'wine-table', 'set-table',
    'work-service', 'ingredients', 'fire-wings', 'outside-cheese',
  ];
  for (const key of keys) {
    const photo = page.locator('img[data-editorial-photo="' + key + '"]').first();
    await expect(photo).toHaveAttribute('src', /explore-v03/);
    await photo.scrollIntoViewIfNeeded();
    await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), { timeout: 15_000 }).toBe(true);
  }
});
