import { SupabaseClient } from '@supabase/supabase-js';

interface GHLContact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  source?: string;
  tags?: string[];
  customFields?: Record<string, string | number | boolean>;
  dateAdded?: string;
  lastActivity?: string;
  contactSource?: string;
  // Referral tracking fields
  referredBy?: string; // Contact ID of referrer
  referralCode?: string;
}

export interface GHLImportConfig {
  apiKey: string;
  locationId: string;
  baseUrl?: string;
  apiVersion?: 'v1' | 'v2'; // Add API version option
  useOAuth?: boolean; // Add OAuth option
  refreshToken?: string; // For OAuth refresh
}

interface ImportResult {
  success: boolean;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  recordsUpdated: number;
  errors: string[];
  warnings: string[];
}

interface ImportLogData {
  import_source: string;
  import_type: string;
  started_by?: string;
  import_config?: Record<string, unknown>;
}

interface ImportLogUpdateData {
  status: string;
  completed_at?: string;
  records_processed?: number;
  records_successful?: number;
  records_failed?: number;
  records_updated?: number;
  error_details?: Record<string, unknown>;
  warnings?: Record<string, unknown>;
}

interface GHLAPIResponse {
  contacts?: GHLContact[];
  contact?: GHLContact;
  meta?: {
    nextCursor?: string;
    nextPageUrl?: string;
  };
}

export class GHLImportService {
  private supabase: SupabaseClient;
  private serviceRoleClient: SupabaseClient;
  private config: GHLImportConfig;

  constructor(
    supabase: SupabaseClient,
    serviceRoleClient: SupabaseClient,
    config: GHLImportConfig
  ) {
    this.supabase = supabase;
    this.serviceRoleClient = serviceRoleClient;
    this.config = {
      baseUrl: config.apiVersion === 'v2' 
        ? 'https://services.leadconnectorhq.com' 
        : 'https://rest.gohighlevel.com/v1',
      apiVersion: 'v1', // Default to v1 for backward compatibility
      useOAuth: false,
      ...config
    };
  }

  private async createImportLog(data: ImportLogData): Promise<string> {
    const { data: log, error } = await this.serviceRoleClient
      .from('affiliate_import_logs')
      .insert({
        ...data,
        status: 'started'
      })
      .select()
      .single();

    if (error) throw error;
    return log.id;
  }

  private async updateImportLog(
    logId: string,
    data: ImportLogUpdateData
  ): Promise<void> {
    const { error } = await this.serviceRoleClient
      .from('affiliate_import_logs')
      .update({
        ...data,
        completed_at: data.completed_at || new Date().toISOString()
      })
      .eq('id', logId);

    if (error) throw error;
  }

