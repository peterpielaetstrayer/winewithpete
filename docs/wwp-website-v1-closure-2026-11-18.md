# Wine With Pete — Website v1 closure checkpoint

**Date:** 2026-11-18
**Status:** Editorial/code release candidate. **Not deployed or signed off in production.**

## Decision: finish the present website before building the host platform

Wine With Pete v1 should feel complete as an authored, mobile-first editorial hospitality website. Its primary public journeys are **Explore** (find free things to read, cook or use), **Journal / Tables** (understand the work), **Gather** (inquire or raise interest), and **Founding Table** (free email list). A complete v1 does not imply a complete historical archive, paid membership program, or purchasable merchandise.

The collaborative gathering experience discussed November 15–17—choose a gathering score, invite a team, assign roles, follow preparations and day-of guidance, eventually ask an AI helper—is **future product discovery**. It must not become a rushed v1 database/account feature or a public promise. Later integration can link a curated Explore item to a separately tested host-experience flow via stable content identifiers and a deliberate route; there is no active backend contract yet.

## This follow-on patch

Based on the earlier stabilization candidate [PR #22](https://github.com/peterpielaetstrayer/winewithpete/pull/22). Review **after** that branch, rather than merging unrelated older drafts blindly.

1. **Broader photographic rollout.** Reuses only the eight previously public, optimized WebPs from the November 12 approved Explore release. Home, Journal, Gather, Signature Table, Gathering Blueprint, About, Community Tables, Objects, recipe atmosphere, and the Table Archive now use documented **real** food/table/process photos instead of old illustrated scenes. No new archive originals or identifiable guest portraits were published. Photography may illustrate a theme, but it is not presented as a photograph of a different named recipe or an unheld future Taíno event. The real Giscours and Seoul Bowl photos are paired with their respective archive entries. Knife & Fire stays text-only pending verified source imagery. No invented photo of Pete is used as a portrait.
2. **Clearer entry paths.** Home hero and fourth entryway lead to the already-live free `/explore` collection. Other entryways still go to Journal, Recipes, and Tables.
3. **Honest Objects page.** Physical checkout is actually paused in the API. The storefront no longer suggests that products can be bought, shows simulated inventory, or leads visitors into a checkout error. `/store` is a finished explanatory page with open paths to Explore, Recipes, and Join. Reintroducing actual merchandise requires a verified payment/fulfillment workflow and separate go-live decision.
4. **Failure states and privacy.** API failures are not mistaken for an empty event/guide shelf; gathering interest is not silently treated as general newsletter consent; unverified RSVP confirmation email is no longer promised. Sensitive subscription provider/database error details are not exposed in public JSON. The admin-only OG-metadata fetcher now requires an allowlisted admin identity, public HTTPS target, and refuses redirect-following.
5. **Legacy entry.** The `/start` landing page no longer promotes checkout of paused merchandise, unavailable historical downloads, or fabricated "coming soon" featured content when real free material is already published. Existing genuinely free content stays accessible. An unused old ConvertKit endpoint now explicitly retires instead of ever claiming a non-persisted email signup succeeded.
6. **Baseline hygiene.** Mechanical type repairs restored full TypeScript checking (CORS return variant, Zod v4 issues, typed response extraction, obsolete Supabase export). ESLint's previously blocking errors were removed; remaining warnings are tracked as maintainability work.

## Verification evidence (local, not production)

| Boundary | Observation |
|---|---|
| Full TypeScript | Pass |
| ESLint | Pass with non-blocking warnings, no errors |
| Source/security/catalog suite | 46 passing; webhook replay test still demonstrates unresolved duplicate fulfillment |
| New sitewide tests | 10 passing: image provenance, route integrity, event-photo attribution, no fictitious merch, legacy Start, no phantom subscription, consent, metadata fetcher guard |
| Production build with inert placeholders | Pass; 58 routes generated |
| Real-browser mobile/desktop | **Pending GitHub CI / browser-enabled environment**; local Chromium failed earlier due runtime socket permission |
| Production signup, interest, welcome email, unsubscribe | **Not yet exercised** with approved test contacts |
| Production admin / approved merchandise gateway | **Not yet exercised**; merchandise checkout deliberately paused |

## Definition of done for website v1

- [x] Primary editorial pages use approved real WWP imagery with truthful descriptions and no documentary misattribution.
- [x] Visitors can find Explore from home and navigate the established public journeys.
- [x] No invented merchandise or live-button-to-paused-physical-checkout path.
- [x] Key catalog/API failure states and consent behavior are explicit.
- [x] Source, type, lint, and build checks pass locally (lint warnings remain).
- [ ] Follow-on PR browser tests pass on mobile/desktop, keyboard and responsive layouts; visually inspect crops, wraps, spacing, images and 200% zoom.
- [ ] Review/merge dependency [PR #22](https://github.com/peterpielaetstrayer/winewithpete/pull/22), then this follow-on in order; production deploy confirmed.
- [ ] Real production smoke: `/`, `/explore`, `/journal`, `/tables`, Giscours and Seoul Bowl, `/recipes`, Fire Wings, Taco guide and print, `/gather`, `/gatherings`, `/join`, `/store`, mobile nav and redirects.
- [ ] Authorized non-spam test of Founding Table storage, deliverability, unsubscribe and gathering interest, plus admin read-only access. Do not send tests to actual members by default.
- [ ] Review remaining old drafts and deployment inventory without mass-merge, deletion or closing unrelated work.

**No factual signoff until unchecked items have evidence.** If real-service testing identifies a defect, fix or explicitly gate that surface before the production-complete declaration. Historical archive recovery, new portrait permissions, premium tiers, payment reactivation, and collaborative host experiences remain separate workstreams—not loopholes in the definition of current-site completeness.

## Next after v1

1. Curate the next **small, verified** archive batch from OneDrive: candidate historical guides such as Morning Brew, past table stories and tested methods. Check source, usefulness, claims, rights and instructions before each publication; no publication list is assumed approved.
2. Prototype **one** host-kit journey (Better Taco Night or Fire School 101) with a mobile-first, no-account coordination proof and genuine user testing, then decide whether accounts/database/AI assistance are justified. Not a v1 launch commitment.
3. Separately reconcile LLC/tax/event licensing, expenses, and in-person pilot logistics; these are not solved by a website deploy.
