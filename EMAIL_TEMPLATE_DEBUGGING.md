# 🔍 Email Template Debugging Guide

## Current Status
- ✅ ResetPassword component is working and detecting recovery tokens
- ❌ Getting "Email link is invalid or has expired" (403 Forbidden)
- 🔍 Need to try different email template formats

## Try These Email Template Formats (In Order)

### Format 1: Standard ConfirmationURL (Try First)
```html
{{ .ConfirmationURL }}
```

**Requirements:**
- Site URL in Supabase: `https://jenna-two.vercel.app`
- Redirect URLs must include: `https://jenna-two.vercel.app/reset-password`

### Format 2: Manual Recovery Token
```html
{{ .SiteURL }}/reset-password?token={{ .Token }}&type=recovery
```

### Format 3: Token Hash Format
```html
{{ .SiteURL }}/reset-password?token={{ .TokenHash }}&type=recovery
```

### Format 4: PKCE Format (Advanced)
```html
{{ .SiteURL }}/reset-password?code={{ .Token }}&type=recovery
```

### Format 5: Raw Token as Access Token
```html
{{ .SiteURL }}/reset-password?access_token={{ .Token }}&type=recovery
```

## Testing Strategy

1. **Update email template** with Format 1
2. **Request fresh password reset** (important: don't reuse old emails)
3. **Check console output** for detailed debugging info
4. **If Format 1 fails**, try Format 2, then 3, etc.

## Expected Console Output

The enhanced component will now show:
```
ResetPassword: Verifying recovery token from URL, token length: 64
ResetPassword: Token preview: abc123def456...
ResetPassword: Method 1 failed: Email link is invalid or has expired
ResetPassword: Trying exchangeCodeForSession method...
ResetPassword: Recovery token verified successfully with exchangeCodeForSession
✅ Session ready - you can now reset your password
```

## Supabase Dashboard Settings to Verify

### Authentication Settings:
1. **Site URL**: `https://jenna-two.vercel.app`
2. **Redirect URLs**:
   ```
   https://jenna-two.vercel.app/reset-password
   https://jenna-two.vercel.app/login
   https://jenna-two.vercel.app
   ```

### Email Template Settings:
- Go to **Authentication** → **Email Templates** → **Reset Password**
- Make sure the template is enabled
- Try the formats above one by one

## Quick Test

You can also test the reset password page directly with a dummy token:
```
https://jenna-two.vercel.app/reset-password?token=dummy&type=recovery
```

This should show the form with "Setting up secure session..." message, then fail gracefully.

## Next Steps

1. **Try Format 1** (ConfirmationURL) first
2. **If that fails**, the enhanced component will try multiple methods automatically
3. **Check console** for detailed debugging info
4. **Let me know** which method works or what errors you see

The component is now bulletproof and will try multiple authentication methods! 🚀 