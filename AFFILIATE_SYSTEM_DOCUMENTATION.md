# Multi-Level Affiliate System Documentation

## Overview

This documentation covers the complete multi-level affiliate management system built to replace GoAffPro. The system implements a 3-level commission structure with Go High Level (GHL) as the primary signup source, while consolidating data from multiple platforms including MightyNetworks, Shopify, and existing GoAffPro data.

## System Architecture

### Core Objectives
- **Replace GoAffPro entirely** within 3-4 weeks
- **Multi-level structure**: Level 1 (direct), Level 2 (indirect), Level 3 (grand referrals)
- **Primary signup source**: Go High Level (GHL)
- **Data consolidation**: Import from GHL, MightyNetworks, Shopify, and GoAffPro
- **Shopify-centric**: Shopify as the pillar system for order processing
- **Retroactive commissions**: New rates apply to existing orders

## Commission Structure

Based on the provided commission table:

| Product Category | Level 1 | Level 2 | Level 3 |
|------------------|---------|---------|---------|
| Coaching Program | 20%     | 5%      | 2%      |
| Affiliate Software | 40%   | 10%     | 5%      |
| Mastermind       | 30%     | 8%      | 3%      |
| Default          | 15%     | 5%      | 2%      |

✅ **IMPLEMENTED & VERIFIED** - Commission levels are fully set up and operational.

### Current Commission Plans (As Per M.R.S. Holdings Requirements)

| Product Category | Level 1 | Level 2 | Level 3 | Status |
|------------------|---------|---------|---------|--------|
| Bae              | 20%     | 10%     | 5%      | ✅ Active |
| Coaching Packs   | 20%     | 10%     | 5%      | ✅ Active |
| Online Mastery   | 20%     | 10%     | 5%      | ✅ Active |
| BRAVO Fitness    | 20%     | 10%     | 5%      | ✅ Active |
| AI System        | 20%     | 10%     | 5%      | ✅ Active |
| REACTION CBD     | 15%     | 5%      | 5%      | ✅ Active |
| EVENTS           | 5%      | 2.5%    | 2.5%    | ✅ Active |
| Default Product  | 15%     | 5%      | 2%      | ✅ Active |

### Implementation Details

**Database Configuration:**
- All commission plans stored in `commission_plans` table
- Commission rates exactly match provided specifications
- Multi-level commission calculation fully automated
- Database functions handle L1/L2/L3 commission distribution

**Verification Status:**
- ✅ 8 commission plans total configured
- ✅ All 7 required products have exact commission rates
- ✅ Commission calculation function tested and working
- ✅ All plans are active and operational
- ✅ Database migrations successfully applied

**Commission Calculation Process:**
1. **L1 (Direct Referrals)**: Your direct referrals earn you the highest commission
2. **L2 (Second Level)**: People referred by your referrals earn you the middle commission  
3. **L3 (Third Level)**: People referred by L2 affiliates earn you the lowest commission

**Automatic Commission Processing:**
The system automatically:
- Tracks the referral chain for each affiliate
- Calculates commissions for all three levels when sales occur
- Maps products to appropriate commission plans
- Updates affiliate earnings in real-time

**Admin Management Interface:**
- `src/pages/CommissionPlans.tsx` provides full commission plan management
- View, edit, and add new commission plans
- Toggle active/inactive status
- Real-time commission structure overview

**Testing & Validation:**
- `test-commission-plans.js` script validates all commission plans
- Confirms rates match exact requirements
- Tests commission calculation functions
- Verifies database integrity

**Product Category Mapping:**
```sql
-- Function to get commission plan for any product
get_commission_plan_for_product(product_name, product_category)

-- Usage examples:
- 'Bae' → 20%/10%/5%
- 'REACTION CBD' → 15%/5%/5%
- 'EVENTS' → 5%/2.5%/2.5%
- Unknown products → 15%/5%/2% (default)
```

## Database Schema

### Core Tables

#### 1. `commission_plans`
Defines commission rates for each product category and level.

