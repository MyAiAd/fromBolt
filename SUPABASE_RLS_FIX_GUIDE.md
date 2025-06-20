# Supabase RLS Infinite Recursion Fix Guide

## Problem Summary

Your affiliate aggregation service is experiencing an **"infinite recursion detected in policy for relation 'affiliate_system_users'"** error. This is a common Supabase Row Level Security (RLS) issue that occurs when policies reference the same table they're trying to protect.

## Root Cause

The current RLS policies on the `affiliate_system_users` table contain self-referencing queries like this:

```sql
-- PROBLEMATIC POLICY (causes infinite recursion)
CREATE POLICY "Users can view their own affiliate data"
  ON affiliate_system_users
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT id FROM affiliate_system_users  -- ❌ This queries the same table!
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );
```

When Supabase tries to evaluate this policy, it creates an infinite loop because the policy queries the same table it's trying to protect.

## Solution

### Step 1: Run the RLS Fix Script

Execute the `fix-rls-policies.sql` file in your Supabase SQL editor:

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `fix-rls-policies.sql`
4. Run the script

This will:
- Drop all problematic policies
- Create new, non-recursive policies
- Grant necessary permissions

### Step 2: Verify the Fix

After running the script, test your affiliate aggregation service:

```javascript
// This should now work without infinite recursion errors
const affiliates = await affiliateAggregationService.getAllAffiliates();
```

### Step 3: Monitor the Logs

The service now includes better error handling and will:
- Detect infinite recursion errors (code '42P17')
- Log helpful warnings
- Return empty arrays gracefully instead of crashing

## Error Codes to Watch For

- **42P17**: Infinite recursion detected in policy
- **42501**: Permission denied (RLS policy blocking access)
- **500**: Internal Server Error (often RLS-related)

## Quick Temporary Fix

If you need an immediate fix while working on policies, you can temporarily disable RLS:

```sql
-- TEMPORARY: Disable RLS for development (NOT recommended for production)
ALTER TABLE affiliate_system_users DISABLE ROW LEVEL SECURITY;
```

Remember to re-enable it later:

```sql
-- Re-enable RLS with proper policies
ALTER TABLE affiliate_system_users ENABLE ROW LEVEL SECURITY;
```

## Best Practices for RLS Policies

### ✅ Good Patterns

```sql
-- Use simple, non-recursive conditions
CREATE POLICY "Simple access control"
  ON table_name
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Use direct auth functions
CREATE POLICY "Direct auth check"
  ON table_name
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');
```

### ❌ Patterns to Avoid

```sql
-- Avoid self-referencing subqueries
CREATE POLICY "Avoid this pattern"
  ON table_name
  FOR SELECT
  TO authenticated
  USING (
    id IN (SELECT id FROM table_name WHERE ...) -- ❌ Causes recursion
  );

-- Avoid complex nested queries in policies
CREATE POLICY "Too complex"
  ON table_name
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM table_name t1 
      JOIN other_table t2 ON t1.id = t2.table_id
      WHERE t1.user_id = auth.uid()
    ) -- ❌ Can cause performance issues
  );
```

## Current Status

✅ **Fixed**: Added error handling to affiliate aggregation service
✅ **Fixed**: Created non-recursive RLS policies  
⏳ **Pending**: Apply the SQL fix script to your database
⏳ **Pending**: Test the affiliate aggregation functionality

## Next Steps

1. **Immediate**: Run the `fix-rls-policies.sql` script
2. **Short-term**: Test all affiliate-related functionality
3. **Long-term**: Review and optimize all RLS policies across your database

## Support

If you continue to experience issues after applying this fix:

1. Check the browser console for specific error codes
2. Review the Supabase dashboard logs
3. Verify that all policies have been properly applied
4. Consider temporarily disabling RLS for debugging (development only)

The affiliate aggregation service will now gracefully handle RLS errors and provide helpful debugging information in the console logs. 