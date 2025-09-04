import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { CreateCheckoutSessionRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateCheckoutSessionRequest & { customAmount?: number; customDescription?: string } = await request.json();
    const { productId, quantity = 1, customerEmail, customerName, customAmount, customDescription } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Handle support payments (custom amounts)
    if (productId.startsWith('support-') && customAmount) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: customDescription || 'Support Wine With Pete',
                description: 'Thank you for supporting the community!',
              },
              unit_amount: Math.round(customAmount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${request.nextUrl.origin}/store/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.nextUrl.origin}/support?cancelled=true`,
        customer_email: customerEmail,
        metadata: {
          productId: productId,
          productName: customDescription || 'Support Payment',
          customerName: customerName || '',
          isSupportPayment: 'true',
        },
      });

      return NextResponse.json({ 
        sessionId: session.id,
        url: session.url 
      });
    }

    // Get product details from Supabase for regular products
    const supabase = createClient();
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Handle free products with optional tips
    if (product.price === 0) {
      // For free products, allow custom amount (tip)
      const tipAmount = customAmount || 0;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
                description: product.description || undefined,
              },
              unit_amount: 0, // Free product
            },
            quantity: 1,
          },
          // Add tip if provided
          ...(tipAmount > 0 ? [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Tip for Wine With Pete',
                description: 'Thank you for supporting the community!',
              },
              unit_amount: Math.round(tipAmount * 100),
            },
            quantity: 1,
          }] : []),
        ],
        mode: 'payment',
        success_url: `${request.nextUrl.origin}/store/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.nextUrl.origin}/store?cancelled=true`,
        customer_email: customerEmail,
        metadata: {
          productId: product.id,
          productName: product.name,
          customerName: customerName || '',
          isFreeProduct: 'true',
          tipAmount: tipAmount.toString(),
        },
      });

      return NextResponse.json({ 
        sessionId: session.id,
        url: session.url 
      });
    }

    // Regular paid products
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description || undefined,
              images: [], // Add product images if you have them
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/store?cancelled=true`,
      customer_email: customerEmail,
      metadata: {
        productId: product.id,
        productName: product.name,
        customerName: customerName || '',
      },
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
