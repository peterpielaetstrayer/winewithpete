import { createClient } from '@supabase/supabase-js';
import type { Event, EventRSVP, Product, Order, OrderItem, NewsletterSubscriber, RSVPFormData, NewsletterFormData, Package, Recipe, Member, ShoppingItem, Ingredient } from '../types';

// Create Supabase client with proper environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!
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

// Packages
export async function getPackages(memberOnly = false) {
  let query = supabase
    .from('packages')
    .select(`
      *,
      recipes:packages.recipes->recipe_id (*)
    `)
    .order('created_at', { ascending: false });

  if (!memberOnly) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Package[];
}

export async function getPackage(slug: string) {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      recipes
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;

  // Fetch full recipe details
  if (data?.recipes) {
    const recipeIds = (data.recipes as any[]).map(r => r.recipe_id);
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*')
      .in('id', recipeIds);

    if (!recipesError && recipes) {
      // Merge recipe data with package recipe data
      data.recipes = (data.recipes as any[]).map(pr => ({
        ...pr,
        recipe: recipes.find(r => r.id === pr.recipe_id)
      }));
    }
  }

  return data as Package;
}

export async function getRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as Recipe[];
}

export async function getRecipe(id: string) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Recipe;
}

// Members
export async function getMember(userId: string) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return data as Member | null;
}

export async function createMember(memberData: {
  user_id: string;
  email: string;
  name?: string;
  subscription_tier?: 'basic' | 'premium' | 'founder';
}) {
  const { data, error } = await supabase
    .from('members')
    .insert(memberData)
    .select()
    .single();

  if (error) throw error;
  return data as Member;
}

// Utility functions for shopping list aggregation
export function aggregateShoppingList(
  packageData: Package,
  servingSize: number = 4
): ShoppingItem[] {
  if (!packageData.recipes) return [];

  const aggregated: Map<string, ShoppingItem> = new Map();

  packageData.recipes.forEach((packageRecipe) => {
    if (!packageRecipe.recipe?.ingredients) return;

    const recipe = packageRecipe.recipe;
    const scaleFactor = (servingSize / recipe.serves_base) * packageRecipe.serves_factor;

    recipe.ingredients.forEach((ingredient: Ingredient) => {
      const key = `${ingredient.item}_${ingredient.unit}`;
      const scaledAmount = ingredient.amount * scaleFactor;

      if (aggregated.has(key)) {
        const existing = aggregated.get(key)!;
        existing.amount += scaledAmount;
      } else {
        aggregated.set(key, {
          item: ingredient.item,
          amount: scaledAmount,
          unit: ingredient.unit,
          notes: ingredient.notes,
        });
      }
    });
  });

  return Array.from(aggregated.values()).sort((a, b) => a.item.localeCompare(b.item));
}

export function formatShoppingAmount(amount: number): string {
  // Round to reasonable precision
  if (amount % 1 === 0) return amount.toString();
  if (amount < 1) return amount.toFixed(2).replace(/\.?0+$/, '');
  return amount.toFixed(1).replace(/\.0$/, '');
}
