'use strict';

// Hermetic handler-level integration tests of REAL application TypeScript.
// They run inside a VM with stubbed services and inert process.env.
// No sockets, external APIs, real database connections, charges, or emails.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const next = {
  NextResponse: {
    json(body, options = {}) { return { body, status: options.status ?? 200 }; }
  }
};

function loadRealHandler(relativePath, services, env = {}) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  const compiled = ts.transpileModule(source, {
    fileName: relativePath,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true
    }
  }).outputText;
  const mod = { exports: {} };
  const context = {
    module: mod,
    exports: mod.exports,
    require(id) {
      assert.ok(Object.hasOwn(services, id), 'Unmocked import prohibited: ' + id);
      return services[id];
    },
    process: { env: Object.freeze({ ...env }) },
    console: { log() {}, info() {}, warn() {}, error() {} }
  };
  vm.runInNewContext(compiled, context, { filename: relativePath, timeout: 1000 });
  assert.equal(typeof mod.exports.POST, 'function', 'Expected real POST handler');
  return mod.exports.POST;
}

function request(body, headers = {}) {
  const normalized = new Map(Object.entries(headers).map(([k,v]) => [k.toLowerCase(),v]));
  return {
    headers: { get: (key) => normalized.get(key.toLowerCase()) ?? null },
    json: async () => body,
    text: async () => JSON.stringify(body)
  };
}

function campaignFixture({ allowlist = 'admin-id', user = { id: 'admin-id' }, subscribers = [], emailResults = [], authError = null } = {}) {
  const calls = { clients: 0, users: [], tables: [], mails: [] };
  const supabase = {
    auth: { getUser: async (token) => {
      calls.users.push(token);
      return { data: { user }, error: authError };
    }},
    from: (table) => {
      calls.tables.push(table);
      assert.equal(table, 'newsletter_subscribers');
      const query = {
        select: () => query,
        eq: () => query,
        limit: async () => ({ data: subscribers, error: null })
      };
      return query;
    }
  };
  const services = {
    'next/server': next,
    '@/lib/supabase/server': { createClient: () => { calls.clients++; return supabase; } },
    '@/lib/email': { sendEmail: async (payload) => {
      calls.mails.push(payload);
      const n = calls.mails.length - 1;
      return n < emailResults.length ? emailResults[n] : { id: 'fake-mail' };
    }}
  };
  return {
    calls,
    POST: loadRealHandler('src/app/api/campaigns/send/route.ts', services,
      { WWP_ADMIN_USER_IDS: allowlist })
  };
}

test('campaign: empty allowlist rejects even a bearer token before DB access', async () => {
  const x = campaignFixture({ allowlist: '' });
  const result = await x.POST(request({subject:'test',html:'safe'}, {authorization:'Bearer fake'}));
  assert.equal(result.status, 403);
  assert.equal(x.calls.clients, 0);
  assert.equal(x.calls.mails.length, 0);
});

test('campaign: missing token rejects even when allowlist exists', async () => {
  const x = campaignFixture();
  const result = await x.POST(request({subject:'test',html:'safe'}));
  assert.equal(result.status, 403);
  assert.equal(x.calls.clients, 0);
});

test('campaign: invalid or non-allowlisted identity cannot read subscribers', async () => {
  const unauthorized = campaignFixture({ user: {id:'other-id'} });
  const first = await unauthorized.POST(request({subject:'test',html:'safe'},{authorization:'Bearer fake'}));
  assert.equal(first.status, 403);
  assert.equal(unauthorized.calls.tables.length, 0);
  const invalid = campaignFixture({ user: null, authError: {message:'invalid token'} });
  const second = await invalid.POST(request({subject:'test',html:'safe'},{authorization:'Bearer fake'}));
  assert.equal(second.status, 403);
  assert.equal(invalid.calls.mails.length, 0);
});

test('campaign: verified authorized identity rejects unsupported tag targeting without sends', async () => {
  const x = campaignFixture();
  const response = await x.POST(request({subject:'hello',html:'welcome',tags:['members']},{authorization:'Bearer fake'}));
  assert.equal(response.status, 422);
  assert.equal(x.calls.users.length, 1);
  assert.equal(x.calls.tables.length, 0);
  assert.equal(x.calls.mails.length, 0);
});

