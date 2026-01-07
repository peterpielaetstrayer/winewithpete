/**
 * Application-wide constants
 */

// Shipping configuration
export const SHIPPING_COST = 5.99; // Flat rate shipping in USD
export const SHIPPING_COST_CENTS = Math.round(SHIPPING_COST * 100); // For Stripe (599 cents)

// Shipping settings
export const SHIPPING_ALLOWED_COUNTRIES = ['US']; // US only shipping
export const SHIPPING_DELIVERY_MIN_DAYS = 5; // Minimum business days
export const SHIPPING_DELIVERY_MAX_DAYS = 10; // Maximum business days

