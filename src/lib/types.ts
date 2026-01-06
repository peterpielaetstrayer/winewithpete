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
  printful_sync_data?: any; // Full Printful product data
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
