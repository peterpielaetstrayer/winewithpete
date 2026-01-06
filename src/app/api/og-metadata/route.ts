import { NextRequest, NextResponse } from 'next/server';

interface OGMetadata {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the HTML
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WineWithPete/1.0; +https://winewithpete.me)',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Parse Open Graph metadata
    const metadata: OGMetadata = {};

    // Extract og:title
    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                         html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i);
    if (ogTitleMatch) {
      metadata.title = ogTitleMatch[1];
    } else {
      // Fallback to <title> tag
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) {
        metadata.title = titleMatch[1].trim();
      }
    }

    // Extract og:description
    const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
                          html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']/i);
    if (ogDescMatch) {
      metadata.description = ogDescMatch[1];
    } else {
      // Fallback to meta description
      const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                             html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
      if (metaDescMatch) {
        metadata.description = metaDescMatch[1];
      }
    }

    // Extract og:image
    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                           html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
    if (ogImageMatch) {
      let imageUrl = ogImageMatch[1];
      // Convert relative URLs to absolute
      if (imageUrl.startsWith('/')) {
        imageUrl = `${targetUrl.origin}${imageUrl}`;
      } else if (!imageUrl.startsWith('http')) {
        imageUrl = `${targetUrl.origin}/${imageUrl}`;
      }
      metadata.image = imageUrl;
    }

    // Extract og:url (canonical URL)
    const ogUrlMatch = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i) ||
                        html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:url["']/i);
    if (ogUrlMatch) {
      metadata.url = ogUrlMatch[1];
    } else {
      metadata.url = targetUrl.toString();
    }

    return NextResponse.json({
      success: true,
      metadata,
    });

  } catch (error) {
    console.error('OG metadata fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch metadata',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

