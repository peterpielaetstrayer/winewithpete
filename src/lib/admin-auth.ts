import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** Server-only privileged access gate. Authentication alone is not authorization. */
export async function verifyAdmin(request: Pick<NextRequest, 'headers'>): Promise<boolean> {
  const allowedIds = new Set(
    (process.env.WWP_ADMIN_USER_IDS || '').split(',')
      .map((id) => id.trim()).filter(Boolean)
  );
  const authorization = request.headers.get('authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim() : '';
  if (!token || allowedIds.size === 0) return false;
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    return !error && !!user && allowedIds.has(user.id);
  } catch {
    return false;
  }
}
