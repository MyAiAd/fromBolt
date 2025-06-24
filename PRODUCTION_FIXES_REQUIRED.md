# 🚨 PRODUCTION FIXES REQUIRED - LOCALHOST & RLS ISSUES

## **CRITICAL ISSUES IDENTIFIED:**

### ✅ **1. AUTH CONFIGURATION (FIXED IN CODE)**
**Problem**: Password reset emails redirect to localhost
**Status**: Fixed in `supabase/config.toml` - now points to `https://jenna-two.vercel.app`
**Action Required**: Apply config to production Supabase

### ❌ **2. RLS INFINITE RECURSION (URGENT)**
**Problem**: Database queries fail with "infinite recursion detected in policy"
**Status**: Needs immediate fix in production database
**Action Required**: Run SQL script in Supabase dashboard

### ⚠️ **3. DEMO USER FUNCTION (MAY BE AFFECTED)**
**Problem**: Demo user creation may fail due to RLS issues
**Status**: Code is correct, but RLS blocks execution
**Action Required**: Fix RLS first, then test

---

## **🔥 IMMEDIATE ACTIONS REQUIRED:**

### **Step 1: Fix Auth Configuration in Production**

**Go to**: [Supabase Dashboard](https://supabase.com/dashboard/project/qnruorhzdxkyfhdgtkqp) → Settings → Authentication

**Update these settings:**

1. **Site URL**: `https://jenna-two.vercel.app`
2. **Redirect URLs**: Add all of these:
   - `https://jenna-two.vercel.app`
   - `https://jenna-two.vercel.app/login`
   - `https://jenna-two.vercel.app/forgot-password`
   - `https://jenna-two.vercel.app/dashboard`

### **Step 2: Fix RLS Infinite Recursion (CRITICAL)**

**Go to**: [Supabase Dashboard](https://supabase.com/dashboard/project/qnruorhzdxkyfhdgtkqp) → SQL Editor

**Copy and paste this ENTIRE script:**

```sql
-- COMPREHENSIVE FIX FOR ALL RLS INFINITE RECURSION ISSUES
-- This script fixes infinite recursion in BOTH users and affiliate_system_users tables
-- Run this ENTIRE script in your Supabase SQL Editor

-- =============================================================================
-- STEP 1: Fix users table RLS policies (infinite recursion)
-- =============================================================================

-- Drop ALL existing problematic policies for users table
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create simple, non-recursive policies for users table
CREATE POLICY "users_simple_select_policy" ON users
  FOR SELECT
  TO authenticated
  USING (
    -- User can see their own record OR user is admin
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users au 
      WHERE au.id = auth.uid() 
      AND au.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "users_simple_update_policy" ON users
  FOR UPDATE
  TO authenticated
  USING (
    -- User can update their own record OR user is admin
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users au 
      WHERE au.id = auth.uid() 
      AND au.raw_user_meta_data->>'is_admin' = 'true'
    )
  )
  WITH CHECK (
    -- Same check for updates
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users au 
      WHERE au.id = auth.uid() 
      AND au.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "users_simple_insert_policy" ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Users can insert their own records OR admins can insert any
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users au 
      WHERE au.id = auth.uid() 
      AND au.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- =============================================================================
-- STEP 2: Fix affiliate_system_users RLS policies (already fixed but ensuring)
-- =============================================================================

-- Drop ALL existing problematic policies for affiliate_system_users
DROP POLICY IF EXISTS "Users can view their own affiliate data" ON affiliate_system_users;
DROP POLICY IF EXISTS "Users can view their team members" ON affiliate_system_users;
DROP POLICY IF EXISTS "Users can manage their own affiliate data" ON affiliate_system_users;
DROP POLICY IF EXISTS "Users can insert affiliate records" ON affiliate_system_users;
DROP POLICY IF EXISTS "Admins can manage all affiliate users" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated read access" ON affiliate_system_users;

-- Create simple, non-recursive policies for affiliate_system_users
CREATE POLICY "affiliate_system_users_simple_select" ON affiliate_system_users
  FOR SELECT
  TO authenticated
  USING (true); -- Allow all authenticated users to read

CREATE POLICY "affiliate_system_users_simple_insert" ON affiliate_system_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Allow all authenticated users to insert

CREATE POLICY "affiliate_system_users_simple_update" ON affiliate_system_users
  FOR UPDATE
  TO authenticated
  USING (true) -- Allow all authenticated users to update
  WITH CHECK (true);

CREATE POLICY "affiliate_system_users_simple_delete" ON affiliate_system_users
  FOR DELETE
  TO authenticated
  USING (true); -- Allow all authenticated users to delete

-- =============================================================================
-- STEP 3: Grant necessary permissions
-- =============================================================================

-- Ensure authenticated users have proper access
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON affiliate_system_users TO authenticated;

-- Ensure service_role has full access (for server-side operations)
GRANT ALL ON users TO service_role;
GRANT ALL ON affiliate_system_users TO service_role;

-- =============================================================================
-- STEP 4: Verify tables exist and are accessible
-- =============================================================================

-- Test query to ensure no recursion
DO $$
BEGIN
  -- Test users table access
  PERFORM COUNT(*) FROM users LIMIT 1;
  RAISE NOTICE 'SUCCESS: users table accessible without recursion';
  
  -- Test affiliate_system_users table access  
  PERFORM COUNT(*) FROM affiliate_system_users LIMIT 1;
  RAISE NOTICE 'SUCCESS: affiliate_system_users table accessible without recursion';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'ERROR during verification: %', SQLERRM;
END $$;

COMMIT;
```

### **Step 3: Test the Fixes**

After running the SQL script, test these queries in the SQL Editor:

```sql
-- Test 1: Should work without recursion
SELECT COUNT(*) FROM users;

-- Test 2: Should work without recursion  
SELECT COUNT(*) FROM affiliate_system_users;

-- Test 3: Complex query that was failing
SELECT email, first_name, last_name, status, primary_source 
FROM affiliate_system_users 
LIMIT 10;
```

### **Step 4: Verify Edge Functions**

Check your Edge Functions for any localhost references:
- Go to [Supabase Dashboard](https://supabase.com/dashboard/project/qnruorhzdxkyfhdgtkqp) → Edge Functions
- Review each function for any hardcoded localhost URLs

---

## **🎯 EXPECTED RESULTS AFTER FIXES:**

### ✅ **Password Reset**
- Password reset emails will redirect to `https://jenna-two.vercel.app/forgot-password`
- Users can successfully reset passwords in production

### ✅ **Demo User Creation**
- Demo user creation will work without RLS errors
- New affiliates can be created and stored properly

### ✅ **Authentication Flow**
- Login/logout works smoothly
- User validation uses production URLs
- No more localhost redirects

### ✅ **Database Operations**
- No more infinite recursion errors
- All affiliate aggregation queries work
- Data imports function correctly

---

## **🚨 EMERGENCY CONTACTS:**

If issues persist after applying these fixes:

1. **Check Supabase Logs**: Dashboard → Logs → Database
2. **Review Network Tab**: Browser DevTools during failed operations  
3. **Test Individual Functions**: Use the provided test queries

---

## **📋 VERIFICATION CHECKLIST:**

After applying fixes, verify:

- [ ] Password reset emails work and redirect correctly
- [ ] Demo user creation completes successfully
- [ ] Affiliate data loads without errors
- [ ] Login/logout functions properly
- [ ] No more localhost references in network requests
- [ ] RLS policies allow proper data access
- [ ] Edge functions (if any) use production URLs

---

## **🔧 TECHNICAL SUMMARY:**

### **Files Modified:**
- ✅ `supabase/config.toml` - Auth URLs updated to production

### **Database Changes Required:**
- ❌ RLS policies on `users` table - needs manual SQL execution
- ❌ RLS policies on `affiliate_system_users` table - needs manual SQL execution

### **Functions Affected:**
- `resetPassword` in AuthContext.tsx - ✅ Uses environment variables correctly
- `createDemoUser` in Affiliates.tsx - ✅ Uses environment variables correctly  
- All Edge Functions - ⚠️ Need manual verification

**Priority**: 🔥 **CRITICAL** - Apply RLS fix immediately to restore functionality 