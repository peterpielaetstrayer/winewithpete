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
      
      // First, test if we can even connect to Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
      if (supabaseUrl) {
        try {
          const healthCheck = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'HEAD',
            headers: {
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
            }
          });
          results.steps.supabase_test.health_check = {
            status: healthCheck.status,
            reachable: healthCheck.status < 500,
          };
        } catch (healthError) {
          results.steps.supabase_test.health_check = {
            status: 'unreachable',
            error: healthError instanceof Error ? healthError.message : String(healthError),
          };
        }
      }
      
      // Try to subscribe
      const supabaseResult = await subscribeToNewsletter({
        email: email.trim().toLowerCase(),
      });
      results.steps.supabase_test = {
        ...results.steps.supabase_test,
        status: 'success',
        data: supabaseResult,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.steps.supabase_test = {
        ...results.steps.supabase_test,
        status: 'error',
        error: errorMessage,
        isConnectionError: errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('ECONNREFUSED'),
        suggestion: errorMessage.includes('fetch') || errorMessage.includes('network') 
          ? 'Supabase database may be paused. Check your Supabase dashboard and resume if needed.'
          : 'Check Supabase configuration and table permissions.',
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

