# Wine With Pete

The public website for Wine With Pete: an editorial hospitality world about cooking, wine, fire, stories, and bringing people to the table.

Stack: Next.js 15, TypeScript, Tailwind, Supabase, Stripe, and existing hosted integrations. Some integrations are deliberately restricted while their release checks remain open.

## Work locally

```bash
npm ci
npm run dev
```

Use `.env.example` as the environment-variable reference. Do not commit `.env.local` or real credentials. Do not use placeholder credentials to test real external signup, order, or administrative flows.

## Checks

```bash
node --test tests/*.test.*
npx tsc -p tsconfig.field-guides.json --noEmit
npx eslint src/app/explore/page.tsx src/app/recipes/page.tsx src/data/explore/experiences.ts
npm run build
npx playwright test
```

Playwright runs the supported field-guide, Explore, and Giscours flows on mobile and desktop. A Chromium-capable runtime is required. `WWP_SYSTEM_CHROMIUM` optionally points to a locally installed browser executable; CI uses the default Playwright browser.

## Current release posture

- The live editorial and free-guide experiences are public; the `Explore` collection deliberately contains only verified entries.
- Published recipes and the Better Taco Night kitchen-test guide are available without payment.
- New direct first-party digital purchases remain **paused**. Do not reopen them until Stripe webhook replay/idempotency has been corrected and independently tested. Do not mistake a passing test which *demonstrates* the replay risk for a release gate passing.
- Proposed collaborative gathering tools, Fire School host kits, member accounts, and paid AI assistance are discovery work, **not** live customer promises.
- Publish and production merge only after review, CI, mobile/desktop browser QA, and live integration checks.

See [`docs/wwp-website-stabilization-2026-11-18.md`](docs/wwp-website-stabilization-2026-11-18.md) for the verified baseline, outstanding QA, and next release sequence.
