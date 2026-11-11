# Wine With Pete — Mobile editorial polish (review-only)

Status: **unmerged design candidate**, based on production `42b4ada9188b8d9ef929722e9157f28b190b246f`. No deployment, checkout, account, or private-photo publication authorized.

## Art direction
Use the existing warm paper and charcoal palette. Keep Playfair for key editorial headings, Crimson Text for the inviting descriptive voice, and Inter for usable instructions and controls. A dark, firelit **atmospheric** opening on recipe pages transitions immediately into a light practical working layout. The shared site photograph of a fire is decorative; it is **not** a photograph of the actual wings. The AI-generated picture studies in conversation are inspiration only and are not shipped as factual food images or recipe source.

## Changes included
- Homepage: slightly tighter mobile hero scale and height; clearer description of what visitors can find; 14px primary action text.
- Header: mobile menu 44x44 CSS px; readable desktop navigation labels.
- Recipe detail: compact, dark hero with existing non-dish-specific fire photo; more legible title/introduction, genuine quick summary from actual recipe data; anchor links to ingredients/method; light 17px cooking text; clear numbered stages, 12px metadata; print action and print-specific layout.
- Recipe safety editorial correction: removes the hand-near-grate heat test in favor of monitoring zones with a thermometer, shifting away from flare-ups, and checking internal chicken temperature.
- The page itself is a `div`, using the existing root layout's `main` landmark rather than creating a second nested `main` in this route. Other routes need separate semantic review.

## Explicit exclusions
No new food photography, personal/guest pictures, commercial product claims, new paid checkout or member account; no modification to Stripe, Supabase, payment, admin, authorization, or newsletter delivery routes. No free Explore integration from the separate [PR #16](https://github.com/peterpielaetstrayer/winewithpete/pull/16). No PR merge or release without distinct approval.

## Required acceptance checks
1. CI: exact-head locked dependency install, production Next build, scope lint and existing security tests; investigate any regression before considering release.
2. Browser QA at 390x844 and 1366x900, plus 320px if possible: no overflow, header menu accessible, hero readable, cooking summary visible, anchor links lead to correct IDs, all recipe content preserved.
3. Confirm functioning **Print recipe** opens native print UI and output includes title, method and ingredients but suppresses dark hero and global navigation/footer.
4. Keyboard and zoom checks at 200% and 400%, color contrast at normal text size, screen-reader main landmark count; no regressions to other pages.
5. Confirm recipe figures and ingredients against the actual source of record (not AI mockup), verify safety text and confirm editorial photography rights before any later photo release.
6. Reconcile with Release 2 draft PR #16 rather than blindly merging two branches into production; rebase or integrate sequentially with fresh CI.
7. Final production smoke after any separately approved deployment: home, journal, public recipe, recipe print, free signup and checkout pause, actual admins and any order risk through the correct connected provider accounts.

This is an editorial and UI review candidate, not completed production release acceptance.
