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

test('preview unsubscribe links stay on the preview deployment', () => {
  const signer = load('src/lib/newsletter-unsubscribe.ts', {}, {
    WWP_UNSUBSCRIBE_SIGNING_SECRET: 'test-only-dedicated-secret',
    VERCEL_ENV: 'preview',
    VERCEL_URL: 'winewithpete-test-preview.vercel.app',
  });
  const url = new URL(signer.createUnsubscribeUrl(subscriberId));
  assert.equal(url.origin, 'https://winewithpete-test-preview.vercel.app');
  assert.equal(signer.verifyUnsubscribeToken(subscriberId, url.searchParams.get('token')), true);
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
          select(columns) {
            assert.equal(columns, 'preferences');
            return { eq(column, id) {
              assert.equal(column, 'id');
              assert.equal(id, subscriberId);
              return { maybeSingle: async () => ({
                data: { preferences: { gathering_interest: { source: 'historic' } } }, error: null,
              }) };
            } };
          },
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
  assert.equal(updates[0].preferences.gathering_interest.source, 'historic');
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
    '@/lib/newsletter-rejoin': load('src/lib/newsletter-rejoin.ts'),
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
  assert.equal(inserted[0].preferences.newsletter_consent.source, 'website_founding_table');
});

function rejoinDatabase(isActive = false) {
  const state = {
    id: subscriberId, email: 'returning@example.test',
    is_active: isActive, preferences: { gathering_interest: { source: 'historic' } },
  };
  const calls = { insert: 0, lookup: 0, updates: [] };

  const db = {
    from(table) {
      assert.equal(table, 'newsletter_subscribers');
      return {
        insert() {
          calls.insert++;
          return { select: () => ({ single: async () => ({
            data: null, error: { code: '23505', message: 'duplicate key value violates unique constraint' },
          }) }) };
        },
        select(columns) {
          assert.ok(columns === 'preferences' || columns.includes('id'));
          return { eq(column, value) {
            assert.ok(column === 'email' || column === 'id');
            assert.equal(value, column === 'email' ? state.email : subscriberId);
            return { maybeSingle: async () => {
              calls.lookup++;
              return { data: { ...state, preferences: { ...state.preferences } }, error: null };
            } };
          } };
        },
        update(value) {
          const filters = [];
          let applied = false;
          let result;
          const apply = () => {
            if (!applied) {
              applied = true;
              const matches = filters.every(([column, match]) => {
                if (column === 'id') return match === state.id;
                if (column === 'is_active') return match === state.is_active;
                if (column === 'preferences->pending_rejoin->>token_hash') {
                  return match === state.preferences.pending_rejoin?.token_hash;
                }
                throw new Error('Unexpected update filter ' + column);
              });
              if (matches) {
                Object.assign(state, value);
                calls.updates.push(value);
              }
              result = { data: matches ? { id: state.id } : null, error: null };
            }
            return result;
          };
          const query = {
            eq(column, match) { filters.push([column, match]); return query; },
            select(columns) { assert.equal(columns, 'id'); return { maybeSingle: async () => apply() }; },
            then(resolve, reject) { return Promise.resolve(apply()).then(resolve, reject); },
          };
          return query;
        },
      };
    },
  };
  return { db, state, calls };
}

function rejoinServices(fixture, emails) {
  const helper = load('src/lib/newsletter-rejoin.ts');
  return {
    'next/server': response,
    '@/lib/supabase/server': { createClient: () => fixture.db },
    '@/lib/newsletter-rejoin': helper,
    '@/lib/newsletter-unsubscribe': { createUnsubscribeUrl: () => null },
    '@/lib/email': {
      emailTemplates: {
        newsletterRejoinConfirmation: (url) => ({ subject: 'Confirm', html: url, text: url }),
      },
      sendEmail: async (email) => { emails.push(email); return { id: 'mock-confirmation' }; },
    },
  };
}

test('rejoin links are private one-time proof with expiry, and previews stay on preview', () => {
  const helper = load('src/lib/newsletter-rejoin.ts', {}, {
    VERCEL_ENV: 'preview', VERCEL_URL: 'wwp-preview.vercel.app',
  });
  const now = Date.now();
  const confirmation = helper.createRejoinConfirmation(subscriberId, now);
  const url = new URL(confirmation.url);
  assert.equal(url.origin, 'https://wwp-preview.vercel.app');
  assert.ok(!url.search.includes(confirmation.pending.token_hash), 'Only the token hash goes to storage');
  assert.equal(helper.verifyRejoinConfirmation(subscriberId, url.searchParams.get('token'), confirmation.pending, now), true);
  assert.equal(helper.verifyRejoinConfirmation(subscriberId, '0'.repeat(64), confirmation.pending, now), false);
  assert.equal(helper.verifyRejoinConfirmation(subscriberId, url.searchParams.get('token'), confirmation.pending,
    now + helper.REJOIN_CONFIRMATION_TTL_MS), false);
  assert.equal(helper.isRejoinRequestCoolingDown(confirmation.pending, now + 1000), true);
  assert.equal(helper.isRejoinRequestCoolingDown(confirmation.pending, now + helper.REJOIN_REQUEST_COOLDOWN_MS), false);
});

