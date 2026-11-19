import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

const SUBSCRIBER_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TOKEN = /^[0-9a-f]{64}$/;

export const REJOIN_CONFIRMATION_TTL_MS = 24 * 60 * 60 * 1000;
export const REJOIN_REQUEST_COOLDOWN_MS = 15 * 60 * 1000;

export type PendingRejoin = {
  token_hash: string;
  requested_at: string;
  expires_at: string;
};

export function createRejoinConfirmation(subscriberId: string, now = Date.now()): {
  url: string;
  pending: PendingRejoin;
} | null {
  if (!SUBSCRIBER_ID.test(subscriberId)) return null;

  const token = randomBytes(32).toString('hex');
  const origin = process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://winewithpete.me';
  const url = new URL('/rejoin', origin);
  url.searchParams.set('id', subscriberId.toLowerCase());
  url.searchParams.set('token', token);

  return {
    url: url.toString(),
    pending: {
      token_hash: createHash('sha256').update(token).digest('hex'),
      requested_at: new Date(now).toISOString(),
      expires_at: new Date(now + REJOIN_CONFIRMATION_TTL_MS).toISOString(),
    },
  };
}

export function isRejoinRequestCoolingDown(pending: PendingRejoin | null | undefined, now = Date.now()): boolean {
  if (!pending || typeof pending.requested_at !== 'string') return false;
  const requestedAt = Date.parse(pending.requested_at);
  return Number.isFinite(requestedAt) && now >= requestedAt && now - requestedAt < REJOIN_REQUEST_COOLDOWN_MS;
}

export function verifyRejoinConfirmation(
  subscriberId: unknown,
  token: unknown,
  pending: PendingRejoin | null | undefined,
  now = Date.now()
): boolean {
  if (typeof subscriberId !== 'string' || !SUBSCRIBER_ID.test(subscriberId)) return false;
  if (typeof token !== 'string' || !TOKEN.test(token)) return false;
  if (!pending || typeof pending.token_hash !== 'string' || !TOKEN.test(pending.token_hash)) return false;
  if (typeof pending.expires_at !== 'string') return false;

  const expiry = Date.parse(pending.expires_at);
  if (!Number.isFinite(expiry) || expiry <= now) return false;

  const suppliedHash = createHash('sha256').update(token).digest();
  return timingSafeEqual(suppliedHash, Buffer.from(pending.token_hash, 'hex'));
}
