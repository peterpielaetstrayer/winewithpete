# Wine With Pete — private gathering inquiry v0 proposal

**November 19, 2026 | Status: browser-only v0 released; not a hosted booking service or confirmed operating policy**

**Release update:** [PR #30](https://github.com/peterpielaetstrayer/winewithpete/pull/30) was squash-merged as `778712b6b8c88bfe51c0e4e5f40170f383ff74ff`. Vercel production was READY and aliased to `winewithpete.me`; both `/signature-table` and `/plan` returned HTTP 200 with the composer and explicit no-send/no-storage language. Three PR workflows passed, and the preview interaction was checked in a browser. Peter delegated release judgment for high-confidence low-risk changes. The email-first boundary remains; real-device/assistive-tech testing and inquiry-response operations remain follow-up items.

**November 19 production verification:** Both live inquiry pages (`/signature-table` and `/plan`) accepted synthetic details and prepared offer-specific email drafts without submitting data to a backend. The Signature Table copy action succeeded; no email was sent. Targeted TypeScript and lint checks, 14 editorial/security unit checks, and a production build with placeholder credentials passed. Local Playwright web-server startup was blocked by the workspace runtime (`uv_interface_addresses`), while the previously shipped PR browser workflows had passed. Vercel reported no aggregated runtime errors over 24 hours and no error/fatal entries in the latest 30-minute log window. The email-client delivery and real-device checks remain open, and the broader multi-participant gathering kit is a separate future product.

## Why this exists

The public Gather page clearly distinguishes a **Signature Table** (Pete designs and hosts a private evening) from a **Gathering Blueprint** (Pete designs a plan that the customer hosts). Both detail pages currently use prefilled `mailto:` links. That is personal and does not require a database, but it asks the visitor to start writing in an email app before they have been helped to think through the essential details.

The proposal is to offer a short, on-page **conversation starter** on each offer page. It is not a booking flow, quote, commitment of availability, ticket purchase, or automated customer relationship manager.

## Released v0 experience

1. The hero call to action scrolls to the inquiry section. A direct email link remains available.
2. Visitor describes their city/area and what brings their people together (required). Name, timeframe, approximate guest count, and one offer-specific prompt are optional.
3. **Prepare an email** creates a readable draft entirely in browser memory. It does not submit a request.
4. Visitor reviews the draft and chooses **Open in my email app** or **Copy the message**. Only the visitor's actual email send contacts Pete. A selectable text preview remains available if clipboard access fails.

The composer does not request a separate email address, upload guest lists, retain entries in localStorage, or call an API. Existing site analytics may count an explicit mailto click but do not receive answers. Use no personal-data event labels or query strings in analytics.

## Offer distinction

| | Signature Table | Gathering Blueprint |
|---|---|---|
| Pete's role | Designs and hosts | Designs, customer hosts |
| Subject | Signature Table inquiry | Gathering Blueprint inquiry |
| Optional extra prompt | Space, food, wine or atmosphere to know about | Parts of planning where help is wanted |
| Business status | Inquiry only; no reserved date | Inquiry only; no committed deliverable or price |

## Original review gates and ongoing quality checks

- Peter can still review and refine the copy, number of questions, appearance, and tone. V0 was released under his delegated high-confidence release discretion; that is not an endorsement of every future modification.
- Mobile and desktop automated browser checks passed and the draft email was prepared in a manual preview browser session. **Still to check:** 200% zoom, physical-device/assistive-technology behavior, clipboard failure, and actual email-client handoff. A `mailto:` activation is **not** confirmed email delivery; do not count it as a lead received.
- Confirm the contact address and actual process for noticing and replying to inquiries. Do not promise a response time, pricing, geography, or capacity before Peter decides.
- Keep the existing `/api/gatherings/interest` route conceptually separate: it records community-table interest in Supabase and is not a private-service CRM.
- The prior Founding Table/Supabase permissions release gate was closed on November 18 (see the closure addendum in `docs/wwp-founding-table-operations-gate-2026-11-18.md`). **Any future backend inquiry storage or subscriber linkage** still requires separate privacy, retention, permission and consent decisions. V0 made no database/policy change.

## What would justify a true hosted form later?

Evidence that visitors cannot complete an email-draft inquiry, plus Peter's explicit decision on where inquiries are stored, who can access them, retention/deletion, spam protection, notification routing, reply workflow, privacy notice, and consent separation. If those are unresolved, the email-first experience stays the boundary.

## Pilot evaluation

With Peter's permission, try the draft with 3–5 people on their own phones. Ask them to describe what service is offered, find where to inquire, prepare a message, and explain whether they believe anything was sent. Observe friction without collecting their actual inquiry answers. Track qualitative findings before committing to a backend.
