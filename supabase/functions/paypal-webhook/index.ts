import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse the PayPal webhook payload
    const payload = await req.json()
    
    console.log('PayPal Webhook Received:', {
      event_type: payload.event_type,
      resource_type: payload.resource_type,
      summary: payload.summary
    })

    // Handle different PayPal webhook event types
    switch (payload.event_type) {
      case 'PAYMENT.PAYOUTSBATCH.SUCCESS':
        await handlePayoutBatchSuccess(supabase, payload)
        break
      
      case 'PAYMENT.PAYOUTSBATCH.DENIED':
        await handlePayoutBatchDenied(supabase, payload)
        break
        
      case 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED':
        await handlePayoutItemSucceeded(supabase, payload)
        break
        
      case 'PAYMENT.PAYOUTS-ITEM.FAILED':
        await handlePayoutItemFailed(supabase, payload)
        break
        
      case 'PAYMENT.PAYOUTS-ITEM.DENIED':
        await handlePayoutItemDenied(supabase, payload)
        break
        
      default:
        console.log('Unhandled webhook event type:', payload.event_type)
    }

    return new Response(
      JSON.stringify({ success: true, event_type: payload.event_type }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('PayPal Webhook Error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function handlePayoutBatchSuccess(supabase: any, payload: any) {
  console.log('Processing payout batch success:', payload.resource.batch_header.payout_batch_id)
  
  // The batch was successful, but individual items might still be processing
  // We'll wait for individual item events to update specific payouts
}

async function handlePayoutBatchDenied(supabase: any, payload: any) {
  console.log('Processing payout batch denied:', payload.resource.batch_header.payout_batch_id)
  
  const batchId = payload.resource.batch_header.payout_batch_id
  
  // Mark all payouts in this batch as failed
  const { error } = await supabase
    .from('payouts')
    .update({ 
      status: 'failed',
      notes: 'PayPal batch denied: ' + (payload.resource.batch_header.batch_status || 'Unknown reason'),
      updated_at: new Date().toISOString()
    })
    .eq('transaction_id', batchId)

  if (error) {
    console.error('Error updating failed batch:', error)
  }
}

async function handlePayoutItemSucceeded(supabase: any, payload: any) {
  console.log('Processing payout item succeeded')
  
  const payoutItem = payload.resource
  const payoutItemId = payoutItem.payout_item_id
  const transactionId = payoutItem.transaction_id
  
  console.log('Payout item details:', {
    payout_item_id: payoutItemId,
    transaction_id: transactionId,
    amount: payoutItem.payout_item.amount?.value,
    recipient_email: payoutItem.payout_item.receiver
  })

  // Find the payout record by transaction_id or payout_item_id
  const { data: payouts, error: fetchError } = await supabase
    .from('payouts')
    .select('*')
    .or(`transaction_id.eq.${transactionId},transaction_id.eq.${payoutItemId}`)
    .limit(1)

  if (fetchError) {
    console.error('Error fetching payout:', fetchError)
    return
  }

  if (!payouts || payouts.length === 0) {
    console.error('No payout found for transaction_id:', transactionId, 'or payout_item_id:', payoutItemId)
    return
  }

  const payout = payouts[0]
  
  // Update payout status to completed
  const { error: updateError } = await supabase
    .from('payouts')
    .update({
      status: 'completed',
      completed_date: new Date().toISOString(),
      transaction_id: transactionId, // Update with actual PayPal transaction ID
      notes: 'PayPal payout completed successfully',
      updated_at: new Date().toISOString()
    })
    .eq('id', payout.id)

  if (updateError) {
    console.error('Error updating payout status:', updateError)
    return
  }

  // Update corresponding commission records to mark as paid
  const { error: commissionError } = await supabase
    .from('multi_level_commissions')
    .update({
      paid_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('earning_affiliate_id', payout.affiliate_id)
    .is('paid_date', null) // Only update unpaid commissions
    .eq('status', 'approved')

  if (commissionError) {
    console.error('Error updating commission paid_date:', commissionError)
  } else {
    console.log('Successfully marked commissions as paid for affiliate:', payout.affiliate_id)
  }
}

async function handlePayoutItemFailed(supabase: any, payload: any) {
  console.log('Processing payout item failed')
  
  const payoutItem = payload.resource
  const payoutItemId = payoutItem.payout_item_id
  const transactionId = payoutItem.transaction_id
  
  // Find the payout record
  const { data: payouts, error: fetchError } = await supabase
    .from('payouts')
    .select('*')
    .or(`transaction_id.eq.${transactionId},transaction_id.eq.${payoutItemId}`)
    .limit(1)

  if (fetchError || !payouts || payouts.length === 0) {
    console.error('Error finding payout for failed item:', fetchError)
    return
  }

  const payout = payouts[0]
  
  // Update payout status to failed
  const { error: updateError } = await supabase
    .from('payouts')
    .update({
      status: 'failed',
      notes: 'PayPal payout failed: ' + (payoutItem.errors?.[0]?.message || 'Unknown error'),
      updated_at: new Date().toISOString()
    })
    .eq('id', payout.id)

  if (updateError) {
    console.error('Error updating failed payout:', updateError)
  }
}

async function handlePayoutItemDenied(supabase: any, payload: any) {
  console.log('Processing payout item denied')
  
  // Similar to failed, but for denied items
  await handlePayoutItemFailed(supabase, payload)
} 