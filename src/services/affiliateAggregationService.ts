import { SupabaseClient } from '@supabase/supabase-js';

export interface AggregatedAffiliate {
  id: string;
  name: string;
  email: string;
  source: 'goaffpro' | 'mightynetworks' | 'native' | 'ghl';
  level: string;
  referrals: number;
  commission: string;
  dateJoined: string;
  status: 'Active' | 'Pending' | 'Inactive';
  originalData?: Record<string, unknown>;
}

export class AffiliateAggregationService {
  constructor(private supabase: SupabaseClient) {
    console.log('🔧 AffiliateAggregationService: Constructor called with supabase client');
  }

  async getAllAffiliates(): Promise<AggregatedAffiliate[]> {
    console.log('🔍 AffiliateAggregationService: Starting getAllAffiliates...');
    
    const affiliates: AggregatedAffiliate[] = [];

    try {
      // Get GoAffPro affiliates
      console.log('📊 Fetching ReAction affiliates...');
      const goaffproAffiliates = await this.getGoAffProAffiliates();
      console.log(`✅ Found ${goaffproAffiliates.length} ReAction affiliates`);
      affiliates.push(...goaffproAffiliates);

      // Get MightyNetworks affiliates (placeholder for future implementation)
      console.log('📊 Fetching The RISE affiliates...');
      const mightyNetworksAffiliates = await this.getMightyNetworksAffiliates();
      console.log(`✅ Found ${mightyNetworksAffiliates.length} The RISE affiliates`);
      affiliates.push(...mightyNetworksAffiliates);

      // Get GHL affiliates
      console.log('📊 Fetching GHL affiliates...');
      const ghlAffiliates = await this.getGHLAffiliates();
      console.log(`✅ Found ${ghlAffiliates.length} GHL affiliates`);
      affiliates.push(...ghlAffiliates);

      // Get native platform affiliates
      console.log('📊 Fetching JennaZ.co affiliates...');
      const nativeAffiliates = await this.getNativeAffiliates();
      console.log(`✅ Found ${nativeAffiliates.length} JennaZ.co affiliates`);
      affiliates.push(...nativeAffiliates);

      console.log(`🎉 Total aggregated affiliates: ${affiliates.length}`);
      console.log('🎉 Sample affiliate data:', affiliates.length > 0 ? affiliates[0] : 'none');
      return affiliates;
    } catch (error) {
      console.error('❌ Error aggregating affiliates:', error);
      throw error;
    }
  }

