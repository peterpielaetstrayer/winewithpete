import { createClient } from '@/lib/supabase/server';
import { sendEmail, emailTemplates } from '@/lib/email';

export interface DigitalFulfillmentResult {
  delivered: boolean;
  downloadCount: number;
  reason?: string;
}

/**
 * Deliver digital files for an existing Wine With Pete order.
 *
 * Signed URLs are sent only to the email stored on the order and are never
 * returned to public callers. This keeps digital fulfillment separate from
 * Stripe webhook handling and prevents download URLs from becoming API output.
 */
export async function fulfillDigitalOrder(
  orderId: string
): Promise<DigitalFulfillmentResult> {
  const supabase = createClient();

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
    return {
      delivered: false,
      downloadCount: 0,
      reason: 'Order not found',
    };
  }

  const downloadLinks: Array<{
    productName: string;
    downloadUrl: string;
  }> = [];

  for (const item of order.order_items || []) {
    const product = item.products;
    if (!product?.file_path) continue;

    const { data: signedUrl, error: signedUrlError } = await supabase.storage
      .from('digital-products')
      .createSignedUrl(product.file_path, 60 * 60 * 24 * 7);

    if (signedUrlError || !signedUrl?.signedUrl) {
      console.error('Failed to create signed digital-product URL:', {
        orderId,
        productId: product.id,
        error: signedUrlError,
      });
      continue;
    }

    downloadLinks.push({
      productName: product.name,
      downloadUrl: signedUrl.signedUrl,
    });
  }

  if (downloadLinks.length === 0) {
    return {
      delivered: false,
      downloadCount: 0,
      reason: 'No downloadable files found for order',
    };
  }

  const primaryProductName =
    order.order_items?.[0]?.products?.name || 'Your Wine With Pete purchase';

  const emailResult = await sendEmail({
    to: order.email,
    ...emailTemplates.purchaseConfirmation(
      order.name || 'Friend',
      primaryProductName,
      downloadLinks
    ),
  });

  if (!emailResult) {
    return {
      delivered: false,
      downloadCount: downloadLinks.length,
      reason: 'Email delivery failed',
    };
  }

  return {
    delivered: true,
    downloadCount: downloadLinks.length,
  };
}
