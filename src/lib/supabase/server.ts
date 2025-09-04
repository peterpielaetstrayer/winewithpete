import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const createServerSupabase = () =>
  createSupabaseClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// Export createClient for API routes (server-side with service role)
export const createClient = () =>
  createSupabaseClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );