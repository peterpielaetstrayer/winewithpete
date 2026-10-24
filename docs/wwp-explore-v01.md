# Wine With Pete · Explore v0.1

Status: **Review-only prototype** in draft PR #9. Not approved for production or promotion.

## Product outcome

Someone arrives with an intention: cook, taste, gather or read. They can discover something real, understand what it is, and choose an appropriate way to use it. The user does **not** need to understand our content types (story / PDF / interactive guide) before finding what matters.

### Routes

- `/explore`: the one-stop discovery interface, noindexed until release approval
- `/journal`: still the editorial world; an optional Explore link bridges reading and doing
- `/recipes`: retains its recipe + existing commerce shelf, with no changes to checkout
- `/tables`: retains the archive of actual gatherings
- Individual guides / tasting boards remain accessible through their existing paths

## One experience, several formats

The catalog's canonical `Experience` record has one stable ID, title, summary, intent labels, search tags, publication status and ranked primary route. `links[]` adds alternative **existing** outputs such as printable sheets or optional interactive companions. An event with three outputs must not occupy three separate results.

Current records:
1. **The Better Taco Night** → prototype kitchen guide + printable recipe
2. **Chipotle Lime Fire Wings** → actual field recipe
3. **Château Giscours Vertical** → actual historical story + optional prototype board + blank printable worksheet
4. **The Seoul Bowl Table** → actual historical story

Do not list unrelated category landing pages as invented recipes, or turn unapproved personal dinner PDFs into discoverable download links.

## Findability strategy

- Purpose selector: Everything, Cook, Taste, Gather, Stories. These categories are *user intentions*, and an item can appear under more than one.
- Text search across title, summary, tags, and format labels. Accent-agnostic, token-based matching.
- Format filter: Recipe, Interactive, Printable, Story.
- Featured/curated and alphabetical sort.
- Pagination: up to 12 results at a time, with user-controlled Show more.
- Empty results show an actionable reset. Results count updates accessibly.
- The actual library is four records; a separate unit test generates 500 fake records **in memory in test code only** and validates filtering, unique results, and progressive listing.

## Visual direction

Use the current Wine With Pete typography and palette. The entry is an editorial welcome (not a marketplace or SaaS dashboard), with existing campfire imagery used only as a *brand* hero visual. Content cards use typography-first graphic covers because there are no verified photographs for every subject. Do not mislabel unrelated food photos as real finished recipes.

## Publication and rights

`status: prototype` is a disclosure, **not** a payment entitlement. No member library, ownership claim, account system or download gate has been built. Printed recipe pages and blank worksheets already exist in preview form, and must not be called exclusive member content without a reviewed access mechanism.

Rules to add new items:
1. Confirm a real page/tool/file exists and the primary route resolves.
2. Check rights, private dinner details, image consent and source attribution.
3. Assign one canonical ID with a single primary route and optional alternate outputs.
4. Use intents based on what a visitor can actually do, not internal project names.
5. Mark untested recipes/experiments as prototypes.
6. Verify search facets, keyboard access, mobile layout, and alternate links.
7. Do not publish until explicit approval.

## Future scalability, without premature infrastructure

This is currently an in-repository manifest, suitable for small curated collections. When real entries number in the hundreds, migrate the **same record contract** to a reviewed content service or CMS. Then add server-side indexing, query-string state, analytics grounded in actual use, typed publication entitlements, and saved personal libraries only if user research supports them.

Do not add 500 fake records to production. A test dataset does not validate database-scale latency, content operations, usability with real people, or member-access security.

## QA and release blockers

- Scoped TypeScript / ESLint and catalog integrity/500-record unit test
- Cross-device Playwright: search, category/format intersections, zero-result reset, navigation, actual print route and horizontal-overflow check
- Keyboard and screen-reader human testing still required
- Existing application-wide TypeScript / ESLint debt remains in old routes
- Remaining Next/PostCSS high-severity issue and a moderate dependency advisory are unresolved
- Real kitchen validation and actual photos for Taco Night outstanding
- No changes to commerce, customer data, live membership or production deployment; release requires approval

## Practical follow-up

After usability testing, map the next *real* historical artifact into this same scheme. The Maine at Golden Hour private PDF must first be reviewed and approved for publishing before any public metadata, guest details or download links are added.
