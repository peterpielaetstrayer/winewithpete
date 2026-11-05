# Wine With Pete — Integrated Security Release Candidate v0.1
Date: 2026-11-05
State: DRAFT / UNMERGED / NO PRODUCTION AUTHORIZATION

## Scope and provenance
This branch starts from the exact current `main` commit `156d4e59751272fcfb11d868ff2927fe3670eb5d` and selectively integrates previously separate, review-gated changes. No homepage PR #13, Explore PR #9, or private photography PR #12 is included.

- From [PR #8](https://github.com/peterpielaetstrayer/winewithpete/pull/8), head `98cea33ce8bbc7b7b690da1369792e3522297b89`: authenticated/allowlisted campaign send API and admin token; disabled anonymous download resend; public catalog removes internal file path; paid digital fulfillment checks; six no-dependency source regression contracts.
- From [PR #10](https://github.com/peterpielaetstrayer/winewithpete/pull/10): reviewable `work/*` branch preview suppression, branch policy test and deployment safeguards notes.
- From [PR #11](https://github.com/peterpielaetstrayer/winewithpete/pull/11), head `033da142baa66339158c5c1ea47d0641d1d67db4`: Next.js 15.5.28 / React 19.1.10 and trial Next-scoped PostCSS 8.5.31 override and locked dependencies. This avoids a blind major-version update but **overrides Next's pinned transitive version**, so needs compatibility review.

## CI and safe tests
- `Validate` runs source contracts separately from the locked critical-advisory audit and scoped commerce checks.
- `Integrated Security Release Review` performs high-severity audit, security API/admin typecheck, focused lint, actual optimized Next build with **obviously inert** CI-only placeholder settings, and local HTTP calls proving unauthenticated campaign and resend endpoints return 403. It never sends real mail, charges payments or accesses a real Supabase/Stripe project. Failures remain visible and block approval.
- This branch is named `work/*` and contains deployment suppression. **Verify** that Vercel generated no automatic preview; don't treat configuration as proof.

## Unresolved production gates (even if CI green)
1. Campaign allowlist: `WWP_CAMPAIGN_ADMIN_USER_IDS` is **not verified configured** in Vercel; must be securely set with the authorized administrator's actual Supabase user ID. Missing means authenticated campaign sends are intentionally denied. Do not expose user IDs or credentials in public source. Runtime test with an explicitly authorized test account and an unauthorized test account, without sending campaign emails.
2. Payment: duplicate Stripe webhook event idempotency and safe email retry/fulfillment ledger are not solved by PR #8. Sandbox payment and private-asset delivery tests required before selling paid digital products.
3. The existing Next config intentionally skips full application TypeScript/lint validation during build. Independent full-site checks and critical-path browser regression must be reviewed.
4. Deployment safeguards and existing PR stacking must be reconciled; the release commit must be checked against production, with a verified rollback candidate, appropriate Vercel environment isolation and explicit owner sign-off. Do not merge the three source PRs blindly after this integration.
5. Check for actual exposure or past abuse through provider/security logs using authorized read-only access; no exploitation has been established by source inspection.
6. User-facing website releases remain a separate decision, beginning with homepage draft PR #13, followed by Explore and photography.

## Release decision
Only Peter can approve changes to the production branch, production deployment, customer mailing, private image publication, spending or configuration of live services. Creating this candidate does not imply that approval.

## Iteration after first integrated CI
The first integrated build and local 403-denial HTTP smoke tests succeeded. Full scoped security/admin checks surfaced legacy type and HTML entity issues in the existing admin/Printful UI (not the new campaign authorization logic): 15 TypeScript errors and 5 lint errors. This candidate now normalizes optional Printful and Supabase user fields and escapes existing UI text, while preserving the same API/auth paths. These are additional legacy UI changes beyond the original security patch and require regression review. They were applied to the draft branch only. The whole-app TypeScript/lint baseline and provider-backed authorization/payment tests are still separate release gates.

## November 5 — hermetic actual-handler integration suite

Connected Supabase projects were checked read-only; none is unmistakably an isolated Wine With Pete staging/test project. **Do not use unrelated project-launch-lab, Moments Together, or other projects as WWP test databases.** No known separate Stripe test account/credentials available through this work session.

The independent Node 20 `node:test` suite `tests/security-handler-integration.test.cjs` transpiles **the actual application TypeScript handlers** using the project's locked TypeScript compiler and executes them in a VM where every dependency is explicitly mocked. No real network APIs, credentials, subscriber records, charges or outbound email are used. Tests cover unauthorized and authorized synthetic campaign routes, failed email-count handling, order-completion and missing-file fulfillment, Stripe signature/payment guards, and webhook replay.

**Known fail-open business behavior demonstrated intentionally:** replaying a synthetically signed `checkout.session.completed` handler against an already present order and item still invokes `fulfillDigitalOrder` twice. This test PASS means **the duplicate risk is reproduced**, NOT that idempotency is satisfied. Release of paid digital fulfillment still needs an atomic persisted event/order claim and safe email retry design, tested against a dedicated staging database.

These tests are more substantive than source-contract checks but do not substitute for a real nonproduction Stripe/Supabase integration test. Existing protected build and local 403 HTTP checks remain intact.

## First security release boundary — November 5 follow-on

Read-only source review found that admin products, orders and essays endpoints verified a signed-in user without an administrator role check; Printful catalog and sync routes had no server-side authorization check. This is a code-level risk finding, NOT proof of exploitation. The draft now requires server-side `verifyAdmin` (verified JWT + explicit `WWP_ADMIN_USER_IDS`) for those five privileged route groups, and the campaign sender uses the same allowlist variable. The older, draft-only `WWP_CAMPAIGN_ADMIN_USER_IDS` name is superseded. No correct live admin ID or configured environment variable has been verified: **if deployed now, privileged operations fail closed until securely configured**.

**Business-impacting hold awaiting approval:** first-party Stripe digital-download checkout now returns `409 DIGITAL_CHECKOUT_PAUSED` before Stripe session creation. Support checkout and external checkout links remain unaffected; existing Stripe webhooks for previously paid orders are not disabled, and the duplicate digital-fulfillment risk for historical events is NOT fixed. Review any live digital sales and outstanding paid orders before enabling this change.

The hermetic suite now includes source-backed authorized and unauthorized admin helper tests, Printful denial tests and checkout pause/support-preservation tests, while CI scope includes admin and Printful TypeScript/lint. These are not a replacement for an isolated Wine With Pete Supabase + Stripe sandbox with verified live-provider behavior. Do not merge or deploy until owner approves the paused digital sale behavior, correct admin account is identified and configured securely, and rollout/rollback is verified.