test('active duplicate is idempotent and sends no new email', async () => {
  const fixture = rejoinDatabase(true);
  const emails = [];
  const route = load('src/app/api/newsletter/subscribe/route.ts', rejoinServices(fixture, emails),
    { RESEND_API_KEY: 'test-only' });
  const result = await route.POST(json({ email: fixture.state.email }));
  assert.equal(result.status, 200);
  assert.equal(result.body.already_subscribed, true);
  assert.equal(fixture.state.is_active, true);
  assert.equal(fixture.calls.updates.length, 0);
  assert.equal(emails.length, 0);
});

test('inactive duplicate receives one confirmation, not reactivation or a welcome email', async () => {
  const fixture = rejoinDatabase();
  const emails = [];
  const route = load('src/app/api/newsletter/subscribe/route.ts', rejoinServices(fixture, emails),
    { RESEND_API_KEY: 'test-only' });
  const result = await route.POST(json({ email: fixture.state.email }));
  assert.equal(result.status, 200);
  assert.equal(result.body.confirmation_requested, true);
  assert.equal(fixture.state.is_active, false);
  assert.equal(fixture.state.preferences.gathering_interest.source, 'historic');
  assert.equal(emails.length, 1);
  assert.match(emails[0].text, /\/rejoin\?id=/);

  const repeated = await route.POST(json({ email: fixture.state.email }));
  assert.equal(repeated.body.confirmation_requested, true);
  assert.equal(emails.length, 1, 'A duplicate request during cooldown must not send another email');
});

test('rejoin confirmation requires deliberate POST, preserves preferences, and rejects replay', async () => {
  const fixture = rejoinDatabase();
  const emails = [];
  const services = rejoinServices(fixture, emails);
  const subscribe = load('src/app/api/newsletter/subscribe/route.ts', services, { RESEND_API_KEY: 'test-only' });
  await subscribe.POST(json({ email: fixture.state.email }));
  const emailUrl = new URL(emails[0].text);
  const id = emailUrl.searchParams.get('id');
  const token = emailUrl.searchParams.get('token');
  const route = load('src/app/api/newsletter/rejoin/route.ts', services);

  const invalid = await route.POST(json({ id: 'not-a-uuid', token }));
  assert.equal(invalid.status, 400);
  const badToken = await route.POST(json({ id, token: '0'.repeat(64) }));
  assert.equal(badToken.status, 400);
  assert.equal(fixture.state.is_active, false);

  const confirmed = await route.POST(json({ id, token }));
  assert.equal(confirmed.status, 200);
  assert.equal(confirmed.body.success, true);
  assert.equal(fixture.state.is_active, true);
  assert.equal(fixture.state.preferences.gathering_interest.source, 'historic');
  assert.equal(fixture.state.preferences.pending_rejoin, undefined);
  assert.equal(fixture.state.preferences.newsletter_consent.source, 'email_rejoin_confirmation');

  const repeated = await route.POST(json({ id, token }));
  assert.equal(repeated.status, 400);
  assert.equal(fixture.state.is_active, true);
});

test('an unsubscribe request revokes a still-pending rejoin link', async () => {
  const fixture = rejoinDatabase();
  const emails = [];
  const services = rejoinServices(fixture, emails);
  await load('src/app/api/newsletter/subscribe/route.ts', services, { RESEND_API_KEY: 'test-only' })
    .POST(json({ email: fixture.state.email }));
  const link = new URL(emails[0].text);

  const unsubscribe = load('src/app/api/newsletter/unsubscribe/route.ts', {
    'next/server': response,
    '@/lib/newsletter-unsubscribe': { verifyUnsubscribeToken: () => true },
    '@/lib/supabase/server': { createClient: () => fixture.db },
  });
  const result = await unsubscribe.POST(json({ id: subscriberId, token: 'valid-unsubscribe' }));
  assert.equal(result.status, 200);
  assert.equal(fixture.state.is_active, false);
  assert.equal(fixture.state.preferences.pending_rejoin, undefined);

  const confirm = load('src/app/api/newsletter/rejoin/route.ts', services);
  const afterward = await confirm.POST(json({
    id: link.searchParams.get('id'), token: link.searchParams.get('token'),
  }));
  assert.equal(afterward.status, 400);
  assert.equal(fixture.state.is_active, false);
});

test('a failed confirmation email leaves the address inactive and allows retry', async () => {
  const fixture = rejoinDatabase();
  const services = rejoinServices(fixture, []);
  services['@/lib/email'].sendEmail = async () => null;
  const route = load('src/app/api/newsletter/subscribe/route.ts', services, { RESEND_API_KEY: 'test-only' });
  const result = await route.POST(json({ email: fixture.state.email }));
  assert.equal(result.status, 503);
  assert.equal(fixture.state.is_active, false);
  assert.equal(fixture.state.preferences.pending_rejoin, undefined);
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
