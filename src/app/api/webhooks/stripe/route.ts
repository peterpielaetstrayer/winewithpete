import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          // Handle subscription creation
          const subscriptionId = session.subscription as string;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await handleSubscriptionCreated(subscription, supabase);
        } else {
          // Handle one-time payment
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
              email: session.customer_email || session.customer_details?.email || '',
              name: session.customer_details?.name || session.metadata?.customerName || '',
              total_amount: session.amount_total ? session.amount_total / 100 : 0,
              stripe_payment_intent_id: session.payment_intent as string,
              status: 'completed',
            })
            .select()
            .single();

          if (orderError) {
            console.error('Failed to create order:', orderError);
            break;
          }

          // Create order item
          const productId = session.metadata?.productId;
          if (productId) {
            const { error: itemError } = await supabase
              .from('order_items')
              .insert({
                order_id: order.id,
                product_id: productId,
                quantity: 1,
                price: session.amount_total ? session.amount_total / 100 : 0,
              });

            if (itemError) {
              console.error('Failed to create order item:', itemError);
            }
          }

          console.log('Order completed:', order.id);

          // Send download links to customer
          try {
            console.log('Attempting to send download email for order:', order.id);
            console.log('Customer email:', order.email);
            
            // Get the base URL from environment or construct from request
            const baseUrl = process.env.APP_URL || 
              `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('host') || 'winewithpete.me'}`;
            
            console.log('Using base URL:', baseUrl);
            const downloadResponse = await fetch(`${baseUrl}/api/send-download`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: order.id,
              }),
            });

            console.log('Download response status:', downloadResponse.status);
            
            if (downloadResponse.ok) {
              const downloadData = await downloadResponse.json();
              console.log('Download email sent successfully:', downloadData);
            } else {
              console.error('Download response failed:', await downloadResponse.text());
            }
          } catch (emailError) {
            console.error('Failed to send download email:', emailError);
            // Don't fail the webhook if email fails
          }
        }

        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription, supabase);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, supabase);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, supabase);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order status to failed
        await supabase
          .from('orders')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  const subscriptionTier = subscription.metadata.subscription_tier as 'premium' | 'founder';
  const memberId = subscription.metadata.member_id;

  if (!memberId) {
    console.error('No member_id in subscription metadata');
    return;
  }

  // Update member subscription tier
  const { error } = await supabase
    .from('members')
    .update({ 
      subscription_tier: subscriptionTier,
      updated_at: new Date().toISOString()
    })
    .eq('id', memberId);

  if (error) {
    console.error('Error updating member subscription:', error);
  } else {
    console.log('Subscription created for member:', memberId, 'tier:', subscriptionTier);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  const subscriptionTier = subscription.metadata.subscription_tier as 'premium' | 'founder';
  const memberId = subscription.metadata.member_id;

  if (!memberId) {
    console.error('No member_id in subscription metadata');
    return;
  }

  // Update member subscription tier based on status
  let tier = 'free';
  if (subscription.status === 'active') {
    tier = subscriptionTier;
  }

  const { error } = await supabase
    .from('members')
    .update({ 
      subscription_tier: tier,
      updated_at: new Date().toISOString()
    })
    .eq('id', memberId);

  if (error) {
    console.error('Error updating member subscription:', error);
  } else {
    console.log('Subscription updated for member:', memberId, 'tier:', tier);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  const memberId = subscription.metadata.member_id;

  if (!memberId) {
    console.error('No member_id in subscription metadata');
    return;
  }

  // Downgrade to free tier
  const { error } = await supabase
    .from('members')
    .update({ 
      subscription_tier: 'free',
      updated_at: new Date().toISOString()
    })
    .eq('id', memberId);

  if (error) {
    console.error('Error downgrading member subscription:', error);
  } else {
    console.log('Subscription cancelled for member:', memberId);
  }
}
