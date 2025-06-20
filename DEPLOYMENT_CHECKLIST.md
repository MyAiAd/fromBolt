# 🚀 Production Deployment Checklist

## Current Status
- ✅ Local database schema exported and **cleaned for production** (`local_schema_production.sql`)
- ✅ Local database data exported and **cleaned for production** (`local_data_production.sql`) 
- ✅ Production Supabase project configured
- ✅ Edge Function secrets set in production
- ✅ Environment files created (`.env.production`, `.env.local.updated`)
- ✅ **FIXED**: `transaction_timeout` error resolved

## 📋 Pre-Migration Steps

### 1. Update Local Environment
- [ ] Replace `.env.local` with `.env.local.updated`
- [ ] Restart development server
- [ ] Test local app with updated environment variables

### 2. Database Migration to Production

#### Option A: Via Supabase Dashboard (Recommended)
- [ ] Go to [Supabase Dashboard](https://app.supabase.com/project/qnruorhzdxkyfhdgtkqp)
- [ ] Navigate to SQL Editor
- [ ] Copy contents of **`local_schema_production.sql`** and execute ⚠️ **Use the _production version!**
- [ ] Copy contents of **`local_data_production.sql`** and execute ⚠️ **Use the _production version!**

#### Option B: Via Command Line
```bash
# Get your database password from Supabase Dashboard > Settings > Database
psql "postgresql://postgres:[PASSWORD]@db.qnruorhzdxkyfhdgtkqp.supabase.co:5432/postgres" < local_schema_production.sql
psql "postgresql://postgres:[PASSWORD]@db.qnruorhzdxkyfhdgtkqp.supabase.co:5432/postgres" < local_data_production.sql
```

#### ✅ **What Was Fixed:**
- **transaction_timeout**: Commented out (not supported in production PostgreSQL)
- **pgbouncer references**: Cleaned up for production compatibility
- **Local development roles**: Converted to production-compatible owners

### 3. Deploy Edge Functions

#### Deploy Mighty Networks Webhook
- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Login: `supabase login`
- [ ] Link project: `supabase link --project-ref qnruorhzdxkyfhdgtkqp`
- [ ] Deploy function: `supabase functions deploy mn-webhook`

#### Verify Environment Variables
Production should already have these set:
- [ ] `ZAPIER_MIGHTYNETWORKS_KEY` ✅
- [ ] `MN_WEBHOOK_SECRET` ✅
- [ ] `SUPABASE_URL` ✅
- [ ] `SUPABASE_ANON_KEY` ✅
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ✅

### 4. Test Production Webhook
- [ ] Run: `node test-production-webhook.js`
- [ ] Verify webhook responds with 200 status
- [ ] Check Supabase logs for any errors

## 🧪 Testing Phase

### 1. Test Production Environment
- [ ] Copy `.env.production` to `.env.local` (temporary)
- [ ] Start development server
- [ ] Test all major features:
  - [ ] Login/Authentication
  - [ ] Affiliate dashboard
  - [ ] Data sync functionality
  - [ ] ReAction integration
  - [ ] GHL integration
  - [ ] Performance metrics

### 2. Test Zapier Integration
- [ ] Update Zapier webhook URL to: `https://qnruorhzdxkyfhdgtkqp.supabase.co/functions/v1/mn-webhook`
- [ ] Test webhook with sample data
- [ ] Verify data appears in production database
- [ ] Check affiliate creation/updates work correctly

### 3. Test All API Integrations
- [ ] GoAffPro/ReAction sync
- [ ] GHL import
- [ ] Mighty Networks webhook
- [ ] Manual affiliate reassignment

## 🚀 Go Live Steps

### 1. Final Environment Switch
- [ ] Backup current `.env.local`
- [ ] Copy `.env.production` to `.env.local`
- [ ] Update any deployment scripts/configs

### 2. Update External Services
- [ ] Update Zapier webhook URL to production
- [ ] Update any other webhook endpoints
- [ ] Notify team of new production URLs

### 3. Deploy Application
- [ ] Build production version: `npm run build`
- [ ] Deploy to hosting platform (Vercel/Netlify/etc.)
- [ ] Verify production deployment works

### 4. Monitor & Verify
- [ ] Check Supabase logs for errors
- [ ] Monitor webhook activity
- [ ] Test end-to-end affiliate flow
- [ ] Verify all data syncing correctly

## 🔧 Rollback Plan

If issues occur:
1. Revert `.env.local` to previous version
2. Update Zapier back to local URL (if testing locally)
3. Check error logs in Supabase dashboard
4. Fix issues and re-test

## 📞 Support Resources

- **Supabase Dashboard**: https://app.supabase.com/project/qnruorhzdxkyfhdgtkqp
- **Edge Functions Logs**: Dashboard > Edge Functions > mn-webhook > Logs
- **Database Logs**: Dashboard > Logs > Database
- **API Logs**: Dashboard > Logs > API

## 🎯 Success Criteria

- [ ] All database tables migrated successfully
- [ ] Webhook responds correctly to test requests
- [ ] Zapier integration works end-to-end
- [ ] All existing features work in production
- [ ] No data loss during migration
- [ ] Performance is acceptable

## 📝 Post-Migration Tasks

- [ ] Update documentation with production URLs
- [ ] Clean up local test files (optional)
- [ ] Set up monitoring/alerts for production
- [ ] Schedule regular backups
- [ ] Document any configuration changes

---

## Quick Reference

### URLs
- **Local**: http://localhost:54321/functions/v1/mn-webhook
- **Production**: https://qnruorhzdxkyfhdgtkqp.supabase.co/functions/v1/mn-webhook

### Project Details
- **Project ID**: qnruorhzdxkyfhdgtkqp
- **Project Name**: affiliate-platform
- **Database**: PostgreSQL on Supabase

### Production-Ready Files
- **Schema**: `local_schema_production.sql` ⚠️ **Use this one!**
- **Data**: `local_data_production.sql` ⚠️ **Use this one!**

### Test Commands
```bash
# Test production webhook
node test-production-webhook.js

# Test local webhook (if running)
node test-webhook.js

# Run migration helper
node migrate-to-production.js

# Clean schema for production (already done)
node clean-schema-for-production.js
``` 