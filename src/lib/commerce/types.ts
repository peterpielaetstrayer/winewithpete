export type OfferKind = 'experience' | 'digital' | 'physical' | 'support' | 'access';

export type OfferStatus = 'draft' | 'coming_soon' | 'active' | 'archived';

export type CurrencyCode = 'usd';

export interface Money {
  amountCents: number;
  currency: CurrencyCode;
}

export interface OfferImage {
  url: string;
  alt?: string;
}

export interface OfferAvailability {
  status: OfferStatus;
  featured?: boolean;
  limited?: boolean;
}

export type OfferFulfillment =
  | { type: 'none' }
  | { type: 'digital_download' }
  | { type: 'experience_followup' }
  | { type: 'external_provider' };

export type CommerceStrategy =
  | {
      type: 'inquiry';
      href: string;
    }
  | {
      type: 'stripe';
      mode: 'payment' | 'subscription';
      fulfillment: OfferFulfillment;
    }
  | {
      type: 'external_checkout';
      provider: 'fourthwall' | 'gumroad' | 'other';
      href: string;
      providerOfferId?: string;
    }
  | {
      type: 'signup';
      href: string;
    }
  | {
      /**
       * Transitional escape hatch for existing commerce flows while they are
       * migrated behind provider-agnostic Offer behavior.
       *
       * New offers should not use this strategy.
       */
      type: 'legacy_checkout';
      href: string;
    };

export interface Offer {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  kind: OfferKind;
  /** Canonical Wine With Pete page where the offer is presented. */
  pagePath?: string;
  availability: OfferAvailability;
  price?: Money | null;
  images?: OfferImage[];
  commerce: CommerceStrategy;
  source?: {
    type: 'legacy_product' | 'static' | 'provider';
    id?: string;
  };
}

export function isPurchasableOffer(offer: Offer): boolean {
  return (
    offer.availability.status === 'active' &&
    ['stripe', 'external_checkout', 'legacy_checkout'].includes(offer.commerce.type)
  );
}
