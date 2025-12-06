import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for server-side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Send campaign email to all subscribers
 * POST /api/campaigns/send
 * Body: { subject, html, text?, tags?, limit? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, html, text, tags, limit } = body;

    if (!subject || !html) {
      return NextResponse.json(
        { error: 'Subject and HTML content are required' },
        { status: 400 }
      );
    }

    // Get all active subscribers from Supabase
    let query = supabase
      .from('newsletter_subscribers')
      .select('email, name')
      .eq('is_active', true);

    // Filter by tags if provided (assuming you have a tags column or JSON field)
    // Adjust based on your actual schema
    if (tags && Array.isArray(tags) && tags.length > 0) {
      // This is a placeholder - adjust based on your actual schema
      // You might need to use .contains() or filter differently
      console.log('Tags filtering not yet implemented - sending to all active subscribers');
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data: subscribers, error } = await query;

    if (error) {
      console.error('Failed to fetch subscribers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscribers', details: error.message },
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: 'No active subscribers found',
      });
    }

    // Send emails to all subscribers
    const results = await Promise.allSettled(
      subscribers.map((subscriber) => {
        const personalizedHtml = html.replace(/\{name\}/g, subscriber.name || 'Friend');
        const personalizedText = text?.replace(/\{name\}/g, subscriber.name || 'Friend');
        
        return sendEmail({
          to: subscriber.email,
          subject,
          html: personalizedHtml,
          text: personalizedText,
        });
      })
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`Campaign sent: ${successful} successful, ${failed} failed out of ${subscribers.length} total`);

    return NextResponse.json({
      success: true,
      sent: successful,
      failed,
      total: subscribers.length,
      message: `Campaign sent to ${successful} subscribers`,
    });

  } catch (error) {
    console.error('Campaign sending failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send campaign',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

