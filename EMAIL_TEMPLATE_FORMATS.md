# 📧 Email Template Formats for Password Reset

## Current Issue
The ResetPassword component now handles multiple token formats. Based on the "Invalid JWT structure" error, we need to use the correct format in your Supabase email template.

## Option 1: Recovery Token Format (Recommended)

**Email Template URL:**
```html
{{ .SiteURL }}/reset-password?token={{ .Token }}&type=recovery
```

**How it works:**
- Uses `{{ .Token }}` (raw recovery token)
- Component calls `supabase.auth.verifyOtp()` with the token
- More secure and standard approach

## Option 2: Access/Refresh Token Format

**Email Template URL:**
```html
{{ .SiteURL }}/reset-password?access_token={{ .Token }}&refresh_token={{ .Token }}
```

**How it works:**
- Uses same token for both access and refresh
- Component calls `supabase.auth.setSession()`
- May work but less standard

## Option 3: Use ConfirmationURL (If Fixed)

**Email Template URL:**
```html
{{ .ConfirmationURL }}
```

**Requirements:**
- Site URL must be: `https://themilitarygiftshop.myshopify.com`
- Redirect URLs must include: `https://themilitarygiftshop.myshopify.com/reset-password`

## Recommended Next Steps

1. **Try Option 1 first** (Recovery Token Format)
2. **Update your email template** to use:
   ```
   {{ .SiteURL }}/reset-password?token={{ .Token }}&type=recovery
   ```
3. **Test with a fresh password reset request**

## Expected Console Output After Fix

You should see:
```
ResetPassword: Verifying recovery token from URL
ResetPassword: Recovery token verified successfully
✅ Session ready - you can now reset your password
```

Instead of:
```
ResetPassword: Session setup error: AuthInvalidJwtError: Invalid JWT structure
```

The ResetPassword component is now ready to handle both formats, so try the recovery token format first! 🚀 