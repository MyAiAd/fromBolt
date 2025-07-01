import { SupabaseClient } from '@supabase/supabase-js';

interface GHLContact {
  id: string;
  locationId: string;
  contactName: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email: string;
  phone?: string;
  dnd: boolean;
  type: string;
  source?: string;
  assignedTo?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  address1?: string;
  dateAdded: string;
  dateUpdated: string;
  dateOfBirth?: string;
  tags?: string[];
  country?: string;
  website?: string;
  timezone?: string;
  customField?: Record<string, any>;
}

interface ImportResult {
  success: boolean;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  recordsUpdated: number;
  errors: string[];
  warnings: string[];
  uniqueAffiliates: number;
  campaignBreakdown: Record<string, number>;
}

export interface GHLTagBasedConfig {
  apiKey: string;
  locationId: string;
  baseUrl?: string;
}

export class GHLTagBasedImportService {
  private config: GHLTagBasedConfig;
  private supabase: SupabaseClient;
  private serviceRoleClient: SupabaseClient;

  // Validated campaign definitions (tested with 461/481 success rate)
  private readonly CAMPAIGNS = {
    'rego-rise66': {
      name: 'Rego Rise 66',
      tags: ['rego-rise66'],
      sources: ['rise signup']
    },
    'jennaz-affiliate': {
      name: 'Jennaz Affiliate',
      tags: ['jennaz-affiliate'],
      sources: []
    },
    'reaction-affiliate': {
      name: 'Reaction Affiliate',
      tags: ['reaction-affiliate'],
      sources: []
    }
  };

  private readonly ALL_AFFILIATE_TAGS = [
    'rego-rise66',
    'jennaz-affiliate', 
    'reaction-affiliate'
  ];

  constructor(
    supabase: SupabaseClient,
    serviceRoleClient: SupabaseClient,
    config: GHLTagBasedConfig
  ) {
    this.supabase = supabase;
    this.serviceRoleClient = serviceRoleClient;
    this.config = {
      baseUrl: 'https://rest.gohighlevel.com/v1',
      ...config
    };
  }

  // Validated tag-based + source-based affiliate identification (96.9% success rate)
  private isAffiliate(contact: GHLContact): boolean {
    const tags = contact.tags?.map(tag => tag.toLowerCase()) || [];
    const source = contact.source?.toLowerCase() || '';

    // Primary validation: Check for affiliate tags
    const hasAffiliateTag = this.ALL_AFFILIATE_TAGS.some(affiliateTag => 
      tags.includes(affiliateTag.toLowerCase())
    );

    // Secondary validation: Check for campaign sources
    const hasCampaignSource = Object.values(this.CAMPAIGNS).some(campaign =>
      campaign.sources.some(campaignSource => 
        source.includes(campaignSource.toLowerCase())
      )
    );

    // Tertiary validation: Check for additional affiliate sources (from investigation)
    const additionalAffiliateSources = ['bib aff signup', 'affiliate signup', 'partner signup'];
    const hasAdditionalAffiliateSource = additionalAffiliateSources.some(affSource =>
      source.includes(affSource.toLowerCase())
    );

    // Also check for "bae-affiliate" tag found in investigation
    const hasBaeAffiliateTag = tags.includes('bae-affiliate');

    return hasAffiliateTag || hasCampaignSource || hasAdditionalAffiliateSource || hasBaeAffiliateTag;
  }

  private getCampaignsForContact(contact: GHLContact): string[] {
    const campaigns: string[] = [];
    const tags = contact.tags?.map(tag => tag.toLowerCase()) || [];
    const source = contact.source?.toLowerCase() || '';

    // Check campaign tags
    Object.entries(this.CAMPAIGNS).forEach(([campaignId, campaign]) => {
      const hasTag = campaign.tags.some(tag => tags.includes(tag.toLowerCase()));
      const hasSource = campaign.sources.length === 0 || 
        campaign.sources.some(src => source.includes(src.toLowerCase()));
      
      if (hasTag || (hasSource && campaign.sources.length > 0)) {
        campaigns.push(campaign.name);
      }
    });

    return [...new Set(campaigns)]; // Remove duplicates
  }

