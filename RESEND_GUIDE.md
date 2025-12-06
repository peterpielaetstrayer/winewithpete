# Resend Email Campaign Guide

## What is Resend?

Resend is an email API service (like SendGrid, Mailgun) that sends transactional and marketing emails. You're already using it for welcome emails and purchase confirmations.

## Your Current Setup

✅ **Already configured:**
- Resend API key in environment variables (`RESEND_API_KEY`)
- Email sending function in `src/lib/email.ts`
- Sender: `pete@winewithpete.me`
- Campaign API endpoint: `/api/campaigns/send`

## How Resend Works

**Basic flow:**
1. You call Resend API with email content
2. Resend sends the email
3. You get delivery status

**What you can do:**
- Send to individual emails ✅
- Send to multiple recipients ✅ (batch sending)
- HTML + plain text emails ✅
- Personalization (like `{name}`) ✅
- Track opens/clicks (with Resend Pro)

## Sending Campaigns

### Method 1: Use the Admin Page (Easiest)

Go to `/admin` and use the campaign form to:
- Write your email subject
- Write HTML content
- Preview before sending
- Send to all subscribers

### Method 2: Use the API Directly

```bash
POST /api/campaigns/send
Content-Type: application/json

{
  "subject": "Weekly Newsletter - December 6",
  "html": "<h1>Hello {name}!</h1><p>This week's update...</p>",
  "text": "Hello! This week's update...",
  "limit": 100  // optional: test with first 100 subscribers
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/campaigns/send \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test Campaign",
    "html": "<h1>Hello {name}!</h1><p>This is a test email.</p>",
    "text": "Hello! This is a test email."
  }'
```

### Method 3: Use in Code

```typescript
// Send to one person
import { sendEmail } from '@/lib/email';

await sendEmail({
  to: 'subscriber@example.com',
  subject: 'Weekly Newsletter',
  html: '<h1>Hello!</h1><p>Your weekly update...</p>',
  text: 'Hello! Your weekly update...'
});

// Send to all subscribers (use the campaign API)
const response = await fetch('/api/campaigns/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: 'Weekly Newsletter',
    html: '<h1>Hello {name}!</h1><p>Your weekly update...</p>',
    text: 'Hello! Your weekly update...'
  })
});
```

## Email Templates

You already have templates in `src/lib/email.ts`:
- `newsletterWelcome` - Welcome email for new subscribers
- `rsvpConfirmation` - Event RSVP confirmations
- `purchaseConfirmation` - Product purchase confirmations

**Create your own template:**
```typescript
// In src/lib/email.ts
export const emailTemplates = {
  // ... existing templates ...
  
  weeklyNewsletter: (name: string, content: string) => ({
    subject: 'Weekly Newsletter - Wine With Pete',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #5b2320;">Hello ${name}!</h1>
        ${content}
        <p>— Pete</p>
      </div>
    `,
    text: `Hello ${name}! ${content} — Pete`
  })
};
```

## Personalization

Use `{name}` in your HTML/text content, and it will be replaced with the subscriber's name:

```json
{
  "html": "<h1>Hello {name}!</h1><p>Welcome back...</p>"
}
```

The campaign API automatically replaces `{name}` with each subscriber's name.

## Testing

**Before sending to everyone:**
1. Use `limit: 1` to test with one subscriber
2. Send to your own email first
3. Check spam folder
4. Then send to all

**Example test:**
```json
{
  "subject": "Test Campaign",
  "html": "<h1>Test</h1><p>This is a test.</p>",
  "limit": 1
}
```

## Resend Dashboard

Visit [resend.com](https://resend.com) to:
- View sent emails
- Check delivery status
- See open/click rates (with Pro plan)
- Manage API keys

## Limits & Pricing

**Free tier:**
- 3,000 emails/month
- 100 emails/day
- Basic analytics

**Pro tier:**
- More emails
- Advanced analytics
- Custom domains
- Webhooks

## Best Practices

1. **Always include plain text** - Some email clients don't render HTML
2. **Test first** - Use `limit: 1` before sending to everyone
3. **Personalize** - Use `{name}` to make emails feel personal
4. **Keep it simple** - Plain HTML works best (avoid complex CSS)
5. **Mobile-friendly** - Test on phone before sending

## Troubleshooting

**Email not sending?**
- Check `RESEND_API_KEY` is set in environment variables
- Check Resend dashboard for errors
- Verify sender email (`pete@winewithpete.me`) is verified in Resend

**Email going to spam?**
- Use plain text version
- Avoid spam trigger words
- Verify your domain in Resend
- Ask subscribers to whitelist your email

**API errors?**
- Check Resend API status
- Verify API key is correct
- Check rate limits (100/day on free tier)

## Next Steps

1. **Test the campaign API** - Send a test email to yourself
2. **Create email templates** - Build reusable templates for common campaigns
3. **Build admin UI** - Use the `/admin` page to send campaigns visually
4. **Set up automation** - Schedule weekly newsletters (cron job or Vercel Cron)

That's it! Resend is simple - you send emails via API, and it handles delivery.

