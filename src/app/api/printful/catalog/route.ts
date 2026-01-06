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

    // Fetch store products from Printful
    // Try sync/products endpoint first (this is the correct endpoint for store products)
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
          console.error('Printful API error:', response.status, JSON.stringify(errorJson, null, 2));
          return NextResponse.json(
            { 
              error: `Printful API error: ${response.status}`,
              details: errorJson.error?.message || errorJson.error || errorText,
              fullError: errorJson
            },
            { status: response.status }
          );
        } catch {
          // Not JSON, return as text
          console.error('Printful API error (text):', response.status, errorText);
          return NextResponse.json(
            { 
              error: `Printful API error: ${response.status}`,
              details: errorText
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

