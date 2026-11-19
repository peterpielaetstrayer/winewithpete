# Wine With Pete — private gathering inquiry v0 proposal

**November 19, 2026 | Status: draft prototype, not a released service or confirmed operating policy**

## Why this exists

The public Gather page clearly distinguishes a **Signature Table** (Pete designs and hosts a private evening) from a **Gathering Blueprint** (Pete designs a plan that the customer hosts). Both detail pages currently use prefilled `mailto:` links. That is personal and does not require a database, but it asks the visitor to start writing in an email app before they have been helped to think through the essential details.

The proposal is to offer a short, on-page **conversation starter** on each offer page. It is not a booking flow, quote, commitment of availability, ticket purchase, or automated customer relationship manager.

## Draft experience

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

## Review gates before publishing

- Peter reviews the copy, number of questions, appearance, and whether the interaction feels like a personal invitation rather than a corporate intake form.
- Mobile and desktop browser tests, keyboard labels, 200% zoom, copy fallback, and no-email-client fallback are verified. In particular, successful mailto activation is **not** equivalent to confirmed delivery; do not count it as a lead received.
- Confirm the contact address and actual process for noticing and replying to inquiries. Do not promise a response time, pricing, geography, or capacity before Peter decides.
- Keep the existing `/api/gatherings/interest` route conceptually separate: it records community-table interest in Supabase and is not a private-service CRM.
- Production Founding Table/Supabase permission hardening and consent validation documented in `docs/wwp-founding-table-operations-gate-2026-11-18.md` must be reconciled before **any** new backend inquiry storage or shared subscriber linkage. No database/policy modification is part of this prototype.

## What would justify a true hosted form later?

Evidence that visitors cannot complete an email-draft inquiry, plus Peter's explicit decision on where inquiries are stored, who can access them, retention/deletion, spam protection, notification routing, reply workflow, privacy notice, and consent separation. If those are unresolved, the email-first experience stays the boundary.

## Pilot evaluation

With Peter's permission, try the draft with 3–5 people on their own phones. Ask them to describe what service is offered, find where to inquire, prepare a message, and explain whether they believe anything was sent. Observe friction without collecting their actual inquiry answers. Track qualitative findings before committing to a backend.
