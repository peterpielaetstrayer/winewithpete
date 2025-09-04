import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email format').max(255);
export const nameSchema = z.string().min(1, 'Name is required').max(100, 'Name too long');
export const uuidSchema = z.string().uuid('Invalid ID format');

// RSVP validation
export const rsvpSchema = z.object({
  eventId: uuidSchema,
  email: emailSchema,
  name: nameSchema,
  notes: z.string().max(500, 'Notes too long').optional(),
});

// Newsletter subscription validation
export const newsletterSchema = z.object({
  email: emailSchema,
  name: nameSchema.optional(),
});

// Checkout validation
export const checkoutSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Quantity too high').default(1),
  customerEmail: emailSchema,
  customerName: nameSchema,
  customAmount: z.number().positive('Amount must be positive').max(10000, 'Amount too high').optional(),
  customDescription: z.string().max(200, 'Description too long').optional(),
});

// Admin product update validation
export const productUpdateSchema = z.object({
  id: uuidSchema,
  name: nameSchema.optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  price: z.number().positive('Price must be positive').max(10000, 'Price too high').optional(),
  is_active: z.boolean().optional(),
});

// Order ID validation
export const orderIdSchema = z.object({
  orderId: uuidSchema,
});

// Sanitize string inputs
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Validate and sanitize email
export function validateEmail(email: string): string {
  const validated = emailSchema.parse(email);
  return validated.toLowerCase().trim();
}

// Validate and sanitize name
export function validateName(name: string): string {
  const validated = nameSchema.parse(name);
  return sanitizeString(validated);
}
