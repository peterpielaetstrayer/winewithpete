// Email campaign automation using Resend
// This allows you to send automated campaigns to all subscribers in Supabase

import { sendEmail } from './email';
import { getSupabaseClient } from './supabase/database';

interface CampaignEmail {
  subject: string;
  html: string;
  text?: string;
}

interface CampaignOptions {
  tags?: string[];
  limit?: number;
}

/**
 * Send a campaign email to all active newsletter subscribers
 */
export async function sendCampaignEmail(
  campaign: CampaignEmail,
  options: CampaignOptions = {}
) {
  try {
    // Get all active subscribers from Supabase
    const supabase = getSupabaseClient();
    let query = supabase
      .from('newsletter_subscribers')
      .select('email, name')
      .eq('is_active', true);

    // Filter by tags if provided
    if (options.tags && options.tags.length > 0) {
      // Note: This assumes you have a tags column or similar
      // You might need to adjust based on your schema
      query = query.contains('tags', options.tags);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data: subscribers, error } = await query;

    if (error) {
      console.error('Failed to fetch subscribers:', error);
      return {
        success: false,
        error: 'Failed to fetch subscribers',
      };
    }

    if (!subscribers || subscribers.length === 0) {
      return {
        success: true,
        sent: 0,
        message: 'No subscribers found',
      };
    }

    // Send emails to all subscribers
    const results = await Promise.allSettled(
      subscribers.map((subscriber) =>
        sendEmail({
          to: subscriber.email,
          subject: campaign.subject,
          html: campaign.html.replace(/\{name\}/g, subscriber.name || 'Friend'),
          text: campaign.text?.replace(/\{name\}/g, subscriber.name || 'Friend'),
        })
      )
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`Campaign sent: ${successful} successful, ${failed} failed`);

    return {
      success: true,
      sent: successful,
      failed,
      total: subscribers.length,
    };
  } catch (error) {
    console.error('Campaign sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send campaign to subscribers with specific tag (e.g., 'december-reset')
 */
export async function sendTaggedCampaign(
  campaign: CampaignEmail,
  tag: string,
  options: CampaignOptions = {}
) {
  return sendCampaignEmail(campaign, {
    ...options,
    tags: [tag],
  });
}