  private async getGoAffProAffiliates(): Promise<AggregatedAffiliate[]> {
    try {
      console.log('🔍 Querying goaffpro_affiliates table...');
      const { data: goaffproData, error } = await this.supabase
        .from('goaffpro_affiliates')
        .select('*')
        .eq('data_source', 'goaffpro');

      if (error) {
        console.error('❌ Error fetching ReAction affiliates:', error);
        console.error('❌ Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        return [];
      }

      console.log(`📊 Raw ReAction data: ${goaffproData?.length || 0} records`);
      if (goaffproData && goaffproData.length > 0) {
        console.log('Sample raw record:', goaffproData[0]);
      }

      const processed = (goaffproData || []).map(affiliate => {
        // Handle name with better fallbacks
        let displayName = 'Unknown';
        if (affiliate.first_name && affiliate.last_name && 
            affiliate.first_name !== 'null' && affiliate.last_name !== 'null') {
          displayName = `${affiliate.first_name} ${affiliate.last_name}`.trim();
        } else if (affiliate.first_name && affiliate.first_name !== 'null') {
          displayName = affiliate.first_name;
        } else if (affiliate.last_name && affiliate.last_name !== 'null') {
          displayName = affiliate.last_name;
        } else if (affiliate.email) {
          // Use email username as fallback
          displayName = affiliate.email.split('@')[0];
        }

        // Handle date with better fallbacks
        let joinDate = new Date(affiliate.created_at).toISOString().split('T')[0];
        if (affiliate.signup_date) {
          joinDate = new Date(affiliate.signup_date).toISOString().split('T')[0];
        }

        const aggregated = {
          id: `goaffpro_${affiliate.id}`,
          name: displayName,
          email: affiliate.email,
          source: 'goaffpro' as const,
          level: affiliate.current_performance_level || 'Aligned',
          referrals: affiliate.total_orders || 0,
          commission: `$${(affiliate.total_earnings || 0).toFixed(2)}`,
          dateJoined: joinDate,
          status: this.mapGoAffProStatus(affiliate.status),
          originalData: affiliate
        };
        console.log('Processed affiliate:', aggregated);
        return aggregated;
      });

      console.log(`✅ Processed ${processed.length} ReAction affiliates`);
      return processed;
    } catch (error) {
      console.error('❌ Error processing ReAction affiliates:', error);
      return [];
    }
  }

  private async getMightyNetworksAffiliates(): Promise<AggregatedAffiliate[]> {
    try {
      console.log('🔍 Querying mightynetworks_affiliates table...');
      const { data: mightyData, error } = await this.supabase
        .from('mightynetworks_affiliates')
        .select('*')
        .eq('data_source', 'mightynetworks');

      // If table doesn't exist, return empty array silently
      if (error && error.code === '42P01') {
        console.log('ℹ️ The RISE table does not exist yet');
        return [];
      }

      if (error) {
        console.error('❌ Error fetching The RISE affiliates:', error);
        return [];
      }

      console.log(`📊 Raw The RISE data: ${mightyData?.length || 0} records`);
      if (mightyData && mightyData.length > 0) {
        console.log('Sample raw The RISE record:', mightyData[0]);
      }

      const processed = (mightyData || []).map(affiliate => {
        // Handle name with better fallbacks
        let displayName = 'Unknown';
        if (affiliate.name && affiliate.name !== 'null') {
          displayName = affiliate.name;
        } else if (affiliate.first_name && affiliate.last_name && 
                   affiliate.first_name !== 'null' && affiliate.last_name !== 'null') {
          displayName = `${affiliate.first_name} ${affiliate.last_name}`.trim();
        } else if (affiliate.first_name && affiliate.first_name !== 'null') {
          displayName = affiliate.first_name;
        } else if (affiliate.last_name && affiliate.last_name !== 'null') {
          displayName = affiliate.last_name;
        } else if (affiliate.email) {
          // Use email username as fallback
          displayName = affiliate.email.split('@')[0];
        }

        // Handle date with better fallbacks
        let joinDate = new Date(affiliate.created_at).toISOString().split('T')[0];
        if (affiliate.signup_date) {
          joinDate = new Date(affiliate.signup_date).toISOString().split('T')[0];
        }

        const aggregated = {
          id: `mighty_${affiliate.id}`,
          name: displayName,
          email: affiliate.email,
          source: 'mightynetworks' as const,
          level: affiliate.current_performance_level || 'Aligned',
          referrals: affiliate.total_referrals || 0,
          commission: `$${(affiliate.total_earnings || 0).toFixed(2)}`,
          dateJoined: joinDate,
          status: this.mapMightyNetworksStatus(affiliate.status),
          originalData: affiliate
        };
        console.log('Processed The RISE affiliate:', aggregated);
        return aggregated;
      });

      console.log(`✅ Processed ${processed.length} The RISE affiliates`);
      return processed;
    } catch (error) {
      console.error('❌ Error processing The RISE affiliates:', error);
      // Table doesn't exist yet, return empty array silently
      return [];
    }
  }

  private async getGHLAffiliates(): Promise<AggregatedAffiliate[]> {
    try {
      console.log('🔍 Querying affiliate_system_users table for GHL affiliates...');
      
      // Try the query with error handling for RLS policy issues
      // Use 'GHL' (uppercase) to match the database constraint
      const { data: ghlData, error } = await this.supabase
        .from('affiliate_system_users')
        .select('*')
        .eq('primary_source', 'GHL');

      if (error) {
        console.error('❌ Error fetching GHL affiliates:', error);
        console.error('❌ Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // If it's an infinite recursion error, return empty array and log warning
        if (error.code === '42P17') {
          console.warn('⚠️ Infinite recursion detected in RLS policy. Please run the fix-rls-policies.sql script to resolve this issue.');
          console.warn('⚠️ Returning empty array for GHL affiliates until RLS policies are fixed.');
          return [];
        }
        
        return [];
      }

      console.log(`📊 Raw GHL data: ${ghlData?.length || 0} records`);
      if (ghlData && ghlData.length > 0) {
        console.log('Sample raw GHL record:', ghlData[0]);
      }

      const processed = (ghlData || []).map(affiliate => {
        // Handle name with better fallbacks
        let displayName = 'Unknown';
        if (affiliate.first_name && affiliate.last_name && 
            affiliate.first_name !== 'null' && affiliate.last_name !== 'null') {
          displayName = `${affiliate.first_name} ${affiliate.last_name}`.trim();
        } else if (affiliate.first_name && affiliate.first_name !== 'null') {
          displayName = affiliate.first_name;
        } else if (affiliate.last_name && affiliate.last_name !== 'null') {
          displayName = affiliate.last_name;
        } else if (affiliate.email) {
          // Use email username as fallback
          displayName = affiliate.email.split('@')[0];
        }

        // Handle date with better fallbacks
        let joinDate = new Date().toISOString().split('T')[0]; // Default to today
        if (affiliate.signup_date) {
          joinDate = new Date(affiliate.signup_date).toISOString().split('T')[0];
        } else if (affiliate.created_at) {
          joinDate = new Date(affiliate.created_at).toISOString().split('T')[0];
        }

        const aggregated = {
          id: `ghl_${affiliate.id}`,
          name: displayName,
          email: affiliate.email,
          source: 'ghl' as const, // Use 'ghl' as its own source instead of mapping to 'native'
          level: affiliate.current_performance_level || 'Aligned',
          referrals: affiliate.total_team_size || 0, // Use team size as referrals
          commission: `$${(affiliate.total_earnings || 0).toFixed(2)}`,
          dateJoined: joinDate,
          status: this.mapGHLStatus(affiliate.status),
          originalData: affiliate
        };
        console.log('Processed GHL affiliate:', aggregated);
        return aggregated;
      });

      console.log(`✅ Processed ${processed.length} GHL affiliates`);
      return processed;
    } catch (error) {
      console.error('❌ Error processing GHL affiliates:', error);
      console.warn('⚠️ This might be due to RLS policy issues. Please check the database policies.');
      return [];
    }
  }

  private async getNativeAffiliates(): Promise<AggregatedAffiliate[]> {
    try {
      console.log('🔍 Querying users table with affiliates relationship...');
      
      const { data: nativeData, error } = await this.supabase
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
        .not('data_source', 'eq', 'test'); // Exclude test data

      if (error) {
        console.error('❌ Error fetching native affiliates:', error);
        console.error('❌ Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // Handle infinite recursion errors specifically
        if (error.code === '42P17') {
          console.warn('⚠️ Infinite recursion detected in RLS policy for users table.');
          console.warn('⚠️ This is a database configuration issue that needs to be fixed.');
          console.warn('⚠️ Returning empty array for native affiliates until RLS policies are fixed.');
          return [];
        }
        
        // Handle permission errors gracefully
        if (error.code === '42501') {
          console.warn('⚠️ Permission denied for users table. This might be due to RLS policies.');
          console.warn('⚠️ Returning empty array for native affiliates until permissions are fixed.');
          return [];
        }
        
        // Handle any other database errors
        console.warn('⚠️ Database error occurred. Returning empty array for native affiliates.');
        return [];
      }

      console.log(`📊 Raw native data: ${nativeData?.length || 0} records`);

      return (nativeData || [])
        .filter(user => user.affiliates && user.affiliates.length > 0)
        .map(user => ({
          id: `native_${user.id}`,
          name: user.full_name || user.email?.split('@')[0] || 'Unknown',
          email: user.email || '',
          source: 'native' as const,
          level: user.current_performance_level || 'Aligned',
          referrals: 0, // TODO: Calculate from referrals table
          commission: '$0.00', // TODO: Calculate from commissions
          dateJoined: new Date(user.affiliates[0]?.created_at || user.created_at).toISOString().split('T')[0],
          status: this.mapNativeStatus(user.affiliates[0]?.status || 'pending'),
          originalData: user
        }));
    } catch (error) {
      console.error('❌ Error processing native affiliates:', error);
      console.warn('⚠️ This might be due to RLS policy issues or missing permissions.');
      return [];
    }
  }

  private mapGoAffProStatus(status: string): 'Active' | 'Pending' | 'Inactive' {
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

  private mapMightyNetworksStatus(status: string): 'Active' | 'Pending' | 'Inactive' {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'approved':
        return 'Active';
      case 'pending':
        return 'Pending';
      case 'inactive':
      case 'suspended':
        return 'Inactive';
      default:
        return 'Pending';
    }
  }

  private mapNativeStatus(status: string): 'Active' | 'Pending' | 'Inactive' {
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

  private mapGHLStatus(status: string): 'Active' | 'Pending' | 'Inactive' {
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

  async getAffiliatesBySource(source: 'goaffpro' | 'mightynetworks' | 'native' | 'ghl'): Promise<AggregatedAffiliate[]> {
    const allAffiliates = await this.getAllAffiliates();
    return allAffiliates.filter(affiliate => affiliate.source === source);
  }

  async getAffiliateStats() {
    const allAffiliates = await this.getAllAffiliates();
    
    const stats = {
      total: allAffiliates.length,
      active: allAffiliates.filter(a => a.status === 'Active').length,
      pending: allAffiliates.filter(a => a.status === 'Pending').length,
      inactive: allAffiliates.filter(a => a.status === 'Inactive').length,
      bySource: {
        goaffpro: allAffiliates.filter(a => a.source === 'goaffpro').length,
        mightynetworks: allAffiliates.filter(a => a.source === 'mightynetworks').length,
        native: allAffiliates.filter(a => a.source === 'native').length,
        ghl: allAffiliates.filter(a => a.source === 'ghl').length
      }
    };

    return stats;
  }

  async getUserAffiliateData(userEmail: string): Promise<AggregatedAffiliate[]> {
    console.log('🔍 AffiliateAggregationService: Starting getUserAffiliateData for:', userEmail);
    
    const affiliates: AggregatedAffiliate[] = [];

    try {
      // Search in GoAffPro affiliates
      console.log('📊 Searching for user in ReAction affiliates...');
      const goaffproAffiliates = await this.getGoAffProAffiliateByEmail(userEmail);
      if (goaffproAffiliates.length > 0) {
        console.log(`✅ Found user in ReAction affiliates`);
        affiliates.push(...goaffproAffiliates);
      }

      // Search in MightyNetworks affiliates
      console.log('📊 Searching for user in The RISE affiliates...');
      const mightyNetworksAffiliates = await this.getMightyNetworksAffiliateByEmail(userEmail);
      if (mightyNetworksAffiliates.length > 0) {
        console.log(`✅ Found user in The RISE affiliates`);
        affiliates.push(...mightyNetworksAffiliates);
      }

      // Search in GHL affiliates
      console.log('📊 Searching for user in GHL affiliates...');
      const ghlAffiliates = await this.getGHLAffiliateByEmail(userEmail);
      if (ghlAffiliates.length > 0) {
        console.log(`✅ Found user in GHL affiliates`);
        affiliates.push(...ghlAffiliates);
      }

      // Search in native platform affiliates
      console.log('📊 Searching for user in JennaZ.co affiliates...');
      const nativeAffiliates = await this.getNativeAffiliateByEmail(userEmail);
      if (nativeAffiliates.length > 0) {
        console.log(`✅ Found user in JennaZ.co affiliates`);
        affiliates.push(...nativeAffiliates);
      }

      console.log(`🎉 Total user affiliates found: ${affiliates.length}`);
      return affiliates;
    } catch (error) {
      console.error('❌ Error getting user affiliate data:', error);
      throw error;
    }
  }

  private async getGoAffProAffiliateByEmail(email: string): Promise<AggregatedAffiliate[]> {
    try {
      console.log('🔍 Querying goaffpro_affiliates table for email:', email);
      const { data: goaffproData, error } = await this.supabase
        .from('goaffpro_affiliates')
        .select('*')
        .eq('data_source', 'goaffpro')
        .eq('email', email);

      if (error) {
        console.error('❌ Error fetching ReAction affiliate by email:', error);
        return [];
      }

      if (!goaffproData || goaffproData.length === 0) {
        console.log('ℹ️ No ReAction affiliate found for email:', email);
        return [];
      }

      return goaffproData.map(affiliate => {
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
          source: 'goaffpro' as const,
          level: affiliate.current_performance_level || 'Aligned',
          referrals: affiliate.total_orders || 0,
          commission: `$${(affiliate.total_earnings || 0).toFixed(2)}`,
          dateJoined: joinDate,
          status: this.mapGoAffProStatus(affiliate.status),
          originalData: affiliate
        };
      });
    } catch (error) {
      console.error('❌ Error processing ReAction affiliate by email:', error);
      return [];
    }
  }

  private async getMightyNetworksAffiliateByEmail(email: string): Promise<AggregatedAffiliate[]> {
    try {
      console.log('🔍 Querying mightynetworks_affiliates table for email:', email);
      const { data: mightyData, error } = await this.supabase
        .from('mightynetworks_affiliates')
        .select('*')
        .eq('data_source', 'mightynetworks')
        .eq('email', email);

      if (error && error.code === '42P01') {
        console.log('ℹ️ The RISE table does not exist yet');
        return [];
      }

      if (error) {
        console.error('❌ Error fetching The RISE affiliate by email:', error);
        return [];
      }

      if (!mightyData || mightyData.length === 0) {
        console.log('ℹ️ No The RISE affiliate found for email:', email);
        return [];
      }

      return mightyData.map(affiliate => {
        let displayName = 'Unknown';
        if (affiliate.name && affiliate.name !== 'null') {
          displayName = affiliate.name;
        } else if (affiliate.first_name && affiliate.last_name && 
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
          id: `mighty_${affiliate.id}`,
          name: displayName,
          email: affiliate.email,
          source: 'mightynetworks' as const,
          level: affiliate.current_performance_level || 'Aligned',
          referrals: affiliate.total_referrals || 0,
          commission: `$${(affiliate.total_earnings || 0).toFixed(2)}`,
          dateJoined: joinDate,
          status: this.mapMightyNetworksStatus(affiliate.status),
          originalData: affiliate
        };
      });
    } catch (error) {
      console.error('❌ Error processing The RISE affiliate by email:', error);
      return [];
    }
  }

  private async getGHLAffiliateByEmail(email: string): Promise<AggregatedAffiliate[]> {
    try {
      console.log('🔍 Querying affiliate_system_users table for GHL affiliate with email:', email);
      const { data: ghlData, error } = await this.supabase
        .from('affiliate_system_users')
        .select('*')
        .eq('primary_source', 'GHL') // Use 'GHL' (uppercase)
        .eq('email', email);

      if (error) {
        console.error('❌ Error fetching GHL affiliate by email:', error);
        return [];
      }

      if (!ghlData || ghlData.length === 0) {
        console.log('ℹ️ No GHL affiliate found for email:', email);
        return [];
      }

      return ghlData.map(affiliate => {
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

        let joinDate = new Date().toISOString().split('T')[0];
        if (affiliate.signup_date) {
          joinDate = new Date(affiliate.signup_date).toISOString().split('T')[0];
        } else if (affiliate.created_at) {
          joinDate = new Date(affiliate.created_at).toISOString().split('T')[0];
        }

        return {
          id: `ghl_${affiliate.id}`,
          name: displayName,
          email: affiliate.email,
          source: 'ghl' as const,
          level: affiliate.current_performance_level || 'Aligned',
          referrals: affiliate.total_team_size || 0,
          commission: `$${(affiliate.total_earnings || 0).toFixed(2)}`,
          dateJoined: joinDate,
          status: this.mapGHLStatus(affiliate.status),
          originalData: affiliate
        };
      });
    } catch (error) {
      console.error('❌ Error processing GHL affiliate by email:', error);
      return [];
    }
  }

  private async getNativeAffiliateByEmail(email: string): Promise<AggregatedAffiliate[]> {
    try {
      console.log('🔍 Querying affiliate_system_users table for native email:', email);
      const { data: nativeData, error } = await this.supabase
        .from('affiliate_system_users')
        .select('*')
        .in('primary_source', ['manual'])
        .eq('email', email);

      if (error) {
        console.error('❌ Error fetching native affiliate by email:', error);
        return [];
      }

      if (!nativeData || nativeData.length === 0) {
        console.log('ℹ️ No native affiliate found for email:', email);
        return [];
      }

      return nativeData.map(affiliate => {
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

        let joinDate = new Date().toISOString().split('T')[0];
        if (affiliate.signup_date) {
          joinDate = new Date(affiliate.signup_date).toISOString().split('T')[0];
        } else if (affiliate.created_at) {
          joinDate = new Date(affiliate.created_at).toISOString().split('T')[0];
        }

        return {
          id: `native_${affiliate.id}`,
          name: displayName,
          email: affiliate.email,
          source: 'native' as const,
          level: affiliate.current_performance_level || 'Aligned',
          referrals: affiliate.total_team_size || 0,
          commission: `$${(affiliate.total_earnings || 0).toFixed(2)}`,
          dateJoined: joinDate,
          status: this.mapNativeStatus(affiliate.status),
          originalData: affiliate
        };
      });
    } catch (error) {
      console.error('❌ Error processing native affiliate by email:', error);
      return [];
    }
  }
} 