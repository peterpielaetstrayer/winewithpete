# Wine With Pete · deployment efficiency safeguards (draft proposal)

**Status:** draft configuration for review. Not installed on `main`, not merged, no Vercel project settings changed. 

## Why this exists

The current Wine With Pete Explore draft PR #9 accumulated **62 commits**, while 46 feature-branch deployments appeared among 54 deployment records reviewed on October 24, 2026. A separate preview deployment later hit the Vercel Hobby deployment cap. The build/preview cycle had been coupled too closely to small GitHub file writes.

We will change that in stages, rather than disabling all deployments.

## Proposed behavior

`vercel.json` would exclude automatic Git deployments for **`work/*`** branches only, using Vercel's `git.deploymentEnabled` setting.

| Branch | Vercel Git behavior after configuration is present on that branch |
| --- | --- |
| `work/my-change` | Automatic deployment disabled |
| `review/my-change` | Default automatic preview remains enabled |
| `feature/interactive-field-guides-v01` | Default automatic preview remains enabled |
| `main` | Default production behavior remains enabled |

This is a narrowly scoped branch-based pilot, not a blanket disable, a billing change, or a rule requiring use of only these branch names.

**Important limitation:** The file must be present in the branch revision that Vercel evaluates. Branches based on older commits lacking this file may still deploy. Creating an initial branch containing a configuration file can itself produce a Git event; verify actual deployment behavior rather than assuming zero usage.

Reference: [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration). Vercel documents `git.deploymentEnabled` object rules and minimatch patterns; branches not specified default to enabled.

## CI behavior

Existing `.github/workflows/validate.yml` on `main` **already** uses `permissions: contents: read`, `npm ci`, and nonmutating commands. This PR intentionally preserves those validations.

It proposes only two improvements:
- `persist-credentials: false` for the checkout step, so the job does not retain Git push credentials.
- `concurrency: cancel-in-progress: true` for superseded runs of the same PR/branch, reducing redundant compute.
- A no-dependency Node check ensuring only `work/*` has been excluded in the configuration.

**Separate remaining issue:** `.github/workflows/field-guide-qa.yml` exists only on **PR #9's feature branch**, not on `main`. That workflow currently has `contents: write`, installs or audits with mutation, and may commit/push updated dependency files. This separate safeguards PR **cannot directly edit a file absent from its `main` base** without creating misleading parallel workflow state. Before PR #9 is considered for merge, revise that file in its own branch to:

1. use `contents: read` and checkout with `persist-credentials: false`;
2. install only existing locked versions with `npm ci`, ensuring `package.json` and lockfile are committed together;
3. remove `npm install --save-exact`, `npm audit fix`, and the entire "Commit reviewed security versions and lockfile" Git push step;
4. run relevant scoped unit, lint, typecheck and browser tests without changing tracked files;
5. report remaining high-severity vulnerabilities and historical whole-app type/lint failures truthfully, without weakening release gates;
6. verify the resulting workflow before merging any feature with it.

Do not silently delete it or assume the existing `Validate` job covers the same tests. The eventual PR #9 maintenance belongs in a separate approved change to that PR.

## Rollout protocol after explicit approval

1. Review this PR's exact diff and green read-only GitHub checks. Confirm the new `vercel.json` does not override any project-level behavior. Confirm production branch, protected previews, and current Vercel Git settings.
2. Approve and merge only with separate, explicit authorization. Do not equate a draft PR with approval.
3. Create **one small nonproduction `work/*` branch** from the updated `main`; push one harmless commit and verify Vercel lists no new automatic deployment for it.
4. Create an intentionally chosen `review/*` branch from the updated `main` and verify one protected preview is created for its exact commit (after quota allows).
5. Check that `main` was not redeployed unexpectedly and that production behavior is unchanged. Do **not** manufacture a production push merely to test a policy.
6. Compare deployments per productive milestone, CI run counts, ability to review previews, and time spent over two substantial sessions.

## Rollback

Revert this PR's `vercel.json` (or remove its `work/*` rule) and the `validate.yml` check in a reviewed Git commit. No Vercel environment variables, domain aliases, pricing, payments, database schema, or project-level deployment settings are to be changed.

## Approval boundary

**This PR is preparation only.** No merge, live publication, project setting change, new paid plan, or automatic implementation in OWLL/LOCUS is authorized. The existing Explore feature PR is untouched.
