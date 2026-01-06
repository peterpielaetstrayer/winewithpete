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
        from: 'Pete <pete@winewithpete.me>',
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

  newsletterWelcome: (name: string, recipeCardUrl?: string) => ({
    subject: 'Glad you\'re here',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
        <p>Hey there,</p>
        <p>I'm really glad you found your way here.</p>
        ${recipeCardUrl ? `
        <div style="background-color: #f6f3ef; border-left: 4px solid #5b2320; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 0 12px 0; font-weight: 600;">Your Fire Ritual Recipe Card</p>
          <p style="margin: 0 0 12px 0;">As promised, here's your free Fire Ritual recipe card:</p>
          <p style="margin: 0;">
            <a href="${recipeCardUrl}" style="display: inline-block; background-color: #5b2320; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Download Recipe Card</a>
          </p>
        </div>
        ` : ''}
        <p>The Circle is a small, intentional space. It's where I share things that don't always fit neatly on social media or in longer essays. Thoughts in progress. Recipes meant to be cooked over fire or slow heat. Invitations to gather, reflect, and pay attention.</p>
        <p>Here's what you can expect, at a human pace:</p>
        <ul style="list-style: none; padding-left: 0;">
          <li style="margin-bottom: 8px;">• Weekly reflections — short, grounded ideas about ritual, attention, food, and being human</li>
          <li style="margin-bottom: 8px;">• Fire-friendly recipe cards — simple, nourishing things meant to be shared</li>
          <li style="margin-bottom: 8px;">• Occasional invitations — dinners, gatherings, or moments worth showing up for</li>
          <li style="margin-bottom: 8px;">• Community notes — reflections that come from cooking, hosting, and listening</li>
        </ul>
        <p>This is different from my longer essays on Substack. Those are more structured. The Circle is closer to a journal you open once a week.</p>
        <p>If you'd like to explore a bit right now, you can:</p>
        <ul style="list-style: none; padding-left: 0;">
          <li style="margin-bottom: 8px;">• Read the essays <a href="https://winewithpete.substack.com" style="color: #5b2320; text-decoration: underline;">here</a></li>
          <li style="margin-bottom: 8px;">• Browse recent recipes <a href="https://winewithpete.me/recipes" style="color: #5b2320; text-decoration: underline;">here</a></li>
        </ul>
        <p>No rush. No algorithm to satisfy. Come and go as you need.</p>
        <p>Mostly, I just want you to know this: you're welcome here. You don't need to optimize anything. Just show up when it feels right.</p>
        <p>Glad you're in the Circle.</p>
        <p>Warmly,<br>Pete</p>
      </div>
    `,
    text: `Hey there,

I'm really glad you found your way here.

${recipeCardUrl ? `Your Fire Ritual Recipe Card: ${recipeCardUrl}\n\n` : ''}The Circle is a small, intentional space. It's where I share things that don't always fit neatly on social media or in longer essays. Thoughts in progress. Recipes meant to be cooked over fire or slow heat. Invitations to gather, reflect, and pay attention.

Here's what you can expect, at a human pace:

• Weekly reflections — short, grounded ideas about ritual, attention, food, and being human
• Fire-friendly recipe cards — simple, nourishing things meant to be shared
• Occasional invitations — dinners, gatherings, or moments worth showing up for
• Community notes — reflections that come from cooking, hosting, and listening

This is different from my longer essays on Substack. Those are more structured. The Circle is closer to a journal you open once a week.

If you'd like to explore a bit right now, you can:

• Read the essays here: https://winewithpete.substack.com
• Browse recent recipes here: https://winewithpete.me/recipes

No rush. No algorithm to satisfy. Come and go as you need.

Mostly, I just want you to know this: you're welcome here. You don't need to optimize anything. Just show up when it feels right.

Glad you're in the Circle.

Warmly,
Pete`
  }),

  baselineMethodWelcome: (name: string, gumroadUrl: string) => ({
    subject: 'Your Baseline Method guide',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
        <p>Hey ${name},</p>
        <p>Thanks for your interest in The Baseline Method.</p>
        <p>This is an evergreen guide to rebuild your physical and mental baseline through small, repeatable daily anchors. It's not a challenge. It's not a detox. It's something you can start any day of the year, especially during moments of drift.</p>
        <p>You can get the guide here:</p>
        <p><a href="${gumroadUrl}" style="color: #5b2320; text-decoration: underline;">Get The Baseline Method</a></p>
        <p>It's free / pay-what-you-want. No pressure.</p>
        <p>The baseline always welcomes you back.</p>
        <p>Warmly,<br>Pete</p>
      </div>
    `,
    text: `Hey ${name},

Thanks for your interest in The Baseline Method.

This is an evergreen guide to rebuild your physical and mental baseline through small, repeatable daily anchors. It's not a challenge. It's not a detox. It's something you can start any day of the year, especially during moments of drift.

You can get the guide here: ${gumroadUrl}

It's free / pay-what-you-want. No pressure.

The baseline always welcomes you back.

Warmly,
Pete`
  })
};
