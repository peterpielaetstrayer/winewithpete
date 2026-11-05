import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

// Source-contract tests only: no server, Stripe, Supabase or npm dependency.
// Real runtime integration, payment idempotency and dependency audit remain separate gates.

test('legacy anonymous resend remains disabled', () => {
  const code = source('src/app/api/send-download/route.ts');
  assert.match(code, /export async function POST/);
  assert.match(code, /status:\s*403\b/);
  assert.doesNotMatch(code, /fulfillDigitalOrder|createClient|sendEmail|createSignedUrl/);
});

test('public catalog excludes internal storage paths', () => {
  const code = source('src/app/api/products/route.ts');
  const fields = code.match(/const PUBLIC_PRODUCT_FIELDS\s*=\s*\[([\s\S]*?)\]\.join\(/)?.[1];
  assert.ok(fields, 'public product columns must have a visible allowlist');
  assert.doesNotMatch(fields, /['"]file_path['"]/);
  assert.match(code, /\.select\(PUBLIC_PRODUCT_FIELDS\)/);
});

test('download signing requires completed order', () => {
  const code = source('src/lib/commerce/digital-fulfillment.ts');
  const guard = code.indexOf("if (order.status !== 'completed')");
  const sign = code.indexOf('.createSignedUrl(');
  assert.ok(guard >= 0 && sign > guard, 'completed guard must precede signing');
  assert.match(code, /reason:\s*'Order is not completed'/);
});

test('no silent partial-file fulfillment', () => {
  const code = source('src/lib/commerce/digital-fulfillment.ts');
  assert.match(code, /if\s*\(!product\?\.file_path\)\s*\{/);
  assert.match(code, /reason:\s*'Missing digital file for order item'/);
  assert.match(code, /reason:\s*'Failed to prepare all digital downloads'/);
  const send = code.indexOf('const emailResult = await sendEmail(');
  assert.ok(send > code.indexOf('Missing digital file for order item'));
  assert.ok(send > code.indexOf('Failed to prepare all digital downloads'));
});

test('Stripe webhook verifies signature and payment before fulfillment', () => {
  const code = source('src/app/api/webhooks/stripe/route.ts');
  const verify = code.indexOf('stripe.webhooks.constructEvent(');
  const paid = code.indexOf("session.payment_status !== 'paid'");
  const fulfill = code.indexOf('await fulfillDigitalOrder(');
  assert.ok(verify >= 0 && paid > verify && fulfill > paid);
});
