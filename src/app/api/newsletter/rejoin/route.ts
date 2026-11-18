import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyRejoinConfirmation, type PendingRejoin } from '@/lib/newsletter-rejoin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, token } = body ?? {};

    // Validation must precede database access. A confirmation requires a
    // deliberate POST from the landing page; link scanners only make GETs.
    if (typeof id !== 'string' || typeof token !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ||
        !/^[0-9a-f]{64}$/.test(token)) {
      return NextResponse.json({ error: 'This confirmation link is invalid.' }, { status: 400 });
    }

    const db = createClient();
    const { data: subscriber, error: lookupError } = await db
      .from('newsletter_subscribers')
      .select('id, is_active, preferences')
      .eq('id', id.toLowerCase())
      .maybeSingle();

    if (lookupError) {
      console.error('Newsletter rejoin lookup failed', lookupError.code);
      return NextResponse.json({ error: 'We could not confirm your request right now.' }, { status: 503 });
    }

    const preferences = subscriber?.preferences && typeof subscriber.preferences === 'object' &&
      !Array.isArray(subscriber.preferences) ? subscriber.preferences : {};
    const pending = preferences.pending_rejoin as PendingRejoin | undefined;
    if (!subscriber || subscriber.is_active || !verifyRejoinConfirmation(subscriber.id, token, pending)) {
      return NextResponse.json({ error: 'This confirmation link is invalid, expired, or already used.' }, { status: 400 });
    }

    const nextPreferences = { ...preferences };
    delete nextPreferences.pending_rejoin;
    nextPreferences.newsletter_consent = {
      source: 'email_rejoin_confirmation',
      confirmed_at: new Date().toISOString(),
      method: 'mailbox_confirmed',
    };

    // Compare the token hash in the filter too: only the currently pending,
    // inactive record may be activated; an older link cannot win a race.
    const { data: updated, error: updateError } = await db
      .from('newsletter_subscribers')
      .update({ is_active: true, preferences: nextPreferences })
      .eq('id', subscriber.id)
      .eq('is_active', false)
      .eq('preferences->pending_rejoin->>token_hash', pending!.token_hash)
      .select('id')
      .maybeSingle();

    if (updateError) {
      console.error('Newsletter rejoin confirmation failed', updateError.code);
      return NextResponse.json({ error: 'We could not confirm your request right now.' }, { status: 503 });
    }
    if (!updated) {
      return NextResponse.json({ error: 'This confirmation link is invalid, expired, or already used.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Welcome back to the Founding Table.' });
  } catch {
    return NextResponse.json({ error: 'Unable to process this confirmation.' }, { status: 400 });
  }
}
