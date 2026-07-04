import { NextRequest } from 'next/server';

import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { createClient } from '@/lib/supabase/server';
import type {
  GatheringInterest,
  GatheringInterestFormData,
  NewsletterSubscriber,
} from '@/lib/types';
import {
  gatheringInterestSchema,
  sanitizeString,
  validateEmail,
  validateName,
} from '@/lib/validations';

type SubscriberLookup = Pick<NewsletterSubscriber, 'id' | 'preferences'>;

function sanitizeOptionalText(value: string | undefined, maxLength: number): string | null {
  if (!value) return null;

  const sanitized = sanitizeString(value).substring(0, maxLength).trim();
  return sanitized.length > 0 ? sanitized : null;
}

function normalizeIdentifier(value: string | undefined, fallback: string, maxLength: number): string {
  const sanitized = sanitizeOptionalText(value, maxLength);
  if (!sanitized) return fallback;

  return sanitized
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '') || fallback;
}

function normalizeInterestTypes(payload: GatheringInterestFormData): string[] {
  const rawInterestTypes = payload.interestTypes && payload.interestTypes.length > 0
    ? payload.interestTypes
    : payload.interestType
      ? [payload.interestType]
      : ['attend'];

  return [...new Set(
    rawInterestTypes
      .map((interestType) => normalizeIdentifier(interestType, '', 100))
      .filter(Boolean)
  )];
}

function buildGatheringPreferenceSummary(data: {
  source: string;
  location: string | null;
  interestTypes: string[];
  newsletterOptIn: boolean;
  pagePath: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}) {
  return {
    source: data.source,
    location: data.location,
    interest_types: data.interestTypes,
    newsletter_opt_in: data.newsletterOptIn,
    page_path: data.pagePath,
    utm: {
      source: data.utmSource,
      medium: data.utmMedium,
      campaign: data.utmCampaign,
    },
    submitted_at: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = gatheringInterestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message);
      return validationErrorResponse(errors);
    }

    const payload = validationResult.data;

    // Sanitize inputs
    const sanitizedData = {
      email: validateEmail(payload.email),
      name: validateName(payload.name),
      location: sanitizeOptionalText(payload.location, 200),
      interestTypes: normalizeInterestTypes(payload),
      note: sanitizeOptionalText(payload.note, 2000),
      source: normalizeIdentifier(payload.source, 'general', 100),
      newsletterOptIn: payload.newsletterOptIn ?? true,
      utmSource: sanitizeOptionalText(payload.utm?.source, 100),
      utmMedium: sanitizeOptionalText(payload.utm?.medium, 100),
      utmCampaign: sanitizeOptionalText(payload.utm?.campaign, 100),
      pagePath: sanitizeOptionalText(payload.pagePath, 255),
    };

    const supabase = createClient();

    const { data: existingSubscriber, error: subscriberLookupError } = await supabase
      .from('newsletter_subscribers')
      .select('id, preferences')
      .eq('email', sanitizedData.email)
      .maybeSingle();

    if (subscriberLookupError) {
      throw subscriberLookupError;
    }

    const existingSubscriberRow = existingSubscriber as SubscriberLookup | null;
    let subscriberId: string | null = existingSubscriberRow?.id ?? null;

    if (sanitizedData.newsletterOptIn) {
      const gatheringPreferenceSummary = buildGatheringPreferenceSummary(sanitizedData);

      if (existingSubscriberRow) {
        const nextPreferences = {
          ...(existingSubscriberRow.preferences || {}),
          gathering_interest: gatheringPreferenceSummary,
        };

        const { data: updatedSubscriber, error: updateSubscriberError } = await supabase
          .from('newsletter_subscribers')
          .update({
            name: sanitizedData.name,
            preferences: nextPreferences,
            is_active: true,
          })
          .eq('id', existingSubscriberRow.id)
          .select('id')
          .single();

        if (updateSubscriberError) {
          throw updateSubscriberError;
        }

        subscriberId = updatedSubscriber.id;
      } else {
        const { data: insertedSubscriber, error: insertSubscriberError } = await supabase
          .from('newsletter_subscribers')
          .insert({
            email: sanitizedData.email,
            name: sanitizedData.name,
            preferences: {
              gathering_interest: gatheringPreferenceSummary,
            },
            is_active: true,
          })
          .select('id')
          .single();

        if (insertSubscriberError) {
          throw insertSubscriberError;
        }

        subscriberId = insertedSubscriber.id;
      }
    }

    const { data: gatheringInterest, error: insertInterestError } = await supabase
      .from('gathering_interests')
      .insert({
        subscriber_id: subscriberId,
        email: sanitizedData.email,
        name: sanitizedData.name,
        location: sanitizedData.location,
        source: sanitizedData.source,
        interest_types: sanitizedData.interestTypes,
        note: sanitizedData.note,
        newsletter_opt_in: sanitizedData.newsletterOptIn,
        utm_source: sanitizedData.utmSource,
        utm_medium: sanitizedData.utmMedium,
        utm_campaign: sanitizedData.utmCampaign,
        page_path: sanitizedData.pagePath,
      })
      .select('id')
      .single();

    if (insertInterestError) {
      throw insertInterestError;
    }

    return successResponse(
      {
        id: (gatheringInterest as Pick<GatheringInterest, 'id'>).id,
        subscriber_id: subscriberId,
      },
      'Thank you! We\'ll notify you when gatherings are announced in your area.'
    );

  } catch (error) {
    return errorResponse(
      'Failed to submit interest. Please try again.',
      error instanceof Error ? error.message : 'Unknown error',
      'INTERNAL_ERROR',
      500
    );
  }
}

