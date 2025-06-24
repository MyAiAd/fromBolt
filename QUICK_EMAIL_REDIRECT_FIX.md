# 🔧 QUICK FIX: Update Supabase Email Redirect

## Problem
Password reset emails are redirecting to `/forgot-password` (email entry page) instead of `/reset-password` (new password entry page).

## Solution: Update Supabase Dashboard

### 1. Go to Supabase Dashboard
- URL: https://supabase.com/dashboard/project/qnruorhzdxkyfhdgtkqp
- Navigate: **Settings** → **Authentication**

### 2. Update Redirect URLs
Find the **"Redirect URLs"** section and make sure it includes:
```
https://jenna-two.vercel.app/reset-password
```

### 3. Check Email Template (Optional)
- Go to **Authentication** → **Email Templates**
- Find **"Reset Password"** template
- The confirmation URL should use: `{{ .ConfirmationURL }}`
- This automatically generates the correct URL with tokens

### 4. Save Changes
Click **"Save"** to apply the changes.

## Test the Fix
1. Go to https://jenna-two.vercel.app/forgot-password
2. Enter your email
3. Check the email - the link should now go to `/reset-password` instead of `/forgot-password`

## Expected Flow After Fix
1. User enters email at `/forgot-password`
2. User receives email with link to `/reset-password?access_token=...&refresh_token=...`
3. User clicks link → goes to password reset form
4. User enters new password twice → password updated → redirected to login

The app is now working correctly - we just need to update the email redirect URL in Supabase! 🚀 