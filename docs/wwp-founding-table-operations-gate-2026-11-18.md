# Founding Table operational gate — November 18, 2026

**Status:** Production database permissions inspected on November 18, 2026; **release remains held until the server-route fix is deployed and the dangerous live grants/policies are removed and verified**. This is a focused post-v1 operational hardening change, not part of the collaborative Explore product.

## Scope of this change

- New Founding Table signups are saved through a **server-only Supabase service-role client** so correctly restricted RLS SELECT policies do not break the return of a subscriber ID.
- Welcome and admin-authenticated campaign emails each include an individually signed unsubscribe URL; the URL contains an opaque subscriber UUID, not an email address.
- Visiting `/unsubscribe` never changes a subscription. A separate explicit POST verifies an HMAC signature (constant-time check) and deactivates that subscriber. Repeated valid requests are harmless. Campaign sends fail closed if opt-out links cannot be generated.
- Welcome copy now reflects the current Wine With Pete Journal/Explore and occasional, not weekly, emails.
- No subscribers are imported, emailed, modified, or deleted by the code or its hermetic tests. No provider integrations have been silently switched on.

## Production database gate

**Confirmed production:** Supabase organization **Wine With Pete**, project `winewithpete website`, ref `nybsqanrdltoaoraejpt` (accessed through Peter's authenticated Supabase dashboard). The separately connected Supabase API tool does **not** include this organization, so dashboard inspections below were read-only SQL Editor queries. Historical SQL files did not establish live state; the live database was verified directly.

**Observed state on November 18, 2026:**

- `public.newsletter_subscribers`: RLS enabled, but policy `Allow newsletter reading` grants `SELECT USING (true)` to `{public}`, and `Allow newsletter updates` grants `UPDATE USING (true) WITH CHECK (true)` to `{public}`; `Allow newsletter subscriptions` grants `INSERT WITH CHECK (true)` to `{public}`.
- `anon` and `authenticated` both have effective `SELECT`, `INSERT`, `UPDATE`, and `DELETE` table privileges and `USAGE` on the `public` schema. In combination with the above policies, the subscriber list is readable and updateable by anonymous API clients. **Treat this as confirmed high-priority exposure; do not publish the opt-out feature while it remains.**
- `public.gathering_interests`: RLS enabled, **no policies**; public roles have table privileges, but RLS presently denies them row access. Its write route already uses the server service-role client.
- Aggregate-only counts: **15/15 newsletter rows active**, **2 gathering-interest rows**, both marked newsletter-opted-in. No email addresses or names were extracted for this audit. The older Kit audience count has not been reconciled with this database.
- Supabase Security Advisor has 8 warnings. Other permissive INSERT policies affect `event_rsvps`, `orders`, and `order_items` (RLS SELECT policies absent), and there are separate mutable function search-path, leaked-password-protection, and Postgres security-patch warnings. Track these as follow-up security review; do not conflate with the confirmed subscriber read/update exposure.

**Code prerequisite added to this branch:** The legacy `/api/baseline-method/subscribe` route previously inserted with an anonymous client and returned a full subscriber row. It now inserts through the server-only service-role client and selects/returns only `id`. The no-longer-used anonymous newsletter mutation helper was removed from `src/lib/supabase/database.ts`. The main `/api/newsletter/subscribe`, `/api/gatherings/interest`, campaign, and unsubscribe routes already use the server-only client.

**Signing configuration check:** Vercel has a server-side `SUPABASE_SERVICE_ROLE_KEY`, but no dedicated `WWP_UNSUBSCRIBE_SIGNING_SECRET` in the currently listed Production/Preview/Development variables. The signing helper can temporarily fall back to the service-role key; a separate stable signing secret is preferred before sending real unsubscribe links so database-key rotation does not invalidate previously delivered opt-out URLs. Do not log, display, or check in either secret. The helper now generates links to the current Vercel preview domain during Preview QA and to `winewithpete.me` in Production; both endpoints must be verified without touching existing contacts.

**Proposed production remediation (not yet executed):**

1. Review the Vercel preview and source checks. Configure a dedicated server-only unsubscribe signing secret for the relevant environments (or explicitly accept the documented temporary fallback), then deploy the complete reviewed server-route change. Verify production service-role configuration and basic site health.
2. In the confirmed production project, after explicit approval for changing database access, execute the following in one transaction. This changes **permissions and policies only**, not subscriber rows:

   ```sql
   begin;
   revoke all privileges on table public.newsletter_subscribers,
     public.gathering_interests from anon, authenticated;
   drop policy if exists "Allow newsletter reading" on public.newsletter_subscribers;
   drop policy if exists "Allow newsletter updates" on public.newsletter_subscribers;
   drop policy if exists "Allow newsletter subscriptions" on public.newsletter_subscribers;
   commit;
   ```

3. Re-run `pg_policies`, `has_table_privilege` for `anon` and `authenticated`, and the Supabase Security Advisor; verify no anonymous subscriber read/update/insert is possible. Check that the server-only signup endpoint still works with one authorized test address. The `service_role` retains its separate grants and bypass-RLS capability.
4. Hold any mass email or database migration until per-address end-to-end opt-out verification is complete.

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

Before any live release, verify that public/anonymous clients **cannot SELECT or UPDATE newsletter rows**. A newsletter signup is allowed only through the server route, which uses the service-role key strictly on the server. Check active campaign administration separately. The proposed transaction above is a **review plan, not an authorization to change production**.

## Verification gate

1. Validate source CI, TypeScript, lint, and production build. Hermetic tests must cover signature tampering, absent secret, invalid POST without DB access, idempotent unsubscribe, welcome-link creation, and per-recipient campaign links.
2. Use a single explicitly authorized disposable test address to verify Join → Supabase active subscriber → delivered welcome email → link confirmation → Supabase inactive subscriber. Verify campaign selection excludes inactive rows without sending a mass campaign.
3. Test Gather interest submission separately with explicit consent choice, without quietly joining the newsletter.
4. Confirm the current subscriber list is reconciled with the old Kit service. **Supabase does not automatically sync to Kit**; the legacy Kit endpoint is separate, and Loops is not configured. Choose the canonical mailing-list system before launching routine sends.
5. Verify a reliable route for a previously unsubscribed reader to request re-enrollment. At present, duplicate signup is reported as already on file and does not automatically reactivate. Do not reactivate without verifiable consent.
6. Monitor the production deployment, opt-out route, and errors only after all preceding gates pass.

**Live release status:** Held for live remediation approval and end-to-end verification with a single approved test contact. No mass send, DB policy mutation, or production deployment is authorized merely by this document.
