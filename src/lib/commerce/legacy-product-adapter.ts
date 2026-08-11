import type { Product } from '@/lib/types';
import type { Offer, OfferKind, OfferImage } from './types';

const DIGITAL_PRODUCT_TYPES = new Set<Product['product_type']>([
  'recipe_card',
  'guide',
  'ebook',
  'bundle',
]);

const PHYSICAL_PRODUCT_TYPES = new Set<Product['product_type']>([
  'physical',
  'merch',
]);

export interface LegacyProductAdapterOptions {
  resolveStoredImageUrl?: (imagePath: string) => string | null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getOfferKind(product: Product): OfferKind {
  if (
    DIGITAL_PRODUCT_TYPES.has(product.product_type) ||
    product.product_category === 'digital'
  ) {
    return 'digital';
  }

  if (
    PHYSICAL_PRODUCT_TYPES.has(product.product_type) ||
    product.product_category === 'merch' ||
    product.product_category === 'wine_bear'
  ) {
    return 'physical';
  }

  return 'digital';
}

function getImages(
  product: Product,
  options: LegacyProductAdapterOptions
): OfferImage[] | undefined {
  if (!product.image_path) return undefined;

  if (product.image_path.startsWith('http')) {
    return [{ url: product.image_path, alt: product.name }];
  }

  const resolved = options.resolveStoredImageUrl?.(product.image_path);
  return resolved ? [{ url: resolved, alt: product.name }] : undefined;
}

/**
 * Transitional adapter that lets existing Product records participate in the
 * new Offer domain without changing database tables or customer-facing routes.
 *
 * The adapter intentionally does not expose Printful-specific fields. Existing
 * physical checkout remains represented only as `legacy_checkout` until a
 * replacement provider is wired in.
 */
export function legacyProductToOffer(
  product: Product,
  options: LegacyProductAdapterOptions = {}
): Offer {
  const kind = getOfferKind(product);
  const destination = kind === 'physical' ? '/store' : '/recipes';

  return {
    id: product.id,
    slug: slugify(product.name) || product.id,
    title: product.name,
    description: product.description,
    kind,
    pagePath: destination,
    availability: {
      status: product.is_active ? 'active' : 'archived',
      featured: product.is_featured ?? false,
    },
    price: {
      amountCents: Math.round(product.price * 100),
      currency: 'usd',
    },
    images: getImages(product, options),
    commerce: {
      type: 'legacy_checkout',
      href: `${destination}?product=${encodeURIComponent(product.id)}`,
    },
    source: {
      type: 'legacy_product',
      id: product.id,
    },
  };
}
