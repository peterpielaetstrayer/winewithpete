# Founding Table operational gate — November 18, 2026

**Status:** Code is reviewable; **do not merge/deploy** until the production database access policy is inspected. This is a focused post-v1 operational hardening change, not part of the collaborative Explore product.

## Scope of this change

- New Founding Table signups are saved through a **server-only Supabase service-role client** so correctly restricted RLS SELECT policies do not break the return of a subscriber ID.
- Welcome and admin-authenticated campaign emails each include an individually signed unsubscribe URL; the URL contains an opaque subscriber UUID, not an email address.
- Visiting `/unsubscribe` never changes a subscription. A separate explicit POST verifies an HMAC signature (constant-time check) and deactivates that subscriber. Repeated valid requests are harmless. Campaign sends fail closed if opt-out links cannot be generated.
- Welcome copy now reflects the current Wine With Pete Journal/Explore and occasional, not weekly, emails.
- No subscribers are imported, emailed, modified, or deleted by the code or its hermetic tests. No provider integrations have been silently switched on.

## Production database gate

The linked Supabase connector currently lists other projects, **not an identifiable Wine With Pete project**. Repository SQL files `fix-newsletter-simple.sql`, `fix-newsletter-rls.sql`, and `fix-newsletter-security.sql` contain historical policies that allow broad newsletter SELECT and/or UPDATE access if applied. Their **live application is unknown**. Never assume these scripts represent the current database.

Connect the exact production project used by the `NEXT_PUBLIC_SUPABASE_URL` deployed in Vercel, confirm its name/project ref (without sharing service-role keys), and inspect **read-only**:

```sql
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('newsletter_subscribers', 'gathering_interests')
order by tablename, policyname;

select n.nspname as schema_name, c.relname as table_name,
       c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('newsletter_subscribers', 'gathering_interests');
```

Before any live release, verify that public/anonymous clients **cannot SELECT or UPDATE newsletter rows**. A newsletter signup is allowed only through the server route, which uses the service-role key strictly on the server. If existing policies are unsafe, prepare a separate reviewed migration; do not apply historical broad-access scripts. Check active campaign administration separately.

## Verification gate

1. Validate source CI, TypeScript, lint, and production build. Hermetic tests must cover signature tampering, absent secret, invalid POST without DB access, idempotent unsubscribe, welcome-link creation, and per-recipient campaign links.
2. Use a single explicitly authorized disposable test address to verify Join → Supabase active subscriber → delivered welcome email → link confirmation → Supabase inactive subscriber. Verify campaign selection excludes inactive rows without sending a mass campaign.
3. Test Gather interest submission separately with explicit consent choice, without quietly joining the newsletter.
4. Confirm the current subscriber list is reconciled with the old Kit service. **Supabase does not automatically sync to Kit**; the legacy Kit endpoint is separate, and Loops is not configured. Choose the canonical mailing-list system before launching routine sends.
5. Verify a reliable route for a previously unsubscribed reader to request re-enrollment. At present, duplicate signup is reported as already on file and does not automatically reactivate. Do not reactivate without verifiable consent.
6. Monitor the production deployment, opt-out route, and errors only after all preceding gates pass.

**Live release status:** Held for project-level RLS access and approved test contact. No mass send, DB policy mutation, or production deployment is authorized merely by this document.
