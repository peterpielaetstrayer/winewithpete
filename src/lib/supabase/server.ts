import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

export const createServerSupabase = () =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookies().get(name)?.value } }
  );