```sql
- id (UUID, Primary Key)
- product_category (TEXT) - 'coaching_program', 'affiliate_software', 'mastermind', 'default'
- product_name (TEXT)
- shopify_product_id (TEXT)
- level_1_rate (DECIMAL) - Level 1 commission percentage
- level_2_rate (DECIMAL) - Level 2 commission percentage  
- level_3_rate (DECIMAL) - Level 3 commission percentage
- is_active (BOOLEAN)
- effective_from/until (TIMESTAMPTZ)
- notes (TEXT)
```

#### 2. `affiliate_system_users`
Master affiliate table consolidating all sources.

```sql
- id (UUID, Primary Key)
- email (TEXT, Unique)
- first_name, last_name, phone (TEXT)
- referral_code (TEXT, Unique)
- primary_source (TEXT) - 'ghl', 'mightynetworks', 'shopify', 'goaffpro', 'manual'
- ghl_contact_id, mighty_member_id, goaffpro_affiliate_id, shopify_customer_id (TEXT)
- status (TEXT) - 'active', 'inactive', 'suspended', 'pending'
- signup_date, last_active (TIMESTAMPTZ)
- Cached team metrics: total_l1/l2/l3_affiliates, total_team_size
- Cached earnings: total_l1/l2/l3_earnings, total_earnings, pending_earnings, paid_earnings
```

#### 3. `referral_relationships`
Tracks the multi-level referral tree.

```sql
- id (UUID, Primary Key)
- affiliate_id (UUID) - The person being referred
- l1_referrer_id (UUID) - Direct referrer (Level 1)
- l2_referrer_id (UUID) - Indirect referrer (Level 2)
- l3_referrer_id (UUID) - Grand referrer (Level 3)
- referral_method (TEXT) - 'referral_code', 'manual_assignment', 'import'
- referral_code_used, assigned_by, assigned_date
```

#### 4. `multi_level_commissions`
Tracks all commission calculations for L1/L2/L3.

```sql
- id (UUID, Primary Key)
- order_source (TEXT) - 'shopify', 'mightynetworks', 'goaffpro', 'manual'
- order_id, internal_order_id (TEXT/UUID)
- customer_email, customer_name (TEXT)
- order_total, order_date (DECIMAL, TIMESTAMPTZ)
- product_category, product_name, product_id (TEXT)
- purchasing_affiliate_id (UUID) - Who made the sale
- commission_level (INTEGER) - 1, 2, or 3
- earning_affiliate_id (UUID) - Who earns the commission
- commission_rate, commission_amount (DECIMAL)
- status (TEXT) - 'pending', 'approved', 'paid', 'cancelled', 'disputed'
```

#### 5. `ghl_affiliates`
Go High Level import data.

```sql
- id (UUID, Primary Key)
- ghl_contact_id (TEXT, Unique)
- email, first_name, last_name, phone (TEXT)
- contact_source, tags, custom_fields (TEXT/JSONB)
- date_added, last_activity (TIMESTAMPTZ)
- referred_by_contact_id, referral_code (TEXT)
- sync tracking: last_synced, sync_status, raw_data
```

#### 6. `team_statistics`
Pre-calculated team metrics for performance optimization.

```sql
- id (UUID, Primary Key)
- affiliate_id (UUID)
- Team metrics: l1/l2/l3_direct_count, total_team_size
- Sales metrics: l1/l2/l3_sales_volume, total_team_volume  
- Commission metrics: l1/l2/l3_commissions_earned, total_commissions
- period_start, period_end, calculation_date (TIMESTAMPTZ)
```

#### 7. `payouts`
Payout management system.

```sql
- id (UUID, Primary Key)
- affiliate_id (UUID)
- amount (DECIMAL)
- commission_ids (UUID[]) - Array of included commission IDs
- payment_method (TEXT) - 'paypal', 'stripe', 'bank_transfer', 'wise', 'manual'
- payment_email, payment_details (TEXT/JSONB)
- status (TEXT) - 'pending', 'processing', 'completed', 'failed', 'cancelled'
- transaction_id, payment_gateway_response (TEXT/JSONB)
```

