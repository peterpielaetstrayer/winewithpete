import { expect, test } from '@playwright/test';

const guide = '/guides/better-taco-night';

test('story, chapter navigation and responsive layout work', async ({ page }) => {
  await page.goto(guide);
  await expect(page.getByRole('heading', { name: 'The Better Taco Night.' })).toBeVisible();
  await expect(page.getByText('Not yet kitchen-tested')).toBeVisible();
  await page.getByRole('button', { name: 'Start with the ingredients' }).click();
  await expect(page.getByRole('heading', { name: 'A good night begins before the stove.' })).toBeVisible();
  const width = await page.evaluate(() => ({ viewport: window.innerWidth, page: document.documentElement.scrollWidth }));
  expect(width.page).toBeLessThanOrEqual(width.viewport + 2);
});

test('all four supported batch sizes scale ingredients correctly', async ({ page }) => {
  await page.goto(guide);
  await page.getByRole('button', { name: 'Ingredients', exact: true }).click();
  await expect(page.getByText('2 15-oz cans low-sodium pinto beans, drained and rinsed')).toBeVisible();

  await page.getByRole('button', { name: 'Make fewer burritos' }).click();
  await expect(page.getByText('1 15-oz can low-sodium pinto beans, drained and rinsed')).toBeVisible();
  await expect(page.getByText('⅙ cup very finely minced white onion')).toBeVisible();

  await page.getByRole('button', { name: 'Make more burritos' }).click();
  await expect(page.getByText('2 15-oz cans low-sodium pinto beans, drained and rinsed')).toBeVisible();

  await page.getByRole('button', { name: 'Make more burritos' }).click();
  await expect(page.getByText('3 15-oz cans low-sodium pinto beans, drained and rinsed')).toBeVisible();

  await page.getByRole('button', { name: 'Make more burritos' }).click();
  await expect(page.getByText('4 15-oz cans low-sodium pinto beans, drained and rinsed')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Make more burritos' })).toBeDisabled();
});

test('checkboxes, serving size and cooking step survive reload', async ({ page }) => {
  await page.goto(guide);
  await page.getByRole('button', { name: 'Ingredients', exact: true }).click();
  await page.getByRole('checkbox').first().check();
  await page.getByRole('button', { name: 'Make fewer burritos' }).click();
  await page.getByRole('button', { name: 'Cook', exact: true }).click();
  await page.getByRole('button', { name: 'Next step' }).click();
  await expect(page.getByRole('heading', { name: 'Make the beans silky.' })).toBeVisible();

  await page.reload();
  await page.getByRole('button', { name: 'Ingredients', exact: true }).click();
  await expect(page.getByRole('checkbox').first()).toBeChecked();
  await expect(page.getByText('1 15-oz can low-sodium pinto beans, drained and rinsed')).toBeVisible();
  await page.getByRole('button', { name: 'Cook', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Make the beans silky.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Go to step 2' })).toHaveAttribute('aria-current', 'step');
  const size = await page.getByRole('button', { name: 'Go to step 2' }).evaluate(el => el.getBoundingClientRect().height);
  expect(size).toBeGreaterThanOrEqual(44);
});

test('clipboard refusal is handled without blocking shopping list', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => { throw new Error('Clipboard denied by test'); } },
    });
  });
  await page.goto(guide);
  await page.getByRole('button', { name: 'Ingredients', exact: true }).click();
  await page.getByRole('button', { name: 'Copy shopping list' }).click();
  await expect(page.getByRole('status')).toContainText('Clipboard unavailable');
  await expect(page.getByText('For the silky beans')).toBeVisible();
});

test('table reflection stays on this browser after reload', async ({ page }) => {
  await page.goto(guide);
  await page.getByRole('button', { name: 'The Table', exact: true }).click();
  await page.getByRole('textbox', { name: 'What do you want to remember?' }).fill('Dinner with a friend; the sauce was mild.');
  await page.getByRole('button', { name: 'Save on this device' }).click();
  await expect(page.getByRole('status')).toContainText('Saved locally');
  await page.reload();
  await page.getByRole('button', { name: 'The Table', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'What do you want to remember?' })).toHaveValue('Dinner with a friend; the sauce was mild.');
});

test('print edition uses same recipe quantities and never indexes the draft', async ({ page }) => {
  await page.goto(guide);
  await page.getByRole('link', { name: 'Printable recipe' }).click();
  await expect(page.getByRole('heading', { name: 'The Perfect Bean & Cheese Burrito' })).toBeVisible();
  await expect(page.getByText('2 15-oz cans low-sodium pinto beans, drained and rinsed')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

  await page.goto(guide + '/print?servings=3');
  await expect(page.getByText('1 15-oz can low-sodium pinto beans, drained and rinsed')).toBeVisible();
  await expect(page.getByText('⅙ cup very finely minced white onion')).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.wwp-print-controls')).toBeHidden();
});
