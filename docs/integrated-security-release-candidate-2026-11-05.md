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
