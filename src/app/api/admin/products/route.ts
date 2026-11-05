import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { productUpdateSchema } from '@/lib/validations';
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
    if (!(await verifyAdmin(request))) {
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
      console.error('Product ID:', id);
      console.error('Updates being applied:', updates);
      return NextResponse.json(
        { 
          error: 'Failed to update product',
          details: error.message || 'Database error',
          code: error.code,
          hint: error.hint
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
