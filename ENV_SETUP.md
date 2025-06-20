# Environment Setup Guide

This guide will help you configure the necessary environment variables for the Affiliate Platform.

## Quick Setup

Run the interactive setup script:

```bash
npm run setup
```

This will guide you through setting up your Supabase and GoAffPro credentials.

## Manual Setup

If you prefer to set up the environment variables manually, create a `.env` file in the root directory with the following content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# GoAffPro Configuration
VITE_GOAFFPRO_ACCESS_TOKEN=your_goaffpro_access_token
VITE_GOAFFPRO_PUBLIC_TOKEN=your_goaffpro_public_token
```

## Getting Your Credentials

### Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Project API keys** → `anon public` → `VITE_SUPABASE_ANON_KEY`

### GoAffPro Credentials

1. Log into your GoAffPro admin panel
2. Go to Settings → API
3. Copy the following:
   - **Access Token** → `VITE_GOAFFPRO_ACCESS_TOKEN`
   - **Public Token** → `VITE_GOAFFPRO_PUBLIC_TOKEN`

## Testing the Setup

After setting up your environment variables:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the application in your browser

3. Test the GoAffPro import functionality:
   - Go to the GoAffPro Data page
   - Try importing affiliates, orders, rewards, or payments
   - Check the console for any errors

## Test Credentials

For testing purposes, the setup script includes default GoAffPro test credentials that should work with the GoAffPro API. However, you'll still need to provide your own Supabase credentials.

## Troubleshooting

### Common Issues

1. **"Missing environment variables" error**
   - Make sure your `.env` file is in the root directory
   - Restart the development server after creating/modifying the `.env` file

2. **Supabase connection errors**
   - Verify your Supabase URL and anon key are correct
   - Check that your Supabase project is active

3. **GoAffPro API errors**
   - Verify your GoAffPro tokens are correct
   - Check that your GoAffPro account has API access enabled

4. **Import showing "importing..." but no data**
   - This was a known issue that has been fixed
   - The GoAffPro API now includes proper field parameters
   - Try the import again with the updated service

### Debug Information

The application includes a debug component that shows the status of your environment variables. Look for the debug panel in the top-right corner of the application.

## Security Notes

- The `.env` file is automatically gitignored for security
- Never commit your actual credentials to version control
- Use different credentials for development and production environments 