import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { logger } from '@/lib/logger';
import { getOfferById } from '@/lib/commerce';
import type { Offer } from '@/lib/commerce';
import { checkoutSchema, validateEmail, validateName } from '@/lib/validations';
import { checkoutRateLimit } from '@/lib/rate-limit';

function getCancelUrl(origin: string, offer: Offer): string {
  const path = offer.pagePath || (offer.kind === 'physical' ? '/store' : '/recipes');
  const separator = path.includes('?') ? '&' : '?';
  return `${origin}${path}${separator}cancelled=true`;
}

function getFulfillmentType(offer: Offer): string {
  if (offer.commerce.type === 'stripe') {
    return offer.commerce.fulfillment.type;
  }

  if (offer.kind === 'digital') return 'digital_download';
  return 'none';
}

export async function POST(request: NextRequest) {
  try {
    const requiredEnvVars = {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      logger.error('Missing checkout environment variables:', missingVars);
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const rateLimitResult = checkoutRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many checkout attempts. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const validationResult = checkoutSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues.map(
            (issue) => `${issue.path.join('.')}: ${issue.message}`
          ),
        },
        { status: 400 }
      );
    }

    const {
      productId,
      quantity,
      customerEmail,
      customerName,
      customAmount,
    } = validationResult.data;

    const sanitizedEmail = validateEmail(customerEmail);
    const sanitizedName = validateName(customerName);
    const offer = await getOfferById(productId);

    if (!offer || offer.availability.status !== 'active') {
      return NextResponse.json(
        { error: 'Offer not found or unavailable' },
        { status: 404 }
      );
    }

    // Physical fulfillment is intentionally paused while Wine With Pete moves
    // away from the custom Printful pipeline. This guard must remain in place
    // until an external physical-commerce provider is explicitly wired in.
    if (offer.kind === 'physical') {
      return NextResponse.json(
        {
          error: 'Physical checkout is temporarily unavailable while the store is being refreshed.',
          code: 'PHYSICAL_CHECKOUT_PAUSED',
          href: offer.pagePath || '/store',
        },
        { status: 409 }
      );
    }

    if (offer.commerce.type === 'external_checkout') {
      return NextResponse.json({
        url: offer.commerce.href,
        external: true,
      });
    }

    if (offer.commerce.type === 'inquiry' || offer.commerce.type === 'signup') {
      return NextResponse.json(
        {
          error: 'This offer does not use direct checkout.',
          href: offer.commerce.href,
        },
        { status: 400 }
      );
    }

    if (offer.commerce.type === 'stripe' && offer.commerce.mode !== 'payment') {
      return NextResponse.json(
        { error: 'This checkout mode is not available yet.' },
        { status: 501 }
      );
    }

    if (!offer.price) {
      return NextResponse.json(
        { error: 'This offer does not have a checkout price.' },
        { status: 400 }
      );
    }

    const checkoutQuantity = offer.kind === 'digital' || offer.kind === 'support' ? 1 : quantity;

    // Paid offers always use the server-owned Offer price. The browser can no
    // longer override paid product or support pricing with customAmount.
    let amountCents = offer.price.amountCents;

    // Preserve the existing optional-tip behavior only for genuinely free
    // digital products. Tips are never allowed to alter a paid offer's price.
    if (offer.kind === 'digital' && amountCents === 0 && customAmount) {
      amountCents = Math.round(customAmount * 100);
    }

    const productImages = (offer.images || [])
      .map((image) => image.url)
      .filter((url) => url.startsWith('https://'))
      .slice(0, 8);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: offer.price.currency,
            product_data: {
              name: offer.title,
              description: offer.description || undefined,
              images: productImages.length > 0 ? productImages : undefined,
            },
            unit_amount: amountCents,
          },
          quantity: checkoutQuantity,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: getCancelUrl(request.nextUrl.origin, offer),
      customer_email: sanitizedEmail,
      metadata: {
        offerId: offer.id,
        productId: offer.source?.type === 'legacy_product' ? offer.id : '',
        offerKind: offer.kind,
        productName: offer.title,
        customerName: sanitizedName,
        quantity: checkoutQuantity.toString(),
        fulfillmentType: getFulfillmentType(offer),
        isSupportPayment: offer.kind === 'support' ? 'true' : 'false',
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    logger.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
