import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.CONVERTKIT_API_KEY;
    const formId = process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID;

    if (!apiKey) {
      return NextResponse.json({
        configured: false,
        error: 'CONVERTKIT_API_KEY not found in environment variables',
      }, { status: 400 });
    }

    if (!formId) {
      return NextResponse.json({
        configured: false,
        error: 'NEXT_PUBLIC_CONVERTKIT_FORM_ID not found in environment variables',
      }, { status: 400 });
    }

    // Test the API key by fetching account info
    const response = await fetch(`https://api.convertkit.com/v3/account?api_secret=${apiKey}`, {
      method: 'GET',
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        configured: true,
        apiKeyValid: false,
        formId,
        error: result.error || 'Invalid API key',
        details: result,
      }, { status: response.status });
    }

    return NextResponse.json({
      configured: true,
      apiKeyValid: true,
      formId,
      account: {
        name: result.account?.name,
        email: result.account?.email,
      },
      message: 'ConvertKit is properly configured!',
    });

  } catch (error) {
    console.error('ConvertKit test error:', error);
    return NextResponse.json({
      configured: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

