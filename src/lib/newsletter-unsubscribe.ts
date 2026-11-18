import { createHmac, timingSafeEqual } from 'node:crypto';

const SUBSCRIBER_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SIGNATURE = /^[0-9a-f]{64}$/;
const PURPOSE = 'winewithpete:newsletter-unsubscribe:v1:';

/** Uses an existing server-only secret until a dedicated signing secret is configured. */
function signingKey(): string | null {
  return process.env.WWP_UNSUBSCRIBE_SIGNING_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

function signatureFor(subscriberId: string, key: string): string {
  return createHmac('sha256', key).update(PURPOSE + subscriberId.toLowerCase()).digest('hex');
}

export function createUnsubscribeUrl(subscriberId: string): string | null {
  const key = signingKey();
  if (!key || !SUBSCRIBER_ID.test(subscriberId)) return null;

  // Preview emails must link back to the preview deployment so the full
  // consent lifecycle can be tested before exposing it on the public site.
  const origin = process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://winewithpete.me';
  const url = new URL('/unsubscribe', origin);
  url.searchParams.set('id', subscriberId.toLowerCase());
  url.searchParams.set('token', signatureFor(subscriberId, key));
  return url.toString();
}

export function verifyUnsubscribeToken(subscriberId: unknown, token: unknown): boolean {
  const key = signingKey();
  if (!key || typeof subscriberId !== 'string' || typeof token !== 'string') return false;
  if (!SUBSCRIBER_ID.test(subscriberId) || !SIGNATURE.test(token)) return false;

  const expected = Buffer.from(signatureFor(subscriberId, key), 'hex');
  const received = Buffer.from(token, 'hex');
  return timingSafeEqual(expected, received);
}
