import type { Offer } from './types';

/**
 * First-party Wine With Pete offers that are not backed by the legacy
 * `products` table. This catalog proves the Offer domain can describe the
 * actual business, not just ecommerce SKUs.
 */
export const STATIC_OFFERS = [
  {
    id: 'plan-a-gathering',
    slug: 'plan-a-gathering',
    title: 'Plan a Gathering',
    description:
      'A custom gathering blueprint for a privately hosted evening, including menu, wine, flow, atmosphere, and conversation direction.',
    kind: 'experience',
    pagePath: '/plan',
    availability: {
      status: 'active',
      featured: true,
    },
    commerce: {
      type: 'inquiry',
      href: '/plan',
    },
    source: {
      type: 'static',
      id: 'plan-a-gathering',
    },
  },
  {
    id: 'signature-table',
    slug: 'signature-table',
    title: 'Signature Table',
    description:
      'A privately hosted Wine With Pete table experience shaped around the host, guests, setting, food, wine, and conversation.',
    kind: 'experience',
    pagePath: '/signature-table',
    availability: {
      status: 'active',
      featured: true,
      limited: true,
    },
    commerce: {
      type: 'inquiry',
      href: '/signature-table',
    },
    source: {
      type: 'static',
      id: 'signature-table',
    },
  },
  {
    id: 'founding-table',
    slug: 'founding-table',
    title: 'Founding Table',
    description:
      'The closer Wine With Pete circle for gathering invitations, essays, notes, recipes, and early community access.',
    kind: 'access',
    pagePath: '/join',
    availability: {
      status: 'active',
    },
    commerce: {
      type: 'signup',
      href: '/join',
    },
    source: {
      type: 'static',
      id: 'founding-table',
    },
  },
  {
    id: 'baseline-method',
    slug: 'baseline-method',
    title: 'The Baseline Method',
    description:
      'An evergreen guide to rebuild a physical and mental baseline through small, repeatable daily anchors.',
    kind: 'digital',
    pagePath: '/baseline-method',
    availability: {
      status: 'active',
    },
    commerce: {
      type: 'external_checkout',
      provider: 'gumroad',
      href: 'https://8413493499309.gumroad.com/l/baseline-method',
    },
    source: {
      type: 'static',
      id: 'baseline-method',
    },
  },
  {
    id: 'support-5',
    slug: 'support-coffee',
    title: 'Buy Me a Coffee',
    description: 'A small one-time contribution to support Wine With Pete.',
    kind: 'support',
    pagePath: '/support',
    availability: {
      status: 'active',
    },
    price: {
      amountCents: 500,
      currency: 'usd',
    },
    commerce: {
      type: 'stripe',
      mode: 'payment',
      fulfillment: { type: 'none' },
    },
    source: {
      type: 'static',
      id: 'support-5',
    },
  },
  {
    id: 'support-7',
    slug: 'support-glass-of-wine',
    title: 'Buy Me a Glass of Wine',
    description: 'A one-time contribution to support Wine With Pete.',
    kind: 'support',
    pagePath: '/support',
    availability: {
      status: 'active',
    },
    price: {
      amountCents: 700,
      currency: 'usd',
    },
    commerce: {
      type: 'stripe',
      mode: 'payment',
      fulfillment: { type: 'none' },
    },
    source: {
      type: 'static',
      id: 'support-7',
    },
  },
  {
    id: 'support-50',
    slug: 'support-vision',
    title: 'Support the Vision',
    description: 'A larger one-time contribution to support Wine With Pete.',
    kind: 'support',
    pagePath: '/support',
    availability: {
      status: 'active',
    },
    price: {
      amountCents: 5000,
      currency: 'usd',
    },
    commerce: {
      type: 'stripe',
      mode: 'payment',
      fulfillment: { type: 'none' },
    },
    source: {
      type: 'static',
      id: 'support-50',
    },
  },
] satisfies Offer[];

export function getStaticOffers(): Offer[] {
  return [...STATIC_OFFERS];
}

export function getStaticOfferById(id: string): Offer | undefined {
  return STATIC_OFFERS.find((offer) => offer.id === id);
}
