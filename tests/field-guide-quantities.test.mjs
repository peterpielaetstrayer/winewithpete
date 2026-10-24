import test from 'node:test';
import assert from 'node:assert/strict';
import { formatAmount, ingredientText } from '../src/lib/guides/quantity.ts';

test('friendly units preserve common fractions', () => {
  assert.equal(formatAmount(0.125), '⅛');
  assert.equal(formatAmount(0.25), '¼');
  assert.equal(formatAmount(0.333), '⅓');
  assert.equal(formatAmount(1.5), '1 ½');
  assert.equal(formatAmount(2), '2');
  assert.equal(formatAmount(1.125), '1 ⅛');
});

test('pinto-bean can singular / plural at supported batch sizes', () => {
  const beans = { id: 'beans', name: 'low-sodium pinto beans', unit: '15-oz cans', quantity: 2 };
  assert.equal(ingredientText(beans, 3), '1 15-oz can low-sodium pinto beans');
  assert.equal(ingredientText(beans, 6), '2 15-oz cans low-sodium pinto beans');
  assert.equal(ingredientText(beans, 9), '3 15-oz cans low-sodium pinto beans');
  assert.equal(ingredientText(beans, 12), '4 15-oz cans low-sodium pinto beans');
});

test('fractional cups scale accurately and pluralize appropriately', () => {
  const cheese = { id: 'cheese', name: 'finely shredded cheddar', unit: 'cup', quantity: .75 };
  assert.equal(ingredientText(cheese, 3), '⅜ cup finely shredded cheddar');
  assert.equal(ingredientText(cheese, 6), '¾ cup finely shredded cheddar');
  assert.equal(ingredientText(cheese, 9), '1 ⅛ cups finely shredded cheddar');
  assert.equal(ingredientText(cheese, 12), '1 ½ cups finely shredded cheddar');
});

test('white onion scales from a third cup to a sixth without decimals', () => {
  const onion = { id: 'onion', name: 'minced white onion', unit: 'cup', quantity: .333 };
  assert.equal(ingredientText(onion, 3), '⅙ cup minced white onion');
  assert.equal(ingredientText(onion, 6), '⅓ cup minced white onion');
  assert.equal(ingredientText(onion, 9), '½ cup minced white onion');
  assert.equal(ingredientText(onion, 12), '⅔ cup minced white onion');
});

test('season-to-taste ingredients retain their instruction', () => {
  assert.equal(ingredientText({ id: 'salt', name: 'salt to taste' }, 12), 'salt to taste');
});
