import { SupabaseClient } from '@supabase/supabase-js';

interface ImportResult {
  success: boolean;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errors: string[];
  warnings: string[];
  source: string;
  duration: number;
}

interface UnifiedImportResult {
  success: boolean;
  totalRecordsProcessed: number;
  totalRecordsSuccessful: number;
  totalRecordsFailed: number;
  results: {
    goaffpro?: ImportResult;
    ghl?: ImportResult;
  };
  errors: string[];
  warnings: string[];
  duration: number;
}

interface GHLContact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  referralCode?: string;
  dateAdded?: string;
  lastActivity?: string;
  customFields?: Record<string, unknown>;
  tags?: string[];
}

interface GoAffProAffiliate {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  phone?: string;
  address?: Record<string, unknown>;
  status?: string;
  signup_date?: string;
  referral_code?: string;
  commission_rate?: number;
  balance?: number;
  total_earnings?: number;
  total_orders?: number;
  tags?: unknown[];
  custom_fields?: Record<string, unknown>;
  [key: string]: unknown;
}

export class UnifiedImportService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async importAllData(
    ghlCredentials?: { apiKey: string; locationId: string },
    goaffproCredentials?: { apiKey: string; storeId: string }
  ): Promise<UnifiedImportResult> {
    console.log('🚀 Starting unified import from all sources...');
    const startTime = Date.now();
    
    const result: UnifiedImportResult = {
      success: false,
      totalRecordsProcessed: 0,
      totalRecordsSuccessful: 0,
      totalRecordsFailed: 0,
      results: {},
      errors: [],
      warnings: [],
      duration: 0
    };

    try {
      const importPromises: Promise<ImportResult>[] = [];

      // Import from GHL if credentials provided
      if (ghlCredentials) {
        console.log('📥 Adding GHL import to queue...');
        importPromises.push(this.importFromGHL(ghlCredentials));
      } else {
        result.warnings.push('GHL credentials not provided - skipping GHL import');
      }

      // Import from GoAffPro if credentials provided
      if (goaffproCredentials) {
        console.log('📥 Adding GoAffPro import to queue...');
        importPromises.push(this.importFromGoAffPro(goaffproCredentials));
      } else {
        result.warnings.push('GoAffPro credentials not provided - skipping GoAffPro import');
      }

      // Execute all imports in parallel
      if (importPromises.length > 0) {
        console.log(`⚡ Executing ${importPromises.length} imports in parallel...`);
        const importResults = await Promise.allSettled(importPromises);

        // Process results
        importResults.forEach((promiseResult, index) => {
          if (promiseResult.status === 'fulfilled') {
            const importResult = promiseResult.value;
            result.totalRecordsProcessed += importResult.recordsProcessed;
            result.totalRecordsSuccessful += importResult.recordsSuccessful;
            result.totalRecordsFailed += importResult.recordsFailed;
            result.errors.push(...importResult.errors);
            result.warnings.push(...importResult.warnings);

            // Store specific results
            if (importResult.source === 'ghl') {
              result.results.ghl = importResult;
            } else if (importResult.source === 'goaffpro') {
              result.results.goaffpro = importResult;
            }
          } else {
            const error = promiseResult.reason;
            result.errors.push(`Import failed: ${error instanceof Error ? error.message : String(error)}`);
            result.totalRecordsFailed++;
          }
        });
      } else {
        result.warnings.push('No import services configured - nothing to import');
      }

      result.success = result.totalRecordsFailed === 0;
      result.duration = Date.now() - startTime;

      console.log('✅ Unified import completed:', {
        success: result.success,
        processed: result.totalRecordsProcessed,
        successful: result.totalRecordsSuccessful,
        failed: result.totalRecordsFailed,
        duration: `${result.duration}ms`
      });

      return result;

    } catch (error) {
      result.errors.push(`Unified import failed: ${error instanceof Error ? error.message : String(error)}`);
      result.duration = Date.now() - startTime;
      console.error('❌ Unified import error:', error);
      return result;
    }
  }

  private async importFromGHL(credentials: { apiKey: string; locationId: string }): Promise<ImportResult> {
    console.log('🔵 Starting GHL v1 import...');
    const startTime = Date.now();
    
    // FIRST: Clear existing GHL data to avoid accumulation
    console.log('🧹 Clearing existing GHL data from database...');
    try {
      const { error: deleteError } = await this.supabase
        .from('affiliate_system_users')
        .delete()
        .eq('primary_source', 'GHL');
        
      if (deleteError) {
        console.error('❌ Error clearing GHL data:', deleteError);
      } else {
        console.log('✅ Cleared existing GHL data');
      }
    } catch (error) {
      console.error('❌ Error during GHL data cleanup:', error);
    }
    
    const result: ImportResult = {
      success: false,
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      errors: [],
      warnings: [],
      source: 'ghl',
      duration: 0
    };

    try {
            // Fetch all contacts first, then filter for affiliates
      console.log(`🏷️ GHL v1: Fetching all contacts to find affiliates...`);
      const allContacts: GHLContact[] = [];
      
      // Use GHL v1 API with skip-based pagination (no tag filtering in URL)
      let page = 1;
      let hasMore = true;
      const limit = 100;
      
      while (hasMore) {
        console.log(`📥 GHL v1: Fetching page ${page} of all contacts...`);
        
        // GHL v1 API endpoint without tag filtering (we'll filter after)
        const url = `https://rest.gohighlevel.com/v1/contacts/?locationId=${credentials.locationId}&limit=${limit}&skip=${(page - 1) * limit}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${credentials.apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`GHL v1 API Error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        
        if (responseData.contacts && Array.isArray(responseData.contacts)) {
          console.log(`📊 GHL v1: Page ${page} returned ${responseData.contacts.length} contacts`);
          
          // Filter to only include ACTUAL affiliates
          const affiliateContacts = responseData.contacts.filter((contact: GHLContact) => {
            // Skip duplicates
            if (allContacts.some(existing => existing.id === contact.id)) {
              return false;
            }
            
            // Must have email
            const hasEmail = contact.email && contact.email.trim() !== '';
            if (!hasEmail) {
              return false;
            }
            
            // Log first 5 contacts to understand the data structure
            if (allContacts.length < 5) {
              console.log(`🔍 GHL Contact sample #${allContacts.length + 1}:`, {
                id: contact.id,
                email: contact.email,
                firstName: contact.firstName,
                lastName: contact.lastName,
                tags: contact.tags,
                referralCode: contact.referralCode,
                customFields: contact.customFields ? Object.keys(contact.customFields) : 'none'
              });
            }
            
            // Check for affiliate indicators
            const hasReferralCode = contact.referralCode && contact.referralCode.trim() !== '';
            
            // Check tags for affiliate-related keywords
            const hasAffiliateTags = contact.tags && Array.isArray(contact.tags) && 
              contact.tags.some(tag => {
                const tagLower = tag.toLowerCase();
                return tagLower.includes('affiliate') || 
                       tagLower.includes('partner') || 
                       tagLower.includes('referrer') ||
                       tagLower.includes('ambassador') ||
                       tagLower.includes('influencer');
              });
            
            // Check custom fields for affiliate indicators
            const hasAffiliateCustomFields = contact.customFields && (
              contact.customFields.referral_code ||
              contact.customFields.affiliate_id ||
              contact.customFields.commission_rate ||
              contact.customFields.affiliate_status ||
              contact.customFields.payout_email ||
              contact.customFields.referral_link ||
              contact.customFields.affiliate_commission ||
              contact.customFields.affiliate_earnings
            );
            
            // COMPREHENSIVE filtering based on analysis - include all potential affiliate indicators
            const hasSpecificAffiliateTags = contact.tags && Array.isArray(contact.tags) && 
              contact.tags.some(tag => {
                const tagLower = tag.toLowerCase();
                return tagLower === 'jennaz-affiliate' || 
                       tagLower === 'reaction-affiliate' ||
                       tagLower.includes('affiliate') ||
                       tagLower.includes('rego-') ||          // rego-rise66 (290 contacts)
                       tagLower.includes('manifest-') ||      // manifest-your-dreams (35 contacts)
                       tagLower.includes('purchase-') ||      // purchase-3mastery (30 contacts)
                       tagLower.includes('rise') ||
                       tagLower.includes('mastery') ||
                       tagLower.includes('partner') ||
                       tagLower.includes('referrer');
              });
            
            const isActualAffiliate = hasReferralCode || hasSpecificAffiliateTags;
            
            // Log every decision for the first 50 contacts to debug
            if (allContacts.length < 50) {
              console.log(`🔍 GHL Contact ${contact.id} (${contact.email}):`, {
                hasReferralCode,
                referralCode: contact.referralCode,
                hasSpecificAffiliateTags,
                tags: contact.tags,
                isActualAffiliate
              });
            }
            
            if (isActualAffiliate) {
              console.log(`✅ GHL: Including affiliate ${contact.id} (${contact.email}) - reasons: ${[
                hasReferralCode && 'referralCode',
                hasSpecificAffiliateTags && 'specificAffiliateTags'
              ].filter(Boolean).join(', ')}`);
              
              // EMERGENCY BRAKE: Increase limit since we expect ~481 affiliates
              if (allContacts.length >= 500) {
                console.error(`🚨 EMERGENCY BRAKE: Found ${allContacts.length} affiliates already - stopping to prevent spam!`);
                hasMore = false; // This will break the outer while loop
                return false; // Don't include this contact
              }
            }
            
            return isActualAffiliate;
          });
          
          allContacts.push(...affiliateContacts);
          console.log(`✅ GHL v1: Added ${affiliateContacts.length} actual affiliates from page ${page} (filtered from ${responseData.contacts.length} contacts, total: ${allContacts.length})`);
        }
        
        // GHL v1 pagination: check if we got a full page of results
        const contactsReceived = responseData.contacts?.length || 0;
        hasMore = contactsReceived === limit;
        
        if (hasMore) {
          page++;
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Safety break - increase limit to capture all ~320 affiliates
          if (page > 10) {
            console.log(`🛑 GHL v1: Safety break at page 10 (1000 contacts checked)`);
            break;
          }
        }
      }

      console.log(`✅ GHL v1: Total contacts fetched: ${allContacts.length}`);
      console.log(`🔍 GHL v1: These contacts will be inserted into database:`, allContacts.map(c => ({ id: c.id, email: c.email, hasReferralCode: !!c.referralCode, tags: c.tags })).slice(0, 10));
      
      // SANITY CHECK: Based on analysis, we expect ~481 affiliates
      if (allContacts.length > 500) {
        console.error(`🚨 SANITY CHECK FAILED: Found ${allContacts.length} affiliates - limiting to first 500 to prevent spam.`);
        allContacts.splice(500); // Keep only first 500
      } else {
        console.log(`✅ GHL: Found ${allContacts.length} affiliates - this matches expected range based on analysis`);
      }
      
      result.recordsProcessed = allContacts.length;

      // Process contacts into Supabase
      for (const contact of allContacts) {
        try {
          if (!contact.email || contact.email.trim() === '') {
            result.warnings.push(`GHL: Skipped contact ${contact.id} - no email address`);
            continue;
          }

          // Generate referral code if not provided
          const referralCode = contact.referralCode || this.generateReferralCode(contact.firstName, contact.lastName, contact.email);

          // Import into affiliate_system_users
          const affiliateData = {
            email: contact.email,
            first_name: contact.firstName || null,
            last_name: contact.lastName || null,
            phone: contact.phone || null,
            referral_code: referralCode,
            primary_source: 'GHL', // Must match database constraint (uppercase abbreviation)
            ghl_contact_id: contact.id,
            status: 'active',
            signup_date: contact.dateAdded ? new Date(contact.dateAdded).toISOString() : new Date().toISOString(),
            last_active: contact.lastActivity ? new Date(contact.lastActivity).toISOString() : null,
            custom_fields: contact.customFields || null // Store as JSONB, not stringified
          };

          const { error } = await this.supabase
            .from('affiliate_system_users')
            .upsert(affiliateData, { 
              onConflict: 'email'
            });

          if (error) {
            console.error('🚨 GHL Database error:', error);
            console.error('🚨 GHL Data that failed:', affiliateData);
            const errorMessage = error instanceof Error ? error.message : String(error);
            result.errors.push(`GHL: Contact ${contact.id} - ${errorMessage}`);
            result.recordsFailed++;
          } else {
            result.recordsSuccessful++;
          }

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          result.errors.push(`GHL: Contact ${contact.id} - ${errorMessage}`);
          result.recordsFailed++;
        }
      }

      result.success = result.recordsFailed === 0;
      result.duration = Date.now() - startTime;
      
      console.log('✅ GHL v1 import completed:', {
        processed: result.recordsProcessed,
        successful: result.recordsSuccessful,
        failed: result.recordsFailed
      });

      return result;

    } catch (error) {
      result.errors.push(`GHL v1 import failed: ${error instanceof Error ? error.message : String(error)}`);
      result.duration = Date.now() - startTime;
      console.error('❌ GHL v1 import error:', error);
      return result;
    }
  }

  private async importFromGoAffPro(credentials: { apiKey: string; storeId: string }): Promise<ImportResult> {
    console.log('🟠 Starting GoAffPro import...');
    const startTime = Date.now();
    
    // FIRST: Clear existing GoAffPro data to avoid accumulation
    console.log('🧹 Clearing existing GoAffPro data from database...');
    try {
      const { error: deleteError } = await this.supabase
        .from('affiliate_system_users')
        .delete()
        .eq('primary_source', 'SHP');
        
      if (deleteError) {
        console.error('❌ Error clearing GoAffPro data:', deleteError);
      } else {
        console.log('✅ Cleared existing GoAffPro data');
      }
    } catch (error) {
      console.error('❌ Error during GoAffPro data cleanup:', error);
    }
    
    const result: ImportResult = {
      success: false,
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      errors: [],
      warnings: [],
      source: 'goaffpro',
      duration: 0
    };

    try {
      // Fetch affiliates from GoAffPro
      const affiliates: GoAffProAffiliate[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        console.log(`📥 GoAffPro: Fetching page ${page}...`);
        
        // GoAffPro API uses header-based authentication
        const response = await fetch(`https://api.goaffpro.com/v1/admin/affiliates?fields=id,email,first_name,last_name,name,phone,address,status,signup_date,referral_code,commission_rate,balance,total_earnings,total_orders,tags,custom_fields&page=${page}&limit=100`, {
          headers: {
            'X-GOAFFPRO-ACCESS-TOKEN': credentials.apiKey,
            'X-GOAFFPRO-PUBLIC-TOKEN': credentials.storeId, // storeId is actually the public token
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`GoAffPro API Error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        
        if (responseData.affiliates && Array.isArray(responseData.affiliates)) {
          affiliates.push(...responseData.affiliates);
          console.log(`✅ GoAffPro: Added ${responseData.affiliates.length} affiliates from page ${page} (total: ${affiliates.length})`);
          
          // Check if there are more pages
          hasMore = responseData.affiliates.length === 100; // If we got a full page, there might be more
          page++;
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Safety break
          if (page > 50) {
            console.log('🛑 GoAffPro: Safety break at page 50');
            break;
          }
        } else {
          hasMore = false;
        }
      }

      console.log(`✅ GoAffPro: Total affiliates fetched: ${affiliates.length}`);
      result.recordsProcessed = affiliates.length;

      // Process affiliates into Supabase
      for (const affiliate of affiliates) {
        try {
          if (!affiliate.email || affiliate.email.trim() === '') {
            result.warnings.push(`GoAffPro: Skipped affiliate ${affiliate.id} - no email address`);
            continue;
          }

          // Import into affiliate_system_users
          const affiliateData = {
            email: affiliate.email,
            first_name: affiliate.first_name || null,
            last_name: affiliate.last_name || null,
            phone: affiliate.phone || null,
            referral_code: affiliate.referral_code || this.generateReferralCode(affiliate.first_name, affiliate.last_name, affiliate.email),
            primary_source: 'SHP', // Must match database constraint (SHP = GoAffPro)
            goaffpro_affiliate_id: affiliate.id,
            status: this.mapGoAffProStatus(affiliate.status), // Ensure status matches database constraint
            signup_date: affiliate.signup_date ? new Date(affiliate.signup_date).toISOString() : new Date().toISOString(),
            last_active: null, // GoAffPro doesn't provide last_active in the response
            total_earnings: affiliate.total_earnings || 0,
            pending_earnings: affiliate.balance || 0,
            paid_earnings: (affiliate.total_earnings || 0) - (affiliate.balance || 0),
            custom_fields: affiliate.custom_fields || null
          };

          const { error } = await this.supabase
            .from('affiliate_system_users')
            .upsert(affiliateData, { 
              onConflict: 'email'
            });

          if (error) {
            console.error('🚨 GoAffPro Database error:', error);
            console.error('🚨 GoAffPro Data that failed:', affiliateData);
            result.errors.push(`GoAffPro: Affiliate ${affiliate.id} - ${error.message}`);
            result.recordsFailed++;
          } else {
            result.recordsSuccessful++;
          }

        } catch (error) {
          result.errors.push(`GoAffPro: Affiliate ${affiliate.id} - ${error instanceof Error ? error.message : String(error)}`);
          result.recordsFailed++;
        }
      }

      result.success = result.recordsFailed === 0;
      result.duration = Date.now() - startTime;
      
      console.log('✅ GoAffPro import completed:', {
        processed: result.recordsProcessed,
        successful: result.recordsSuccessful,
        failed: result.recordsFailed
      });

      return result;

    } catch (error) {
      result.errors.push(`GoAffPro import failed: ${error instanceof Error ? error.message : String(error)}`);
      result.duration = Date.now() - startTime;
      console.error('❌ GoAffPro import error:', error);
      return result;
    }
  }

  private mapGoAffProStatus(status?: string): string {
    // Map GoAffPro status to database constraint values: 'active', 'inactive', 'suspended', 'pending'
    if (!status) return 'active';
    
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case 'active':
      case 'approved':
        return 'active';
      case 'inactive':
      case 'disabled':
        return 'inactive';
      case 'suspended':
      case 'banned':
        return 'suspended';
      case 'pending':
      case 'waiting':
      case 'review':
        return 'pending';
      default:
        return 'active';
    }
  }

  private generateReferralCode(firstName?: string, lastName?: string, email?: string): string {
    // Safely handle null/undefined values
    const first = firstName?.trim() || '';
    const last = lastName?.trim() || '';
    const emailPart = email?.trim() || '';
    
    let baseName = '';
    
    // Try to get base name from firstName, lastName, or email
    if (first) {
      baseName = first;
    } else if (last) {
      baseName = last;
    } else if (emailPart && emailPart.includes('@')) {
      baseName = emailPart.split('@')[0];
    } else {
      // Fallback if no usable name info
      baseName = `user${Math.random().toString(36).substring(2, 6)}`;
    }
    
    const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
    const finalName = cleanName.length > 0 ? cleanName : 'USER';
    
    return `${finalName.substr(0, 6)}${randomSuffix}`;
  }
} 