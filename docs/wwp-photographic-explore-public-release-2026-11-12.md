# Wine With Pete — Photographic Explore Release Manifest

**Date:** November 12, 2026  
**Scope:** Explore photographic redesign on top of live Release 2.  
**Authorization:** User explicitly approved the prior private photographic design proof and instructed to go live.  
**Delivery:** Eight previously prepared optimized WebP derivatives only. Original Google Drive photographs remain private. No raw JPEGs, camera originals, GPS/EXIF, additional private files or identifiable guest portrait photos are included.

| Public derivative | Display role | Factual context/limit |
|---|---|---|
| `hero-seoul-bowl.webp` | Explore opening and Seoul Bowl featured cover | Real Seoul Bowl table with printed event menus, no other event attribution |
| `from-fire.webp` | Cook navigation | Real outdoor cooking, not labeled as a specific recipe |
| `wine-table.webp` | Taste navigation | Wine table and menus, no claimed tasting date |
| `set-table.webp` | Gather navigation | Actual prepared table with paper menus, no guest identities |
| `work-service.webp` | Stories navigation | Real plated service, no fabricated event or course |
| `ingredients.webp` | Behind the scenes and archive vignette | Ingredients and preparation; do not claim specific published recipe |
| `fire-wings.webp` | Food vignette | Actual cooked wings; **not** attributed to Chipotle Lime Fire Wings recipe |
| `outside-cheese.webp` | Hospitality/archive vignette | Real cheese outdoors, no invented location/date |

**Privacy/provenance checks:** Public derivatives were retrieved from the previous private photo-review proof and validated as RIFF WebP files with VP8 image payload and no EXIF, XMP or ICCP metadata chunks. No identifiable people are depicted in these eight selected food/table/process scenes; menus and wine labels are part of the photographed Wine With Pete hospitality context. Public repository assets are intentionally public and must not be used for other contexts without separate review.

**Quality and rollback:** Exact-path file presence and metadata integrity are CI-gated by `tests/photo-publishing-safety.test.mjs`; Playwright verifies image loading and existing Explore catalog behavior on mobile and desktop. Other site releases and paid checkout are not modified. Rollback through Vercel's prior READY production deployment or Git revert of this photographic release if problems arise.
