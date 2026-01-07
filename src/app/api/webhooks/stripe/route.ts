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
        const quantity = parseInt(session.metadata?.quantity || '1', 10);
        let product = null;
        if (productId) {
          const { error: itemError } = await supabase
            .from('order_items')
            .insert({
              order_id: order.id,
              product_id: productId,
              quantity: quantity,
              price: session.amount_total ? session.amount_total / 100 : 0,
            });

          if (itemError) {
            console.error('Failed to create order item:', itemError);
          }

          // Fetch product to check if it needs Printful fulfillment
          const { data: productData } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
          
          product = productData;
        }

        console.log('Order completed:', order.id);

        // Create Printful order if product requires it
        // Use selected variant from metadata, fallback to product's default variant
        const selectedVariantId = session.metadata?.printfulVariantId || product.printful_variant_id;
        
        console.log('Printful order creation - Variant selection:', {
          variantIdFromMetadata: session.metadata?.printfulVariantId,
          fallbackVariantId: product.printful_variant_id,
          selectedVariantId: selectedVariantId,
          productId: product.id,
          productName: product.name,
          printfulProductId: product.printful_product_id
        });
        
        if (product && product.printful_product_id && selectedVariantId) {
          try {
            const apiKey = process.env.PRINTFUL_API_KEY;
            if (!apiKey) {
              console.warn('PRINTFUL_API_KEY not configured, skipping Printful order creation');
            } else {
              // Get shipping address from Stripe session
              const shippingDetails = session.shipping_details;
              if (!shippingDetails || !shippingDetails.address) {
                console.warn('No shipping address in session, cannot create Printful order');
              } else {
                // Get store ID first
                const storesResponse = await fetch('https://api.printful.com/stores', {
                  headers: { 'Authorization': `Bearer ${apiKey}` },
                });

                if (!storesResponse.ok) {
                  throw new Error(`Failed to fetch stores: ${storesResponse.status}`);
                }

                const storesData = await storesResponse.json();
                const storeId = storesData.result?.[0]?.id;

                if (!storeId) {
                  throw new Error('No store found in Printful');
                }

                // Parse variant ID with radix 10 for safety
                const parsedVariantId = parseInt(String(selectedVariantId), 10);
                
                console.log('Creating Printful order with:', {
                  variant_id: parsedVariantId,
                  quantity: quantity,
                  product_id: product.printful_product_id,
                  variant_id_original: selectedVariantId,
                  variant_id_type: typeof selectedVariantId,
                  variant_id_parsed: parsedVariantId,
                  store_id: storeId
                });

                // Create Printful order
                const printfulOrder = {
                  external_id: order.id, // Link to our order
                  recipient: {
                    name: shippingDetails.name || order.name,
                    address1: shippingDetails.address.line1,
                    address2: shippingDetails.address.line2 || '',
                    city: shippingDetails.address.city,
                    state_code: shippingDetails.address.state,
                    country_code: shippingDetails.address.country,
                    zip: shippingDetails.address.postal_code,
                    phone: shippingDetails.phone || '',
                    email: order.email,
                  },
                  items: [
                    {
                      variant_id: parsedVariantId,
                      quantity: quantity,
                    },
                  ],
                };

                // Printful orders endpoint requires store_id as query param or in body
                const printfulResponse = await fetch(`https://api.printful.com/orders?store_id=${storeId}`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(printfulOrder),
                });

                if (!printfulResponse.ok) {
                  const errorText = await printfulResponse.text();
                  console.error('Printful order creation failed:', {
                    status: printfulResponse.status,
                    statusText: printfulResponse.statusText,
                    error: errorText,
                    variantId: parsedVariantId,
                    quantity: quantity,
                    orderPayload: JSON.stringify(printfulOrder, null, 2)
                  });
                  // Don't throw - we'll log but continue
                } else {
                  const printfulData = await printfulResponse.json();
                  const printfulOrderId = printfulData.result?.id;
                  console.log('Printful order created successfully:', {
                    printfulOrderId: printfulOrderId,
                    variantId: parsedVariantId,
                    quantity: quantity,
                    productId: product.printful_product_id,
                    orderId: order.id
                  });
                  
                  // Store Printful order ID in our order record
                  if (printfulOrderId) {
                    const { error: updateError } = await supabase
                      .from('orders')
                      .update({ 
                        printful_order_id: printfulOrderId.toString(),
                      })
                      .eq('id', order.id);
                    
                    if (updateError) {
                      console.error('Failed to update order with Printful order ID:', updateError);
                    } else {
                      console.log('Order updated with Printful order ID:', printfulOrderId);
                    }
                  }
                }
              }
            }
          } catch (printfulError) {
            console.error('Failed to create Printful order:', printfulError);
            // Don't fail the webhook - payment succeeded, Printful order can be created manually if needed
          }
        }

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
