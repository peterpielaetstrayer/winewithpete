// Database types for Wine With Pete

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: 'open_fire_sunday' | 'salon_dinner' | 'other';
  event_date: string;
  location: string | null;
  max_attendees: number | null;
  current_attendees: number;
  is_public: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventRSVP {
  id: string;
  event_id: string;
  email: string;
  name: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Printful API types
export interface PrintfulVariantFile {
  id?: number;
  type?: string;
  url?: string;
  preview_url?: string;
  filename?: string;
}

export interface PrintfulVariant {
  id: number;
  product_id?: number;
  name?: string;
  size?: string;
  color?: string;
  color_code?: string;
  availability_status?: string;
  retail_price?: number | string;
  price?: number | string;
  cost?: number | string;
  currency?: string;
  files?: PrintfulVariantFile[];
  preview_image?: string;
  [key: string]: unknown; // Allow additional properties from Printful API
}

export interface PrintfulSyncProduct {
  id: number;
  external_id?: string;
  name: string;
  thumbnail_url?: string;
  preview_url?: string;
  image?: string;
  [key: string]: unknown; // Allow additional properties from Printful API
}

export interface PrintfulSyncData {
  sync_product?: PrintfulSyncProduct;
  variants: PrintfulVariant[];
  [key: string]: unknown; // Allow additional properties from Printful API
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  product_type: 'recipe_card' | 'guide' | 'ebook' | 'bundle' | 'physical' | 'merch';
  product_category?: 'digital' | 'merch' | 'wine_bear';
  file_path: string | null;
  image_path: string | null;
  printful_product_id?: string | null;
  printful_variant_id?: string | null;
  printful_sync_data?: PrintfulSyncData | null;
  is_active: boolean;
  is_featured?: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  email: string;
  name: string;
  total_amount: number;
  stripe_payment_intent_id: string | null;
  printful_order_id?: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  preferences: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeaturedEssay {
  id: string;
  url: string;
  title: string | null;
  excerpt: string | null;
  image_url: string | null;
  published_date: string | null;
  display_order: number;
  is_active: boolean;
  featured_essay?: boolean;
  created_at: string;
  updated_at: string;
}

// Form types
export interface RSVPFormData {
  name: string;
  email: string;
  notes?: string;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
}

// Stripe types
export interface StripeCheckoutSession {
  id: string;
  url: string;
}

export interface CreateCheckoutSessionRequest {
  productId: string;
  quantity?: number;
  customerEmail?: string;
  customerName?: string;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Supabase Auth User type (simplified)
export interface SupabaseUser {
  id: string;
  email?: string;
  [key: string]: unknown;
}

// Printful sync error type
export interface PrintfulSyncError {
  product: string;
  error: string;
  debug?: string;
}
