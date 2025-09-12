import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPackages } from '@/lib/supabase/database';

export async function GET(request: NextRequest) {
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

    // Get packages - members see all, non-members see only published
    const packages = await getPackages(!isMember);

    return NextResponse.json({
      data: packages,
      member: isMember
    });

  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}
