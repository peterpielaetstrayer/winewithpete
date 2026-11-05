# Wine With Pete — commerce hardening regression review
Date: 2026-11-05
Status: Draft PR #8 only; no production release authorization.

## PR #8 behavior reviewed in source
- Disables unauthenticated manual resend (HTTP 403).
- Removes internal `file_path` from public products API.
- Checks `orders.status === 'completed'` before signing download URLs.
- Rejects missing/unsignable digital files instead of emailing an incomplete set.
- Retains Stripe webhook signature and paid-status checks.

## Test addition
- Five dependency-free **source contract** tests in `tests/commerce-public-safety.test.mjs`.
- New read-only `public-commerce-security` CI job runs independently of the existing `quality` job. This matters because the existing critical npm dependency audit blocks downstream lint/typecheck.
- No new product APIs, checkout behavior, payment settings, customer records or production configuration.

## Not yet validated
- Runtime HTTP behavior, actual signed webhook processing, Supabase policies, real digital delivery and all-app type/lint on the exact deploy candidate.
- Stripe webhook **idempotency**: repeated completed-session events may trigger repeat delivery/email. This PR does not create an atomic fulfillment ledger.
- Retry/recovery after email failure; payment-state semantics; other external consumers of the legacy product fields.
- November 5 dependency audit: 8 production advisories (1 critical, 6 high, 1 moderate). PR #11's October patch must be rechecked against current advisories.
- Safe deployment and rollback on the exact integrated commit.

## Release checklist
1. Verify source-contract CI passes; it is not a runtime security proof.
2. Resolve dependency release blockers separately, without blind automatic major upgrades.
3. Run protected runtime checks for unauthenticated resend, public catalog, paid/completed orders, Stripe signature rejection, missing files and duplicate webhook deliveries.
4. Select/test an idempotency and email-retry mechanism before enabling paid download fulfillment at scale.
5. Review secure deployment sequence and request Peter's explicit approval for merge/public release. No release is authorized by this document.

## November 5 follow-on: campaign send authentication gap

Source inspection found `POST /api/campaigns/send` accepted arbitrary campaign content, queried newsletter subscribers and sent Resend emails **without verifying the HTTP caller**. The admin UI's client-side login does not protect the API. No live POST was made, and external exploitability or past misuse was **not** established by source inspection alone.

This draft PR now requires a verified Supabase Bearer token **and** an explicit server-only `WWP_CAMPAIGN_ADMIN_USER_IDS` allowlist before any subscriber read or email send. Missing allowlist defaults to HTTP 403. The admin UI supplies its current bearer token; the API rejects unsupported tag targeting, caps each campaign at 100 recipients, validates content sizes and counts null-returning email failures correctly. A new dependency-free source contract test checks the authorization ordering.

**Critical release dependency:** `WWP_CAMPAIGN_ADMIN_USER_IDS` is not known to be configured. The API will intentionally refuse campaigns until Peter authorizes the specific admin ID(s) and configures the server-only environment through a secure admin channel. An incorrect allowlist could block an existing admin workflow; preserve a rollback route. Do not expose user IDs in public code or paste secrets into discussion. Review the exact endpoint access controls and actual runtime authentication with a nonproduction test account before release.

No live email campaign was sent; no Vercel settings were changed; no production route was disabled. PR remains draft and unmerged.
