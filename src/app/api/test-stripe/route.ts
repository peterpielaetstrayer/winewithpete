import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    console.log('Testing Stripe connection...');
    console.log('Stripe secret key available:', !!process.env.STRIPE_SECRET_KEY);
    
    // Test Stripe by listing prices
    const prices = await stripe.prices.list({ limit: 1 });
    
    console.log('Stripe connection successful');
    
    return NextResponse.json({
      success: true,
      message: 'Stripe connection working',
      pricesCount: prices.data.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Stripe test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        type: (error as any)?.type,
        code: (error as any)?.code,
        message: (error as any)?.message
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
