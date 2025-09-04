// Simple in-memory rate limiting
// In production, use Redis or a proper rate limiting service

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (request: Request) => string; // Custom key generator
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, keyGenerator } = options;

  return (request: Request): { success: boolean; remaining: number; resetTime: number } => {
    // Generate key for this request
    const key = keyGenerator ? keyGenerator(request) : getDefaultKey(request);
    
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      
      return {
        success: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      };
    }

    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment counter
    entry.count++;
    rateLimitMap.set(key, entry);

    return {
      success: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  };
}

function getDefaultKey(request: Request): string {
  // Use IP address as default key
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `rate_limit:${ip}`;
}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Predefined rate limiters
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
});

export const checkoutRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 10, // 10 checkout attempts per 5 minutes
});
