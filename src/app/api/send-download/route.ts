import { NextRequest, NextResponse } from 'next/server';

/**
 * Legacy manual resend endpoint is intentionally disabled.
 *
 * The previous implementation accepted arbitrary order IDs from anonymous
 * callers and used the service-role client to send download emails.
 * Digital fulfillment remains available to the verified Stripe webhook.
 * A future administrative resend flow must authenticate and authorize the
 * operator, check payment status, and rate-limit requests.
 */
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: 'Manual download resend is unavailable' },
    { status: 403 }
  );
}
