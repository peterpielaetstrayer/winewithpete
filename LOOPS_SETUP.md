# Loops.so Integration Setup Guide

This guide covers the Loops.so email automation integration for the December Reset landing page.

## Overview

The integration allows users to subscribe via the landing page form, which:
1. Adds them to Loops.so mailing list
2. Triggers automated email sequence (configured in Loops dashboard)
3. Sends the Quick Start Guide PDF link

## Files Created

### API Routes
- **`/app/api/loops/subscribe/route.ts`** - Handles form submissions and Loops API integration
- **`/app/api/loops/test/route.ts`** - Test endpoint to verify setup

### Public Files
- **`/public/files/`** - Directory for hosting downloadable PDFs
  - Place `quick_start_guide_december_reset.pdf` here
  - Accessible at: `https://winewithpete.me/files/quick_start_guide_december_reset.pdf`

### Components
- **`/components/convertkit-form.tsx`** - Updated to use Loops API instead of Kit.co

## Environment Variables

Add to `.env.local` (development) and Vercel environment variables (production):

```bash
LOOPS_API_KEY=your_loops_api_key_here
```

### Getting Your Loops API Key

1. Log in to [Loops.so](https://app.loops.so)
2. Go to Settings → API Keys
3. Copy your API key
4. Add it to your environment variables

## Setup Steps

### 1. Add PDF File

Place your PDF in the `/public/files/` directory:

```bash
# Copy your PDF to the files directory
cp /path/to/quick_start_guide_december_reset.pdf public/files/
```

The PDF will be automatically accessible at:
- `https://winewithpete.me/files/quick_start_guide_december_reset.pdf`

### 2. Configure Loops.so

1. **Create Mailing List**
   - In Loops dashboard, create a mailing list named: `december-reset-leads`
   - Or update the list name in `/app/api/loops/subscribe/route.ts` if different

2. **Set Up Email Automation**
   - Create a transactional email or automation workflow
   - Include the PDF link: `https://winewithpete.me/files/quick_start_guide_december_reset.pdf`
   - Trigger on: "Contact added to list: december-reset-leads"
   - Or use Loops' "Welcome Email" feature

3. **Verify DNS Settings**
   - Ensure your domain `winewithpete.me` is verified in Loops
   - SPF, DKIM, and DMARC records should be configured

### 3. Add Environment Variable

**Local Development:**
```bash
# Add to .env.local
LOOPS_API_KEY=your_key_here
```

**Production (Vercel):**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `LOOPS_API_KEY` with your API key
3. Redeploy the application

### 4. Test the Integration

**Test Endpoint:**
```bash
# Visit in browser or use curl
GET https://winewithpete.me/api/loops/test
```

This will check:
- ✅ Environment variable is configured
- ✅ Loops API connection
- ✅ PDF file location (manual check)

**Test Form Submission:**
1. Visit the December Reset landing page
2. Enter a test email address
3. Submit the form
4. Check:
   - Form shows success message
   - Email appears in Loops dashboard
   - Welcome email is received (if automation is set up)

## API Endpoints

### POST `/api/loops/subscribe`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Successfully subscribed! Check your email for the Quick Start Guide.",
  "data": { ... }
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message here",
  "details": "Additional details (development only)"
}
```

**Duplicate Email (200):**
```json
{
  "success": true,
  "message": "You're already subscribed! Check your email for the Quick Start Guide.",
  "already_subscribed": true
}
```

### GET `/api/loops/test`

Returns status of:
- Environment variable configuration
- Loops API connectivity
- PDF file setup

## Troubleshooting

### Form Not Working

1. **Check API Key:**
   ```bash
   # Test endpoint
   curl https://winewithpete.me/api/loops/test
   ```

2. **Check Server Logs:**
   - Vercel Function Logs
   - Look for Loops API errors

3. **Verify Email Format:**
   - Form validates email format client-side
   - API also validates server-side

### PDF Not Accessible

1. **Verify File Location:**
   - File must be in `/public/files/`
   - Filename must match exactly: `quick_start_guide_december_reset.pdf`

2. **Check File Permissions:**
   - File should be readable
   - No special permissions needed in Next.js

3. **Test URL:**
   ```bash
   curl -I https://winewithpete.me/files/quick_start_guide_december_reset.pdf
   ```
   Should return `200 OK` with `Content-Type: application/pdf`

### Loops API Errors

1. **Check API Key:**
   - Verify key is correct in environment variables
   - Ensure no extra spaces or quotes

2. **Check Mailing List Name:**
   - Must match exactly: `december-reset-leads`
   - Case-sensitive

3. **Check Loops Dashboard:**
   - Verify contact was created
   - Check for any error messages

### Email Not Sending

1. **Check Loops Automation:**
   - Verify automation/workflow is active
   - Check trigger conditions
   - Test manually in Loops dashboard

2. **Check Spam Folder:**
   - Loops emails might go to spam initially
   - Verify sender domain is authenticated

3. **Check Loops Logs:**
   - Loops dashboard → Email Logs
   - Look for delivery status

## Migration from Kit.co

The form component has been updated to use Loops instead of Kit.co. The old Kit integration is still available at `/api/kit/subscribe` but is no longer used by the December Reset form.

If you need to keep both:
- Kit.co: `/api/kit/subscribe`
- Loops: `/api/loops/subscribe`

## Next Steps

1. ✅ Add `LOOPS_API_KEY` to environment variables
2. ✅ Place PDF in `/public/files/` directory
3. ✅ Configure Loops email automation
4. ✅ Test the integration
5. ✅ Deploy to production

## Support

For issues:
- Check server logs in Vercel
- Test endpoint: `/api/loops/test`
- Loops documentation: https://loops.so/docs

