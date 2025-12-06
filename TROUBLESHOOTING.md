# Newsletter Subscription Troubleshooting

## Current Flow
1. User submits email on `/join` page
2. Frontend calls `/api/newsletter/subscribe`
3. Backend:
   - Saves to Supabase (REQUIRED - if this fails, whole thing fails)
   - Tries to add to Kit.co (OPTIONAL - fails silently)
   - Tries to send welcome email (OPTIONAL - fails silently)

## Possible Issues

### 1. Supabase Connection Failing
**Symptoms:**
- 500 error on subscription
- Error in logs about Supabase connection

**Check:**
- `NEXT_PUBLIC_SUPABASE_URL` set in Vercel?
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Vercel?
- Supabase project still active?
- Database table `newsletter_subscribers` exists?

**Test:**
```bash
POST https://winewithpete.me/api/debug-subscription
Body: { "email": "test@example.com" }
```

### 2. Kit.co API Not Working
**Symptoms:**
- Subscription succeeds but email not in Kit.co
- Kit sync shows `false` in response

**Check:**
- `KIT_API_KEY` set in Vercel?
- Kit.co API endpoints might not exist (we're guessing at them)
- Kit.co might require different authentication

**Possible Solutions:**
- Use Kit.co embed script directly instead of API
- Use Kit.co webhook instead of direct API
- Check Kit.co documentation for correct API

### 3. Environment Variables Missing
**Check in Vercel:**
- Settings → Environment Variables
- Make sure all are set for "Production" environment
- Redeploy after adding variables

## Testing Steps

1. **Test Debug Endpoint:**
   ```
   GET https://winewithpete.me/api/debug-subscription
   ```
   This shows what env vars are set

2. **Test Full Flow:**
   ```
   POST https://winewithpete.me/api/debug-subscription
   Body: { "email": "your-test-email@example.com" }
   ```
   This tests Supabase and Kit separately

3. **Check Vercel Logs:**
   - Go to Functions → `/api/newsletter/subscribe`
   - Look for error messages
   - Check if Supabase error or Kit error

4. **Test Kit API Directly:**
   ```
   POST https://winewithpete.me/api/test-kit
   Body: { "email": "test@example.com" }
   ```

## Quick Fixes

### If Supabase is failing:
- Check Supabase dashboard
- Verify table exists
- Check RLS policies

### If Kit.co is failing:
- Kit.co might not have a public API
- Consider using their embed script instead
- Or use webhooks if available

### If both are failing:
- Check all environment variables in Vercel
- Redeploy after adding variables

