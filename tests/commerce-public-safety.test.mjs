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

test('bulk campaign email requires a verified allowlisted identity', () => {
  const api = source('src/app/api/campaigns/send/route.ts');
  const admin = source('src/app/admin/page.tsx');
  assert.match(api, /WWP_ADMIN_USER_IDS/);
  assert.match(api, /auth\.getUser\(token\)/);
  assert.match(api, /allowedIds\.has\(user\.id\)/);
  assert.match(api, /status:\s*403\b/);
  assert.ok(api.indexOf('await requireCampaignAdmin(request)') >= 0);
  assert.ok(api.indexOf('await requireCampaignAdmin(request)') < api.indexOf("from('newsletter_subscribers')"));
  assert.ok(api.indexOf('await requireCampaignAdmin(request)') < api.indexOf('Promise.allSettled('));
  assert.match(api, /Tag-targeted campaigns are unavailable/);
  assert.match(admin, /Authorization: `Bearer \$\{session\.access_token\}`/);
});

test('privileged API surfaces require server-authorized administrators', () => {
  const gate = source('src/lib/admin-auth.ts');
  assert.match(gate, /WWP_ADMIN_USER_IDS/);
  assert.match(gate, /auth\.getUser\(token\)/);
  assert.match(gate, /allowedIds\.has\(user\.id\)/);
  for (const name of ['admin/products','admin/orders','admin/essays','printful/catalog','printful/sync']) {
    const api = source('src/app/api/' + name + '/route.ts');
    assert.match(api, /import \{ verifyAdmin \} from '@\/lib\/admin-auth'/);
    assert.match(api, /await verifyAdmin\(request\)/);
    assert.match(api, /status:\s*(401|403)\b/);
    if (name === 'printful/sync') assert.ok(api.indexOf('await verifyAdmin(request)') < api.indexOf('await request.json()'));
    if (name === 'printful/catalog') assert.ok(api.indexOf('await verifyAdmin(request)') < api.indexOf('const apiKey ='));
  }
});

test('new direct digital Stripe checkout is paused before session creation', () => {
  const checkout = source('src/app/api/checkout/route.ts');
  const holdAt = checkout.indexOf("code: 'DIGITAL_CHECKOUT_PAUSED'");
  const stripeAt = checkout.indexOf('stripe.checkout.sessions.create(');
  assert.ok(holdAt >= 0 && holdAt < stripeAt);
  assert.match(checkout, /offer\.kind === 'digital'/);
  assert.match(checkout, /offer\.commerce\.type === 'stripe'/);
  assert.match(checkout, /offer\.commerce\.type === 'legacy_checkout'/);
  const adapter = source('src/lib/commerce/legacy-product-adapter.ts');
  assert.match(adapter, /type: 'legacy_checkout'/);
  assert.match(checkout, /getFulfillmentType\(offer\) === 'digital_download'/);
});

test('Printful requests carry the authenticated admin bearer token', () => {
  const admin = source('src/app/admin/page.tsx');
  for (const p of ['/api/printful/catalog','/api/printful/sync']) {
    const index = admin.indexOf(p);
    assert.ok(index > 0);
    const nearby = admin.slice(index, index + 450);
    assert.match(nearby, /Authorization:/);
    assert.match(nearby, /session\.access_token/);
  }
});

test('guide shelf does not advertise paused first-party purchases', () => {
  const recipes = source('src/app/recipes/page.tsx');
  assert.match(recipes, /Published field recipes are free to read and cook/);
  assert.match(recipes, /direct downloads are temporarily paused/);
  assert.match(recipes, /Download not yet available/);
  assert.match(recipes, /href="\/join"/);
  assert.doesNotMatch(recipes, /handleCheckoutSubmit|selectedProduct|\/api\/checkout|Opening checkout/);
  assert.doesNotMatch(recipes, /Get it/);
});
