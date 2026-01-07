// Kit email marketing integration for Wine With Pete

interface KitSubscriber {
  email: string;
  name?: string;
  tags?: string[];
}

interface KitResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export async function addToKitList(subscriber: KitSubscriber): Promise<KitResponse> {
  // Check if Kit API key is available
  if (!process.env.KIT_API_KEY) {
    console.log('Kit API key not found, skipping Kit integration');
    return {
      success: false,
      error: 'Kit API key not configured'
    };
  }

  try {
    // Try form-specific submission first (using form ID from embed code)
    const formId = process.env.KIT_FORM_ID || '7051ff142e';
    
    // Try form submission endpoint first
    const formEndpoint = `https://wine-with-pete.kit.com/${formId}/subscribe`;
    
    const formRequestBody = {
      email: subscriber.email,
      name: subscriber.name,
    };

    console.log('Kit API request:', {
      formEndpoint,
      body: formRequestBody,
      hasApiKey: !!process.env.KIT_API_KEY,
      formId,
    });

    // Try form submission endpoint first
    try {
      const formResponse = await fetch(formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formRequestBody),
      });

      if (formResponse.ok) {
        const formResult = await formResponse.json();
        console.log('Successfully submitted via form endpoint:', formResult);
        return {
          success: true,
          data: formResult
        };
      } else {
        console.log(`Form endpoint failed: ${formResponse.status}`);
      }
    } catch (formError) {
      console.log('Form endpoint error:', formError);
    }

    // Use Kit.co V4 API (their current API)
    const requestBody = {
      email: subscriber.email,
      name: subscriber.name,
      tags: ['newsletter', 'website-signup', ...(subscriber.tags || [])],
    };

    // Kit.co V4 API endpoints (based on their documentation)
    const endpoints = [
      'https://api.kit.co/v4/subscribers',
      'https://api.kit.co/v4/contacts',
      'https://api.kit.co/v4/audience/subscribers',
      // Fallback to V3 if V4 doesn't work
      'https://api.kit.co/v3/subscribers',
    ];

    let response;
    let lastError: { status?: number; error?: string | unknown } | Error | null = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying Kit API endpoint: ${endpoint}`);
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.KIT_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          console.log(`Success with endpoint: ${endpoint}`);
          break;
        } else {
          const errorData = await response.text();
          console.error(`Failed with ${endpoint}: ${response.status}`, {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
            headers: Object.fromEntries(response.headers.entries()),
          });
          lastError = { status: response.status, error: errorData };
        }
      } catch (error) {
        console.log(`Error with ${endpoint}:`, error);
        lastError = error instanceof Error ? error : { error: String(error) };
      }
    }

    if (!response || !response.ok) {
      console.error('All Kit API endpoints failed', {
        lastError,
        hasApiKey: !!process.env.KIT_API_KEY,
        apiKeyLength: process.env.KIT_API_KEY?.length,
      });
      
      let errorMessage = 'Kit API failed: All endpoints returned errors';
      if (lastError) {
        if (lastError instanceof Error) {
          errorMessage = `Kit API failed: ${lastError.message}`;
        } else if (lastError.status || lastError.error) {
          const status = lastError.status || 'Unknown';
          const error = typeof lastError.error === 'string' 
            ? lastError.error.substring(0, 100) 
            : 'Unknown error';
          errorMessage = `Kit API failed: ${status} - ${error}`;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    console.log('Successfully added to Kit:', result);
    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.error('Kit integration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function sendKitWelcomeEmail(email: string, name?: string): Promise<KitResponse> {
  try {
    const response = await fetch('https://api.kit.co/v1/emails/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.KIT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        template: 'welcome', // You'll need to create this template in Kit
        data: {
          name: name || 'Friend',
          unsubscribe_url: `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Kit email error:', response.status, errorData);
      return {
        success: false,
        error: `Kit email error: ${response.status}`
      };
    }

    const result = await response.json();
    console.log('Welcome email sent via Kit:', result);
    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.error('Kit email sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
