/**
 * Utilities for working with Printful API data
 */

/**
 * Safely convert a value to a number
 */
export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? null : num;
}

/**
 * Extract price from Printful variant data
 * Printful API may return prices in cents or dollars, so we need to handle both formats
 */
export function extractPriceFromVariant(variant: {
  retail_price?: unknown;
  price?: unknown;
  cost?: unknown;
}): number {
  const rawRetailPrice = toNumber(variant.retail_price);
  const rawPrice = toNumber(variant.price);
  const rawCost = toNumber(variant.cost);

  let priceValue = 0;

  // Try retail_price first (most common)
  if (rawRetailPrice !== null && rawRetailPrice !== undefined) {
    // retail_price: Printful usually returns in cents
    // If value is >= 100, it's likely in cents; if < 100, might be dollars
    if (rawRetailPrice >= 100) {
      // Large number, definitely cents - convert to dollars
      priceValue = Math.round((rawRetailPrice / 100) * 100) / 100;
    } else if (rawRetailPrice >= 1 && rawRetailPrice < 100) {
      // Medium number (1-100), could be dollars (like 39.99, 51) or cents (like 40, 51)
      // If it's a whole number >= 10, it's likely dollars; otherwise check decimals
      if (rawRetailPrice % 1 === 0 && rawRetailPrice >= 10) {
        // Whole number >= 10, likely dollars (like 40, 51)
        priceValue = rawRetailPrice;
      } else {
        // Has decimals or < 10, could be either - try as dollars first
        priceValue = rawRetailPrice;
      }
    } else {
      // Very small number (< 1), likely already in dollars as decimal
      priceValue = rawRetailPrice;
    }
  } else if (rawPrice !== null && rawPrice !== undefined) {
    // Fallback to price field
    if (rawPrice >= 100) {
      priceValue = Math.round((rawPrice / 100) * 100) / 100;
    } else {
      priceValue = rawPrice;
    }
  } else if (rawCost !== null && rawCost !== undefined) {
    // Fallback to cost field
    if (rawCost >= 100) {
      priceValue = Math.round((rawCost / 100) * 100) / 100;
    } else {
      priceValue = rawCost;
    }
  }

  // Handle edge case: if price is between 0-1, it might be incorrectly parsed
  // Check if the raw value was actually a larger number
  if (priceValue > 0 && priceValue < 1) {
    const rawValue = rawRetailPrice ?? rawPrice;
    if (rawValue !== null && rawValue >= 10 && rawValue < 1000) {
      // Likely should be treated as dollars, not cents
      priceValue = rawValue;
    }
  }

  // Round to 2 decimal places
  return Math.round(priceValue * 100) / 100;
}

