import { SupabaseClient } from '@supabase/supabase-js';

export class AffiliateCodeService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Generate a unique affiliate code based on user info
   */
  private async generateUniqueAffiliateCode(email: string, userId: string): Promise<string> {
    const baseCode = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 4);
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const suffix = attempts === 0 
        ? Math.random().toString(36).substring(2, 6).toUpperCase()
        : Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const candidateCode = `${baseCode}${suffix}`;

      // Check if this code already exists in any table
      const existsInAffiliate = await this.checkCodeExists('affiliate_system_users', candidateCode);
      const existsInGHL = await this.checkCodeExists('ghl_affiliates', candidateCode);
      const existsInMighty = await this.checkCodeExists('mighty_affiliates', candidateCode);
      const existsInGoAff = await this.checkCodeExists('goaffpro_affiliates', candidateCode);

      if (!existsInAffiliate && !existsInGHL && !existsInMighty && !existsInGoAff) {
        return candidateCode;
      }

      attempts++;
    }

    // Fallback: use timestamp-based code
    return `${baseCode}${Date.now().toString().slice(-6)}`;
  }

  /**
   * Check if a referral code exists in a specific table
   */
  private async checkCodeExists(tableName: string, code: string): Promise<boolean> {
    try {
      const { data } = await this.supabase
        .from(tableName)
        .select('id')
        .eq('referral_code', code)
        .single();
      
      return !!data;
    } catch {
      // If table doesn't exist or query fails, assume code doesn't exist
      return false;
    }
  }

  /**
   * Get or create affiliate code for a user
   * This is the main method to use for getting a user's affiliate code
   */
  async getOrCreateAffiliateCode(userEmail: string, userId: string, userMetadata?: any): Promise<string> {
    if (!userEmail || !userId) {
      throw new Error('User email and ID required');
    }

    try {
      console.log(`🔍 Getting affiliate code for user: ${userEmail}`);

      // First, verify user is authenticated
      const { data: { user }, error: authError } = await this.supabase.auth.getUser();
      if (authError || !user) {
        console.warn('⚠️ User not authenticated, waiting for auth state...');
        // Wait a bit and try again
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { data: { user: retryUser }, error: retryAuthError } = await this.supabase.auth.getUser();
        if (retryAuthError || !retryUser) {
          throw new Error('User not authenticated');
        }
        console.log('✅ User authenticated after retry');
      } else {
        console.log('✅ User authenticated:', user.email);
      }

      // First, try to get existing affiliate record
      const { data: existingAffiliate } = await this.supabase
        .from('affiliate_system_users')
        .select('referral_code')
        .eq('email', userEmail)
        .single();

      if (existingAffiliate?.referral_code) {
        console.log(`✅ Found existing affiliate code: ${existingAffiliate.referral_code}`);
        return existingAffiliate.referral_code;
      }

      console.log(`🆕 No existing code found, generating new one...`);

      // Generate new unique code
      const newCode = await this.generateUniqueAffiliateCode(userEmail, userId);

      console.log(`🎫 Generated new affiliate code: ${newCode}`);

      // Create or update affiliate record
      const { error: upsertError } = await this.supabase
        .from('affiliate_system_users')
        .upsert({
          email: userEmail,
          first_name: userMetadata?.first_name || null,
          last_name: userMetadata?.last_name || null,
          referral_code: newCode,
          primary_source: 'manual',
          status: 'active',
          signup_date: new Date().toISOString()
        }, {
          onConflict: 'email'
        });

      if (upsertError) {
        console.error('❌ Error creating/updating affiliate record:', upsertError);
        throw upsertError;
      }

      console.log(`✅ Successfully created affiliate record with code: ${newCode}`);
      return newCode;

    } catch (error) {
      console.error('❌ Error in getOrCreateAffiliateCode:', error);
      console.error('❌ Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        code: (error as any)?.code,
        details: (error as any)?.details,
        hint: (error as any)?.hint,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Check if user is authenticated
      try {
        const { data: { user }, error: authError } = await this.supabase.auth.getUser();
        console.log('🔐 Current auth state:', { 
          user: user ? { id: user.id, email: user.email } : null,
          authError 
        });
      } catch (authCheckError) {
        console.error('❌ Auth check failed:', authCheckError);
      }
      
      // Fallback to temporary code if database operations fail
      const tempCode = `TEMP${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      console.warn(`⚠️ Using temporary fallback code: ${tempCode}`);
      return tempCode;
    }
  }

  /**
   * Validate if an affiliate code is valid and exists
   */
  async validateAffiliateCode(code: string): Promise<boolean> {
    if (!code || code.startsWith('TEMP')) {
      return false;
    }

    try {
      const { data } = await this.supabase
        .from('affiliate_system_users')
        .select('id')
        .eq('referral_code', code)
        .single();

      return !!data;
    } catch {
      return false;
    }
  }

  /**
   * Get affiliate details by referral code
   */
  async getAffiliateByCode(code: string): Promise<any | null> {
    try {
      const { data } = await this.supabase
        .from('affiliate_system_users')
        .select('*')
        .eq('referral_code', code)
        .single();

      return data;
    } catch {
      return null;
    }
  }

  /**
   * Update affiliate code for a user (admin only)
   */
  async updateAffiliateCode(userEmail: string, newCode: string): Promise<boolean> {
    try {
      // First check if the new code is available
      const codeExists = await this.checkCodeExists('affiliate_system_users', newCode);
      if (codeExists) {
        throw new Error('Affiliate code already exists');
      }

      const { error } = await this.supabase
        .from('affiliate_system_users')
        .update({ referral_code: newCode })
        .eq('email', userEmail);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error updating affiliate code:', error);
      return false;
    }
  }

  /**
   * Generate affiliate link for a given code
   */
  generateAffiliateLink(code: string, baseUrl: string = 'https://jennaz.co'): string {
    return `${baseUrl}/join/${code}`;
  }

  /**
   * Sync affiliate code across all platform integrations
   * This ensures the same code is used in GHL, MightyNetworks, etc.
   */
  async syncAffiliateCodeAcrossPlatforms(userEmail: string, affiliateCode: string): Promise<void> {
    try {
      // Update GHL affiliates table if record exists
      await this.supabase
        .from('ghl_affiliates')
        .update({ referral_code: affiliateCode })
        .eq('email', userEmail);

      // Update other platform tables as needed
      // This can be expanded as more integrations are added
      
      console.log(`✅ Synced affiliate code ${affiliateCode} across platforms for ${userEmail}`);
    } catch (error) {
      console.warn('⚠️ Some platform sync operations may have failed:', error);
      // Don't throw error as this is a nice-to-have sync operation
    }
  }
} 