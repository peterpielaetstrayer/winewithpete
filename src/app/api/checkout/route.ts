import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerSupabase } from '@/lib/supabase/server';
import { CreateCheckoutSessionRequest } from '@/lib/types';
import { checkoutSchema, validateEmail, validateName } from '@/lib/validations';
import { checkoutRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const requiredEnvVars = {
      SUPABASE_URL: supabaseUrl,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Check rate limit
    const rateLimitResult = checkoutRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many checkout attempts. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          }
        }
      );
    }

    const body = await request.json();
    
    // Validate input with Zod
    const validationResult = checkoutSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error?.errors?.map(e => e.message) || ['Unknown validation error']
        },
        { status: 400 }
      );
    }

    const { productId, quantity, customerEmail, customerName, customAmount, customDescription } = validationResult.data;

    // Sanitize inputs
    const sanitizedEmail = validateEmail(customerEmail);
    const sanitizedName = validateName(customerName);

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
        customer_email: sanitizedEmail,
        metadata: {
          productId: productId,
          productName: customDescription || 'Support Payment',
          customerName: sanitizedName,
          isSupportPayment: 'true',
        },
      });

      return NextResponse.json({ 
        sessionId: session.id,
        url: session.url 
      });
    }

    // For now, let's use hardcoded product data to test Stripe
    // TODO: Fix Supabase RLS policies and restore product lookup
    const product = {
      id: productId,
      name: 'Test Product',
      description: 'Test product for checkout',
      price: 0,
      product_type: 'recipe_card' as const,
      file_path: null,
      image_path: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Using hardcoded product for testing:', product);

    // Handle free products with optional tips
    if (product.price === 0) {
      // For free products, allow custom amount (tip)
      const tipAmount = customAmount || 0;
      
      console.log('Creating Stripe session for free product with tip:', tipAmount);
      console.log('Stripe secret key available:', !!process.env.STRIPE_SECRET_KEY);
      
      try {
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
          cancel_url: `${request.nextUrl.origin}/recipes?cancelled=true`,
          customer_email: sanitizedEmail,
          metadata: {
            productId: product.id,
            productName: product.name,
            customerName: sanitizedName,
            isFreeProduct: 'true',
            tipAmount: tipAmount.toString(),
          },
        });
        
        console.log('Stripe session created successfully:', session.id);
        
        return NextResponse.json({ 
          sessionId: session.id,
          url: session.url 
        });
      } catch (stripeError) {
        console.error('Stripe error:', stripeError);
        console.error('Stripe error details:', {
          message: stripeError instanceof Error ? stripeError.message : 'Unknown error',
          type: (stripeError as any)?.type,
          code: (stripeError as any)?.code,
          decline_code: (stripeError as any)?.decline_code
        });
        throw stripeError;
      }
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
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
