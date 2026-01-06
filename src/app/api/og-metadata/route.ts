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

    // Try to extract from JSON-LD structured data (Substack uses this)
    const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatches) {
      for (const match of jsonLdMatches) {
        try {
          const jsonContent = match.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
          const data = JSON.parse(jsonContent);
          
          // Handle array or object
          const items = Array.isArray(data) ? data : [data];
          
          for (const item of items) {
            if (item['@type'] === 'Article' || item['@type'] === 'BlogPosting' || item['@type'] === 'NewsArticle') {
              if (item.headline && !metadata.title) {
                metadata.title = item.headline;
              }
              if (item.description && !metadata.description) {
                metadata.description = item.description;
              }
              if (item.image && !metadata.image) {
                // Handle image as string, object, or array
                if (typeof item.image === 'string') {
                  metadata.image = item.image;
                } else if (item.image.url) {
                  metadata.image = item.image.url;
                } else if (Array.isArray(item.image) && item.image[0]) {
                  metadata.image = typeof item.image[0] === 'string' ? item.image[0] : item.image[0].url;
                }
              }
            }
          }
        } catch (e) {
          // Skip invalid JSON
          continue;
        }
      }
    }

    // Helper function to decode HTML entities
    const decodeHtml = (str: string): string => {
      return str
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/');
    };

    // Helper function to extract meta tag content (handles various formats)
    const extractMeta = (property: string, name?: string): string | null => {
      // More flexible regex that handles spaces, newlines, and various quote styles
      const patterns = [
        // property="og:xxx" content="..."
        new RegExp(`<meta[^>]*property=["']${property.replace(/:/g, '\\:')}["'][^>]*content=["']([^"']+)["']`, 'i'),
        // content="..." property="og:xxx"
        new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property.replace(/:/g, '\\:')}["']`, 'i'),
        // property='og:xxx' content='...'
        new RegExp(`<meta[^>]*property=['"]${property.replace(/:/g, '\\:')}['"][^>]*content=['"]([^'"]+)['"]`, 'i'),
        // content='...' property='og:xxx'
        new RegExp(`<meta[^>]*content=['"]([^'"]+)['"][^>]*property=['"]${property.replace(/:/g, '\\:')}['"]`, 'i'),
      ];
      
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          return decodeHtml(match[1]);
        }
      }
      
      // If name fallback provided, try name attribute
      if (name) {
        const namePatterns = [
          new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i'),
          new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${name}["']`, 'i'),
          new RegExp(`<meta[^>]*name=['"]${name}['"][^>]*content=['"]([^'"]+)['"]`, 'i'),
          new RegExp(`<meta[^>]*content=['"]([^'"]+)['"][^>]*name=['"]${name}['"]`, 'i'),
        ];
        
        for (const pattern of namePatterns) {
          const match = html.match(pattern);
          if (match && match[1]) {
            return decodeHtml(match[1]);
          }
        }
      }
      
      return null;
    };

    // Extract og:title
    metadata.title = extractMeta('og:title') || 
                     html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || 
                     null;

    // Extract og:description
    metadata.description = extractMeta('og:description') || 
                           extractMeta('', 'description') ||
                           null;

    // Extract og:image (try multiple sources)
    let imageUrl = extractMeta('og:image');
    
    // Fallback to Twitter card image
    if (!imageUrl) {
      imageUrl = extractMeta('twitter:image');
    }
    
    // Fallback to og:image:secure_url
    if (!imageUrl) {
      imageUrl = extractMeta('og:image:secure_url');
    }
    
    if (imageUrl) {
      // Decode HTML entities
      imageUrl = imageUrl.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      
      // Convert relative URLs to absolute
      if (imageUrl.startsWith('//')) {
        imageUrl = `${targetUrl.protocol}${imageUrl}`;
      } else if (imageUrl.startsWith('/')) {
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

    // Log what we found for debugging
    console.log('OG Metadata extracted:', {
      title: metadata.title ? '✓' : '✗',
      description: metadata.description ? '✓' : '✗',
      image: metadata.image ? '✓' : '✗',
      url: metadata.url || targetUrl.toString(),
    });

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

