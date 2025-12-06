import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/supabase/database';
import { addToKitList } from '@/lib/kit';

export async function POST(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    steps: {},
  };

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Step 1: Check environment variables
    results.steps.env_check = {
      hasKitApiKey: !!process.env.KIT_API_KEY,
      kitApiKeyLength: process.env.KIT_API_KEY?.length || 0,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };

    // Step 2: Test Supabase connection
    try {
      results.steps.supabase_test = {
        status: 'testing',
      };
      const supabaseResult = await subscribeToNewsletter({
        email: email.trim().toLowerCase(),
      });
      results.steps.supabase_test = {
        status: 'success',
        data: supabaseResult,
      };
    } catch (error) {
      results.steps.supabase_test = {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      };
    }

    // Step 3: Test Kit API
    try {
      results.steps.kit_test = {
        status: 'testing',
      };
      const kitResult = await addToKitList({
        email: email.trim().toLowerCase(),
        tags: ['test'],
      });
      results.steps.kit_test = {
        status: kitResult.success ? 'success' : 'failed',
        result: kitResult,
      };
    } catch (error) {
      results.steps.kit_test = {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      };
    }

    return NextResponse.json(results);

  } catch (error) {
    results.error = error instanceof Error ? error.message : String(error);
    return NextResponse.json(results, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Debug subscription endpoint',
    usage: 'POST with { email: "test@example.com" }',
    env_check: {
      hasKitApiKey: !!process.env.KIT_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
  });
}

