import { NextRequest } from 'next/server';

export interface AdminAction {
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

export function logAdminAction(
  request: NextRequest,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, any>
) {
  const adminAction: AdminAction = {
    action,
    resource,
    resourceId,
    details,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    timestamp: new Date(),
  };

  // Log to console (in production, send to logging service)
  console.log('🔒 ADMIN ACTION:', JSON.stringify(adminAction, null, 2));
  
  // TODO: In production, send to logging service like:
  // - Sentry
  // - LogRocket
  // - Custom logging endpoint
  // - Database audit log
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Predefined admin actions
export const AdminActions = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  VIEW_ORDERS: 'view_orders',
  VIEW_PRODUCTS: 'view_products',
  UPDATE_PRODUCT: 'update_product',
  TOGGLE_PRODUCT_STATUS: 'toggle_product_status',
  VIEW_CUSTOMER_DATA: 'view_customer_data',
} as const;
