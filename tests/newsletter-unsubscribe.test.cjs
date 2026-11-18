'use strict';
/* eslint-disable @typescript-eslint/no-require-imports */

// Hermetic subscriber-lifecycle tests. No live Supabase, Resend or Kit calls.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const test = require('node:test');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const subscriberId = 'e7c66f57-b50a-4f71-9806-cb2e868d5244';
const signingEnv = { SUPABASE_SERVICE_ROLE_KEY: 'test-only-service-role-secret' };

function load(relativePath, services = {}, env = {}) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(output, {
    module: mod,
    exports: mod.exports,
    require(name) {
      if (name === 'node:crypto') return crypto;
      assert.ok(Object.hasOwn(services, name), `Unexpected import: ${name}`);
      return services[name];
    },
    process: { env: Object.freeze({ ...env }) },
    Buffer,
    URL,
    console: { log() {}, error() {}, warn() {} },
  }, { filename: relativePath, timeout: 1000 });
  return mod.exports;
}

function json(body) { return { json: async () => body }; }
const response = { NextResponse: { json: (body, options = {}) => ({ body, status: options.status || 200 }) } };

test('unsubscribe links are signed, subscriber-specific and need a server-only secret', () => {
  const signer = load('src/lib/newsletter-unsubscribe.ts', {}, signingEnv);
  const url = new URL(signer.createUnsubscribeUrl(subscriberId));
  const token = url.searchParams.get('token');
  assert.equal(url.origin, 'https://winewithpete.me');
  assert.equal(signer.verifyUnsubscribeToken(subscriberId, token), true);
  assert.equal(signer.verifyUnsubscribeToken('3b77a46b-1c5a-47c8-895c-b445365d7662', token), false);
  assert.equal(signer.verifyUnsubscribeToken(subscriberId, '0'.repeat(64)), false);
  assert.equal(signer.verifyUnsubscribeToken('not-a-uuid', token), false);
  assert.equal(signer.verifyUnsubscribeToken(subscriberId, undefined), false);

  const noSecret = load('src/lib/newsletter-unsubscribe.ts');
  assert.equal(noSecret.createUnsubscribeUrl(subscriberId), null);
  assert.equal(noSecret.verifyUnsubscribeToken(subscriberId, token), false);
});

test('unsubscribe POST rejects invalid links before database access', async () => {
  let calls = 0;
  const route = load('src/app/api/newsletter/unsubscribe/route.ts', {
    'next/server': response,
    '@/lib/newsletter-unsubscribe': { verifyUnsubscribeToken: () => false },
    '@/lib/supabase/server': { createClient: () => { calls++; throw new Error('Must not query'); } },
  });
  const result = await route.POST(json({ id: subscriberId, token: 'invalid' }));
  assert.equal(result.status, 400);
  assert.equal(calls, 0);
});

test('unsubscribe POST deactivates only the verified subscriber and is idempotent', async () => {
  const updates = [];
  const route = load('src/app/api/newsletter/unsubscribe/route.ts', {
    'next/server': response,
    '@/lib/newsletter-unsubscribe': { verifyUnsubscribeToken: () => true },
    '@/lib/supabase/server': { createClient: () => ({
      from(table) {
        assert.equal(table, 'newsletter_subscribers');
        return {
          update(value) {
            updates.push(value);
            return { eq: async (column, id) => {
              assert.equal(column, 'id');
              assert.equal(id, subscriberId);
              return { error: null };
            } };
          },
        };
      },
    }) },
  });
  const result = await route.POST(json({ id: subscriberId, token: 'valid' }));
  assert.equal(result.status, 200);
  assert.equal(result.body.success, true);
  assert.equal(updates.length, 1);
  assert.equal(updates[0].is_active, false);
  const repeated = await route.POST(json({ id: subscriberId, token: 'valid' }));
  assert.equal(repeated.status, 200);
  assert.equal(updates.length, 2);
});

test('welcome copy follows current editorial site and includes opt-out', () => {
  const { emailTemplates } = load('src/lib/email.ts');
  const message = emailTemplates.newsletterWelcome('Friend', undefined, 'https://winewithpete.me/unsubscribe?id=test');
  assert.match(message.html, /Unsubscribe/);
  assert.match(message.text, /Unsubscribe from the Founding Table/);
  assert.match(message.html, /winewithpete.me\/journal/);
  assert.doesNotMatch(message.html, /Weekly reflections|substack\.com/);
});

test('Founding Table signup persists with server-only client and sends a signed welcome link', async () => {
  const inserted = [];
  const emails = [];
  const services = {
    'next/server': response,
    '@/lib/supabase/server': { createClient: () => ({ from(table) {
      assert.equal(table, 'newsletter_subscribers');
      return { insert(row) {
        inserted.push(row);
        return { select(fields) {
          assert.equal(fields, 'id');
          return { single: async () => ({ data: { id: subscriberId }, error: null }) };
        } };
      } };
    } }) },
    '@/lib/email': { emailTemplates: {
      newsletterWelcome: (_, __, url) => ({ subject: 'Glad you are here', html: url, text: url }),
    }, sendEmail: async (data) => { emails.push(data); return { id: 'mock-welcome' }; } },
    '@/lib/newsletter-unsubscribe': { createUnsubscribeUrl: () => 'https://winewithpete.me/unsubscribe?id=signed' },
    '@/lib/validations': {},
  };
  const route = load('src/app/api/newsletter/subscribe/route.ts', services, { RESEND_API_KEY: 'test-only' });
  const result = await route.POST(json({ email: '  ALEx@EXAMPLE.test  ' }));
  assert.equal(result.status, 200);
  assert.equal(result.body.success, true);
  assert.equal(inserted.length, 1);
  assert.equal(inserted[0].email, 'alex@example.test');
  assert.equal(emails.length, 1);
  assert.match(emails[0].html, /unsubscribe\?id=signed/);
});

test('campaign sends one signed unsubscribe link per recipient and respects active filtering', async () => {
  const sent = [];
  const query = {
    select(fields) {
      assert.match(fields, /id/);
      return this;
    },
    eq(column, value) { assert.equal(column, 'is_active'); assert.equal(value, true); return this; },
    async limit(value) {
      assert.equal(value, 100);
      return { data: [{ id: subscriberId, email: 'recipient@example.test', name: 'Alex' }], error: null };
    },
  };
  const route = load('src/app/api/campaigns/send/route.ts', {
    'next/server': response,
    '@/lib/email': { sendEmail: async (message) => { sent.push(message); return { id: 'mock-email' }; } },
    '@/lib/newsletter-unsubscribe': { createUnsubscribeUrl: () => 'https://winewithpete.me/unsubscribe?id=signed' },
    '@/lib/supabase/server': { createClient: () => ({
      auth: { getUser: async () => ({ data: { user: { id: 'admin-id' } }, error: null }) },
      from: () => query,
    }) },
  }, { WWP_ADMIN_USER_IDS: 'admin-id' });
  const result = await route.POST({
    headers: { get: () => 'Bearer verified-admin-token' },
    json: async () => ({ subject: 'Hello', html: 'Hi {name}' }),
  });
  assert.equal(result.status, 200);
  assert.equal(sent.length, 1);
  assert.match(sent[0].html, /Hi Alex/);
  assert.match(sent[0].html, /Unsubscribe/);
  assert.match(sent[0].text, /unsubscribe\?id=signed/);
});
