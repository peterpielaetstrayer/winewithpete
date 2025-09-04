import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Helper function to verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const supabase = createClient();
  
  // Get the authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No authorization token', user: null };
  }
  
  const token = authHeader.split(' ')[1];
  
  // Verify the token and get user
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { error: 'Invalid token', user: null };
  }
  
  return { error: null, user };
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { error: authError } = await verifyAdmin(request);
    if (authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
