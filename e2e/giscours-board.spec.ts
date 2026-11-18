import { expect, test } from '@playwright/test';

const archive = '/tables/chateau-giscours-vertical';

test('Giscours remains an editorial table story after board retirement', async ({ page }) => {
  await page.goto(archive);
  await expect(page.getByRole('heading', { name: 'Château Giscours Vertical' })).toBeVisible();
  await expect(page.getByText('Red Wine Exploration Board No. 01', { exact: false })).toBeVisible();
  await expect(page.getByText('Mushroom toast')).toBeVisible();
  await expect(page.getByText('Chocolate tart', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Read the table note/ })).toHaveAttribute('href', '/tables/seoul-bowl-table');
  const dimensions = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 2);
});

test('retired interactive and print board URLs redirect to the canonical story', async ({ page }) => {
  for (const obsolete of [archive + '/board', archive + '/board/print']) {
    await page.goto(obsolete);
    await expect(page).toHaveURL(new RegExp(archive + '/?$'));
    await expect(page.getByRole('heading', { name: 'Château Giscours Vertical' })).toBeVisible();
  }
});

test('Giscours public story photographs load', async ({ page }) => {
  await page.goto(archive);
  const photos = page.locator('main img');
  await expect(photos).toHaveCount(4);
  for (const photo of await photos.all()) {
    await photo.scrollIntoViewIfNeeded();
    await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
});
