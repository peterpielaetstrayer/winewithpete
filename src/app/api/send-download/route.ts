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

    // Send email with download links
    if (downloadLinks.length > 0) {
      try {
        const { sendEmail, emailTemplates } = await import('@/lib/email');
        
        await sendEmail({
          to: order.email,
          ...emailTemplates.purchaseConfirmation(
            order.name,
            order.order_items[0]?.products?.name || 'Your Recipe Cards',
            downloadLinks
          )
        });

        console.log('Download email sent successfully to:', order.email);
      } catch (emailError) {
        console.error('Failed to send download email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      message: 'Download email sent successfully',
      downloadLinks: downloadLinks.length > 0 ? downloadLinks : undefined
    });

  } catch (error) {
    console.error('Download generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download links' },
      { status: 500 }
    );
  }
}
