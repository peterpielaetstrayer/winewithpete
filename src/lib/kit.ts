// Kit email marketing integration for Wine With Pete

interface KitSubscriber {
  email: string;
  name?: string;
  tags?: string[];
}

interface KitResponse {
  success: boolean;
  data?: any;
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
    const requestBody = {
      email: subscriber.email,
      name: subscriber.name,
      tags: ['newsletter', 'website-signup', ...(subscriber.tags || [])],
      // Kit uses 'list' instead of 'list_id'
      list: 'main', // or your specific list ID
    };

    console.log('Kit API request:', {
      url: 'https://api.kit.co/v1/subscribers',
      body: requestBody,
      hasApiKey: !!process.env.KIT_API_KEY
    });

    // Try different Kit API endpoints
    const endpoints = [
      'https://api.kit.co/v1/subscribers',
      'https://api.kit.co/subscribers',
      'https://kit.co/api/v1/subscribers',
      'https://kit.co/api/subscribers'
    ];

    let response;
    let lastError;

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying Kit API endpoint: ${endpoint}`);
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.KIT_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          console.log(`Success with endpoint: ${endpoint}`);
          break;
        } else {
          const errorData = await response.text();
          console.log(`Failed with ${endpoint}: ${response.status} - ${errorData}`);
          lastError = { status: response.status, error: errorData };
        }
      } catch (error) {
        console.log(`Error with ${endpoint}:`, error);
        lastError = error;
      }
    }

    if (!response || !response.ok) {
      console.error('All Kit API endpoints failed');
      return {
        success: false,
        error: `Kit API failed: ${lastError?.status || 'Unknown error'}`
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
