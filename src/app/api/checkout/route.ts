import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
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
      logger.error('Missing environment variables:', missingVars);
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
    logger.debug('Checkout request body received:', body);
    
    // Validate input with Zod
    const validationResult = checkoutSchema.safeParse(body);
    if (!validationResult.success) {
      logger.error('Validation errors:', validationResult.error.errors);
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error?.errors?.map(e => `${e.path.join('.')}: ${e.message}`) || ['Unknown validation error']
        },
        { status: 400 }
      );
    }

    const { productId, quantity, customerEmail, customerName, customAmount, customDescription, printfulVariantId } = validationResult.data;

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

    // Fetch product from Supabase
    const supabase = createClient(); // Uses service role key, bypasses RLS
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      logger.error('Product lookup error:', productError);
      return NextResponse.json(
        { error: 'Product not found or unavailable' },
        { status: 404 }
      );
    }

    logger.debug('Product found:', { id: product.id, name: product.name, price: product.price });

    // Use variant price if provided and different from product price
    let finalPrice = product.price;
    if (printfulVariantId && customAmount && customAmount > 0) {
      // Variant has different price, use it
      finalPrice = customAmount;
      logger.debug('Using variant price:', { variantId: printfulVariantId, price: finalPrice });
    }

    // Handle free products with optional tips
    if (finalPrice === 0) {
      // For free products, allow custom amount (tip)
      const tipAmount = customAmount || 0;
      
      logger.debug('Creating Stripe session for free product with tip:', tipAmount);
      logger.debug('Stripe secret key available:', !!process.env.STRIPE_SECRET_KEY);
      
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
        
        logger.info('Stripe session created successfully:', session.id);
        
        return NextResponse.json({ 
          sessionId: session.id,
          url: session.url 
        });
      } catch (stripeError) {
        logger.error('Stripe error:', stripeError);
        if (stripeError instanceof Stripe.errors.StripeError) {
          logger.error('Stripe error details:', {
            message: stripeError.message,
            type: stripeError.type,
            code: stripeError.code,
            decline_code: 'decline_code' in stripeError ? stripeError.decline_code : undefined
          });
        } else {
          logger.error('Stripe error details:', {
            message: stripeError instanceof Error ? stripeError.message : 'Unknown error',
          });
        }
        throw stripeError;
      }
    }

    // Regular paid products
    // Format product image URL for Stripe (needs full URL)
    const productImages: string[] = [];
    if (product.image_path) {
      if (product.image_path.startsWith('http')) {
        // Direct URL from Printful
        productImages.push(product.image_path);
      } else {
        // Supabase storage path - convert to full URL
        const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl) {
          productImages.push(`${supabaseUrl}/storage/v1/object/public/product-images/${product.image_path}`);
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description || undefined,
              images: productImages.length > 0 ? productImages : undefined,
            },
            unit_amount: Math.round(finalPrice * 100), // Convert to cents (uses variant price if selected)
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/recipes?cancelled=true`,
      customer_email: customerEmail,
      metadata: {
        productId: product.id,
        productName: product.name,
        customerName: customerName || '',
        quantity: quantity.toString(),
        printfulVariantId: printfulVariantId || '',
        variantPrice: finalPrice.toString(),
      },
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    logger.error('Checkout error:', error);
    logger.error('Error details:', {
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
