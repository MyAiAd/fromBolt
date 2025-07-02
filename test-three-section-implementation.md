# Three-Section Payment Implementation Plan

## Current Issue
The existing Payments page shows affiliates in both "Pending Payments" and "Payment History" when a payout is initiated but not yet completed by PayPal.

## Proposed Solution: Three-Section Structure

### 1. **Unpaid** (Yellow/Clock Icon)
- **Purpose**: Commissions ready for payout
- **Data Source**: `multi_level_commissions` table where `status='approved'` and `paid_date=null`
- **Filter**: Only show commissions that don't have any associated pending payouts
- **Actions**: "Pay" button to initiate PayPal payout

### 2. **Pending** (Blue/Spinner Icon)  
- **Purpose**: Payouts initiated but not yet completed by PayPal
- **Data Source**: `payouts` table where `status='processing'` or `status='pending'`
- **Info Shown**: Affiliate name, amount, status, date initiated, transaction ID
- **Actions**: None (waiting for PayPal webhook)

### 3. **Paid** (Green/Checkmark Icon)
- **Purpose**: Successfully completed payouts
- **Data Source**: `payouts` table where `status='completed'`
- **Info Shown**: Affiliate name, amount, completion date, transaction ID
- **Actions**: None (historical record)

## Implementation Steps

1. **Update Data Loading Logic**
   - Modify `loadUnpaidCommissions()` to filter out commissions with pending payouts
   - Create `loadPendingPayouts()` and `loadCompletedPayouts()` functions
   - Separate payout data by status

2. **Create Three UI Sections**
   - Replace current "Pending Payments" and "Payment History" with three distinct sections
   - Use color coding: Yellow (Unpaid), Blue (Pending), Green (Paid)
   - Add appropriate icons and status indicators

3. **Implement PayPal Webhook Handler**
   - Create Supabase Edge Function to receive PayPal webhook notifications
   - Update payout status when PayPal confirms completion
   - Update corresponding commission records with `paid_date`

4. **Add Status Synchronization**
   - Manual "Refresh Status" button for admin testing
   - Automatic status checking via webhook
   - Real-time UI updates when status changes

## Benefits
- ✅ Clear separation of payment stages
- ✅ No duplicate entries confusion  
- ✅ Support for recurring payments
- ✅ Real-time status tracking
- ✅ Better admin visibility
- ✅ Proper audit trail

## Webhook Implementation
The PayPal webhook will:
1. Receive status update from PayPal
2. Update payout record status
3. If status is "completed", update commission `paid_date`
4. Trigger UI refresh for real-time updates 