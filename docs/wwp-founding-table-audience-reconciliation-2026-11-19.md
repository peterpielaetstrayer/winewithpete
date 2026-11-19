# Founding Table audience reconciliation — November 19, 2026

**Status: counts and source history verified; individual overlap, Kit contact-level identities and remaining suppression states, and historical consent remain unresolved. Kit's 53 confirmed is an owner-reported count, not yet reconciled from a roster. No import, reactivation, campaign, or contact mutation is authorized by this note.**

## Distinct ledgers, not one total

| Source / grain | Verified evidence | What the number does *not* establish |
| --- | --- | --- |
| Mailchimp subscribed-segment export → Kit import | A self-emailed historical Mailchimp-format CSV contained **62 distinct contacts**. Kit's **July 4, 2025** “Import is done” email confirmed **62 subscribers added**. | Not 62 active Kit subscribers today; not 62 contacts absent from Supabase; not independent proof of current marketing consent. |
| Kit chart and unsubscribe filter (Nov 19, 2026) | A user-provided Kit **Total subscribers** chart CSV has **56** for each of 32 days (Oct 19–Nov 19, 2026). A Kit **Unsubscribed** status screenshot shows **3 cancelled** records, all originally dated Jul 4, 2025; cancellation dates were Jul 14, Jul 28, and Oct 2, 2025. On Nov 19 the owner reported that the remaining **53 are confirmed**. | Chart is not a contact roster or a count of currently confirmed/sendable records: Kit documents that the historical Total chart can include active and cancelled contacts and exclude other suppression statuses. No overlap can be deduced from this count; cancelled contacts must not be reactivated. |
| Wine With Pete website / Supabase `newsletter_subscribers` | November 18 production read-only query: **16 distinct records**, **15 active** historical website signups (Sep 2025–Jul 2026) and **1 inactive QA record** from a successful test subscribe/unsubscribe on Nov 18. | Not 15 people proven new relative to Kit. `is_active` is a system status, not complete historic consent provenance. |
| Resend | Verified as delivery transport for the website's welcome email and authenticated campaign path. | Not a separate list to add to either audience. |
| Loops / Substack | Separate legacy or publication paths. No verified active integration or reconciled audience count in this assessment. | Not grounds for adding another count or automatically importing contacts. |

These are different **systems, dates, and status definitions**. The historical Kit-import set of 62 is an archive baseline, not a current contact count. The owner's 53 current Kit confirmed contacts and the 15 active site records might share anywhere from 0 to 15 exact email identities; their union is therefore **53–68 distinct currently active-in-source records**. This is *not* yet a count of uniquely permissioned, reachable contacts, because overlap, consent, and suppression conflicts require a row-level check.

## Quality and consent findings

- **Duplicate/overlap check: not yet runnable.** Kit's Total subscribers chart and three unsubscribed/cancelled statuses are now verified from user-provided Nov 19 exports/screenshot. Full Kit confirmed, cancelled and other suppression-state **contact-level** exports remain unavailable for comparison. A read-only Nov 19 search of the connected personal Gmail found only the Kit **Total Subscribers chart** CSV export confirmation, not a current Kit subscriber-roster export. The present Supabase connector does not have permission to the production Wine With Pete project `nybsqanrdltoaoraejpt`. Do not infer overlap from dates or aggregate counts.
- **Historical Mailchimp metadata has limitations.** In 59/62 CSV rows, `OPTIN_TIME` equals `CONFIRM_TIME`; in 3/62, the confirmation timestamp precedes the opt-in timestamp. This is insufficient to establish a verified double-opt-in history for each address.
- **Website provenance is incomplete.** At the November 18 read-only audit, 13/15 active Supabase historical rows had empty/null `preferences`. The schema did not independently record explicit `source`, `consented_at`, or `unsubscribed_at` fields. The new signup/rejoin flow now records better evidence for future actions, without retroactively proving consent for older contacts.
- **Signup and opt-out operation is verified.** The November 18 live single-address QA preserved the original 15 active records and ended with one inactive test contact. The dangerous broad newsletter table grants/policies had already been removed and verified. This resolved the production security gate, not the old-list provenance question.

