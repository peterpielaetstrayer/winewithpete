import { NextResponse } from 'next/server';

/**
 * Standardized API response types
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string;
  code?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true as const,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

/**
 * Create an error API response
 */
export function errorResponse(
  error: string,
  details?: string,
  code?: string,
  status: number = 500
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false as const,
      error,
      ...(details && { details }),
      ...(code && { code }),
    },
    { status }
  );
}

/**
 * Create a validation error response
 */
export function validationErrorResponse(
  errors: string[],
  status: number = 400
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false as const,
      error: 'Validation failed',
      details: errors.join(', '),
      code: 'VALIDATION_ERROR',
    },
    { status }
  );
}

/**
 * Create a not found error response
 */
export function notFoundResponse(
  resource: string = 'Resource',
  status: number = 404
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false as const,
      error: `${resource} not found`,
      code: 'NOT_FOUND',
    },
    { status }
  );
}

/**
 * Create a rate limit error response
 */
export function rateLimitResponse(
  retryAfter: number,
  remaining: number,
  resetTime: number,
  status: number = 429
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false as const,
      error: 'Too many requests. Please try again later.',
      details: `Retry after ${retryAfter} seconds`,
      code: 'RATE_LIMIT_EXCEEDED',
    },
    {
      status,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toString(),
      },
    }
  );
}

