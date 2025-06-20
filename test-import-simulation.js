// Test script to simulate the import process with actual GoAffPro data
const mockAffiliateData = [
  {
    "id": 17889903,
    "email": "galelynn13@gmail.com",
    "first_name": "",
    "last_name": "",
    "phone": null,
    "address": null,
    "status": "approved",
    "tags": []
  },
  {
    "id": 17889904,
    "email": "test@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "address": {"street": "123 Main St", "city": "Anytown"},
    "status": "pending",
    "tags": ["influencer", "social-media"]
  }
];

function simulateImportProcess() {
  console.log('Simulating GoAffPro import process...\n');
  
  let recordsProcessed = 0;
  let recordsSuccessful = 0;
  let recordsFailed = 0;
  let errors = [];

  for (const affiliate of mockAffiliateData) {
    recordsProcessed++;
    
    try {
      // Skip empty affiliate objects (this was the original issue)
      if (!affiliate.id && !affiliate.email) {
        console.log('Skipping empty affiliate object:', affiliate);
        recordsFailed++;
        errors.push('Skipped empty affiliate object');
        continue;
      }

      // Simulate the data transformation that happens in the import service
      const affiliateData = {
        goaffpro_id: affiliate.id ? String(affiliate.id) : `empty_${Date.now()}_${Math.random()}`,
        email: affiliate.email || 'unknown@example.com',
        first_name: affiliate.first_name || null,
        last_name: affiliate.last_name || null,
        phone: affiliate.phone || null,
        address: affiliate.address || null,
        status: affiliate.status || null,
        signup_date: affiliate.signup_date ? new Date(affiliate.signup_date).toISOString() : null,
        referral_code: affiliate.referral_code || null,
        commission_rate: affiliate.commission_rate || null,
        balance: affiliate.balance || 0,
        total_earnings: affiliate.total_earnings || 0,
        total_orders: affiliate.total_orders || 0,
        tags: affiliate.tags || null,
        custom_fields: affiliate.custom_fields || null,
        raw_data: affiliate,
        data_source: 'goaffpro'
      };

      console.log(`Processing affiliate ${affiliate.id}:`);
      console.log('  - GoAffPro ID:', affiliateData.goaffpro_id);
      console.log('  - Email:', affiliateData.email);
      console.log('  - Name:', `${affiliateData.first_name || ''} ${affiliateData.last_name || ''}`.trim() || 'N/A');
      console.log('  - Status:', affiliateData.status);
      console.log('  - Tags:', affiliateData.tags);
      console.log('  - Raw data keys:', Object.keys(affiliate));
      console.log('');

      // Simulate successful database insert
      recordsSuccessful++;
      
    } catch (error) {
      console.error('Processing error for affiliate:', error);
      errors.push(`Affiliate ${affiliate.id}: ${error.message}`);
      recordsFailed++;
    }
  }

  const result = {
    success: recordsFailed === 0,
    recordsProcessed,
    recordsSuccessful,
    recordsFailed,
    errors
  };

  console.log('Import simulation results:');
  console.log('  - Records processed:', result.recordsProcessed);
  console.log('  - Records successful:', result.recordsSuccessful);
  console.log('  - Records failed:', result.recordsFailed);
  console.log('  - Success:', result.success);
  console.log('  - Errors:', result.errors);

  return result;
}

// Test with empty objects (the original problem)
console.log('=== Testing with empty objects (original problem) ===');
const emptyAffiliates = [{}, {}, {}];
let emptyResult = { recordsProcessed: 0, recordsSuccessful: 0, recordsFailed: 0, errors: [] };

for (const affiliate of emptyAffiliates) {
  emptyResult.recordsProcessed++;
  
  if (!affiliate.id && !affiliate.email) {
    console.log('Skipping empty affiliate object:', affiliate);
    emptyResult.recordsFailed++;
    emptyResult.errors.push('Skipped empty affiliate object');
    continue;
  }
  
  emptyResult.recordsSuccessful++;
}

console.log('Empty objects result:', emptyResult);
console.log('');

// Test with actual data
console.log('=== Testing with actual data (after fix) ===');
simulateImportProcess(); 