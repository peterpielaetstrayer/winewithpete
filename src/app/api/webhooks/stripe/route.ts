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
        
        // Create order record
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
          const downloadResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-download`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: order.id,
            }),
          });

          if (downloadResponse.ok) {
            const downloadData = await downloadResponse.json();
            
            // Send email with download links
            if (downloadData.downloadLinks && downloadData.downloadLinks.length > 0) {
              const { sendEmail, emailTemplates } = await import('@/lib/email');
              const productName = session.metadata?.productName || 'Your Recipe Cards';
              
              await sendEmail({
                to: order.email,
                ...emailTemplates.purchaseConfirmation(
                  order.name,
                  productName,
                  downloadData.downloadLinks
                )
              });
            }
          }
        } catch (emailError) {
          console.error('Failed to send download email:', emailError);
          // Don't fail the webhook if email fails
        }

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
