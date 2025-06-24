# Fix Vercel Environment Variables

## Problem
Your app is showing `https://placeholder.supabase.co/auth/v1/user` error because Vercel doesn't have the correct environment variables set.

## Solution: Set Environment Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Find your project**: `jenna-two` (or whatever your project is named)
3. **Go to Settings** → **Environment Variables**
4. **Add these variables**:

```bash
VITE_SUPABASE_URL=https://qnruorhzdxkyfhdgtkqp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucnVvcmh6ZHhreWZoZGd0a3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDU1MTAsImV4cCI6MjA2MzU4MTUxMH0.d42EFmjURUJ2aLFeAyFQsWwFmbnL7L_ObfAIlpv8McM
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucnVvcmh6ZHhreWZoZGd0a3FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODAwNTUxMCwiZXhwIjoyMDYzNTgxNTEwfQ.YLZe38q0F1cl-eBTM5yXDha59JjISzA1eGmtmra7e4o
VITE_GOAFFPRO_ACCESS_TOKEN=0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24
VITE_GOAFFPRO_PUBLIC_TOKEN=c633c5f229cf50a8a47f8efd52583295e3818283ab120ed0040994ea14f0903b
VITE_GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI
VITE_GHL_LOCATION_ID=w01Gc7T4b0tKSDQdKhuN
VITE_MIGHTY_NETWORKS_ZAPIER=Pw8Io8duTZqtSm0jQMYYv9KVPRQfJMf99Nrtc1ZyOGA
```

5. **Set Environment** to `Production, Preview, and Development`
6. **Click "Save"**
7. **Redeploy your app** (Vercel → Deployments → Redeploy latest)

### Method 2: Vercel CLI (Alternative)

If you have Vercel CLI installed:

```bash
# Set each environment variable
vercel env add VITE_SUPABASE_URL
# Enter: https://qnruorhzdxkyfhdgtkqp.supabase.co
# Select: Production, Preview, Development

vercel env add VITE_SUPABASE_ANON_KEY
# Enter the anon key...

# Repeat for all variables above
```

### Method 3: Environment File (Quick)

1. **Create `.env.production`** in your project root:

```bash
VITE_SUPABASE_URL=https://qnruorhzdxkyfhdgtkqp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucnVvcmh6ZHhreWZoZGd0a3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDU1MTAsImV4cCI6MjA2MzU4MTUxMH0.d42EFmjURUJ2aLFeAyFQsWwFmbnL7L_ObfAIlpv8McM
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucnVvcmh6ZHhreWZoZGd0a3FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODAwNTUxMCwiZXhwIjoyMDYzNTgxNTEwfQ.YLZe38q0F1cl-eBTM5yXDha59JjISzA1eGmtmra7e4o
VITE_GOAFFPRO_ACCESS_TOKEN=0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24
VITE_GOAFFPRO_PUBLIC_TOKEN=c633c5f229cf50a8a47f8efd52583295e3818283ab120ed0040994ea14f0903b
VITE_GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI
VITE_GHL_LOCATION_ID=w01Gc7T4b0tKSDQdKhuN
VITE_MIGHTY_NETWORKS_ZAPIER=Pw8Io8duTZqtSm0jQMYYv9KVPRQfJMf99Nrtc1ZyOGA
```

2. **Push to git and redeploy**

## After Setting Environment Variables

1. **Redeploy on Vercel** (this is crucial!)
2. **Test the password reset flow**:
   - Go to https://jenna-two.vercel.app/forgot-password
   - Enter your email
   - Check for reset email
   - Click the reset link
   - Should go to `/reset-password` page now

## Verification

After redeployment, check the browser console. You should see:
- ✅ No more `placeholder.supabase.co` errors
- ✅ Proper Supabase URL: `https://qnruorhzdxkyfhdgtkqp.supabase.co`
- ✅ Password reset flow working

## Why This Happened

- Vite apps need environment variables prefixed with `VITE_`
- Vercel needs these variables set in its dashboard/CLI
- Without them, the app falls back to placeholder values
- The `placeholder.supabase.co` indicates missing `VITE_SUPABASE_URL`

## Next Steps

Once environment variables are set and redeployed:

1. **Test password reset flow end-to-end**
2. **Update Supabase email template redirect URL** (if needed)
3. **Verify all other functionality works** 