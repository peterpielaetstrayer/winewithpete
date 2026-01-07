import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { productUpdateSchema } from '@/lib/validations';
import { logAdminAction, AdminActions } from '@/lib/admin-logger';

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
    const { error: authError, user } = await verifyAdmin(request);
    if (authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Log admin action
    logAdminAction(request, AdminActions.VIEW_PRODUCTS, 'products');

    const supabase = createClient();
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: products });

  } catch (error) {
    console.error('Admin products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authentication
    const { error: authError, user } = await verifyAdmin(request);
    if (authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input with Zod
    const validationResult = productUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors.map(e => e.message)
        },
        { status: 400 }
      );
    }

    const { id, ...updates } = validationResult.data;

    // Log admin action
    logAdminAction(request, AdminActions.UPDATE_PRODUCT, 'products', id, updates);

    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to update product',
          details: error.message || 'Database error'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Admin product update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
