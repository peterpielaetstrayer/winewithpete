# Explore photographic integration v0.3 · private asset gate

Status: **unmerged development branch for review**; no Vercel deployment requested, no production release authorized.

## Creative decision
Peter approved the atmosphere and art direction of private Explore v0.2. Port the editorial structure to the existing React/Next.js Explore page without rewriting catalog logic, creating fictitious experiences or altering checkout/member systems.

## IMPORTANT: The GitHub repository is PUBLIC
Vercel SSO/noindex does not make GitHub blobs private. Google Photos originals and derivative image files are **intentionally absent from this GitHub branch**. A separate local ZIP from the conversation contains the eight optimized, metadata-stripped WebP files. Do not commit, merge into public source, deploy, or publish real images until their provenance, photographer rights, guest/venue privacy and any menu details are explicitly approved by Peter.

## How the design works
- The existing hero, all four catalog entries, text search, format filtering, ranking and alternate links remain.
- A photographic hero, four editorial Cook/Taste/Gather/Stories actions, a behind-the-scenes feature, and three photographic vignettes appear before the existing catalog.
- Editorial lane buttons change the **same** React catalog intent state and scroll to the collection; no duplicate catalog or second database.
- True photos are enabled only by `NEXT_PUBLIC_WWP_EXPLORE_PHOTOS=true` **at build time**. The default is OFF, rendering fully styled safe gradients and graphic covers; no missing image requests.
- The Seoul Bowl story is the only catalog cover linked to a photograph. Other covers remain graphic until specific dish/event provenance is checked.
- Media paths are `/public/images/explore-v03/{hero-seoul-bowl,from-fire,wine-table,set-table,work-service,ingredients,fire-wings,outside-cheese}.webp`. Photos have appropriate alt text when turned on. Images are derivatives, not Drive links or personal EXIF data.
- The page retains `robots: noindex` and must receive mobile, keyboard and security QA before any protected preview.

## Local review procedure
1. Download the separately delivered private `Wine_With_Pete_Explore_v0.3_Private_Photos.zip` artifact from this ChatGPT conversation.
2. Copy the eight contained `images/*.webp` files into local `public/images/explore-v03/` **without committing them**. See the package README.
3. Run `NEXT_PUBLIC_WWP_EXPLORE_PHOTOS=true npm run build` (Windows PowerShell: `$env:NEXT_PUBLIC_WWP_EXPLORE_PHOTOS="true"; npm run build`) and inspect the local app. Do not use a public Vercel deployment for this mode.
4. Run Playwright on desktop 1280px and mobile 390px; confirm no overflow, lane filters, search, page routing, focus, responsive crops and photo identities.

## QA and release gates
- New `explore-photo-pilot.yml` read-only CI checks repository **safe mode** (flag off) with `npm ci`, isolated typecheck, lint, unit tests, Next build, Chromium browser tests and critical-dependency audit; no install mutation or Git writes.
- Await results before claiming CI passed.
- Full-app legacy TS/lint debt and high/moderate dependency advisories require separate triage. This integration does not replace security PR #11 or safeguards PR #10.
- Verify consent for private photos, proper attribution if needed, and whether the repository should remain public or licensed photos should be published in a new reviewed release.
- A public GitHub branch is **not** a private review environment, even though branch-specific Vercel auto-deploy should be disabled by the proposed `vercel.json`.

## Approved scope
Code and low-deployment QA preparation. Not authorized: putting private photos in public GitHub, automatic Vercel settings changes, PR merge, publication, domain assignment, customer email, or spending.
