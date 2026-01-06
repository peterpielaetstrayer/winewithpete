import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FeaturedEssay } from '@/lib/types';

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

// GET - Fetch all featured essays
export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await verifyAdmin(request);
    if (authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createClient();
    
    const { data: essays, error } = await supabase
      .from('featured_essays')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      // Check if table doesn't exist
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Database table not found',
            details: 'Please run the SQL migration to create the featured_essays table. See create-featured-essays-table.sql'
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { 
          error: 'Failed to fetch essays',
          details: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: essays || [] });

  } catch (error) {
    console.error('Admin essays error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new featured essay
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
    const { url, title, excerpt, image_url, published_date, display_order } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get current max display_order to set default
    const { data: existingEssays } = await supabase
      .from('featured_essays')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);

    const newDisplayOrder = display_order !== undefined 
      ? display_order 
      : (existingEssays?.[0]?.display_order ?? 0) + 1;

    const { data: essay, error } = await supabase
      .from('featured_essays')
      .insert({
        url,
        title: title || null,
        excerpt: excerpt || null,
        image_url: image_url || null,
        published_date: published_date || null,
        display_order: newDisplayOrder,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Create essay error:', error);
      return NextResponse.json(
        { error: 'Failed to create essay', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: essay });

  } catch (error) {
    console.error('Admin essays POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update featured essay
export async function PATCH(request: NextRequest) {
  try {
    const { error: authError } = await verifyAdmin(request);
    if (authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Essay ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data: essay, error } = await supabase
      .from('featured_essays')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update essay error:', error);
      return NextResponse.json(
        { error: 'Failed to update essay', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: essay });

  } catch (error) {
    console.error('Admin essays PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete featured essay
export async function DELETE(request: NextRequest) {
  try {
    const { error: authError } = await verifyAdmin(request);
    if (authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Essay ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('featured_essays')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete essay error:', error);
      return NextResponse.json(
        { error: 'Failed to delete essay', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Admin essays DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

