# Wine With Pete — Website reconciliation and stabilization checkpoint

**Date:** November 18, 2026

**Baseline:** production `main` SHA `422d9d60615e4131595d344a0c2b78bda3708a1f` (November 13).
**Purpose:** Distinguish shipped work, fixes awaiting review, and future ideas. Preserve a small, actionable release sequence without accidentally promising products or reopening commerce.

## What is already public

- The editorial architecture includes **Gather, Journal, Explore, and Founding Table/Join**; it is a Wine With Pete world, not merely a product store.
- Explore launched with a search/filterable collection, four verified entries, accessible free materials, and eight reviewed photographic WebP derivatives. This is intentionally a small, credible catalog, not a complete historic archive.
- The mobile recipe/print work, Chipotle-Lime Fire Wings, the Better Taco Night interactive kitchen-test guide and print edition, Seoul Bowl, and the Giscours editorial table story are in the published scope.
- The Giscours interactive tasting board was retired. Its story remains public; obsolete board URLs redirect to that story.
- Publication of the Explore photography was explicitly approved. No new unapproved original photographs or guest identities belong in this patch.

## This stabilization branch (not yet production)

1. Repair stale source-level and browser test expectations that treated the retired Giscours board as live, and incorrectly counted it among printable/interactive Explore options. Tests now reflect the actual public experience.
2. Put the **already available Better Taco Night** interactive and printable guide on `/recipes`, where a visitor reasonably looks for it. Call out the kitchen-test-draft status honestly; keep historical download buttons paused.
3. Remove an unused Explore import and permit an optional local system Chromium path for browser QA. No database, billing, administrative, membership, or email mutation is part of this branch.
4. Replace the outdated README's unqualified checkout/Printful/auth roadmap with the actual release posture.

### Evidence as of November 18

| Verification boundary | Result | Interpretation |
|---|---|---|
| Unit/source security and catalog suite | **46/46 passing** | Covers catalog integrity, recipe quantity, photo safety, auth/commerce guards; one *passing* webhook test reproduces a real unresolved replay risk |
| TypeScript field-guide scope | **Passed** | Static type check only, not a full user journey |
| Targeted ESLint | **Passed** after unused import removal | Source hygiene for touched Explore/Recipes surfaces |
| Next production build (inert CI placeholders) | **Passed**, 58 pages generated | Build correctness; not real Supabase/Stripe connectivity |
| `npm audit --omit=dev` | **0 reported vulnerabilities** | Dependency report at time of audit; not an application security clearance |
| Playwright local mobile/desktop | **Environment blocked** | Next server ran with a temporary network-interface workaround; Chromium then failed before navigation with `socket() failed: Operation not permitted`. Browser behavior **not** verified in this runtime. Retest in GitHub CI or a browser-enabled environment. |
| Live real-world signup, inquiry, admin, payment | **Not verified in this checkpoint** | Must not infer success from local tests or placeholder credentials |

## What is still unfinished — in sequence

### Release gate 1 — Stabilize and observe

- Open/review this branch as a PR; run required GitHub checks and the full mobile/desktop Playwright suite in a permitted browser environment.
- After merge authorization, smoke-test production entry points on real phones and desktop: home, navigation, `/explore`, `/recipes`, recipe and print, `/gather`, `/journal`, `/join`, `/tables/...`, retired redirects, and store's clear purchase restrictions.
- Verify keyboard navigation, page landmarks, visible focus, contrast, 200% zoom and small-screen overflow; inspect broken images, long headings, loading and error states.
- Check Founding Table signup and event inquiry using approved non-spam test contact(s), verify delivery and unsubscribe; check restricted admin as the authorized account. These external flows are **not covered** by a static build.
- Inventory open draft PRs one by one; do not mass-merge or mass-close branches whose purposes differ.
- Keep direct Stripe-hosted digital checkout paused until event-level webhook idempotency and order-fulfillment exactly-once behavior are corrected and replay-tested separately.

### Release gate 2 — Editorial and catalog depth

- Make the whole site feel authored by Peter: tighten headline hierarchy, typography, body copy, image crops, CTA labels, and navigation coherence on **home, Journal, Table Archive, Recipes, and Gather**, after the Explore/photo work. Avoid generic promotional or AI-sounding phrasing.
- Recover/select a **small first collection (roughly 3–5)** from the historical OneDrive archive—Morning Brew and prior guides, Better Taco Night, past dinners, cooking experiments—based on provenance, completeness, practical usefulness, and current accuracy. This is a proposed editorial batch, not an approved publication list.
- Separate factual event stories from instructional guides, tested recipes, unpublished draft experiments, and future concepts. Validate all cooking instructions and legal/photo rights before publishing.
- Choose one recognizable front-door action for each visitor intention: **read/learn**, **cook/host**, **join/attend**, without making an inactive product shelf feel like an empty store.
- Improve imagery with actual approved Wine With Pete media and clear captions; never depict generic/AI studies as documentary photographs.

### Discovery track — Useful but not the current release

- Prototype one collaborative gathering flow—probably a Better Taco Night or Fire School 101 host kit—in mobile-first form: pick a format, assign roles, share preparation, coordinate timing, and learn or reflect afterwards. Test it with real friends **before** building account infrastructure.
- Fire School 101/102 station-specific prelearning, standalone host packages, a paid tier or AI helper, and a subscription business model remain hypotheses, not launch commitments.
- Event pilots and Founding Table communications can proceed as small, honest invitations; event prices, venues, insurance, licenses, and logistics require their own review.

## Design and publication guardrails

Wine With Pete's center is the **table**: the founder's own cooking, wine learning, gatherings, and hospitality practice, presented honestly and in a distinctive warm/editorial voice. The website should help a visitor move from *curiosity* to *doing something around a table*. No invented history, fictitious food photography, untested recipe claims, surprise paywalls, or unverified offers. All public editorial content remains free initially; merchandise remains an independent paid offering if correctly configured. A free Founding Table may come before selective paid member features.

## Next checkpoint

**First priority:** validate and review this small stabilizing patch, then carry out targeted visual/functional QA. **Second:** editorial and archive-depth release. **Third:** a single real-use host-kit prototype. Keep a release checklist and evidence so a new conversation can resume without Peter recreating this roadmap.
