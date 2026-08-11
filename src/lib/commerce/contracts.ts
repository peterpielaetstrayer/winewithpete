import type { CommerceStrategy, Offer, OfferFulfillment } from './types';

export interface CustomerIdentity {
  email?: string;
  name?: string;
}

export interface CheckoutRequest {
  offer: Offer;
  quantity: number;
  customer?: CustomerIdentity;
}

export interface CheckoutResult {
  redirectUrl: string;
  provider: 'stripe' | 'fourthwall' | 'gumroad' | 'legacy' | 'other';
  providerReference?: string;
}

/**
 * Implementations translate a provider-agnostic Offer commerce strategy into
 * the checkout destination or session needed by the selected provider.
 */
export interface CheckoutHandler {
  supports(strategy: CommerceStrategy): boolean;
  createCheckout(request: CheckoutRequest): Promise<CheckoutResult>;
}

export interface FulfillmentRequest {
  orderId: string;
  offer: Offer;
  fulfillment: OfferFulfillment;
  customer: CustomerIdentity;
  quantity: number;
  providerPaymentReference?: string;
}

export interface FulfillmentResult {
  status: 'not_required' | 'fulfilled' | 'pending' | 'failed';
  providerReference?: string;
  error?: string;
}

/**
 * Fulfillment is intentionally separate from payment processing. Stripe can
 * report that a payment succeeded without knowing how a digital guide,
 * experience follow-up, or external physical order is ultimately fulfilled.
 */
export interface FulfillmentHandler {
  supports(fulfillment: OfferFulfillment): boolean;
  fulfill(request: FulfillmentRequest): Promise<FulfillmentResult>;
}
