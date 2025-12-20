import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

async function SuccessContent({ sessionId }: { sessionId: string }) {
  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return (
        <div className="text-center">
          <h1 className="text-2xl font-serif text-charcoal mb-4">Payment Not Found</h1>
          <p className="text-black/70 mb-6">We couldn&apos;t find your payment session.</p>
          <Link href="/recipes">
            <Button className="btn-ember">Back to Recipes</Button>
          </Link>
        </div>
      );
    }

    // Get order details from Supabase
    const supabase = createClient();
    const { data: order } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('stripe_payment_intent_id', session.payment_intent)
      .single();

    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-serif text-charcoal mb-4">Payment Successful!</h1>
        <p className="text-lg text-black/70 mb-6">
          Thank you for your purchase. Your digital recipe cards are ready for download.
        </p>

        {order && (
          <div className="bg-white rounded-lg border p-6 mb-6 max-w-md mx-auto">
            <h3 className="font-medium text-charcoal mb-3">Order Details</h3>
            <div className="text-sm text-black/70 space-y-1">
              <p>Order ID: {order.id.slice(0, 8)}...</p>
              <p>Total: ${order.total_amount}</p>
              <p>Email: {order.email}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-charcoal mb-2">What&apos;s Next?</h3>
            <p className="text-sm text-black/70 mb-4">
              You&apos;ll receive an email with download links for your recipe cards within the next few minutes.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/recipes">
              <Button variant="outline" className="border-ember text-ember hover:bg-ember hover:text-white">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/gatherings">
              <Button className="btn-ember">
                See Gatherings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Success page error:', error);
    return (
      <div className="text-center">
        <h1 className="text-2xl font-serif text-charcoal mb-4">Something went wrong</h1>
        <p className="text-black/70 mb-6">We&apos;re having trouble processing your payment confirmation.</p>
        <Link href="/recipes">
          <Button className="btn-ember">Back to Recipes</Button>
        </Link>
      </div>
    );
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-charcoal mb-4">Invalid Session</h1>
          <p className="text-black/70 mb-6">No session ID provided.</p>
          <Link href="/recipes">
            <Button className="btn-ember">Back to Recipes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-ember border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-black/70">Processing your payment...</p>
        </div>
      }>
        <SuccessContent sessionId={sessionId} />
      </Suspense>
    </div>
  );
}
