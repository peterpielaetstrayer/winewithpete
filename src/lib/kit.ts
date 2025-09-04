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
  try {
    const response = await fetch('https://api.kit.co/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.KIT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: subscriber.email,
        name: subscriber.name,
        tags: ['newsletter', 'website-signup', ...(subscriber.tags || [])],
        // Add to your main list - you may need to adjust the list ID
        list_id: 'main', // or your specific list ID
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Kit API error:', response.status, errorData);
      return {
        success: false,
        error: `Kit API error: ${response.status}`
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
