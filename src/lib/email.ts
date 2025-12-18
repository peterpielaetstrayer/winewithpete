// Resend email integration for Wine With Pete

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(emailData: EmailData) {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured - cannot send email');
    return null;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Wine With Pete <pete@winewithpete.me>',
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      const errorMessage = `Resend API error: ${response.status} - ${errorData}`;
      console.error('Email sending failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        to: emailData.to,
        subject: emailData.subject,
      });
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Email sent successfully:', {
      id: result.id,
      to: emailData.to,
      subject: emailData.subject,
    });
    return result;
  } catch (error) {
    console.error('Email sending failed:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      to: emailData.to,
      subject: emailData.subject,
    });
    // Don't throw - we don't want email failures to break the app
    return null;
  }
}

// Email templates
export const emailTemplates = {
  rsvpConfirmation: (name: string, eventTitle: string, eventDate: string) => ({
    subject: `RSVP Confirmed: ${eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #5b2320;">RSVP Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>You're confirmed for <strong>${eventTitle}</strong> on ${eventDate}.</p>
        <p>We'll send you location details and what to bring closer to the event.</p>
        <p>Looking forward to seeing you around the fire!</p>
        <p>— Pete</p>
      </div>
    `,
    text: `RSVP Confirmed for ${eventTitle} on ${eventDate}. We'll send details closer to the event.`
  }),

  purchaseConfirmation: (name: string, productName: string, downloadLinks: Array<{productName: string, downloadUrl: string}>) => ({
    subject: `Your Recipe Cards are Ready - ${productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #5b2320;">Your Recipe Cards are Ready!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for your purchase of <strong>${productName}</strong>.</p>
        <p>Your digital recipe cards are ready for download:</p>
        <ul>
          ${downloadLinks.map(link => `<li><a href="${link.downloadUrl}">${link.productName}</a></li>`).join('')}
        </ul>
        <p><strong>Note:</strong> These download links expire in 7 days.</p>
        <p>Enjoy cooking around the fire!</p>
        <p>— Pete</p>
      </div>
    `,
    text: `Your recipe cards are ready! Download links: ${downloadLinks.map(l => l.downloadUrl).join(', ')}`
  }),

  newsletterWelcome: (name: string) => ({
    subject: 'Welcome to the Wine With Pete Circle',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #5b2320;">Welcome to the Circle!</h1>
        <p>Hi ${name},</p>
        <p>You're now part of our community. You'll receive:</p>
        <ul>
          <li>Weekly philosophical insights</li>
          <li>Fire-friendly recipe cards</li>
          <li>Event invitations</li>
          <li>Community reflections</li>
        </ul>
        <p>Start by reading our latest essays: <a href="https://winewithpete.substack.com">winewithpete.substack.com</a></p>
        <p>Welcome to the fire,</p>
        <p>— Pete</p>
      </div>
    `,
    text: `Welcome to Wine With Pete! You'll receive weekly insights, recipe cards, and event invitations.`
  })
};
