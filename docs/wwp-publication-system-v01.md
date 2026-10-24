# Wine With Pete Digital Publication System · v0.1

**Working status:** Editorial and product architecture for review. Not a release or membership announcement.

## Decision

Create **one interconnected Wine With Pete collection** where stories, recipes, printable designs, interactive kitchen tools and gathering plans share their identity and provenance. **Do not make everything interactive**; publish each object in the format that best serves its audience.

### Formats and their jobs

| Format | Primary use | Typical experience |
| --- | --- | --- |
| Table Story | Understand and remember a real gathering | Cinematic editorial narrative, photographs, menu and reflection |
| Field Recipe | Cook a specific dish without distraction | Recipe text, ingredients, method, accessible print view |
| Interactive Field Guide | Navigate a multi-step task | Shopping, scaled quantities, step mode, tastings, notes |
| Printable Edition | Use offline, set on a table, collect | Designed PDF, printable menu / tasting mat / preparation guide |
| Gathering Blueprint | Re-create the **approach**, not impersonate the original gathering | Shopping, staging, timeline, table design and service flow |

## Content relationships

Each published object has a canonical internal ID and cross-links to related artifacts. Example: one dinner story may link to two recipes, one PDF, and a hosting blueprint. **Do not duplicate recipes independently inside each format**.

A small initial record might contain:
- slug / title / summary / editorial owner
- type and status (internal-only, draft, public, member, retired)
- source and provenance (original work, licensed/adapted source, first-hand event)
- release and rights review (personal details, guest/photography permissions, third-party recipes)
- hero/thumbnail image, alt text and photographer credit
- related table / recipes / PDF / guide paths
- recipe test date, source batch size, allergens, verified nutrition (optional)
- format-specific annotations (e.g. timeline, tasting notes, tested substitution)

No new database or general-purpose CMS is necessary until two different content types have been validated in actual use.

## Example mappings: existing work

| Working title | Evidence and present treatment | Proposed optional companion | Next status |
| --- | --- | --- | --- |
| The Better Taco Night | Untested WWP kitchen prototype with draft PDF and interactive route | Recipe card and tested photo sequence | Active prototype |
| Maine at Golden Hour | Source PDF located in owner's connected Drive: recipe / shopping guide, staged prep across kitchens | Optional stepwise prep timeline and shopping checklist | Source verified; permission/content review before publication |
| Château Giscours Vertical | Existing Table Archive route in web application | Vintage comparison / tasting mat only if source notes and rights support | Evaluate |
| Seoul Bowl Table | Existing Table Archive route in web application | Recipe(s) or hosting timeline if reusable | Evaluate |
| Cabana Dinner | Mentioned in prior project planning; source not yet verified | Original PDF and editorial recap | Locate source; parked |
| Morning Ritual Menu | Mentioned in prior project planning; original source not yet verified here | Digital essay, practical ritual steps if useful | Locate source; parked |

**Privacy:** A private Drive file is not automatically publishable. Never copy authenticated Drive URLs, personal guest names, or the contents of unreviewed source PDFs to the public repository. The tables above intentionally contain only conceptual publication metadata.

## Delivery model (proposal, not implemented)

**Public:** Stories, sample recipes, selected free guides and useful shareable introductions.
**Founding Table:** Early editions, printable menus, PDF field guides, behind-the-scenes notes and selected companion resources.
**Custom gathering clients:** Bounded tailored preparation resources, event-specific menus and planning artifacts.

At first, distribute member PDFs manually via controlled communications, clearly noting that private links are shareable and not secure access controls. Implement authentication, entitlements and payments only after confirming an actual member/access use case. Never claim a PDF is members-only simply because its URL is unlisted.

## What deserves interaction?

Use an interactive format **only if** it passes at least one of these tests:
1. Does the user need to track progress or resume?
2. Do quantities, schedules, choices or substitutions change the experience?
3. Does stepwise guidance reduce cognitive burden during real cooking or hosting?
4. Does participation add a meaningful personal note, tasting observation or memory?

If not, use a normal well-designed web story or printable PDF.

## Production workflow

1. **Capture:** Original menu, source recipes, field notes, owned photographs, written context.
2. **Rights + truth:** Validate what was cooked, who can be named/pictured, ingredient provenance and attribution.
3. **Editorial master:** Short canonical record linking source material without replacing originals.
4. **Format decision:** Story, recipe, interactive tool, printable edition, or a deliberate combination.
5. **Build:** Apply reusable WWP visual components. Make interactive tasks optional.
6. **QA:** Technical, responsive, accessibility, cooking accuracy and privacy checks.
7. **Review:** Explicit approval for public publishing or members-only distribution.
8. **Maintain:** Track corrected recipes, changed measurements and retired PDFs without silently overwriting event history.

## Priority and boundaries

**Primary outcome:** Make the Taco Night guide accessible and testable to a release-grade standard.
**Secondary outcome:** Prototype the Maine at Golden Hour experience as a *relationship between formats*, starting with its original PDF and a prep timeline concept, without republishing private material.
**Admin action:** Audit the library and mark each source as verified, unverified or permission review needed.

Not part of v0.1: Accounts, arbitrary user uploads, community galleries, calorie ranking claims, automated PDF generation, universal recipe import, algorithmic wine recommendations, subscriptions or payments.

## Release quality gate

- Critical/high dependency audit interpreted and remediated appropriately (no blind `npm audit fix --force`).
- Full application TypeScript + lint issues tracked separately from field-guide checks.
- Safe Next.js build and preview verification.
- Smartphone kitchen test (small/large text; safe tap targets; screen-reader headings; reload resilience).
- Recipe quantity tests at 3, 6, 9 and 12.
- Real kitchen tasting results and authentic food photos.
- Source, permissions, recipe attribution and member-access policy signed off.
- Explicit production-release approval.
