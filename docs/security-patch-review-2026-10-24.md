# Wine With Pete · Security Patch Candidate (Review Only)

**Status:** Draft GitHub pull request only. No production merge, deployment, branch policy or Vercel project configuration has changed.

## Why

The existing `main` branch uses Next.js 15.5.7, React 19.1.2, and an older dependency lockfile. In GitHub Actions run `40135941689` its `npm audit --omit=dev --audit-level=critical` found **8 advisories: 1 critical, 6 high, 1 moderate**, blocking unrelated CI validation. This is an existing main-branch dependency risk, **not caused by the safeguards policy changes**.

## Scope

- Reuse the exact `package.json` and `package-lock.json` Git blobs from the tested Explore feature branch at commit `462f6cdeb7da2af255d04774d31b363f3f9c148d`.
- That package manifest includes Next.js **15.5.28**, React/React DOM **19.1.10**, Sharp **0.35.5**, and an exact Playwright dev-test dependency; it does **not** switch Next.js to a new major version.
- Keep the original lockfile from that feature-branch checkpoint so `npm ci` installs reviewed versions reproducibly.
- Do not update Stripe, Supabase, Next config, application behavior or production secrets as part of this patch.

The candidate security PR is based on the *unmerged safeguards working branch* `work/wwp-deployment-safeguards-v01`. Its additional changes relative to `main` include PR #10's proposed `work/*` deployment suppression and read-only validation checks. **Review both PRs together and never mistake the stacked PR's extra policy diff for unrelated dependency changes.**

## Validation and remaining security risk

Validation required before any release:
- `npm ci` and `npm audit --omit=dev --audit-level=critical` against this exact candidate;
- commerce typecheck and lint from the base workflow, plus a real Next build and representative regression tests if compatible with existing configuration;
- review the difference in CVE/advisory findings, and explicitly triage any high/moderate advisories instead of treating only `critical=0` as a complete release gate;
- verify a Vercel protected preview only when quotas permit and Peter approves preview generation.

The earlier Explore feature branch had **zero critical** advisories, but **one high transitive Next/PostCSS** and **one moderate** advisory. These findings may remain in this patch; recheck current audit output. Existing application-wide TypeScript/lint failures remain independently unresolved.

## Integration proposal, not authorization

1. Confirm this candidate's QA and the safeguards PR #10 checks; identify unresolved high-severity issues and release risk.
2. Decide explicitly whether to combine the two PRs into one security-aware rollout, or to merge in a reviewed sequence with a tested rollback. Do not merge either merely because it exists.
3. Independently make the Explore feature PR #9 CI read-only, so the next feature session does not regenerate commits.
4. Verify on the exact later production commit after separately granted approval.

**Release authority:** Peter. This file is a preparation and review record only.

## Fresh review — November 5, 2026

The current production branch still fails `npm audit --omit=dev --audit-level=critical`: an independently observed GitHub Actions run on Nov 5 reported **8 production advisories: 1 critical, 6 high and 1 moderate**, so non-security homepage PR #13 is blocked. This is **the production baseline**, not a finding against this draft PR #11.

PR #11's original Oct 24 CI passed `npm ci`, critical audit, commerce typecheck, and commerce lint. That earlier success does not establish current compatibility with newly disclosed advisories or a full application build.

A **read-only** `Security Release Review` workflow has been added to this draft branch. It runs the current live npm advisory database at a stronger **high** severity threshold and executes `npm run build` on the same lockfile. Both checks report separately even if one fails, and the job fails overall unless both pass. No Vercel deployment or production release is authorized. Because `next.config.ts` presently ignores application-wide TypeScript/lint failures during `next build`, a successful build by itself is insufficient for full QA.

**Interpretation / next gate:** inspect fresh workflow logs, note exact advisory IDs and affected package versions, choose the least-disruptive supported patch set consistent with actual advisories, and rerun. Do not blindly use `npm audit fix --force` or assume moving to a new Next.js major is required. Retain review of security/deployment PR #10 stacking and independent commerce-hardening PR #8. Any approved release will need a fresh integrated commit, signed-off regression tests, and explicit owner approval.
