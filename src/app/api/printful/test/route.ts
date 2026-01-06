import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.PRINTFUL_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'PRINTFUL_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Test 1: Check API key format
    const keyInfo = {
      length: apiKey.length,
      startsWith: apiKey.substring(0, 10) + '...',
      hasBearer: apiKey.includes('Bearer'),
    };

    // Test 2: Try to get store info (simpler endpoint)
    let storeInfo = null;
    try {
      const storeResponse = await fetch('https://api.printful.com/stores', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      
      if (storeResponse.ok) {
        const storeData = await storeResponse.json();
        storeInfo = storeData;
      } else {
        const errorText = await storeResponse.text();
        storeInfo = { error: errorText, status: storeResponse.status };
      }
    } catch (e) {
      storeInfo = { error: String(e) };
    }

    // Test 3: Try sync/products endpoint
    let productsTest = null;
    try {
      const productsResponse = await fetch('https://api.printful.com/sync/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        productsTest = { success: true, count: productsData.result?.items?.length || 0 };
      } else {
        const errorText = await productsResponse.text();
        let errorJson = null;
        try {
          errorJson = JSON.parse(errorText);
        } catch {}
        productsTest = { 
          error: errorJson || errorText, 
          status: productsResponse.status,
          rawError: errorText
        };
      }
    } catch (e) {
      productsTest = { error: String(e) };
    }

    return NextResponse.json({
      apiKeyInfo: keyInfo,
      storeTest: storeInfo,
      productsTest: productsTest,
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

