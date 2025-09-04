import { createClient } from '@supabase/supabase-js';
import type { Event, EventRSVP, Product, Order, OrderItem, NewsletterSubscriber, RSVPFormData, NewsletterFormData } from '../types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Events
export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('event_date', { ascending: true });

  if (error) throw error;
  return data as Event[];
}

export async function getEvent(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Event;
}

export async function getUpcomingEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .eq('is_public', true)
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true });

  if (error) throw error;
  return data as Event[];
}

// Event RSVPs
export async function createRSVP(eventId: string, rsvpData: RSVPFormData) {
  const { data, error } = await supabase
    .from('event_rsvps')
    .insert({
      event_id: eventId,
      email: rsvpData.email,
      name: rsvpData.name,
      notes: rsvpData.notes || null,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  // Update event attendee count
  const { data: eventData, error: fetchError } = await supabase
    .from('events')
    .select('current_attendees')
    .eq('id', eventId)
    .single();

  if (!fetchError && eventData) {
    const { error: updateError } = await supabase
      .from('events')
      .update({ current_attendees: eventData.current_attendees + 1 })
      .eq('id', eventId);

    if (updateError) {
      console.error('Error updating attendee count:', updateError);
    }
  }

  return data as EventRSVP;
}

export async function getEventRSVPs(eventId: string) {
  const { data, error } = await supabase
    .from('event_rsvps')
    .select('*')
    .eq('event_id', eventId)
    .eq('status', 'confirmed');

  if (error) throw error;
  return data as EventRSVP[];
}

// Products
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
}

export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Product;
}

// Newsletter
export async function subscribeToNewsletter(subscriberData: NewsletterFormData) {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert({
      email: subscriberData.email,
      name: subscriberData.name || null,
      preferences: {},
      is_active: true
    })
    .select()
    .single();

  if (error) throw error;
  return data as NewsletterSubscriber;
}

// Orders
export async function createOrder(orderData: {
  email: string;
  name: string;
  total_amount: number;
  stripe_payment_intent_id: string;
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function createOrderItem(itemData: {
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}) {
  const { data, error } = await supabase
    .from('order_items')
    .insert(itemData)
    .select()
    .single();

  if (error) throw error;
  return data as OrderItem;
}

export async function getOrder(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
