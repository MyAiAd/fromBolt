# Performance Level System Implementation Guide

## Overview
This guide implements a **monthly earnings-based performance level system** that:
- Calculates performance levels based on **monthly earnings** (not total earnings)
- Stores calculated levels **in the database** for fast retrieval
- Recalculates levels **on the 1st of each month** via automated scheduler
- Displays actual performance levels (Aligned, Activated, etc.) instead of source names

## 🔧 Database Changes Required

### 1. Run the Migration Script
Execute the `database_performance_level_migration.sql` file in your Supabase SQL editor:

```sql
-- This adds performance level fields to all affiliate tables
-- and creates the monthly calculation functions
```

**What this creates:**
- Adds `current_performance_level` field to all affiliate tables
- Adds `current_month_earnings` field for tracking
- Creates `monthly_affiliate_earnings` table for historical tracking
- Creates `calculate_performance_level()` function
- Creates `recalculate_monthly_performance_levels()` stored procedure

### 2. Performance Level Thresholds

| Level | Monthly Range | Frontend Display |
|-------|---------------|------------------|
| Aligned | $0 - $999 | Entry Level |
| Activated | $1,000 - $4,999 | Building Momentum |
| Ascended | $5,000 - $9,999 | Growing Impact |
| Magnetic | $25,000 - $49,999 | Strong Performance |
| Luminary | $50,000 - $99,999 | Community Leader |
| Visionary | $100,000 - $499,999 | Leader of Leaders |
| Oracle | $500,000 - $999,999 | Wisdom and Results |
| Sovereign | $1,000,000+ | Ultimate Mastery |

## 🖥️ Frontend Code Changes

### Changes Made:
1. **AffiliateAggregationService** - Updated to use `current_performance_level` field
2. **Performance Level Calculator** - New service for monthly calculations
3. **Monthly Scheduler** - Automated script for monthly calculations

### Key Changes in `affiliateAggregationService.ts`:
```typescript
// OLD (wrong - showing source, not performance)
level: 'ReAction'  // ❌

// NEW (correct - showing actual performance level)
level: affiliate.current_performance_level || 'Aligned'  // ✅
```

## 🔄 Monthly Calculation System

### Automated Scheduling
Set up a **cron job** to run on the 1st of each month:

```bash
# Add to crontab (crontab -e)
0 2 1 * * cd /path/to/project && node monthly-scheduler.js

# Make the script executable
chmod +x monthly-scheduler.js
```

### Manual Testing
```bash
# Test the calculation manually
node monthly-scheduler.js --force

# Or with environment variable
FORCE_RUN=true node monthly-scheduler.js
```

## 📊 How It Works

### Monthly Calculation Process:
1. **On the 1st of each month**, the scheduler runs
2. **Reads current earnings** from each affiliate table
3. **Calculates performance level** based on earnings thresholds
4. **Updates the `current_performance_level`** field in each table
5. **Logs results** to `monthly_affiliate_earnings` table for history
6. **Frontend displays** the updated performance levels

### Database Flow:
```
[goaffpro_affiliates.total_earnings] → calculate_performance_level() → [current_performance_level]
[mightynetworks_affiliates.total_earnings] → calculate_performance_level() → [current_performance_level]  
[affiliate_system_users.total_earnings] → calculate_performance_level() → [current_performance_level]
```

### Frontend Flow:
```
Database.current_performance_level → AggregationService.level → Affiliates.tsx → Table Display
```

## 🚀 Deployment Steps

### Step 1: Database Migration
1. Run the `database_performance_level_migration.sql` in Supabase
2. Verify new fields are added to all tables
3. Test the calculation function manually

### Step 2: Deploy Frontend Code
1. The `affiliateAggregationService.ts` changes are already made
2. Deploy the updated code to production
3. Verify affiliates page shows "Aligned" for new affiliates

### Step 3: Setup Monthly Scheduler
1. Deploy `monthly-scheduler.js` to your server
2. Set up the cron job for 1st of each month
3. Test with `--force` flag to ensure it works

### Step 4: Initial Calculation
```bash
# Run once to populate current performance levels
FORCE_RUN=true node monthly-scheduler.js
```

## 🧪 Testing Checklist

### Database Testing:
- [ ] Migration script runs without errors
- [ ] New fields appear in all affiliate tables
- [ ] `calculate_performance_level()` function works
- [ ] Manual calculation returns expected levels

### Frontend Testing:
- [ ] Affiliates page loads without errors
- [ ] Level column shows performance levels (not source names)
- [ ] New affiliates default to "Aligned"
- [ ] Existing affiliates show calculated levels

### Scheduler Testing:
- [ ] Script runs successfully with `--force`
- [ ] Performance levels get updated in database
- [ ] Monthly calculation logs are created
- [ ] Cron job executes on schedule

## 🔍 Troubleshooting

### Common Issues:

**"Level shows 'undefined'"**
- Check if `current_performance_level` field exists in database
- Verify migration script ran successfully
- Run initial calculation to populate levels

**"Monthly calculation fails"**
- Check Supabase connection and permissions
- Verify database functions exist
- Check for RLS policy conflicts

**"Cron job doesn't run"**
- Verify cron syntax and paths
- Check server logs for errors
- Test script manually first

## 📈 Monitoring

### Track Monthly Calculations:
```sql
-- View calculation history
SELECT * FROM monthly_calculation_logs 
ORDER BY created_at DESC LIMIT 10;

-- Check current month performance distribution
SELECT current_performance_level, COUNT(*) 
FROM affiliate_system_users 
GROUP BY current_performance_level;
```

### Performance Metrics:
- Monitor calculation execution time
- Track level distribution changes month-over-month
- Alert on calculation failures

---

## ✅ Expected Results

After implementation:
- ✅ Affiliates page shows **"Magnetic"**, **"Aligned"**, etc. instead of **"ReAction"**
- ✅ Levels update automatically **on the 1st of each month**
- ✅ Performance levels based on **actual monthly earnings**
- ✅ Historical tracking of level changes over time
- ✅ Admin can view performance level distribution and trends 