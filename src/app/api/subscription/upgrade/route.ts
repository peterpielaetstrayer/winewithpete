import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const upgradeSchema = z.object({
  tier: z.enum(['premium', 'founder']),
  customerId: z.string().optional(),
  email: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier, customerId, email } = upgradeSchema.parse(body);

    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get member data
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (memberError || !member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Define pricing
    const pricing = {
      premium: {
        priceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
        amount: 1900, // $19.00
      },
      founder: {
        priceId: process.env.STRIPE_FOUNDER_PRICE_ID!,
        amount: 3900, // $39.00
      }
    };

    const tierPricing = pricing[tier];

    // Create or get Stripe customer
    let stripeCustomer;
    if (customerId) {
      stripeCustomer = await stripe.customers.retrieve(customerId);
    } else {
      stripeCustomer = await stripe.customers.create({
        email: email || member.email,
        name: member.name || undefined,
        metadata: {
          member_id: member.id,
          user_id: user.id,
        }
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: tierPricing.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/packages`,
      metadata: {
        member_id: member.id,
        user_id: user.id,
        subscription_tier: tier,
      },
      subscription_data: {
        metadata: {
          member_id: member.id,
          user_id: user.id,
          subscription_tier: tier,
        },
      },
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Subscription upgrade error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data',
        details: error.errors 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Failed to create subscription' 
    }, { status: 500 });
  }
}
