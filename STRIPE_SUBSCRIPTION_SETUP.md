# Stripe Subscription Setup

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Subscription Price IDs (create these in Stripe Dashboard)
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_FOUNDER_PRICE_ID=price_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Stripe Dashboard Setup

### 1. Create Products and Prices

1. Go to Stripe Dashboard > Products
2. Create two products:
   - **Premium Subscription** - $19/month
   - **Founder Subscription** - $39/month
3. Copy the Price IDs and add them to your environment variables

### 2. Configure Webhooks

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the webhook secret to your environment variables

### 3. Test the Integration

1. Start your development server
2. Go to `/packages` and try to access premium content
3. The paywall modal should appear
4. Click upgrade to test the Stripe checkout flow
5. Check your Stripe dashboard for successful payments

## Features Implemented

### Paywall Components
- **PaywallModal**: Full-featured modal for package access
- **PaywallOverlay**: Simple overlay for individual content
- **SubscriptionStatus**: Header component showing current tier

### Subscription Management
- **Upgrade Flow**: Stripe checkout integration
- **Webhook Handling**: Automatic subscription status updates
- **Tier Management**: Free, Premium, Founder tiers
- **Access Control**: Content gating based on subscription level

### API Endpoints
- `POST /api/subscription/upgrade` - Create subscription checkout session
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

### Pages
- `/subscription` - Subscription management page
- Updated `/packages` - Paywall integration

## Usage

### Adding Paywall to New Content

```tsx
import { useSubscription } from '@/hooks/use-subscription';
import PaywallModal from '@/components/paywall-modal';

const { canAccessContent, getRequiredTier, upgradeSubscription } = useSubscription();

// Check access
if (!canAccessContent(contentData)) {
  // Show paywall or redirect
  setShowPaywall(true);
}

// In render
<PaywallModal
  isOpen={showPaywall}
  onClose={() => setShowPaywall(false)}
  currentTier={member?.subscription_tier || 'free'}
  requiredTier={getRequiredTier(contentData)}
  contentName={contentData.name}
  onUpgrade={upgradeSubscription}
/>
```

### Access Control

```tsx
import { canAccessPackage, getAccessLevel } from '@/lib/access-control';

// Check if user can access package
const canAccess = canAccessPackage(packageData, member);

// Get user's access level
const access = getAccessLevel(member);
// access.maxServingSize, access.canAccessPremium, etc.
```
