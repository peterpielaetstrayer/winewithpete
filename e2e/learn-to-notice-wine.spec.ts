import { expect, test } from '@playwright/test';

const lesson = '/guides/learn-to-notice-wine';

test('beginner can make a personal note without buying wine or signing in', async ({ page }) => {
  await page.goto(lesson);
  await expect(page.getByRole('heading', { name: /Learn to notice wine/i })).toBeVisible();
  await expect(page.getByText(/Wine is optional/)).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

  await page.getByRole('textbox', { name: 'What are you tasting?' }).fill('Warm rooibos tea');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('textbox', { name: 'What does it smell like to you?' }).fill('Orange peel');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('textbox', { name: 'What does this remind you of?' }).fill('The kitchen at home');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('textbox', { name: 'What changed? What stayed?' }).fill('Softer on the second smell');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByText('Warm rooibos tea', { exact: true })).toBeVisible();
  await expect(page.getByText('The kitchen at home', { exact: true })).toBeVisible();
  await expect(page.getByText(/It is not sent to Wine With Pete/)).toBeVisible();

  await page.getByRole('button', { name: 'Save on this device' }).click();
  await expect(page.getByRole('status')).toContainText('Saved in this browser only');
  await page.reload();
  await page.getByRole('button', { name: 'Keep' }).click();
  await expect(page.getByText('The kitchen at home', { exact: true })).toBeVisible();
});

test('print card is accessible without entering notes and fits at phone width', async ({ page }) => {
  await page.goto(lesson);
  const width = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  expect(width.document).toBeLessThanOrEqual(width.viewport + 2);
  await page.getByRole('button', { name: 'Keep' }).click();
  await page.getByRole('link', { name: 'Blank printable card' }).click();
  await expect(page.getByRole('heading', { name: 'Learn to Notice Wine' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What I smelled' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.wwp-noticing-print-controls')).toBeHidden();
});