  async fetchAllContacts(): Promise<GHLContact[]> {
    console.log('🔄 Fetching all contacts from GHL v1.0 API...');
    
    const allContacts: GHLContact[] = [];
    let startAfter: number | null = null;
    let startAfterId: string | null = null;
    let page = 1;
    const limit = 100;

    do {
      const url = new URL(`${this.config.baseUrl}/contacts/`);
      url.searchParams.append('locationId', this.config.locationId);
      url.searchParams.append('limit', limit.toString());
      
      if (startAfter && startAfterId) {
        url.searchParams.append('startAfter', startAfter.toString());
        url.searchParams.append('startAfterId', startAfterId);
      }
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`GHL API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const contacts = data.contacts || [];
      
      allContacts.push(...contacts);
      console.log(`📄 Page ${page}: ${contacts.length} contacts (Total: ${allContacts.length})`);
      
      // Check if there are more pages (v1.0 API uses different structure)
      if (data.meta && data.meta.startAfter && data.meta.nextPage) {
        startAfter = data.meta.startAfter;
        startAfterId = data.meta.startAfterId;
        page++;
      } else {
        startAfter = null;
        startAfterId = null;
      }
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } while (startAfter && startAfterId);
    
    console.log(`✅ Total contacts fetched: ${allContacts.length}`);
    return allContacts;
  }

  private deduplicateByEmail(contacts: GHLContact[]): GHLContact[] {
    const emailMap = new Map<string, GHLContact>();
    
    contacts.forEach(contact => {
      if (!contact.email) return;
      
      const email = contact.email.toLowerCase();
      const existing = emailMap.get(email);
      
      if (!existing) {
        emailMap.set(email, contact);
      } else {
        // Keep the contact with more tags (more complete information)
        const existingTagCount = existing.tags?.length || 0;
        const currentTagCount = contact.tags?.length || 0;
        
        if (currentTagCount > existingTagCount) {
          // Merge tags from both contacts
          const allTags = [...(existing.tags || []), ...(contact.tags || [])];
          const uniqueTags = [...new Set(allTags)];
          
          emailMap.set(email, {
            ...contact,
            tags: uniqueTags
          });
        } else if (currentTagCount === existingTagCount) {
          // Merge tags even if counts are equal
          const allTags = [...(existing.tags || []), ...(contact.tags || [])];
          const uniqueTags = [...new Set(allTags)];
          
          emailMap.set(email, {
            ...existing,
            tags: uniqueTags
          });
        }
      }
    });
    
    return Array.from(emailMap.values());
  }

  async importAffiliates(userId: string): Promise<ImportResult> {
    console.log('🚀 Starting GHL tag-based affiliate import...');
    
    const result: ImportResult = {
      success: false,
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      recordsUpdated: 0,
      errors: [],
      warnings: [],
      uniqueAffiliates: 0,
      campaignBreakdown: {}
    };

    try {
      // Fetch all contacts
      const allContacts = await this.fetchAllContacts();
      
      // Filter for affiliates using validated approach
      console.log('🔍 Filtering for affiliates using validated tag-based approach...');
      const affiliateContacts = allContacts.filter(contact => this.isAffiliate(contact));
      console.log(`📊 Found ${affiliateContacts.length} affiliate contacts before deduplication`);
      
      // Deduplicate by email (handles multi-campaign affiliates)
      const deduplicatedAffiliates = this.deduplicateByEmail(affiliateContacts);
      console.log(`📊 Found ${deduplicatedAffiliates.length} unique affiliates after deduplication`);
      
      result.recordsProcessed = deduplicatedAffiliates.length;
      result.uniqueAffiliates = deduplicatedAffiliates.length;

      // Analyze campaign breakdown
      Object.values(this.CAMPAIGNS).forEach(campaign => {
        const campaignAffiliates = deduplicatedAffiliates.filter(contact => 
          this.getCampaignsForContact(contact).includes(campaign.name)
        );
        result.campaignBreakdown[campaign.name] = campaignAffiliates.length;
      });

      // Process deduplicated affiliates
      console.log('🔄 Processing unique affiliate contacts...');
      
      for (const contact of deduplicatedAffiliates) {
        try {
          // Generate referral code
          const referralCode = this.generateReferralCode(contact);

          // Get campaigns for this affiliate
          const campaigns = this.getCampaignsForContact(contact);

          // Import into main affiliate system
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
            last_active: contact.dateUpdated ? new Date(contact.dateUpdated).toISOString() : null,
            custom_fields: JSON.stringify({
              campaigns: campaigns,
              tags: contact.tags || [],
              source: contact.source,
              company_name: contact.companyName,
              original_contact_name: contact.contactName,
              city: contact.city,
              state: contact.state,
              country: contact.country,
              website: contact.website,
              timezone: contact.timezone,
              custom_fields: contact.customField
            })
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

      result.success = result.recordsFailed === 0;

      // Log summary
      console.log('\n✨ IMPORT SUMMARY:');
      console.log(`📊 Total contacts processed: ${result.recordsProcessed}`);
      console.log(`✅ Successfully imported: ${result.recordsSuccessful}`);
      console.log(`❌ Failed imports: ${result.recordsFailed}`);
      console.log(`🎯 Unique affiliates: ${result.uniqueAffiliates}`);
      console.log(`📈 Campaign breakdown:`, result.campaignBreakdown);

      if (result.errors.length > 0) {
        console.log(`⚠️  Errors encountered:`, result.errors.slice(0, 5));
      }

      return result;

    } catch (error) {
      result.errors.push(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.success = false;
      return result;
    }
  }

  private generateReferralCode(contact: GHLContact): string {
    // Try to use existing referral code or generate one
    if (contact.customField?.referral_code) {
      return contact.customField.referral_code;
    }
    
    const firstName = contact.firstName?.toLowerCase() || '';
    const lastName = contact.lastName?.toLowerCase() || '';
    const email = contact.email.toLowerCase();
    
    // Use GHL contact ID suffix to ensure uniqueness
    const idSuffix = contact.id.substring(0, 6);
    
    if (firstName && lastName) {
      return `${firstName}-${lastName}-${idSuffix}`.substring(0, 30);
    } else if (firstName) {
      return `${firstName}-${idSuffix}`;
    } else {
      const emailPrefix = email.split('@')[0];
      return `${emailPrefix}-${idSuffix}`;
    }
  }

  // Analysis method for debugging
  async analyzeCurrentState(): Promise<{
    totalContacts: number;
    affiliateInstances: number;
    uniqueAffiliates: number;
    campaignBreakdown: Record<string, number>;
    tagAnalysis: Record<string, number>;
    sourceAnalysis: Record<string, number>;
    multiCampaignAffiliates: number;
  }> {
    console.log('🔍 Analyzing current GHL state...');
    
    const allContacts = await this.fetchAllContacts();
    const affiliateContacts = allContacts.filter(contact => this.isAffiliate(contact));
    const deduplicatedAffiliates = this.deduplicateByEmail(affiliateContacts);
    
    // Campaign breakdown
    const campaignBreakdown: Record<string, number> = {};
    Object.values(this.CAMPAIGNS).forEach(campaign => {
      const campaignAffiliates = affiliateContacts.filter(contact => 
        this.getCampaignsForContact(contact).includes(campaign.name)
      );
      campaignBreakdown[campaign.name] = campaignAffiliates.length;
    });

    // Tag analysis
    const tagCounts: Record<string, number> = {};
    allContacts.forEach(contact => {
      contact.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Source analysis
    const sourceCounts: Record<string, number> = {};
    allContacts.forEach(contact => {
      if (contact.source) {
        sourceCounts[contact.source] = (sourceCounts[contact.source] || 0) + 1;
      }
    });

    // Multi-campaign analysis
    const emailToCampaigns: Record<string, string[]> = {};
    affiliateContacts.forEach(contact => {
      if (contact.email) {
        const campaigns = this.getCampaignsForContact(contact);
        if (!emailToCampaigns[contact.email]) {
          emailToCampaigns[contact.email] = [];
        }
        emailToCampaigns[contact.email].push(...campaigns);
      }
    });

    const multiCampaignAffiliates = Object.values(emailToCampaigns)
      .filter(campaigns => new Set(campaigns).size > 1).length;

    return {
      totalContacts: allContacts.length,
      affiliateInstances: affiliateContacts.length,
      uniqueAffiliates: deduplicatedAffiliates.length,
      campaignBreakdown,
      tagAnalysis: tagCounts,
      sourceAnalysis: sourceCounts,
      multiCampaignAffiliates
    };
  }
} 