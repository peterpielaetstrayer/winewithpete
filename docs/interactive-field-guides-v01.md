# Wine With Pete: Interactive Field Guides (v0.1)

**Status:** Review prototype, not production-ready.  
**First experience:** /guides/better-taco-night  
**Source of truth for first recipe:** Wine_With_Pete_Cravings_Rebuilt_Vol01_v0.1.md (October 24, 2026, kitchen test draft)

## Product principle

A Wine With Pete guide should help a person move from inspiration to a meaningful table, not keep them browsing an app. This is the practical layer of the existing Journal, consistent with the brand's editorial thesis: *Food is part of it. The table is the point.*

Do not replace the site's Gather / Journal / Tables / About / Founding Table navigation, or create an unrelated standalone SaaS product.

## Information architecture

- **Journal > Recipes & Guides** (/journal → /recipes) remains the editorial shelf.
- **Interactive Field Guide** (/guides/better-taco-night) is a new content type entered from the shelf.
- **Experience chapters:** Start → Ingredients → Cook → Taste & Pair → The Table.
- **Return paths:** recipe shelf, Journal and Founding Table.
- Later, if multiple guides prove useful, add a data-driven guide library. Do not create an empty guide portal now.

## Design direction

Use the existing site's Playfair + Crimson + Inter and core colors (#f4efe7, #211d19, #9c3d24). Prioritize food photography that is authentic to the actual recipe once photographed. No stock-like founder portraits, invented tasting scores, fabricated nutrition, or polished illustrations passed off as finished food.

**Mobile is primary:** readable kitchen typography, 44px+ touch targets, no reliance on hover, and checkable ingredients. Desktop is an enhanced layout, not a separate content concept.

## Current behavior

1. A genuine editorial introduction explains what we are rebuilding and labels the guide as a kitchen-test prototype.
2. Ingredients are grouped, can be checked off, and scale from 3 to 12 burritos (default six). List copy requires clipboard permission; failure is handled.
3. Cooking mode offers five sequential, navigable steps with sensory cues.
4. Taste & Pair offers an in-session subjective 1–5 score and pairing experiments, with a nonalcoholic option.
5. The Table offers a single private reflection saved only to local browser storage, not submitted to WWP.
6. No changes to Supabase, Stripe, store checkout, product catalog, newsletters, existing recipe records, or production configuration.

## Content guardrails

- First recipe is **untested**. All flavor/pairing language is prospective unless confirmed by real kitchen testing.
- Do not claim it is healthier, lower calorie, lower sodium, or cheaper without ingredient-label calculations and like-for-like published comparisons.
- Do not substitute photos of a grilled meat burrito for the intended soft bean and cheddar burrito.
- Do not imply Wine With Pete is affiliated with Taco Bell.
- Gluten-free tortilla variant is experimental; einkorn is **not** gluten-free.
- Optional wine suggestions must never crowd out the actual meal or nonalcoholic alternatives.

## Validation before merge or release

- [ ] Typecheck: npm run typecheck.
- [ ] Full ESLint: npm run lint.
- [ ] Next build: npm run build with safe test configuration.
- [ ] QA on small Android/iPhone screen, tablet, and desktop.
- [ ] Test chapter navigation with keyboard/screen reader.
- [ ] Check ingredient quantities at 3, 6, 9 and 12 servings.
- [ ] Test copying list, clipboard denial, progress and local-only notes, including private browsing.
- [ ] Cook and photograph first batch; correct any quantities and steps.
- [ ] Validate nutrition and comparison claims if added.
- [ ] Confirm how guides are distributed (free, subscriber, paid) before connecting them to commerce.
- [ ] Approve production publication separately.

## What we intentionally deferred

Photographs, email capture, accounts, synced notes, public community sharing, recipe ratings, product pricing, PDF rendering, grocery integrations and a general-purpose CMS. These would add infrastructure or privacy/commerce obligations without improving the first cooking test.

## Next bounded iteration

Cook the flagship bean burrito and evaluate five criteria: bean silkiness, sauce accuracy, tortilla softness, cheese balance, and overall satisfaction. Use the results and authentic photography to refine both the recipe and the field guide. Then, and only then, design a reusable guide schema for the next genuinely useful topic.
