import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';
import { getStaticOfferById, getStaticOffers } from './catalog';
import { legacyProductToOffer } from './legacy-product-adapter';
import type { Offer, OfferKind } from './types';

const LEGACY_PRODUCT_FIELDS = [
  'id',
  'name',
  'description',
  'price',
  'product_type',
  'product_category',
  'file_path',
  'image_path',
  'is_active',
  'is_featured',
  'display_order',
  'created_at',
  'updated_at',
].join(',');

export interface GetOffersOptions {
  includeInactive?: boolean;
  kinds?: OfferKind[];
}

function resolveStoredImageUrl(imagePath: string): string | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  return `${supabaseUrl}/storage/v1/object/public/product-images/${imagePath}`;
}

function legacyProductsToOffers(products: Product[]): Offer[] {
  return products.map((product) =>
    legacyProductToOffer(product, { resolveStoredImageUrl })
  );
}

/**
 * Read-only compatibility layer for the migration period.
 *
 * Static first-party offers and legacy product rows are returned through one
 * provider-agnostic domain. No customer-facing route consumes this service yet.
 */
export async function getOffers(options: GetOffersOptions = {}): Promise<Offer[]> {
  const supabase = createClient();

  let query = supabase
    .from('products')
    .select(LEGACY_PRODUCT_FIELDS)
    .order('created_at', { ascending: false });

  if (!options.includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;

  const offers = [
    ...getStaticOffers(),
    ...legacyProductsToOffers((data || []) as Product[]),
  ];

  if (!options.kinds || options.kinds.length === 0) {
    return offers;
  }

  const allowedKinds = new Set(options.kinds);
  return offers.filter((offer) => allowedKinds.has(offer.kind));
}

export async function getOfferById(id: string): Promise<Offer | null> {
  const staticOffer = getStaticOfferById(id);
  if (staticOffer) return staticOffer;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select(LEGACY_PRODUCT_FIELDS)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return legacyProductToOffer(data as Product, { resolveStoredImageUrl });
}
