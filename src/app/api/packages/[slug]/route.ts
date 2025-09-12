import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPackage } from '@/lib/supabase/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    // Check if user is a member
    let isMember = false;
    if (session?.user) {
      const { data: member } = await supabase
        .from('members')
        .select('id')
        .eq('user_id', session.user.id)
        .single();
      isMember = !!member;
    }

    const packageData = await getPackage(params.slug);

    if (!packageData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    const hasAccess = isMember || packageData.published;

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'This package is members only' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      data: packageData,
      member: isMember
    });

  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json(
      { error: 'Failed to fetch package' },
      { status: 500 }
    );
  }
}
