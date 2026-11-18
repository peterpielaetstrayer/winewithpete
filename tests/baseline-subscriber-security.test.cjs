'use strict';

/* eslint-disable @typescript-eslint/no-require-imports -- Hermetic test harness */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const routePath = 'src/app/api/baseline-method/subscribe/route.ts';

function makeRoute(databaseResponse) {
  const source = fs.readFileSync(path.join(root, routePath), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const calls = { client: 0, table: [], inserted: [], selected: [] };
  const query = {
    insert(value) { calls.inserted.push(value); return query; },
    select(columns) { calls.selected.push(columns); return query; },
    async single() { return databaseResponse; },
  };
  const services = {
    'next/server': {
      NextResponse: { json: (body, options = {}) => ({ body, status: options.status ?? 200 }) },
    },
    '@/lib/supabase/server': {
      createClient() {
        calls.client++;
        return { from(table) { calls.table.push(table); return query; } };
      },
    },
    '@/lib/email': {
      sendEmail: async () => { throw new Error('Email should be disabled in this fixture'); },
      emailTemplates: {},
    },
  };
  const mod = { exports: {} };
  vm.runInNewContext(compiled, {
    module: mod,
    exports: mod.exports,
    require(id) {
      assert.ok(Object.hasOwn(services, id), `Unexpected import: ${id}`);
      return services[id];
    },
    process: { env: Object.freeze({}) },
    console: { log() {}, warn() {}, error() {} },
  }, { filename: routePath, timeout: 1000 });
  return { POST: mod.exports.POST, calls };
}

function request(body) { return { json: async () => body }; }

test('Baseline Method signup inserts through the server-only client and returns no subscriber PII', async () => {
  const fixture = makeRoute({ data: { id: 'synthetic-id' }, error: null });
  const response = await fixture.POST(request({ email: 'TeSt@example.invalid', name: 'Synthetic Reader' }));
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.id, 'synthetic-id');
  assert.deepEqual(fixture.calls.table, ['newsletter_subscribers']);
  assert.deepEqual(fixture.calls.selected, ['id']);
  assert.equal(fixture.calls.client, 1);
  assert.equal(fixture.calls.inserted[0].email, 'test@example.invalid');
  assert.deepEqual(Object.keys(response.body.data), ['id']);
});

test('Baseline Method duplicates remain idempotent without public subscriber reads', async () => {
  const fixture = makeRoute({ data: null, error: { code: '23505', message: 'duplicate key value' } });
  const response = await fixture.POST(request({ email: 'reader@example.invalid' }));
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data, null);
  assert.deepEqual(fixture.calls.selected, ['id']);
});

test('Legacy anonymous client module no longer exports a subscriber mutation helper', () => {
  const source = fs.readFileSync(path.join(root, 'src/lib/supabase/database.ts'), 'utf8');
  assert.equal(source.includes(".from('newsletter_subscribers')"), false);
  assert.equal(source.includes('subscribeToNewsletter'), false);
});