  private async makeGHLRequest(endpoint: string, cursor?: string): Promise<GHLAPIResponse> {
    const isV2 = this.config.apiVersion === 'v2';
    let url: string;
    
    if (isV2) {
      // v2 API structure
      url = `${this.config.baseUrl}${endpoint}`;
      if (cursor) {
        url += `${endpoint.includes('?') ? '&' : '?'}cursor=${cursor}`;
      }
    } else {
      // v1 API structure
      url = `${this.config.baseUrl}${endpoint}`;
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };

    // Add version header for v2
    if (isV2) {
      headers['Version'] = '2021-07-28';
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`GHL API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<GHLAPIResponse>;
  }

  async fetchAllContacts(): Promise<GHLContact[]> {
    console.log('🔄 Fetching affiliate contacts from Go High Level...');
    
    const allContacts: GHLContact[] = [];
    let nextUrl: string | null = null;
    let page = 1;
    const limit = 100;

    // Define affiliate-related tags to search for
    const affiliateTags = ['affiliate', 'partner', 'referrer', 'ambassador', 'influencer'];
    
    // We'll make multiple requests for different affiliate tags to be more targeted
    for (const tag of affiliateTags) {
      console.log(`🏷️ Searching for contacts with tag: "${tag}"`);
      
      // Start with the initial URL for this tag
      let currentUrl = `${this.config.baseUrl}/contacts/?locationId=${this.config.locationId}&limit=${limit}&tags=${encodeURIComponent(tag)}`;
      let tagPage = 1;
      
      do {
        try {
          console.log(`📥 Fetching page ${tagPage} for tag "${tag}"...`);
          console.log(`🔗 Request URL: ${currentUrl}`);
          
          const response = await fetch(currentUrl, {
            headers: {
              'Authorization': `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`GHL API Error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          
          console.log(`🔍 API Response for tag "${tag}":`, {
            contactsCount: data.contacts?.length || 0,
            hasNextPageUrl: !!data.meta?.nextPageUrl,
          });
          
          if (data.contacts && Array.isArray(data.contacts) && data.contacts.length > 0) {
            // Filter out duplicates based on contact ID
            const newContacts = data.contacts.filter((contact: GHLContact) => 
              !allContacts.some(existing => existing.id === contact.id)
            );
            
            allContacts.push(...newContacts);
            console.log(`✅ Added ${newContacts.length} new contacts for tag "${tag}" (total: ${allContacts.length})`);
            
            // Use the nextPageUrl directly if available
            nextUrl = data.meta?.nextPageUrl || null;
            
            // If we have a nextPageUrl, use it for the next request
            if (nextUrl) {
              currentUrl = nextUrl;
              console.log(`🔄 Next page URL for tag "${tag}": ${nextUrl}`);
            } else {
              console.log(`🏁 No nextPageUrl found for tag "${tag}" - reached end`);
              break;
            }
            
            // If we got less than the limit, we're at the end
            if (data.contacts.length < limit) {
              console.log(`🏁 Got ${data.contacts.length} < ${limit} contacts for tag "${tag}", reached end`);
              break;
            }
          } else {
            console.log(`❌ No contacts found for tag "${tag}" - stopping`);
            break;
          }

          tagPage++;
          
          // Rate limiting - be more conservative
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Safety break to prevent infinite loops per tag
          if (tagPage > 20) {
            console.log(`🛑 Safety break at page 20 for tag "${tag}"`);
            break;
          }
          
        } catch (error) {
          console.error(`❌ Error fetching page ${tagPage} for tag "${tag}":`, error);
          break;
        }
      } while (nextUrl);
      
      // Reset for next tag
      nextUrl = null;
      
      // Rate limiting between different tag searches
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`✅ Total affiliate contacts fetched: ${allContacts.length}`);
    
    // Additional filtering for any contacts that might have slipped through
    const isAffiliate = (contact: GHLContact): boolean => {
      // Check for affiliate-related tags
      if (contact.tags && Array.isArray(contact.tags)) {
        const hasAffiliateTag = contact.tags.some(tag => 
          affiliateTags.some(affiliateTag => 
            tag.toLowerCase().includes(affiliateTag.toLowerCase())
          )
        );
        if (hasAffiliateTag) return true;
      }
      
      // Check for affiliate-related custom fields
      if (contact.customFields) {
        const customFieldsStr = JSON.stringify(contact.customFields).toLowerCase();
        const hasAffiliateField = affiliateTags.some(tag => customFieldsStr.includes(tag));
        if (hasAffiliateField) return true;
      }
      
      // Include if they have a referral code
      if (contact.referralCode) return true;
      
      return false;
    };

    const finalAffiliateContacts = allContacts.filter(isAffiliate);
    console.log(`🎯 Final filtered affiliate contacts: ${finalAffiliateContacts.length} out of ${allContacts.length} fetched contacts`);
    
    return finalAffiliateContacts;
  }

  async importAffiliates(userId: string): Promise<ImportResult> {
    console.log('🔄 Starting import process...');
    console.log(`🔧 Using API ${this.config.apiVersion} with base URL: ${this.config.baseUrl}`);
    
    // Create import log at the start
    const logId = await this.createImportLog({
      import_source: 'ghl',
      import_type: 'affiliates',
      started_by: userId
    });
    
    const result: ImportResult = {
      success: false,
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      recordsUpdated: 0,
      errors: [],
      warnings: []
    };

    try {
      // Use the new fetchAllContacts method
      const contacts = await this.fetchAllContacts();
      result.recordsProcessed = contacts.length;

      console.log('🔄 Processing GHL contacts into affiliate system...');

      // First pass: Import all contacts into ghl_affiliates table
      for (const contact of contacts) {
        try {
          // Skip contacts without email addresses since affiliate_system_users requires email
          if (!contact.email || contact.email.trim() === '') {
            result.warnings.push(`Skipped contact ${contact.id}: No email address provided`);
            console.log(`⚠️ Skipping contact ${contact.id} - no email address`);
            continue;
          }

          const ghlAffiliateData = {
            ghl_contact_id: contact.id,
            email: contact.email,
            first_name: contact.firstName || null,
            last_name: contact.lastName || null,
            phone: contact.phone || null,
            contact_source: contact.contactSource || contact.source || null,
            tags: contact.tags ? JSON.stringify(contact.tags) : null,
            custom_fields: contact.customFields ? JSON.stringify(contact.customFields) : null,
            date_added: contact.dateAdded ? new Date(contact.dateAdded).toISOString() : null,
            last_activity: contact.lastActivity ? new Date(contact.lastActivity).toISOString() : null,
            referred_by_contact_id: contact.referredBy || null,
            referral_code: contact.referralCode || null,
            status: 'active',
            raw_data: JSON.stringify(contact),
            last_synced: new Date().toISOString(),
            sync_status: 'synced'
          };

          const { error: ghlError } = await this.serviceRoleClient
            .from('ghl_affiliates')
            .upsert([ghlAffiliateData], { onConflict: 'ghl_contact_id' });

          if (ghlError) {
            result.errors.push(`GHL table - Contact ${contact.id}: ${ghlError.message}`);
            result.recordsFailed++;
            continue;
          }

          // Generate referral code if not provided
          const referralCode = contact.referralCode || this.generateReferralCode(contact);

          // Import into main affiliate system with correct primary_source value
          const affiliateData = {
            email: contact.email,
            first_name: contact.firstName || null,
            last_name: contact.lastName || null,
            phone: contact.phone || null,
            referral_code: referralCode,
            primary_source: 'GHL', // Updated to match new constraint
            ghl_contact_id: contact.id,
            status: 'active',
            signup_date: contact.dateAdded ? new Date(contact.dateAdded).toISOString() : new Date().toISOString(),
            last_active: contact.lastActivity ? new Date(contact.lastActivity).toISOString() : null,
            custom_fields: contact.customFields ? JSON.stringify(contact.customFields) : null
          };

          const { error: affiliateError } = await this.serviceRoleClient
            .from('affiliate_system_users')
            .upsert([affiliateData], { 
              onConflict: 'email',
              ignoreDuplicates: false 
            });

          if (affiliateError) {
            result.errors.push(`Affiliate system - Contact ${contact.id}: ${affiliateError.message}`);
            result.recordsFailed++;
          } else {
            result.recordsSuccessful++;
          }

        } catch (error) {
          result.errors.push(`Contact ${contact.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.recordsFailed++;
        }
      }

      // Second pass: Establish referral relationships
      console.log('🔗 Establishing referral relationships...');
      await this.establishReferralRelationships();

      result.success = result.recordsFailed === 0;

      await this.updateImportLog(logId, {
        status: result.success ? 'completed' : (result.recordsSuccessful > 0 ? 'partial' : 'failed'),
        records_processed: result.recordsProcessed,
        records_successful: result.recordsSuccessful,
        records_failed: result.recordsFailed,
        records_updated: result.recordsUpdated,
        error_details: result.errors.length > 0 ? { errors: result.errors } : undefined,
        warnings: result.warnings.length > 0 ? { warnings: result.warnings } : undefined
      });

      return result;

    } catch (error) {
      await this.updateImportLog(logId, {
        status: 'failed',
        error_details: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      throw error;
    }
  }

  private generateReferralCode(contact: GHLContact): string {
    // Generate a unique referral code based on contact info
    // Safely handle null/undefined values
    const firstName = contact.firstName?.trim() || '';
    const lastName = contact.lastName?.trim() || '';
    const email = contact.email?.trim() || '';
    
    let baseName = '';
    
    // Try to get base name from firstName, lastName, or email
    if (firstName) {
      baseName = firstName;
    } else if (lastName) {
      baseName = lastName;
    } else if (email && email.includes('@')) {
      baseName = email.split('@')[0];
    } else {
      // Fallback if no usable name info
      baseName = `user${contact.id?.substring(0, 4) || Math.random().toString(36).substring(2, 6)}`;
    }
    
    const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
    const finalName = cleanName.length > 0 ? cleanName : 'USER';
    
    return `${finalName.substr(0, 6)}${randomSuffix}`;
  }

  private async establishReferralRelationships(): Promise<void> {
    console.log('🔗 Processing referral relationships from GHL data...');

    // Get all GHL contacts with referral information
    const { data: ghlContacts, error } = await this.serviceRoleClient
      .from('ghl_affiliates')
      .select('ghl_contact_id, email, referred_by_contact_id')
      .not('referred_by_contact_id', 'is', null);

    if (error) {
      console.error('❌ Error fetching GHL referral data:', error);
      return;
    }

    if (!ghlContacts || ghlContacts.length === 0) {
      console.log('ℹ️ No referral relationships found in GHL data');
      return;
    }

    console.log(`🔍 Processing ${ghlContacts.length} referral relationships...`);

    for (const contact of ghlContacts) {
      try {
        // Find the affiliate record for this contact
        const { data: affiliate } = await this.serviceRoleClient
          .from('affiliate_system_users')
          .select('id')
          .eq('ghl_contact_id', contact.ghl_contact_id)
          .single();

        if (!affiliate) {
          console.warn(`⚠️ Affiliate not found for GHL contact ${contact.ghl_contact_id}`);
          continue;
        }

        // Find the referrer affiliate
        const { data: referrer } = await this.serviceRoleClient
          .from('affiliate_system_users')
          .select('id')
          .eq('ghl_contact_id', contact.referred_by_contact_id)
          .single();

        if (!referrer) {
          console.warn(`⚠️ Referrer not found for GHL contact ${contact.referred_by_contact_id}`);
          continue;
        }

        // Check if relationship already exists
        const { data: existingRelationship } = await this.serviceRoleClient
          .from('referral_relationships')
          .select('id')
          .eq('affiliate_id', affiliate.id)
          .single();

        if (existingRelationship) {
          console.log(`ℹ️ Relationship already exists for affiliate ${affiliate.id}`);
          continue;
        }

        // Get the referrer's own relationships to determine L2 and L3
        const { data: referrerRelationship } = await this.serviceRoleClient
          .from('referral_relationships')
          .select('l1_referrer_id, l2_referrer_id')
          .eq('affiliate_id', referrer.id)
          .single();

        // Create the new referral relationship
        const relationshipData = {
          affiliate_id: affiliate.id,
          l1_referrer_id: referrer.id,
          l2_referrer_id: referrerRelationship?.l1_referrer_id || null,
          l3_referrer_id: referrerRelationship?.l2_referrer_id || null,
          referral_method: 'import',
          referral_code_used: null, // Could be enhanced to track actual codes used
          assigned_by: null // System import
        };

        const { error: relationshipError } = await this.serviceRoleClient
          .from('referral_relationships')
          .insert([relationshipData]);

        if (relationshipError) {
          console.error(`❌ Error creating relationship for ${contact.email}:`, relationshipError);
        } else {
          console.log(`✅ Created referral relationship: ${contact.email} -> referred by GHL contact ${contact.referred_by_contact_id}`);
        }

      } catch (error) {
        console.error(`❌ Error processing referral for ${contact.email}:`, error);
      }
    }

    console.log('✅ Referral relationship processing complete');
  }

  async syncSingleContact(contactId: string): Promise<boolean> {
    try {
      console.log(`🔄 Syncing single contact: ${contactId}`);
      
      const response = await this.makeGHLRequest(`/contacts/${contactId}?locationId=${this.config.locationId}`);
      
      if (!response.contact) {
        throw new Error('Contact not found in GHL');
      }

      const contact: GHLContact = response.contact;

      // Update GHL affiliates table
      const ghlData = {
        ghl_contact_id: contact.id,
        email: contact.email,
        first_name: contact.firstName || null,
        last_name: contact.lastName || null,
        phone: contact.phone || null,
        contact_source: contact.contactSource || contact.source || null,
        tags: contact.tags ? JSON.stringify(contact.tags) : null,
        custom_fields: contact.customFields ? JSON.stringify(contact.customFields) : null,
        date_added: contact.dateAdded ? new Date(contact.dateAdded).toISOString() : null,
        last_activity: contact.lastActivity ? new Date(contact.lastActivity).toISOString() : null,
        referred_by_contact_id: contact.referredBy || null,
        referral_code: contact.referralCode || null,
        status: 'active',
        raw_data: JSON.stringify(contact),
        last_synced: new Date().toISOString(),
        sync_status: 'synced'
      };

      await this.serviceRoleClient
        .from('ghl_affiliates')
        .upsert([ghlData], { onConflict: 'ghl_contact_id' });

      // Update affiliate system users
      const affiliateData = {
        email: contact.email,
        first_name: contact.firstName || null,
        last_name: contact.lastName || null,
        phone: contact.phone || null,
        primary_source: 'ghl',
        ghl_contact_id: contact.id,
        last_active: contact.lastActivity ? new Date(contact.lastActivity).toISOString() : null,
        custom_fields: contact.customFields ? JSON.stringify(contact.customFields) : null
      };

      await this.serviceRoleClient
        .from('affiliate_system_users')
        .upsert([affiliateData], { onConflict: 'email' });

      console.log(`✅ Successfully synced contact: ${contact.email}`);
      return true;

    } catch (error) {
      console.error(`❌ Error syncing contact ${contactId}:`, error);
      return false;
    }
  }

  async retroactivelyApplyCommissions(): Promise<ImportResult> {
    console.log('🔄 Retroactively applying new commission structure to existing orders...');

    const result: ImportResult = {
      success: false,
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      recordsUpdated: 0,
      errors: [],
      warnings: []
    };

    try {
      // Get all existing Shopify orders
      const { data: shopifyOrders, error: shopifyError } = await this.serviceRoleClient
        .from('shopify_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (shopifyError) throw shopifyError;

      result.recordsProcessed += shopifyOrders?.length || 0;

      // Process Shopify orders
      if (shopifyOrders) {
        for (const order of shopifyOrders) {
          try {
            // Map customer email to affiliate if possible
            const { data: affiliate } = await this.serviceRoleClient
              .from('affiliate_system_users')
              .select('email')
              .eq('email', order.email)
              .single();

            if (affiliate) {
              const commissionResult = await this.serviceRoleClient
                .rpc('calculate_multi_level_commissions', {
                  p_order_source: 'shopify',
                  p_order_id: order.shopify_order_id,
                  p_customer_email: order.email,
                  p_customer_name: `${order.first_name || ''} ${order.last_name || ''}`.trim(),
                  p_order_total: parseFloat(order.total_price || '0'),
                  p_order_date: order.created_at,
                  p_product_category: 'default', // Could be enhanced based on product data
                  p_product_name: 'Shopify Order',
                  p_product_id: order.shopify_order_id,
                  p_purchasing_affiliate_email: affiliate.email
                });

              if (commissionResult.data?.success) {
                result.recordsSuccessful++;
              } else {
                result.recordsFailed++;
                if (commissionResult.data?.error) {
                  result.errors.push(`Order ${order.order_number}: ${commissionResult.data.error}`);
                }
              }
            }
          } catch (error) {
            result.recordsFailed++;
            result.errors.push(`Order ${order.order_number}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }

      // Get GoAffPro orders
      const { data: goaffproOrders, error: goaffproError } = await this.serviceRoleClient
        .from('goaffpro_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (goaffproError) throw goaffproError;

      result.recordsProcessed += goaffproOrders?.length || 0;

      // Process GoAffPro orders
      if (goaffproOrders) {
        for (const order of goaffproOrders) {
          try {
            // Find affiliate by GoAffPro affiliate ID
            const { data: affiliate } = await this.serviceRoleClient
              .from('affiliate_system_users')
              .select('email')
              .eq('goaffpro_affiliate_id', order.goaffpro_affiliate_id)
              .single();

            if (affiliate) {
              const commissionResult = await this.serviceRoleClient
                .rpc('calculate_multi_level_commissions', {
                  p_order_source: 'goaffpro',
                  p_order_id: order.goaffpro_order_id,
                  p_customer_email: order.customer_email,
                  p_customer_name: order.customer_name,
                  p_order_total: parseFloat(order.order_total || '0'),
                  p_order_date: order.order_date || order.created_at,
                  p_product_category: 'default',
                  p_product_name: 'GoAffPro Order',
                  p_product_id: order.goaffpro_order_id,
                  p_purchasing_affiliate_email: affiliate.email
                });

              if (commissionResult.data?.success) {
                result.recordsSuccessful++;
              } else {
                result.recordsFailed++;
                if (commissionResult.data?.error) {
                  result.errors.push(`GoAffPro Order ${order.order_number}: ${commissionResult.data.error}`);
                }
              }
            }
          } catch (error) {
            result.recordsFailed++;
            result.errors.push(`GoAffPro Order ${order.order_number}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }

      result.success = result.recordsFailed === 0;
      console.log(`✅ Retroactive commission application complete. Success: ${result.recordsSuccessful}, Failed: ${result.recordsFailed}`);

      return result;

    } catch (error) {
      console.error('❌ Error in retroactive commission application:', error);
      throw error;
    }
  }
} 