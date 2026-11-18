import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyUnsubscribeToken } from '@/lib/newsletter-unsubscribe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!verifyUnsubscribeToken(body?.id, body?.token)) {
      return NextResponse.json({ error: 'This unsubscribe link is invalid.' }, { status: 400 });
    }

    const { error } = await createClient()
      .from('newsletter_subscribers')
      .update({ is_active: false })
      .eq('id', body.id.toLowerCase());

    if (error) {
      console.error('Newsletter unsubscribe failed:', error.code);
      return NextResponse.json({ error: 'We could not update your subscription. Please try again.' }, { status: 500 });
    }

    // A previously unsubscribed or removed row should receive the same benign response.
    return NextResponse.json({ success: true, message: 'You have been removed from the Founding Table email list.' });
  } catch {
    return NextResponse.json({ error: 'Unable to process this request.' }, { status: 400 });
  }
}
