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

    // First, verify the API key works by checking stores
    let storeInfo = null;
    try {
      const storeResponse = await fetch('https://api.printful.com/stores', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      
      if (!storeResponse.ok) {
        const storeErrorText = await storeResponse.text();
        let storeErrorJson = null;
        try {
          storeErrorJson = JSON.parse(storeErrorText);
        } catch {}
        
        console.error('Printful stores API error:', storeResponse.status, storeErrorJson || storeErrorText);
        return NextResponse.json(
          { 
            error: `Printful API authentication error: ${storeResponse.status}`,
            details: storeErrorJson?.error?.message || storeErrorJson?.error || storeErrorText,
            suggestion: 'Please verify your API key is correct and has access to your store'
          },
          { status: storeResponse.status }
        );
      }
      
      const storeData = await storeResponse.json();
      storeInfo = storeData.result;
      
      // Check if store exists
      if (!storeInfo || (Array.isArray(storeInfo) && storeInfo.length === 0)) {
        return NextResponse.json(
          { 
            error: 'No stores found',
            details: 'Your API key is valid but no stores are associated with it. Please create a store in Printful first.',
            suggestion: 'Go to Printful Dashboard → Stores → Add new store'
          },
          { status: 404 }
        );
      }
    } catch (e) {
      console.error('Error checking stores:', e);
      return NextResponse.json(
        { 
          error: 'Failed to verify API key',
          details: e instanceof Error ? e.message : String(e)
        },
        { status: 500 }
      );
    }

    // Fetch store products from Printful
    // Try sync/products endpoint (this is the correct endpoint for store products)
    const response = await fetch('https://api.printful.com/sync/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
        // Try to parse as JSON for better error message
        try {
          const errorJson = JSON.parse(errorText);
          console.error('Printful sync/products API error:', response.status, JSON.stringify(errorJson, null, 2));
          return NextResponse.json(
            { 
              error: `Printful API error: ${response.status}`,
              details: errorJson.error?.message || errorJson.error || errorText,
              fullError: errorJson,
              suggestion: response.status === 400 
                ? 'This might mean your store has no products yet, or the store type doesn\'t support this endpoint'
                : undefined
            },
            { status: response.status }
          );
        } catch {
          // Not JSON, return as text
          console.error('Printful API error (text):', response.status, errorText);
          return NextResponse.json(
            { 
              error: `Printful API error: ${response.status}`,
              details: errorText,
              suggestion: 'Check your API key and store configuration'
            },
            { status: response.status }
          );
        }
      } catch (e) {
        console.error('Error reading Printful response:', e);
        return NextResponse.json(
          { error: `Printful API error: ${response.status}` },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    
    // Printful returns { result: { items: [...], paging: {...} } } or { result: [...] }
    const products = data.result?.items || data.result || [];
    
    // Return products with their variants (Printful already includes variant data)
    return NextResponse.json({
      success: true,
      data: products,
      total: products.length,
      paging: data.result?.paging,
    });

  } catch (error) {
    console.error('Printful catalog fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Printful catalog',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

