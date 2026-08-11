import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { fulfillDigitalOrder } from '@/lib/commerce/digital-fulfillment';

function getPaymentIntentId(session: Stripe.Checkout.Session): string | null {
  if (typeof session.payment_intent === 'string') {
    return session.payment_intent;
  }

  return session.payment_intent?.id || null;
}

function parseQuantity(value: string | null | undefined): number {
  const parsed = Number.parseInt(value || '1', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook configuration error' },
      { status: 500 }
    );
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (
          session.payment_status !== 'paid' &&
          session.payment_status !== 'no_payment_required'
        ) {
          console.warn('Ignoring unfulfilled Checkout Session:', {
            sessionId: session.id,
            paymentStatus: session.payment_status,
          });
          break;
        }

        const paymentIntentId = getPaymentIntentId(session);
        const productId = session.metadata?.productId || null;
        const offerId = session.metadata?.offerId || productId;
        const fulfillmentType = session.metadata?.fulfillmentType || 'none';
        const quantity = parseQuantity(session.metadata?.quantity);

        let existingOrder = null;

        if (paymentIntentId) {
          const { data, error } = await supabase
            .from('orders')
            .select('id, email, name, total_amount, stripe_payment_intent_id, status')
            .eq('stripe_payment_intent_id', paymentIntentId)
            .maybeSingle();

          if (error) {
            throw error;
          }

          existingOrder = data;
        }

        let order = existingOrder;

        if (!order) {
          const { data, error } = await supabase
            .from('orders')
            .insert({
              email: session.customer_email || session.customer_details?.email || '',
              name: session.customer_details?.name || session.metadata?.customerName || '',
              total_amount: session.amount_total ? session.amount_total / 100 : 0,
              stripe_payment_intent_id: paymentIntentId,
              status: 'completed',
            })
            .select()
            .single();

          if (error || !data) {
            throw error || new Error('Failed to create order');
          }

          order = data;
        }

        if (!order) {
          throw new Error('Order unavailable after checkout processing');
        }

        if (productId) {
          const { data: existingItem, error: itemLookupError } = await supabase
            .from('order_items')
            .select('id')
            .eq('order_id', order.id)
            .eq('product_id', productId)
            .maybeSingle();

          if (itemLookupError) {
            throw itemLookupError;
          }

          if (!existingItem) {
            const totalAmount = session.amount_total ? session.amount_total / 100 : 0;
            const unitPrice = quantity > 0 ? totalAmount / quantity : totalAmount;

            const { error: itemError } = await supabase
              .from('order_items')
              .insert({
                order_id: order.id,
                product_id: productId,
                quantity,
                price: unitPrice,
              });

            if (itemError) {
              throw itemError;
            }
          }
        }

        // Physical checkout is paused in /api/checkout, so the webhook no
        // longer contains Printful logic. Physical fulfillment will return as
        // an external-provider strategy when Fourthwall is introduced.
        if (fulfillmentType === 'digital_download' && productId) {
          const fulfillment = await fulfillDigitalOrder(order.id);

          if (!fulfillment.delivered) {
            console.error('Digital fulfillment did not complete:', {
              orderId: order.id,
              offerId,
              reason: fulfillment.reason,
              downloadCount: fulfillment.downloadCount,
            });
          }
        }

        console.log('Checkout Session processed:', {
          sessionId: session.id,
          orderId: order.id,
          offerId,
          fulfillmentType,
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const { error } = await supabase
          .from('orders')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) {
          throw error;
        }

        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
