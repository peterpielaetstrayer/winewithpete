-- Create gathering_interests table for dinner and gathering lead history
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS gathering_interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  source TEXT NOT NULL DEFAULT 'general',
  interest_types TEXT[] NOT NULL DEFAULT '{}',
  note TEXT,
  newsletter_opt_in BOOLEAN NOT NULL DEFAULT true,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  page_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gathering_interests_email_idx
  ON gathering_interests(email);

CREATE INDEX IF NOT EXISTS gathering_interests_source_idx
  ON gathering_interests(source);

CREATE INDEX IF NOT EXISTS gathering_interests_created_at_idx
  ON gathering_interests(created_at DESC);

ALTER TABLE gathering_interests ENABLE ROW LEVEL SECURITY;

-- This table is written by server-side API routes using the Supabase service role key.
-- No public policies are added here on purpose.
