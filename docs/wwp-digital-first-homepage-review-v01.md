# Wine With Pete — Digital-first homepage, review slice v0.1
Date: 2026-11-05
Status: DRAFT, not a production release

## Purpose
Rebalance the current homepage's visitor journey from selling an in-person gathering toward browsing already published stories, recipes/guides, and the Table Archive. Keep Gather available as an optional secondary path.

## Files changed
- `src/app/page.tsx`: change hero primary action to the new "Begin somewhere" discovery area, keep Gather as secondary, and add editorial links to three **existing public destinations** (`/journal`, `/recipes`, `/tables`). No database, checkout, membership, newsletter API, existing offer details, customer data or private media changed.
- `vercel.json`: branch-only safeguard intended to suppress automatic previews for `work/*`, based on the same reviewed pattern used in the separate Explore PR #12. Verify it works; do **not** infer no preview from config alone.

## Explicit exclusions
- Do **not** link to `/explore` until feature PR #9 has completed release QA.
- Do **not** publish the private photographic assets from PR #12; the public repository is not a safe holding area.
- Do **not** incorporate commerce fixes/security patching into this editorial PR; track draft PR #8 (fulfillment hardening), PR #10 (deployment safeguards), and PR #11 (dependency security) independently.
- Do not claim the existing `/recipes` commerce shelf, newsletter service, or personal photographs have been verified end to end by this review.

## Review and release gate
1. Check a protected and authorized review build for the **exact candidate commit**, with both desktop and mobile layouts, keyboard focus order, visible links and zero overflow.
2. Open each of the three linked public destinations signed out. Confirm content accuracy and avoid promises about unreleased guides or active event bookings.
3. Verify app-wide build/type/lint failures against existing baseline, assess current dependency advisories and any active commerce/security exposure. Resolve release-blocking items before approving production.
4. Confirm that automatic deployment suppression for this work branch succeeded. If unexpected deployment occurs, inspect it and do not promote.
5. Obtain Peter's explicit sign-off before any merge, release, production deployment or image publication. Confirm rollback to previous production deployment is practical.

## Relationship to Explore
This is **not** the Explore launch. It creates a truthful, useful discovery path now and allows the more ambitious interactive Guide Library and photographic editorial world to follow separately when ready.

## Preflight
Static source checks confirmed the three links, anchor, preservation of Gather, no unpublished Explore reference, and the intended hero shift. A full application build, deployed browser test and security validation have **not** been performed on this candidate.
