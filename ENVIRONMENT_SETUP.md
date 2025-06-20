# Environment Variables Setup

This application requires specific environment variables to function properly. All environment variables for Vite must be prefixed with `VITE_` to be accessible in the browser.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Supabase Configuration
```bash
# Your Supabase project URL (local development)
VITE_SUPABASE_URL=http://localhost:54321

# Your Supabase anon/public key (used for client-side operations)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Your Supabase service role key (used for admin operations)
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

### API Integrations
```bash
# Rewardful API key (used for Mighty Networks data)
VITE_REWARDFUL_API_KEY=your_rewardful_api_key_here

# GoAffPro API tokens (used for ReAction data)
VITE_GOAFFPRO_ACCESS_TOKEN=0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24
VITE_GOAFFPRO_PUBLIC_TOKEN=c633c5f229cf50a8a47f8efd52583295e3818283ab120ed0040994ea14f0903b

# Mighty Networks Zapier webhook key (NEEDS VITE_ PREFIX!)
VITE_MIGHTY_NETWORKS_ZAPIER=Pw8Io8duTZqtSm0jQMYYv9KVPRQfJMf99Nrtc1ZyOGA
```

## 🚨 **FIXES NEEDED IN YOUR .env.local FILE**

Update your `.env.local` file with these corrections:

```bash
# ✅ CORRECT - Your current Supabase settings are good
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# ✅ CORRECT - Your GoAffPro tokens are correctly named
VITE_GOAFFPRO_ACCESS_TOKEN=0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24
VITE_GOAFFPRO_PUBLIC_TOKEN=c633c5f229cf50a8a47f8efd52583295e3818283ab120ed0040994ea14f0903b

# 🔄 CHANGE THIS - Add VITE_ prefix to make it accessible in browser
VITE_MIGHTY_NETWORKS_ZAPIER=Pw8Io8duTZqtSm0jQMYYv9KVPRQfJMf99Nrtc1ZyOGA

# 📝 ADD THIS - You need a Rewardful API key for Mighty Networks data import
VITE_REWARDFUL_API_KEY=your_rewardful_api_key_here
```

## How to Find Your Keys

### Supabase Keys ✅ (You have these)
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and API keys

### Rewardful API Key ❌ (You need this)
1. Log into your Rewardful account
2. Go to Settings → API
3. Generate or copy your API key

### GoAffPro API Key ✅ (You have these)
1. Log into your GoAffPro account
2. Go to Settings → API
3. Generate or copy your API key

## Important Notes

- **Never commit** `.env.local` to version control
- The `.env.local` file is already gitignored
- Restart your development server after adding environment variables
- Environment variables prefixed with `VITE_` are available in the browser
- Service role keys should be kept secure and only used for server-side operations

## Fixed Issues

✅ **Browser Process Error**: Fixed `process.env` references to use `import.meta.env` for browser compatibility
✅ **Landing Page**: Changed default route to login page instead of dashboard to prevent loading errors
✅ **Environment Variable Access**: All services now use Vite-compatible environment variable access

## Testing

After setting up your environment variables:

1. **Stop your current dev server** (Ctrl+C in terminal)
2. **Update your `.env.local` file** with the fixes above
3. **Restart the development server**: `npm run dev`
4. **Navigate to** `http://localhost:5174/` (or whatever port Vite shows)
5. You should see the login page without any console errors
6. After logging in, you can test the data import functionality in Settings → Data Import 