## Migration decision and gates (Nov 19)

- **Direction approved in principle:** consolidate current Kit-confirmed Wine With Pete subscribers into the existing Supabase newsletter ledger; retain existing website signups and use Resend for email delivery. The owner reports **53 Kit confirmed**, **3 Kit cancelled**, and the latest site snapshot has **15 active** and **1 inactive test**.
- **No live import yet.** Required first: (1) current Kit roster export with individual statuses, (2) a secure current read of the correct production WWP Supabase project, and (3) source/permission review for old import records. The configured Supabase connector did not have permission to WWP production at the last audit; do not work around the denial.
- **Preflight result:** normalize exact email identities conservatively, report 53 Kit confirmed / 15 site active / overlap / suppressed conflicts / net new candidates. Match and retain consent provenance, do not assume later site signup means unique. Any conflicting or unknown status gets held for review; a later explicit opt-in may supersede an earlier opt-out only with evidence.
- **Suppression must travel too:** preserve the 3 Kit cancellations and any bounce/complaint/block records as non-sendable suppression evidence, not as newly active newsletter subscribers. A new import must never silently reactivate them, including where another older source contains the same email.
- **Release gate:** verify before/after totals and spot-check statuses in a controlled staging/dry-run first; no first Founding Table broadcast, vendor cancellation, or mailing-service sync is implied by consent to migrate.

## Smallest useful next reconciliation

1. **Source snapshots, read-only:** obtain Kit's *current* subscribed, unsubscribed and suppressed states with historical source/consent evidence, and a separately authorized current Supabase snapshot including statuses and recorded provenance. Capture extraction dates. Include the archived Mailchimp import only as a historical baseline.
2. **Compare at the right grain:** normalize email cautiously (trim outer whitespace and compare case-insensitively); do **not** strip Gmail dots or plus-tags globally. Report distinct records per source, exact email intersection, Kit-only, site-only, and status disagreement counts. Keep source IDs and raw emails in a restricted local or approved data environment—never commit them to this repository, embed them in analytics, or paste them into a broad project log.
3. **Resolve consent and suppression before considering any send:** check source/date of permission, unsubscribe and bounce/suppression state, and conflicting records. An old import or current database `is_active` flag alone does not establish permission for a new campaign. Never silently reactivate suppressed contacts.
4. **Report aggregates, then decide:** create a dated, source-backed count table with `historical_imported`, `current_Kit_subscribed`, `current_site_active`, `overlap`, `unique_currently_permissioned` and `unknown_consent`, with explicit definitions. Review candidate recipients before any first Founding Table message. Do not make a mass-email plan until this step.

**Working platform distinction:** Supabase is the current website's signup/suppression ledger, Resend is its transport, Kit is a historical audience requiring audit, and Loops is dormant/optional. This is an operating hypothesis for reconciliation, not a command to cancel providers or migrate contacts.

## Evidence receipts

- November 19 user-provided Kit Total subscribers chart CSV: 32 daily values, all 56; Kit Unsubscribed filter screenshot: three cancelled, no raw email addresses retained in this note. Kit chart definition: https://help.kit.com/en/articles/2502526-understanding-the-subscribers-charts-in-kit.

- Gmail: Kit, subject **“Import is done”**, dated **July 4, 2025**, confirming 62 imported subscribers (read-only search Nov 19).
- The archived self-emailed Mailchimp subscribed-segment CSV and its 62-unique-contact count were reviewed Nov 18; current Kit contact-level status and identity overlap remain unverified.
- November 18 authenticated production Supabase aggregate-only verification and the safe Join/welcome/unsubscribe QA are recorded in Peter OS `20_Projects/Wine_With_Pete.md`. No personal addresses are reproduced here.
