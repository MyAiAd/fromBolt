# 🚨 FIX: Password Reset Emails Still Use localhost:3000

## **CONFIRMED ISSUE:**
Password reset emails are redirecting to `localhost:3000` instead of `https://themilitarygiftshop.myshopify.com`

## **ROOT CAUSE:**
The `supabase/config.toml` changes we made are for **local development**. The **production Supabase** auth settings need to be updated **manually in the dashboard**.

## **ADDITIONAL ISSUE DISCOVERED:**
The reset link was pointing to `/forgot-password?token=` (email request page) instead of `/reset-password?token=` (new password entry page). This has been FIXED by creating a proper ResetPassword component.

---

## **🔧 IMMEDIATE FIX - Update Supabase Dashboard:**

### **Step 1: Go to Supabase Auth Settings**
1. **Open**: [Supabase Dashboard](https://supabase.com/dashboard/project/qnruorhzdxkyfhdgtkqp)
2. **Navigate**: Settings → Authentication

### **Step 2: Update Site URL**
**Find**: "Site URL" field
**Current**: `http://localhost:3000` or `http://127.0.0.1:3000`
**Change to**: `https://themilitarygiftshop.myshopify.com`

### **Step 3: Update Redirect URLs**
**Find**: "Redirect URLs" section
**Remove any localhost entries like:**
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `https://localhost:3000`

**Add these production URLs:**
```
https://themilitarygiftshop.myshopify.com
https://themilitarygiftshop.myshopify.com/login
https://themilitarygiftshop.myshopify.com/reset-password
https://themilitarygiftshop.myshopify.com/dashboard
```

### **Step 4: Save Settings**
Click **"Save"** to apply changes

---

## **🧪 TEST THE FIX:**

### **Test Password Reset:**
1. Go to `https://themilitarygiftshop.myshopify.com/forgot-password`
2. Enter your email address
3. Check email - the reset link should now point to `https://themilitarygiftshop.myshopify.com`

### **Expected Email Link (UPDATED):**
```
https://themilitarygiftshop.myshopify.com/reset-password?access_token=...&refresh_token=...
```
**NOT:**
```
http://localhost:3000/forgot-password?token=...
```

### **User Flow (CORRECTED):**
1. **User clicks "Forgot Password"** → Goes to `/forgot-password` (email entry form)
2. **User enters email and submits** → Receives email with reset link
3. **User clicks email link** → Goes to `/reset-password?access_token=...` (new password form)
4. **User enters new password twice** → Password updated, redirected to login

---

## **📋 SCREENSHOT GUIDE:**

When you're in the Supabase Dashboard:

1. **Authentication Settings Location:**
   ```
   Dashboard → Your Project → Settings → Authentication
   ```

2. **Site URL Section:**
   ```
   [Site URL: https://jenna-two.vercel.app]
   ```

3. **Redirect URLs Section:**
   ```
   ✅ https://themilitarygiftshop.myshopify.com
✅ https://themilitarygiftshop.myshopify.com/login
✅ https://themilitarygiftshop.myshopify.com/reset-password  ← NEW: This is the key fix!
✅ https://themilitarygiftshop.myshopify.com/dashboard
   ❌ Remove any localhost entries
   ❌ Remove /forgot-password from redirect URLs (not needed)
   ```

---

## **⚡ QUICK VERIFICATION:**

After making the changes, test immediately:

```bash
# Test in browser console:
console.log('Site URL should be:', 'https://themilitarygiftshop.myshopify.com');
```

Or check the email template preview in Supabase:
- Go to Authentication → Email Templates
- Preview the "Reset Password" template
- The link should show: `https://themilitarygiftshop.myshopify.com/reset-password?access_token=...`

---

## **🚨 COMMON MISTAKES TO AVOID:**

❌ **Don't add** `http://` (use `https://`)
❌ **Don't add trailing slashes** (`/` at the end)
❌ **Don't leave localhost URLs** in the redirect list
❌ **Don't use `/forgot-password` as redirect URL** (that's for email entry, not password reset)
✅ **Do use `/reset-password`** for the password reset redirect
✅ **Do use exact URLs** as shown above
✅ **Do save after each change**

---

## **💡 WHY THIS HAPPENS:**

- `supabase/config.toml` = **Local development** configuration
- **Supabase Dashboard** = **Production** configuration  
- Password reset emails use **production** settings, not local config
- **Wrong redirect URL** = Users sent to wrong page (email entry instead of password reset)

This is why updating the config file didn't fix the email issue - we need to update the production dashboard settings!

---

## **✅ CONFIRMATION:**

After applying these changes:
- ✅ Password reset emails will use production URLs
- ✅ Reset links go to `/reset-password` (correct page)
- ✅ Users can enter new password twice for confirmation
- ✅ Password reset flow works end-to-end
- ✅ No more localhost redirects
- ✅ Authentication flow works properly

---

## **🔧 TECHNICAL CHANGES MADE:**

### **New Files Created:**
- ✅ `src/pages/auth/ResetPassword.tsx` - New password entry form
- ✅ Added route `/reset-password` to `src/App.tsx`

### **User Experience Fixed:**
1. **Before**: Email link → `/forgot-password?token=` (wrong page, just email entry form)
2. **After**: Email link → `/reset-password?access_token=...` (correct page, new password form)

The issue wasn't just localhost - it was also the wrong destination page! Now users get a proper password reset form where they can enter their new password twice for confirmation. 🚀 