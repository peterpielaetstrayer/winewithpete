import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    };

    // Test Supabase connection
    let supabaseTest = { success: false, error: null };
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .limit(1);
      
      supabaseTest = { success: !error, error: error?.message || null };
    } catch (err) {
      supabaseTest = { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }

    // Test Stripe connection
    let stripeTest = { success: false, error: null };
    try {
      await stripe.prices.list({ limit: 1 });
      stripeTest = { success: true, error: null };
    } catch (err) {
      stripeTest = { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }

    return NextResponse.json({
      environment: envCheck,
      supabase: supabaseTest,
      stripe: stripeTest,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
