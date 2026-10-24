import { expect, test } from '@playwright/test';

const archive = '/tables/chateau-giscours-vertical';
const board = archive + '/board';

test('original table archive remains editorial, with optional board access', async ({ page }) => {
  await page.goto(archive);
  await expect(page.getByRole('heading', { name: 'Château Giscours Vertical' })).toBeVisible();
  await page.getByRole('link', { name: /Open the optional Exploration Board/ }).click();
  await expect(page.getByRole('heading', { name: 'Four vintages. One conversation.' })).toBeVisible();
  await expect(page.getByText('No scores to match')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  const dimensions = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 2);
});

test('two vintage observations remain separate and survive refresh', async ({ page }) => {
  await page.goto(board);
  await page.getByRole('button', { name: '2015' }).click();
  await page.locator('textarea').first().fill('Black fruit, then a floral impression.');
  await page.getByRole('button', { name: '2016' }).click();
  await page.locator('textarea').first().fill('Different nose; brighter fruit.');
  await page.getByRole('button', { name: 'Compare', exact: true }).click();
  await expect(page.getByText('Black fruit, then a floral impression.')).toBeVisible();
  await expect(page.getByText('Different nose; brighter fruit.')).toBeVisible();

  await page.reload();
  await page.getByRole('button', { name: 'Compare', exact: true }).click();
  await expect(page.getByText('Black fruit, then a floral impression.')).toBeVisible();
  await expect(page.getByText('Different nose; brighter fruit.')).toBeVisible();
});

test('blank printed worksheet does not copy private browser notes', async ({ page }) => {
  await page.goto(board);
  await page.locator('textarea').first().fill('Private note that belongs only in this browser.');
  await page.getByRole('link', { name: /Print a blank tasting board/ }).click();
  await expect(page.getByRole('heading', { name: 'Four vintages. One conversation.' })).toBeVisible();
  await expect(page.getByText('Private note that belongs only in this browser.')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.wwp-board-print-controls')).toBeHidden();
});