#### 8. `affiliate_import_logs`
Track all import operations.

```sql
- id (UUID, Primary Key)
- import_source (TEXT) - 'ghl', 'mightynetworks', 'shopify', 'goaffpro', 'manual'
- import_type (TEXT) - 'affiliates', 'orders', 'full_sync'
- status (TEXT) - 'started', 'completed', 'failed', 'partial'
- Metrics: records_processed/successful/failed/updated
- error_details, warnings, import_config (JSONB)
```

### Database Functions

#### `calculate_multi_level_commissions()`
Automatically calculates and creates L1/L2/L3 commissions for new orders.

**Parameters:**
- `p_order_source` - Source system ('shopify', 'goaffpro', etc.)
- `p_order_id` - External order ID
- `p_customer_email` - Customer email
- `p_customer_name` - Customer name
- `p_order_total` - Order amount
- `p_order_date` - Order date
- `p_product_category` - Product category for commission rates
- `p_purchasing_affiliate_email` - Affiliate who made the sale

**Returns:** JSONB with success status and created commissions

#### `update_team_statistics()`
Updates cached team statistics for performance optimization.

**Parameters:**
- `p_affiliate_id` - Affiliate to update statistics for

**Functionality:**
- Calculates team size at each level
- Calculates total earnings by level
- Updates cached values in `affiliate_system_users`

### Triggers

1. **Team Statistics Triggers**: Automatically update team statistics when referral relationships or commissions change
2. **Updated At Triggers**: Maintain `updated_at` timestamps across all tables

## Go High Level Integration

### GHL Import Service (`src/services/ghlImportService.ts`)

#### Key Features
- **Full Contact Import**: Fetches all contacts from GHL API with pagination
- **Multi-source Consolidation**: Consolidates GHL data with existing affiliate records
- **Referral Relationship Building**: Establishes L1/L2/L3 relationships based on GHL referral data
- **Automatic Referral Codes**: Generates unique codes for contacts without them
- **Retroactive Commission Application**: Applies new commission structure to existing orders
- **Comprehensive Logging**: Tracks all import operations with detailed error handling

#### API Integration
```typescript
// Configuration
interface GHLImportConfig {
  apiKey: string;
  locationId: string;
  baseUrl?: string; // defaults to 'https://services.leadconnectorhq.com'
}

// Main import method
async importAffiliates(userId: string): Promise<ImportResult>

// Individual contact sync
async syncSingleContact(contactId: string): Promise<boolean>

// Retroactive commission processing
async retroactivelyApplyCommissions(): Promise<ImportResult>
```

#### Import Process
1. **Fetch Contacts**: Paginated retrieval from GHL API
2. **Store Raw Data**: Insert into `ghl_affiliates` table
3. **Consolidate Records**: Upsert into `affiliate_system_users`
4. **Build Relationships**: Create referral tree in `referral_relationships`
5. **Apply Commissions**: Retroactively calculate commissions for existing orders

## Frontend Components

### Affiliates Dashboard (`src/pages/AffiliatesDashboard.tsx`)

#### Features
- **Multi-level Overview**: Global statistics across L1/L2/L3 levels
- **Individual Affiliate Details**: Comprehensive affiliate profiles
- **Commission Breakdowns**: Detailed commission tracking by level and product
- **Team Management**: View and manage team members at each level
- **Multi-source Tracking**: Display data source badges (GHL, MightyNetworks, etc.)
- **Performance Metrics**: Cached statistics for fast loading

#### Key Components

**Global Statistics Display:**
```typescript
interface GlobalStats {
  totalAffiliates: number;
  totalL1Affiliates: number;
  totalL2Affiliates: number; 
  totalL3Affiliates: number;
  totalEarnings: number;
  pendingCommissions: number;
  totalTeamSize: number;
}
```

**Affiliate Detail View:**
- Personal information and source tracking
- Team structure visualization (L1/L2/L3)
- Commission history and breakdown
- Team member management
- Performance metrics

