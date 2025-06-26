import { SupabaseClient } from '@supabase/supabase-js';

export interface PerformanceLevelCalculationResult {
  processedCount: number;
  monthKey: string;
  errors: string[];
  calculatedAt: string;
}

export class PerformanceLevelCalculator {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Main function to run monthly performance level calculations
   * Should be scheduled to run on the 1st of each month
   */
  async calculateMonthlyPerformanceLevels(): Promise<PerformanceLevelCalculationResult> {
    console.log('🔄 Starting monthly performance level calculation...');
    
    const errors: string[] = [];
    const calculatedAt = new Date().toISOString();
    
    try {
      // Run the database function
      const { data, error } = await this.supabase
        .rpc('recalculate_monthly_performance_levels');

      if (error) {
        console.error('❌ Error running performance calculation:', error);
        errors.push(`Database calculation failed: ${error.message}`);
        return {
          processedCount: 0,
          monthKey: this.getCurrentMonthKey(),
          errors,
          calculatedAt
        };
      }

      const result = Array.isArray(data) ? data[0] : data;
      console.log('✅ Performance calculation completed:', result);

      return {
        processedCount: result?.processed_count || 0,
        monthKey: result?.month_key || this.getCurrentMonthKey(),
        errors,
        calculatedAt
      };

    } catch (error) {
      console.error('❌ Unexpected error in performance calculation:', error);
      errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      return {
        processedCount: 0,
        monthKey: this.getCurrentMonthKey(),
        errors,
        calculatedAt
      };
    }
  }

  /**
   * Get performance level for a specific monthly earnings amount
   */
  static getPerformanceLevel(monthlyEarnings: number): string {
    if (monthlyEarnings >= 1000000) return 'Sovereign';
    if (monthlyEarnings >= 500000) return 'Oracle';
    if (monthlyEarnings >= 100000) return 'Visionary';
    if (monthlyEarnings >= 50000) return 'Luminary';
    if (monthlyEarnings >= 25000) return 'Magnetic';
    if (monthlyEarnings >= 5000) return 'Ascended';
    if (monthlyEarnings >= 1000) return 'Activated';
    return 'Aligned';
  }

  /**
   * Get performance level details including thresholds and descriptions
   */
  static getPerformanceLevelDetails() {
    return {
      'Aligned': { min: 0, max: 999, description: 'Entry Level - You\'ve tuned in and taken aligned action' },
      'Activated': { min: 1000, max: 4999, description: 'Building Momentum - Your energy is moving — you\'re becoming magnetic' },
      'Ascended': { min: 5000, max: 9999, description: 'Growing Impact - Your impact is rising and your influence expanding' },
      'Magnetic': { min: 25000, max: 49999, description: 'Strong Performance - You\'re pulling in abundance through pure alignment' },
      'Luminary': { min: 50000, max: 99999, description: 'Community Leader - You\'re a beacon of light in the community' },
      'Visionary': { min: 100000, max: 499999, description: 'Leader of Leaders - You\'ve become a leader of leaders with a big vision' },
      'Oracle': { min: 500000, max: 999999, description: 'Wisdom and Results - Wisdom radiates from your results' },
      'Sovereign': { min: 1000000, max: Infinity, description: 'Ultimate Mastery - You embody mastery, legacy, and divine authority' }
    };
  }

  /**
   * Get current month key in YYYY-MM format
   */
  private getCurrentMonthKey(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Get monthly earnings history for an affiliate
   */
  async getAffiliateMonthlyHistory(email: string, months: number = 12): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('monthly_affiliate_earnings')
      .select('*')
      .eq('affiliate_email', email)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(months);

    if (error) {
      console.error('❌ Error fetching monthly history:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get performance level statistics for current month
   */
  async getCurrentMonthStats() {
    const monthKey = this.getCurrentMonthKey();
    
    const { data, error } = await this.supabase
      .from('monthly_affiliate_earnings')
      .select('performance_level')
      .eq('month_key', monthKey);

    if (error) {
      console.error('❌ Error fetching month stats:', error);
      return {};
    }

    // Manual grouping since Supabase client doesn't support GROUP BY directly
    const stats: Record<string, number> = {};
    data?.forEach((row: any) => {
      const level = row.performance_level;
      stats[level] = (stats[level] || 0) + 1;
    });

    return stats;
  }

  /**
   * Manual recalculation for a specific affiliate (for testing)
   */
  async recalculateAffiliateLevel(email: string, source: string): Promise<string> {
    try {
      // Get current earnings for this affiliate
      let earnings = 0;
      
      switch (source) {
        case 'goaffpro':
          const { data: goaffproData } = await this.supabase
            .from('goaffpro_affiliates')
            .select('total_earnings')
            .eq('email', email)
            .single();
          earnings = goaffproData?.total_earnings || 0;
          break;
          
        case 'mightynetworks':
          const { data: mightyData } = await this.supabase
            .from('mightynetworks_affiliates')
            .select('total_earnings')
            .eq('email', email)
            .single();
          earnings = mightyData?.total_earnings || 0;
          break;
          
        case 'ghl':
        case 'native':
          const { data: systemData } = await this.supabase
            .from('affiliate_system_users')
            .select('total_earnings')
            .eq('email', email)
            .single();
          earnings = systemData?.total_earnings || 0;
          break;
      }

      const newLevel = PerformanceLevelCalculator.getPerformanceLevel(earnings);
      console.log(`✅ Calculated level for ${email}: ${newLevel} (${earnings} earnings)`);
      
      return newLevel;
    } catch (error) {
      console.error('❌ Error recalculating affiliate level:', error);
      return 'Aligned';
    }
  }
} 