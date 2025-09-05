import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      receivedData: body,
      dataTypes: {
        productId: typeof body.productId,
        quantity: typeof body.quantity,
        customerEmail: typeof body.customerEmail,
        customerName: typeof body.customerName,
        customAmount: typeof body.customAmount,
        customDescription: typeof body.customDescription,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}