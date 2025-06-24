# 🔧 Fix Supabase Password Reset Email Template

## Problem
- `{{ .ConfirmationURL }}` redirects to homepage instead of reset password page
- `{{ .TokenHash }}` gives "Auth session missing!" error
- Need to manually construct the correct URL

## Root Cause
The Supabase redirect URL configuration and email template need to work together properly.

## Solution: Two-Step Fix

### Step 1: Update Supabase Auth Settings

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/qnruorhzdxkyfhdgtkqp
2. **Navigate**: Settings → Authentication
3. **Update Site URL**: `https://jenna-two.vercel.app`
4. **Update Redirect URLs** to include:
   ```
   https://jenna-two.vercel.app/reset-password
   ```

### Step 2: Fix Email Template

Go to **Authentication** → **Email Templates** → **Reset Password**

**Replace the current template URL with:**

```html
{{ .SiteURL }}/reset-password?access_token={{ .Token }}&refresh_token={{ .Token }}&type=recovery
```

**OR** (if the above doesn't work):

```html
{{ .SiteURL }}/reset-password?token={{ .Token }}&type=recovery
```

## Complete Email Template Example

```html
<h2>Reset Your Password</h2>

<p>Hi {{ .Email }},</p>

<p>You requested to reset your password. Click the link below to set a new password:</p>

<p><a href="{{ .SiteURL }}/reset-password?access_token={{ .Token }}&refresh_token={{ .Token }}&type=recovery">Reset Password</a></p>

<p>If you didn't request this, you can safely ignore this email.</p>

<p>This link will expire in 24 hours.</p>
```

## Why Your Current Approach Doesn't Work

- `{{ .TokenHash }}` is a hashed version of the token, not the actual token
- Password reset needs the raw `{{ .Token }}` value
- `type=recovery` parameter is crucial for Supabase to recognize this as a password recovery flow

## Alternative: Update ResetPassword Component

If the email template approach doesn't work, we can modify the ResetPassword component to handle the `token` parameter:

```typescript
// In ResetPassword.tsx, add this:
const token = searchParams.get('token');
const type = searchParams.get('type');

useEffect(() => {
  if (token && type === 'recovery') {
    // Handle recovery token
    supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery'
    }).then(({ data, error }) => {
      if (error) {
        console.error('Token verification failed:', error);
      } else {
        console.log('Token verified successfully');
      }
    });
  }
}, [token, type, supabase]);
```

## Test the Fix

1. **Update the email template** as shown above
2. **Request a new password reset** (don't use old emails)
3. **Check the new email** - the link should work properly
4. **Click the link** - should go to reset password form with working session

## Expected Flow After Fix

1. User requests password reset at `/forgot-password`
2. Email contains: `https://jenna-two.vercel.app/reset-password?access_token=...&refresh_token=...&type=recovery`
3. User clicks link → goes to reset password form
4. Form works without "Auth session missing!" error
5. User can successfully update password

Try the email template fix first - this is the standard approach and should work! 🚀 