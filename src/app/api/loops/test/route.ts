import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    checks: {},
  };

  // Check 1: Environment variable
  results.checks.env_variable = {
    status: process.env.LOOPS_API_KEY ? 'configured' : 'missing',
    hasKey: !!process.env.LOOPS_API_KEY,
    keyLength: process.env.LOOPS_API_KEY?.length || 0,
  };

  // Check 2: PDF file accessibility
  try {
    // In Next.js, files in /public are served at the root
    // We'll check if the file would be accessible (can't actually fetch in server context)
    results.checks.pdf_file = {
      status: 'check_manually',
      expected_path: '/files/quick_start_guide_december_reset.pdf',
      note: 'Place the PDF in /public/files/ directory. It will be accessible at the expected_path URL.',
    };
  } catch (error) {
    results.checks.pdf_file = {
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Check 3: Loops API connection
  if (process.env.LOOPS_API_KEY) {
    try {
      // Test 1: Test API key validity
      const listResponse = await fetch('https://app.loops.so/api/v1/contacts/list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      let listData: any;
      try {
        listData = await listResponse.json();
      } catch {
        listData = await listResponse.text();
      }

      results.checks.loops_api = {
        status: listResponse.ok ? 'connected' : 'error',
        statusCode: listResponse.status,
        statusText: listResponse.statusText,
        message: listResponse.ok 
          ? 'Loops API is accessible and API key is valid'
          : 'Loops API returned an error. Check your API key.',
        response: listData,
      };

      // Test 2: Try creating a test contact (will fail if mailing list doesn't exist)
      if (listResponse.ok) {
        try {
          const testEmail = `test-${Date.now()}@example.com`;
          const createResponse = await fetch('https://app.loops.so/api/v1/contacts/create', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: testEmail,
              source: 'test',
              mailingLists: {
                'december-reset-leads': true,
              },
            }),
          });

          let createData: any;
          try {
            createData = await createResponse.json();
          } catch {
            createData = await createResponse.text();
          }

          results.checks.create_contact = {
            status: createResponse.ok ? 'success' : 'error',
            statusCode: createResponse.status,
            statusText: createResponse.statusText,
            message: createResponse.ok
              ? 'Contact creation test successful'
              : 'Contact creation failed. Check mailing list name.',
            response: createData,
          };
        } catch (error) {
          results.checks.create_contact = {
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
          };
        }
      }
    } catch (error) {
      results.checks.loops_api = {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        message: 'Failed to connect to Loops API. Check your network connection.',
      };
    }
  } else {
    results.checks.loops_api = {
      status: 'skipped',
      message: 'LOOPS_API_KEY not configured. Cannot test API connection.',
    };
  }

  // Overall status
  const allChecksPassed = 
    results.checks.env_variable?.status === 'configured' &&
    results.checks.loops_api?.status === 'connected';

  return NextResponse.json({
    ...results,
    overall_status: allChecksPassed ? 'ready' : 'needs_attention',
    summary: allChecksPassed
      ? 'All checks passed! Integration is ready.'
      : 'Some checks failed. Review the details above.',
  });
}

