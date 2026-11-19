# Founding Table audience reconciliation — November 19, 2026

**Status: counts and source history verified; individual overlap, current Kit status, and historical consent remain unresolved. No import, reactivation, campaign, or contact mutation is authorized by this note.**

## Distinct ledgers, not one total

| Source / grain | Verified evidence | What the number does *not* establish |
| --- | --- | --- |
| Mailchimp subscribed-segment export → Kit import | A self-emailed historical Mailchimp-format CSV contained **62 distinct contacts**. Kit's **July 4, 2025** “Import is done” email confirmed **62 subscribers added**. | Not 62 active Kit subscribers today; not 62 contacts absent from Supabase; not independent proof of current marketing consent. |
| Wine With Pete website / Supabase `newsletter_subscribers` | November 18 production read-only query: **16 distinct records**, **15 active** historical website signups (Sep 2025–Jul 2026) and **1 inactive QA record** from a successful test subscribe/unsubscribe on Nov 18. | Not 15 people proven new relative to Kit. `is_active` is a system status, not complete historic consent provenance. |
| Resend | Verified as delivery transport for the website's welcome email and authenticated campaign path. | Not a separate list to add to either audience. |
| Loops / Substack | Separate legacy or publication paths. No verified active integration or reconciled audience count in this assessment. | Not grounds for adding another count or automatically importing contacts. |

These are different **systems, dates, and status definitions**. The historical Kit-import set of 62 and the 15 active site records might share anywhere from 0 to 15 exact email identities. If those two static sets were the only inputs, their union would be **62–77 distinct records**, but that is *not* a current active, consented, reachable audience size. Kit's current list could have changed since July 2025.

## Quality and consent findings

- **Duplicate/overlap check: not yet runnable.** Current Kit subscribed, unsubscribed, and suppressed exports are unavailable without Kit account access. The present Supabase connector does not have permission to the production Wine With Pete project `nybsqanrdltoaoraejpt`. Do not infer overlap from dates or aggregate counts.
- **Historical Mailchimp metadata has limitations.** In 59/62 CSV rows, `OPTIN_TIME` equals `CONFIRM_TIME`; in 3/62, the confirmation timestamp precedes the opt-in timestamp. This is insufficient to establish a verified double-opt-in history for each address.
- **Website provenance is incomplete.** At the November 18 read-only audit, 13/15 active Supabase historical rows had empty/null `preferences`. The schema did not independently record explicit `source`, `consented_at`, or `unsubscribed_at` fields. The new signup/rejoin flow now records better evidence for future actions, without retroactively proving consent for older contacts.
- **Signup and opt-out operation is verified.** The November 18 live single-address QA preserved the original 15 active records and ended with one inactive test contact. The dangerous broad newsletter table grants/policies had already been removed and verified. This resolved the production security gate, not the old-list provenance question.

## Smallest useful next reconciliation

1. **Source snapshots, read-only:** obtain Kit's *current* subscribed, unsubscribed and suppressed states with historical source/consent evidence, and a separately authorized current Supabase snapshot including statuses and recorded provenance. Capture extraction dates. Include the archived Mailchimp import only as a historical baseline.
2. **Compare at the right grain:** normalize email cautiously (trim outer whitespace and compare case-insensitively); do **not** strip Gmail dots or plus-tags globally. Report distinct records per source, exact email intersection, Kit-only, site-only, and status disagreement counts. Keep source IDs and raw emails in a restricted local or approved data environment—never commit them to this repository, embed them in analytics, or paste them into a broad project log.
3. **Resolve consent and suppression before considering any send:** check source/date of permission, unsubscribe and bounce/suppression state, and conflicting records. An old import or current database `is_active` flag alone does not establish permission for a new campaign. Never silently reactivate suppressed contacts.
4. **Report aggregates, then decide:** create a dated, source-backed count table with `historical_imported`, `current_Kit_subscribed`, `current_site_active`, `overlap`, `unique_currently_permissioned` and `unknown_consent`, with explicit definitions. Review candidate recipients before any first Founding Table message. Do not make a mass-email plan until this step.

**Working platform distinction:** Supabase is the current website's signup/suppression ledger, Resend is its transport, Kit is a historical audience requiring audit, and Loops is dormant/optional. This is an operating hypothesis for reconciliation, not a command to cancel providers or migrate contacts.

## Evidence receipts

- Gmail: Kit, subject **“Import is done”**, dated **July 4, 2025**, confirming 62 imported subscribers (read-only search Nov 19).
- The archived self-emailed Mailchimp subscribed-segment CSV and its 62-unique-contact count were reviewed Nov 18; current Kit state remains unverified.
- November 18 authenticated production Supabase aggregate-only verification and the safe Join/welcome/unsubscribe QA are recorded in Peter OS `20_Projects/Wine_With_Pete.md`. No personal addresses are reproduced here.
