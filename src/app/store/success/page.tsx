import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

function getPaymentIntentId(paymentIntent: unknown): string | null {
  if (typeof paymentIntent === 'string') return paymentIntent;
  if (
    paymentIntent &&
    typeof paymentIntent === 'object' &&
    'id' in paymentIntent &&
    typeof paymentIntent.id === 'string'
  ) {
    return paymentIntent.id;
  }
  return null;
}

async function SuccessContent({ sessionId }: { sessionId: string }) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const isSupportPayment = session.metadata?.isSupportPayment === 'true';
    const isDigitalPurchase = session.metadata?.fulfillmentType === 'digital_download';
    const paymentIntentId = getPaymentIntentId(session.payment_intent);

    let order = null;

    if (paymentIntentId) {
      const supabase = createClient();
      const { data } = await supabase
        .from('orders')
        .select('id, total_amount, email, status')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .maybeSingle();

      order = data;
    }

    const heading = isSupportPayment ? 'Thank You for Supporting Wine With Pete' : 'Payment Successful';
    const message = isSupportPayment
      ? 'Your contribution was received. Thank you for helping support the work behind Wine With Pete.'
      : isDigitalPurchase
        ? 'Your purchase was received. Your download links will be sent to the email used at checkout.'
        : 'Your payment was received successfully.';

    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-serif text-charcoal mb-4">{heading}</h1>
        <p className="text-lg text-black/70 mb-6">{message}</p>

        {order && (
          <div className="bg-white rounded-lg border p-6 mb-6 max-w-md mx-auto">
            <h3 className="font-medium text-charcoal mb-3">Payment Details</h3>
            <div className="text-sm text-black/70 space-y-1">
              <p>Order ID: {order.id.slice(0, 8)}...</p>
              <p>Total: ${Number(order.total_amount).toFixed(2)}</p>
              <p>Email: {order.email}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={isSupportPayment ? '/support' : '/recipes'}>
            <Button variant="outline" className="border-ember text-ember hover:bg-ember hover:text-white">
              {isSupportPayment ? 'Back to Wine With Pete' : 'Browse Recipes & Guides'}
            </Button>
          </Link>
          <Link href="/gatherings">
            <Button className="btn-ember">See Gatherings</Button>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Success page error:', error);
    return (
      <div className="text-center">
        <h1 className="text-2xl font-serif text-charcoal mb-4">Payment received</h1>
        <p className="text-black/70 mb-6">
          We couldn&apos;t load the full confirmation details, but you can return to Wine With Pete below.
        </p>
        <Link href="/">
          <Button className="btn-ember">Return Home</Button>
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
          <h1 className="text-2xl font-serif text-charcoal mb-4">Confirmation unavailable</h1>
          <p className="text-black/70 mb-6">No checkout session was provided.</p>
          <Link href="/">
            <Button className="btn-ember">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Suspense
        fallback={
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-ember border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-black/70">Loading your confirmation...</p>
          </div>
        }
      >
        <SuccessContent sessionId={sessionId} />
      </Suspense>
    </div>
  );
}
