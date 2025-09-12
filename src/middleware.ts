import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // For now, let's disable the middleware to avoid auth issues
  // We'll handle auth in the components instead
  return NextResponse.next()
}

export const config = {
  matcher: ['/hub/:path*']
}
