import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get order with items and products
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Generate signed URLs for PDF downloads
    const downloadLinks = [];
    
    for (const item of order.order_items) {
      if (item.products?.file_path) {
        const { data: signedUrl } = await supabase.storage
          .from('digital-products')
          .createSignedUrl(item.products.file_path, 60 * 60 * 24 * 7); // 7 days expiry

        if (signedUrl) {
          downloadLinks.push({
            productName: item.products.name,
            downloadUrl: signedUrl.signedUrl,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
      }
    }

    // Here you would integrate with your email service (Kit, SendGrid, etc.)
    // For now, we'll just return the download links
    // In production, you'd send these via email to the customer

    return NextResponse.json({
      message: 'Download links generated successfully',
      downloadLinks,
      // In production, you'd return success without exposing the links
      // return NextResponse.json({ message: 'Download email sent successfully' });
    });

  } catch (error) {
    console.error('Download generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download links' },
      { status: 500 }
    );
  }
}