test('campaign: mocked verified identity and subscriber query count successful and null mail results', async () => {
  const x = campaignFixture({
    subscribers: [{email:'person1@example.invalid',name:'Ada'},{email:'person2@example.invalid',name:'Lin'}],
    emailResults: [{id:'fake-success'},null]
  });
  const response = await x.POST(request({subject:'A note',html:'Hi {name}',text:'Hello {name}',limit:2},
    {authorization:'Bearer fake'}));
  assert.equal(response.status, 200);
  assert.equal(response.body.sent, 1);
  assert.equal(response.body.failed, 1);
  assert.equal(response.body.total, 2);
  assert.equal(response.body.success, false);
  assert.equal(x.calls.mails.length, 2);
  assert.equal(x.calls.mails[0].html, 'Hi Ada');
  assert.equal(x.calls.mails[1].text, 'Hello Lin');
});

function fulfillmentFixture(order, { signatureError = false, mailOutcome = {id:'fake-message'} } = {}) {
  const calls = { urls: [], mails: [], orders: [] };
  const supabase = {
    from: (table) => {
      assert.equal(table, 'orders');
      const query = {
        select: () => query,
        eq: (field, id) => { calls.orders.push({field,id}); return query; },
        single: async () => ({ data: order, error: null })
      };
      return query;
    },
    storage: { from: (bucket) => {
      assert.equal(bucket,'digital-products');
      return { createSignedUrl: async (filePath) => {
        calls.urls.push(filePath);
        return signatureError
          ? {data:null,error:{message:'mock storage error'}}
          : {data:{signedUrl:'https://example.invalid/signed'},error:null};
      }};
    }}
  };
  const services = {
    '@/lib/supabase/server': { createClient: () => supabase },
    '@/lib/email': {
      sendEmail: async (payload) => { calls.mails.push(payload); return mailOutcome; },
      emailTemplates: { purchaseConfirmation: (_name,_product,links) =>
        ({subject:'Synthetic purchase',text:String(links.length)}) }
    }
  };
  const code = fs.readFileSync(path.join(root, 'src/lib/commerce/digital-fulfillment.ts'),'utf8');
  const compiled = ts.transpileModule(code,{compilerOptions:{
    target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
  const mod = {exports:{}};
  vm.runInNewContext(compiled,{
    module:mod,exports:mod.exports,
    process:{env:Object.freeze({})},
    console:{log(){},warn(){},error(){}},
    require(id) {
      assert.ok(Object.hasOwn(services,id),'Unmocked import prohibited: '+id);
      return services[id];
    }
  },{timeout:1000});
  return { calls, fulfill:mod.exports.fulfillDigitalOrder };
}

function sampleOrder(status = 'completed', file = 'guides/synthetic.pdf') {
  return {id:'order-test',email:'synthetic@example.invalid',name:'Test',status,
    order_items:[{products:{id:'product-test',name:'Synthetic Guide',file_path:file}}]};
}

test('fulfillment: an unpaid order cannot sign URLs or send email', async () => {
  const f = fulfillmentFixture(sampleOrder('pending'));
  const result = await f.fulfill('order-test');
  assert.equal(result.delivered,false);
  assert.equal(f.calls.urls.length,0);
  assert.equal(f.calls.mails.length,0);
});

test('fulfillment: missing or unsignable files do not emit partial email', async () => {
  const missing = fulfillmentFixture(sampleOrder('completed',null));
  assert.equal((await missing.fulfill('order-test')).delivered,false);
  assert.equal(missing.calls.mails.length,0);
  const storageFailure = fulfillmentFixture(sampleOrder(),{signatureError:true});
  assert.equal((await storageFailure.fulfill('order-test')).delivered,false);
  assert.equal(storageFailure.calls.mails.length,0);
});

test('fulfillment: a completed synthetic order signs its guide and sends to recorded order email', async () => {
  const f=fulfillmentFixture(sampleOrder());
  const result=await f.fulfill('order-test');
  assert.equal(result.delivered,true);
  assert.equal(result.downloadCount,1);
  assert.equal(f.calls.urls[0],'guides/synthetic.pdf');
  assert.equal(f.calls.mails.length,1);
  assert.equal(f.calls.mails[0].to,'synthetic@example.invalid');
});

function webhookFixture(event, { invalidSignature = false } = {}) {
  const calls = { clients: 0, fulfillment: [], readOrders: 0, readItems: 0, inserted: 0 };
  const orders = {
    select: () => ({
      eq: () => ({maybeSingle: async () => {
        calls.readOrders++;
        return {data:{id:'existing-order',status:'completed'},error:null};
      }})
    }),
    update: () => ({eq: async () => ({error:null})})
  };
  const items = {
    select: () => ({eq: () => ({eq: () => ({
      maybeSingle: async () => {calls.readItems++;return {data:{id:'existing-item'},error:null};}
    })})})
  };
  const supabase = {
    from: (table) => {
      assert.ok(['orders','order_items'].includes(table));
      return table==='orders'?orders:items;
    }
  };
  const services = {
    'next/server':next,
    '@/lib/stripe': { stripe: {webhooks: {
      constructEvent: (_body,signature,secret) => {
        assert.equal(secret,'fake-not-a-real-webhook-secret');
        if(invalidSignature||signature!=='synthetic-signature')throw Error('invalid mock signature');
        return event;
      }
    }}},
    '@/lib/supabase/server':{createClient:()=>{calls.clients++;return supabase;}},
    '@/lib/commerce/digital-fulfillment':{fulfillDigitalOrder:async (id)=>{
      calls.fulfillment.push(id);return {delivered:true,downloadCount:1};
    }}
  };
  return { calls, POST:loadRealHandler('src/app/api/webhooks/stripe/route.ts',services,
    {STRIPE_WEBHOOK_SECRET:'fake-not-a-real-webhook-secret'}) };
}

function syntheticStripeEvent(paymentStatus='paid') {
  return {type:'checkout.session.completed',data:{object:{
    id:'cs_synthetic',payment_status:paymentStatus,payment_intent:'pi_synthetic',
    metadata:{productId:'product-test',offerId:'offer-test',fulfillmentType:'digital_download',quantity:'1'}
  }}};
}

test('webhook: missing or invalid signature rejects before any DB or fulfillment', async () => {
  const fixture=webhookFixture(syntheticStripeEvent());
  const missing=await fixture.POST(request({},{ }));
  assert.equal(missing.status,400);
  assert.equal(fixture.calls.clients,0);
  const invalid=webhookFixture(syntheticStripeEvent(),{invalidSignature:true});
  const response=await invalid.POST(request({}, {'stripe-signature':'bad'}));
  assert.equal(response.status,400);
  assert.equal(invalid.calls.clients,0);
});

test('webhook: unpaid synthetic Checkout Session never fulfills a digital purchase', async () => {
  const fixture=webhookFixture(syntheticStripeEvent('unpaid'));
  const response=await fixture.POST(request({}, {'stripe-signature':'synthetic-signature'}));
  assert.equal(response.status,200);
  assert.equal(fixture.calls.readOrders,0);
  assert.equal(fixture.calls.fulfillment.length,0);
});

test('webhook: paid synthetic Checkout Session with recorded order invokes fulfillment', async () => {
  const fixture=webhookFixture(syntheticStripeEvent('paid'));
  const response=await fixture.POST(request({}, {'stripe-signature':'synthetic-signature'}));
  assert.equal(response.status,200);
  assert.equal(fixture.calls.readOrders,1);
  assert.equal(fixture.calls.readItems,1);
  assert.equal(fixture.calls.fulfillment.length,1);
  assert.equal(fixture.calls.fulfillment[0],'existing-order');
});

test('webhook: replay exposes unresolved duplicate fulfillment risk (not a release pass)', async () => {
  const fixture=webhookFixture(syntheticStripeEvent('paid'));
  const first=await fixture.POST(request({}, {'stripe-signature':'synthetic-signature'}));
  const second=await fixture.POST(request({}, {'stripe-signature':'synthetic-signature'}));
  assert.equal(first.status,200);
  assert.equal(second.status,200);
  assert.equal(fixture.calls.fulfillment.length,2,
    'Current webhook lacks an atomic event/order fulfillment claim; this documents the blocker');
});
