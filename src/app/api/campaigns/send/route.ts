import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { createClient } from '@/lib/supabase/server';

/**
 * Explicit, server-side authorization for bulk subscriber email.
 *
 * Browser-side admin login is not an API access control. No send is permitted
 * unless a real Supabase user has a verified ID in the server-only allowlist.
 * An absent/malformed allowlist fails closed.
 */
async function requireCampaignAdmin(request: NextRequest): Promise<boolean> {
  const allowedIds = new Set(
    (process.env.WWP_CAMPAIGN_ADMIN_USER_IDS || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
  );

  const authorization = request.headers.get('authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : '';

  if (allowedIds.size === 0 || !token) return false;

  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return !error && !!user && allowedIds.has(user.id);
}

/** Authenticated, allowlisted email campaign dispatch. */
export async function POST(request: NextRequest) {
  try {
    // This check MUST precede body parsing, subscriber queries, and sending.
    if (!(await requireCampaignAdmin(request))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { subject, html, text, tags, limit } = body ?? {};

    if (
      typeof subject !== 'string' || !subject.trim() || subject.length > 250 ||
      typeof html !== 'string' || !html.trim() || html.length > 100_000 ||
      (text !== undefined && typeof text !== 'string')
    ) {
      return NextResponse.json({ error: 'Valid subject and content are required' }, { status: 400 });
    }

    // Tag-targeting is not implemented. Refuse rather than silently sending
    // the campaign to everyone when a subset was requested.
    if (tags !== undefined && tags !== null && (!Array.isArray(tags) || tags.length > 0)) {
      return NextResponse.json({ error: 'Tag-targeted campaigns are unavailable' }, { status: 422 });
    }

    const maxRecipients = 100;
    const requestedLimit = limit === undefined || limit === null ? maxRecipients : limit;
    if (!Number.isInteger(requestedLimit) || requestedLimit < 1 || requestedLimit > maxRecipients) {
      return NextResponse.json({ error: 'Campaign recipient limit must be between 1 and 100' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('email, name')
      .eq('is_active', true)
      .limit(requestedLimit);

    if (error) {
      console.error('Campaign subscriber lookup failed:', error);
      return NextResponse.json({ error: 'Unable to prepare campaign' }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, failed: 0, message: 'No active subscribers found' });
    }

    const results = await Promise.allSettled(
      subscribers.map((subscriber) => sendEmail({
        to: subscriber.email,
        subject,
        html: html.replace(/\{name\}/g, subscriber.name || 'Friend'),
        text: text?.replace(/\{name\}/g, subscriber.name || 'Friend'),
      }))
    );
    // sendEmail returns null on delivery failure (does not always throw).
    const sent = results.filter((result) => result.status === 'fulfilled' && result.value !== null).length;
    const failed = results.length - sent;

    return NextResponse.json({
      success: failed === 0,
      sent,
      failed,
      total: results.length,
      message: failed === 0 ? 'Campaign sent' : 'Some campaign messages failed',
    });
  } catch (error) {
    console.error('Campaign send failed:', error);
    return NextResponse.json({ error: 'Campaign sending unavailable' }, { status: 500 });
  }
}