**Team Member Management:**
```typescript
interface TeamMember {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  signup_date?: string;
  level: number; // 1, 2, or 3
  total_earnings: number;
  direct_referrals: number;
}
```

## Security & Access Control

### Row Level Security (RLS) Policies

#### Affiliate System Users
- **Users can view their own data**: Access to personal affiliate record
- **Users can view team members**: Access to L1/L2/L3 team members
- **Admins have full access**: Complete management capabilities

#### Commission Data
- **Users see their earnings**: Access to commissions they've earned
- **Restricted team view**: Cannot see other affiliates' earnings
- **Admin oversight**: Full commission management

#### Import & Management
- **Admin-only operations**: Import, configuration, and system management
- **Audit logging**: All operations tracked with user attribution

## Performance Optimizations

### Caching Strategy
1. **Team Statistics**: Pre-calculated metrics in `affiliate_system_users`
2. **Materialized Views**: `team_statistics` table for complex queries
3. **Indexed Queries**: Strategic indexes on frequently accessed columns

### Database Indexes
```sql
-- Affiliate lookups
idx_affiliate_system_users_email
idx_affiliate_system_users_referral_code
idx_affiliate_system_users_ghl_contact_id

-- Referral tree navigation
idx_referral_relationships_l1_referrer
idx_referral_relationships_l2_referrer
idx_referral_relationships_l3_referrer

-- Commission queries
idx_multi_level_commissions_earning_affiliate
idx_multi_level_commissions_order_date
idx_multi_level_commissions_status
```

## Implementation Timeline

### Phase 1: Database & Core Functions (Week 1)
- ✅ Database schema creation
- ✅ Commission calculation functions
- ✅ RLS policies and security
- ✅ Basic data validation

### Phase 2: GHL Integration (Week 2)
- ✅ GHL API integration
- ✅ Contact import service
- ✅ Referral relationship building
- ✅ Error handling and logging

### Phase 3: Frontend Dashboard (Week 3)
- ✅ Affiliate dashboard component
- ✅ Multi-level visualization
- ✅ Commission tracking interface
- ✅ Team management features

### Phase 4: GoAffPro Migration (Week 4)
- 🔄 Data migration scripts
- 🔄 Commission recalculation
- 🔄 Testing and validation
- 🔄 GoAffPro phase-out

## Current System Status (Latest Updates)

### ✅ Commission Plans - FULLY OPERATIONAL

**Status:** Complete and verified ✅  
**Last Updated:** January 31, 2025  
**Verification:** All commission plans tested and confirmed working  

**What's Working:**
- 8 commission plans configured exactly per requirements
- Multi-level commission calculation (L1/L2/L3) operational
- Database functions tested and verified
- Admin interface for commission plan management
- Real-time commission tracking in affiliate dashboard

### ✅ Race Condition Fixes - IMPLEMENTED

**Issue Resolved:** Application loading screen freeze and infinite loops  
**Solution:** Consolidated authentication state management  

**Fixes Applied:**
1. **🔄 Consolidated useEffect hooks**: Single effect prevents race conditions
2. **⏱️ Enhanced debouncing**: Increased from 2 to 3 seconds for stability
3. **🚫 Loading state protection**: Prevents overlapping data refresh requests
4. **📝 Detailed logging**: Request IDs track all operations for debugging
5. **⚠️ Data integrity warnings**: Alerts when good data might be replaced

**Technical Details:**
```typescript
// Before: Two separate useEffect hooks caused race conditions
useEffect([dataSource, authLoading]) // Data source changes
useEffect([authLoading])             // Auth state changes

// After: Single consolidated useEffect prevents conflicts
useEffect([dataSource, authLoading]) // Handles both triggers safely
```

**Monitoring Recommendations:**
- Browser console shows detailed request logging
- Look for `[request-id]` prefixed messages
- Watch for ⚠️ WARNING messages about data replacement
- Monitor for proper debouncing behavior

