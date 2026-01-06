import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Unauthorized', user: null };
  }

  const token = authHeader.replace('Bearer ', '');
  const supabase = createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { error: 'Unauthorized', user: null };
  }
  
  return { error: null, user };
}

// POST - Bulk update display_order for drag-and-drop reordering
export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await verifyAdmin(request);
    if (authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { essays } = body; // Array of { id, display_order }

    if (!Array.isArray(essays)) {
      return NextResponse.json(
        { error: 'Essays array is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Update each essay's display_order
    const updates = essays.map((essay: { id: string; display_order: number }) =>
      supabase
        .from('featured_essays')
        .update({ display_order: essay.display_order })
        .eq('id', essay.id)
    );

    const results = await Promise.all(updates);
    
    // Check for errors
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error('Reorder errors:', errors);
      return NextResponse.json(
        { error: 'Failed to reorder some essays', details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Reorder essays error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

