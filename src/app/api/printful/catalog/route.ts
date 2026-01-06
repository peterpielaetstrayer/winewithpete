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
    const response = await fetch('https://api.printful.com/store/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Printful API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Printful API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const products = data.result || [];
    
    // Fetch full details for each product (including variants)
    const productsWithDetails = await Promise.all(
      products.map(async (product: any) => {
        try {
          const productId = product.id || product.sync_product?.id;
          if (!productId) return product;
          
          const detailResponse = await fetch(`https://api.printful.com/store/products/${productId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            return detailData.result || product;
          }
          return product;
        } catch (error) {
          console.error(`Error fetching details for product ${product.id}:`, error);
          return product;
        }
      })
    );
    
    // Return products with their variants
    return NextResponse.json({
      success: true,
      data: productsWithDetails,
      total: productsWithDetails.length,
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

