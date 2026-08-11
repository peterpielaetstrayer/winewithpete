import { NextRequest, NextResponse } from 'next/server';
import { fulfillDigitalOrder } from '@/lib/commerce/digital-fulfillment';
import { orderIdSchema } from '@/lib/validations';

/**
 * Transitional manual-resend endpoint.
 *
 * Stripe fulfillment now calls the digital fulfillment service directly. This
 * route remains only for compatibility/manual recovery and never returns
 * signed download URLs to the caller.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = orderIdSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Valid order ID is required' },
        { status: 400 }
      );
    }

    const result = await fulfillDigitalOrder(validation.data.orderId);

    if (!result.delivered) {
      const status = result.reason === 'Order not found' ? 404 : 422;
      return NextResponse.json(
        {
          error: result.reason || 'Digital delivery did not complete',
          downloadCount: result.downloadCount,
        },
        { status }
      );
    }

    return NextResponse.json({
      message: 'Digital delivery email sent successfully',
      downloadCount: result.downloadCount,
    });
  } catch (error) {
    console.error('Digital delivery error:', error);
    return NextResponse.json(
      { error: 'Failed to deliver digital purchase' },
      { status: 500 }
    );
  }
}
