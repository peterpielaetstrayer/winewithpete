import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { logAdminAction, AdminActions } from '@/lib/admin-logger';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!(await verifyAdmin(request))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Log admin action
    logAdminAction(request, AdminActions.VIEW_ORDERS, 'orders');

    const supabase = createClient();
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: orders });

  } catch (error) {
    console.error('Admin orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
