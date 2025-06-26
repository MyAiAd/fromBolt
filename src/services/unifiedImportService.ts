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
  referral_code?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  total_sales?: number;
  total_commission?: number;
  pending_commission?: number;
  paid_commission?: number;
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
    console.log('🔵 Starting GHL import...');
    const startTime = Date.now();
    
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
      // Fetch affiliate contacts from GHL using targeted tag searches
      const affiliateTags = ['affiliate', 'partner', 'referrer', 'ambassador', 'influencer'];
      const allContacts: GHLContact[] = [];
      
      for (const tag of affiliateTags) {
        console.log(`🏷️ GHL: Searching for contacts with tag: "${tag}"`);
        
        let currentUrl = `https://rest.gohighlevel.com/v1/contacts/?locationId=${credentials.locationId}&limit=100&tags=${encodeURIComponent(tag)}`;
        let tagPage = 1;
        
        do {
          console.log(`📥 GHL: Fetching page ${tagPage} for tag "${tag}"...`);
          
          const response = await fetch(currentUrl, {
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`GHL API Error: ${response.status} ${response.statusText}`);
          }

          const responseData = await response.json();
          
          if (responseData.contacts && Array.isArray(responseData.contacts)) {
            // Filter out duplicates based on contact ID
            const newContacts = responseData.contacts.filter((contact: GHLContact) => 
              !allContacts.some(existing => existing.id === contact.id)
            );
            
            allContacts.push(...newContacts);
            console.log(`✅ GHL: Added ${newContacts.length} new contacts for tag "${tag}" (total: ${allContacts.length})`);
          }
          
          // Use nextPageUrl if available
          const nextUrl = responseData.meta?.nextPageUrl;
          if (nextUrl) {
            currentUrl = nextUrl;
            tagPage++;
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Safety break
            if (tagPage > 20) {
              console.log(`🛑 GHL: Safety break at page 20 for tag "${tag}"`);
              break;
            }
          } else {
            break;
          }
        } while (true);
        
        // Rate limiting between tag searches
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log(`✅ GHL: Total contacts fetched: ${allContacts.length}`);
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
            primary_source: 'GHL',
            ghl_contact_id: contact.id,
            status: 'active',
            signup_date: contact.dateAdded ? new Date(contact.dateAdded).toISOString() : new Date().toISOString(),
            last_active: contact.lastActivity ? new Date(contact.lastActivity).toISOString() : null,
            custom_fields: contact.customFields ? JSON.stringify(contact.customFields) : null
          };

          const { error } = await this.supabase
            .from('affiliate_system_users')
            .upsert([affiliateData], { 
              onConflict: 'email',
              ignoreDuplicates: false 
            });

          if (error) {
            result.errors.push(`GHL: Contact ${contact.id} - ${error.message}`);
            result.recordsFailed++;
          } else {
            result.recordsSuccessful++;
          }

        } catch (error) {
          result.errors.push(`GHL: Contact ${contact.id} - ${error instanceof Error ? error.message : String(error)}`);
          result.recordsFailed++;
        }
      }

      result.success = result.recordsFailed === 0;
      result.duration = Date.now() - startTime;
      
      console.log('✅ GHL import completed:', {
        processed: result.recordsProcessed,
        successful: result.recordsSuccessful,
        failed: result.recordsFailed
      });

      return result;

    } catch (error) {
      result.errors.push(`GHL import failed: ${error instanceof Error ? error.message : String(error)}`);
      result.duration = Date.now() - startTime;
      console.error('❌ GHL import error:', error);
      return result;
    }
  }

  private async importFromGoAffPro(credentials: { apiKey: string; storeId: string }): Promise<ImportResult> {
    console.log('🟠 Starting GoAffPro import...');
    const startTime = Date.now();
    
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
        
        const response = await fetch(`https://api.goaffpro.com/affiliates?page=${page}&limit=100`, {
          headers: {
            'Authorization': `Bearer ${credentials.apiKey}`,
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
            referral_code: affiliate.referral_code || this.generateReferralCode(affiliate.first_name, affiliate.last_name, affiliate.email),
            primary_source: 'goaffpro',
            goaffpro_affiliate_id: affiliate.id,
            status: affiliate.status || 'active',
            signup_date: affiliate.created_at ? new Date(affiliate.created_at).toISOString() : new Date().toISOString(),
            last_active: affiliate.updated_at ? new Date(affiliate.updated_at).toISOString() : null,
            total_earnings: affiliate.total_commission || 0,
            pending_earnings: affiliate.pending_commission || 0,
            paid_earnings: affiliate.paid_commission || 0
          };

          const { error } = await this.supabase
            .from('affiliate_system_users')
            .upsert([affiliateData], { 
              onConflict: 'email',
              ignoreDuplicates: false 
            });

          if (error) {
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