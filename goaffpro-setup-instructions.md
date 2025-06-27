# GoAffPro Import Setup Instructions

## Issue
The GoAffPro import is returning 0 results because the API tokens are not configured.

## Solution
You need to configure your GoAffPro API tokens in your environment variables.

### Step 1: Get Your GoAffPro API Tokens
1. Log into your GoAffPro dashboard
2. Go to **Settings** → **API** → **Generate Tokens**
3. Generate both:
   - **Access Token**
   - **Public Token**

### Step 2: Configure Environment Variables
Add these to your `.env.local` file (create it if it doesn't exist):

```env
# GoAffPro API Configuration
VITE_GOAFFPRO_ACCESS_TOKEN=your_actual_access_token_here
VITE_GOAFFPRO_PUBLIC_TOKEN=your_actual_public_token_here
```

### Step 3: Restart Your Development Server
After adding the tokens, restart your development server:
```bash
npm run dev
# or
yarn dev
```

### Step 4: Test the Import
1. Go to your affiliate platform
2. Navigate to the GoAffPro import section
3. Click "Import Affiliates"
4. Check the console logs for successful API calls

## Debugging
If you're still getting 0 results:

1. **Check Console Logs**: Look for GoAffPro API request/response logs
2. **Verify Tokens**: Make sure the tokens are correct and have the right permissions
3. **Check API Limits**: Your GoAffPro plan may have API rate limits
4. **Test API Directly**: Try making a direct API call to verify the tokens work

## Expected Results
Once configured correctly, you should see:
- GoAffPro API requests in the console
- Successful responses with affiliate data
- Affiliates being imported into your database

## Current Status
- ✅ GHL Import: Working (but filtering too restrictively - now fixed)
- ❌ GoAffPro Import: Missing API tokens (needs configuration) 