// Test script to simulate page loading behavior
import { createClient } from '@supabase/supabase-js';

const supabaseConfig = {
  url: 'http://localhost:54321',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

// Simulate AffiliateAggregationService behavior
class TestAggregationService {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  async getGoAffProAffiliates() {
    console.log('🔍 Querying goaffpro_affiliates table...');
    const { data: goaffproData, error } = await this.supabase
      .from('goaffpro_affiliates')
      .select('*')
      .eq('data_source', 'goaffpro');

    if (error) {
      console.error('❌ Error fetching GoAffPro affiliates:', error);
      return [];
    }

    console.log(`📊 Raw GoAffPro data: ${goaffproData?.length || 0} records`);
    return goaffproData || [];
  }

  async getAllAffiliates() {
    try {
      console.log('🚀 Starting getAllAffiliates...');
      
      const [goaffproAffiliates, mightyAffiliates, nativeAffiliates] = await Promise.all([
        this.getGoAffProAffiliates(),
        this.getMightyNetworksAffiliates(),
        this.getNativeAffiliates()
      ]);

      console.log(`📊 Data sources loaded:
        - GoAffPro: ${goaffproAffiliates.length}
        - MightyNetworks: ${mightyAffiliates.length}
        - Native: ${nativeAffiliates.length}`);

      const allAffiliates = [
        ...goaffproAffiliates.map(affiliate => this.processGoAffProAffiliate(affiliate)),
        ...mightyAffiliates,
        ...nativeAffiliates
      ];

      console.log(`✅ Total aggregated affiliates: ${allAffiliates.length}`);
      return allAffiliates;
    } catch (error) {
      console.error('❌ Error in getAllAffiliates:', error);
      throw error;
    }
  }

  async getMightyNetworksAffiliates() {
    try {
      const { data: mightyData } = await this.supabase
        .from('mightynetworks_affiliates')
        .select('*')
        .eq('data_source', 'mightynetworks');
      return mightyData || [];
    } catch (error) {
      // Table doesn't exist yet, return empty array
      return [];
    }
  }

  async getNativeAffiliates() {
    try {
      const { data: nativeData } = await this.supabase
        .from('users')
        .select(`
          *,
          affiliates!affiliates_affiliate_id_fkey(
            level,
            commission_rate,
            status,
            created_at
          )
        `)
        .not('data_source', 'eq', 'test');

      return (nativeData || [])
        .filter(user => user.affiliates && user.affiliates.length > 0)
        .map(user => {
          const affiliate = user.affiliates[0];
          return {
            id: `native_${user.id}`,
            name: user.name || 'Unknown',
            email: user.email,
            source: 'native',
            level: `Level ${affiliate.level}`,
            referrals: 0,
            commission: '$0.00',
            dateJoined: new Date(affiliate.created_at).toISOString().split('T')[0],
            status: this.mapNativeStatus(affiliate.status),
            originalData: { user, affiliate }
          };
        });
    } catch (error) {
      console.error('Error processing native affiliates:', error);
      return [];
    }
  }

  processGoAffProAffiliate(affiliate) {
    let displayName = 'Unknown';
    if (affiliate.first_name && affiliate.last_name && 
        affiliate.first_name !== 'null' && affiliate.last_name !== 'null') {
      displayName = `${affiliate.first_name} ${affiliate.last_name}`.trim();
    } else if (affiliate.first_name && affiliate.first_name !== 'null') {
      displayName = affiliate.first_name;
    } else if (affiliate.last_name && affiliate.last_name !== 'null') {
      displayName = affiliate.last_name;
    } else if (affiliate.email) {
      displayName = affiliate.email.split('@')[0];
    }

    let joinDate = new Date(affiliate.created_at).toISOString().split('T')[0];
    if (affiliate.signup_date) {
      joinDate = new Date(affiliate.signup_date).toISOString().split('T')[0];
    }

    return {
      id: `goaffpro_${affiliate.id}`,
      name: displayName,
      email: affiliate.email,
      source: 'goaffpro',
      level: 'GoAffPro',
      referrals: affiliate.total_orders || 0,
      commission: `$${(affiliate.total_earnings || 0).toFixed(2)}`,
      dateJoined: joinDate,
      status: this.mapGoAffProStatus(affiliate.status),
      originalData: affiliate
    };
  }

  mapGoAffProStatus(status) {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'Active';
      case 'pending':
      case 'review':
        return 'Pending';
      case 'rejected':
      case 'inactive':
      case 'suspended':
        return 'Inactive';
      default:
        return 'Pending';
    }
  }

  mapNativeStatus(status) {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Pending';
    }
  }

  async getAffiliateStats() {
    const allAffiliates = await this.getAllAffiliates();
    
    return {
      total: allAffiliates.length,
      active: allAffiliates.filter(a => a.status === 'Active').length,
      pending: allAffiliates.filter(a => a.status === 'Pending').length,
      inactive: allAffiliates.filter(a => a.status === 'Inactive').length,
      bySource: {
        goaffpro: allAffiliates.filter(a => a.source === 'goaffpro').length,
        mightynetworks: allAffiliates.filter(a => a.source === 'mightynetworks').length,
        native: allAffiliates.filter(a => a.source === 'native').length
      }
    };
  }
}

async function testPageLoading() {
  console.log('🧪 Testing page loading behavior...\n');
  
  try {
    const aggregationService = new TestAggregationService(supabase);
    
    console.log('⏱️ Starting loadAffiliates simulation...');
    const startTime = Date.now();
    
    const [affiliateData, statsData] = await Promise.all([
      aggregationService.getAllAffiliates(),
      aggregationService.getAffiliateStats()
    ]);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`\n⏱️ Load completed in ${duration}ms`);
    console.log(`📊 Results:
      - Affiliates loaded: ${affiliateData.length}
      - Stats: ${JSON.stringify(statsData, null, 2)}`);
    
    if (affiliateData.length > 0) {
      console.log('\n📋 Sample affiliate:');
      console.log(JSON.stringify(affiliateData[0], null, 2));
    }
    
    console.log('\n✅ Page loading test completed successfully!');
    
  } catch (error) {
    console.error('❌ Page loading test failed:', error);
  }
}

testPageLoading(); 