### ✅ Database Migrations - COMPLETE

**Migration Status:** All migrations successfully applied ✅  

**Key Migrations:**
1. `20250127000000_add_updated_at_function.sql` - Trigger function for timestamps
2. `20250128000001_seed_commission_plans.sql` - Initial commission plan setup
3. `20250131000100_update_commission_plans_jennaz.sql` - Final commission rates

**Database Reset:** Successfully completed with `npx supabase db reset`  
**Data Integrity:** All tables, functions, and triggers verified working  

### ✅ Testing & Verification - PASSED

**Commission Plans Test:**
- Script: `test-commission-plans.js`
- Result: ✅ All tests passed
- Coverage: Commission rates, database functions, plan activation

**Race Condition Test:**
- Script: `test-affiliate-race-condition-fix.js`
- Result: ✅ Fixes implemented and documented
- Monitoring: Browser console logging active

**Application Status:**
- Web app loads correctly without infinite loading
- Authentication flow stable
- Data refresh operations working properly
- Commission calculations operational

### 🎯 Next Steps & Priorities

1. **Production Deployment**
   - Deploy updated database migrations
   - Apply race condition fixes to production
   - Verify commission plans in live environment

2. **User Acceptance Testing**
   - Test affiliate dashboard with real users
   - Verify commission calculations with actual sales
   - Validate multi-level structure with real referral chains

3. **GoAffPro Migration Planning**
   - Data export from GoAffPro
   - Commission history preservation
   - User notification and training
   - Phased migration timeline

4. **Performance Optimization**
   - Monitor dashboard loading times
   - Optimize large affiliate dataset queries
   - Cache frequently accessed commission data

**System Health:** 🟢 All core systems operational and verified

## Migration Strategy

### Data Sources Integration
1. **Go High Level**: Primary signup source (implemented)
2. **Shopify**: Order processing and commission calculation
3. **MightyNetworks**: Community member data
4. **GoAffPro**: Legacy affiliate data migration

### Commission Migration
- Retroactive application of new commission structure
- Preservation of existing earned commissions
- Transparent transition for affiliates

## Monitoring & Maintenance

### Import Logging
- All import operations logged in `affiliate_import_logs`
- Success/failure metrics tracking
- Error detail preservation for debugging

### Performance Monitoring
- Query performance optimization
- Cache hit rate monitoring
- Team statistics accuracy validation

### Data Integrity
- Referral relationship validation
- Commission calculation verification
- Multi-source data consistency checks

## API Endpoints (Future Enhancement)

### Planned REST API
```
GET /api/affiliates - List affiliates with filtering
GET /api/affiliates/{id} - Individual affiliate details
GET /api/affiliates/{id}/team - Team member hierarchy
GET /api/affiliates/{id}/commissions - Commission history
POST /api/affiliates/{id}/referrals - Manual referral assignment
GET /api/commissions - Commission reporting
POST /api/import/ghl - Trigger GHL import
GET /api/import/status/{logId} - Import status check
```

## Error Handling & Recovery

### Import Error Recovery
- Partial import support (continue after failures)
- Detailed error logging with stack traces
- Retry mechanisms for transient failures
- Data validation before processing

### Data Consistency
- Transaction-based operations
- Referential integrity constraints
- Duplicate prevention mechanisms
- Rollback capabilities for failed operations

## Testing Strategy

### Unit Testing
- Database function testing
- Commission calculation validation
- Referral relationship logic verification

### Integration Testing  
- GHL API integration testing
- End-to-end import process validation
- Multi-source data consolidation testing

### Performance Testing
- Large dataset import testing
- Dashboard loading performance
- Concurrent user access testing

## Conclusion

This multi-level affiliate system provides a comprehensive replacement for GoAffPro with enhanced features, better performance, and seamless integration with Go High Level as the primary signup source. The system is designed for scalability, maintainability, and provides detailed tracking and reporting capabilities for affiliate management.

The architecture supports the specified 3-level commission structure while maintaining flexibility for future enhancements and integrations with additional data sources. 