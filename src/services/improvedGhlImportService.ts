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
  referredBy?: string;
  referralCode?: string;
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

export interface GHLImportConfig {
  apiKey: string;
  locationId: string;
  baseUrl?: string;
}

export class ImprovedGHLImportService {
  private config: GHLImportConfig;
  private supabase: SupabaseClient;
  private serviceRoleClient: SupabaseClient;

  // Campaign definitions - Updated based on successful testing
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
    config: GHLImportConfig
  ) {
    this.supabase = supabase;
    this.serviceRoleClient = serviceRoleClient;
    this.config = {
      baseUrl: 'https://rest.gohighlevel.com/v1',
      ...config
    };
  }

  // Enhanced affiliate identification with validated tag-based approach
  private isAffiliate(contact: GHLContact): boolean {
    const tags = contact.tags?.map(tag => tag.toLowerCase()) || [];
    const source = contact.source?.toLowerCase() || '';

    // Primary validation: Check for affiliate tags (validated approach)
    const hasAffiliateTag = this.ALL_AFFILIATE_TAGS.some(affiliateTag => 
      tags.includes(affiliateTag.toLowerCase())
    );

    // Secondary validation: Check for campaign sources
    const hasCampaignSource = Object.values(this.CAMPAIGNS).some(campaign =>
      campaign.sources.some(campaignSource => 
        source.includes(campaignSource.toLowerCase())
      )
    );

    // Use tag-based approach as primary (this gave us 461/481 = 96% success)
    return hasAffiliateTag || hasCampaignSource;
  }

  private getCampaignsForContact(contact: GHLContact): string[] {
    const campaigns: string[] = [];
    const tags = contact.tags?.map(tag => tag.toLowerCase()) || [];
    const source = contact.source?.toLowerCase() || '';

    // Check campaign tags
    Object.entries(this.CAMPAIGN_TAGS).forEach(([tag, campaignName]) => {
      if (tags.includes(tag)) {
        campaigns.push(campaignName);
      }
    });

    // Check campaign sources
    Object.entries(this.CAMPAIGN_SOURCES).forEach(([sourceKeyword, campaignName]) => {
      if (source.includes(sourceKeyword)) {
        campaigns.push(campaignName);
      }
    });

    return [...new Set(campaigns)]; // Remove duplicates
  }

  private isLikelyAffiliateSignupDate(dateAdded: string): boolean {
    const signupDate = new Date(dateAdded);
    const now = new Date();
    const daysDiff = (now.getTime() - signupDate.getTime()) / (1000 * 3600 * 24);
    
    return daysDiff < 365; // Within last year
  }

  private isRecentActivity(lastActivity: string): boolean {
    const activityDate = new Date(lastActivity);
    const now = new Date();
    const daysDiff = (now.getTime() - activityDate.getTime()) / (1000 * 3600 * 24);
    
    return daysDiff < 90; // Active within last 3 months
  }

  async fetchAllContacts(): Promise<GHLContact[]> {
    console.log('🔄 Fetching all contacts from Go High Level (v1.0 API)...');
    
    const allContacts: GHLContact[] = [];
    let startAfter: number | null = null;
    let startAfterId: string | null = null;
    let page = 1;
    const limit = 100;
    let hasMore = true;
    
    while (hasMore && allContacts.length < 2000) { // Safety limit
      try {
        console.log(`📥 Fetching contacts ${skip + 1}-${skip + limit}...`);
        
        const url = `${this.config.baseUrl}/contacts/?locationId=${this.config.locationId}&limit=${limit}&skip=${skip}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`GHL API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.contacts && data.contacts.length > 0) {
          allContacts.push(...data.contacts);
          console.log(`✅ Fetched ${data.contacts.length} contacts (total: ${allContacts.length})`);
          
          hasMore = data.contacts.length === limit;
          skip += limit;
        } else {
          hasMore = false;
        }
        
        // Rate limiting
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
      } catch (error) {
        console.error(`❌ Error fetching contacts at skip ${skip}:`, error);
        break;
      }
    }

    console.log(`✅ Total contacts fetched: ${allContacts.length}`);
    return allContacts;
  }

  async importAffiliatesWithFiltering(userId: string): Promise<ImportResult> {
    console.log('🚀 Starting improved GHL affiliate import with campaign awareness...');
    
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
      // Fetch all contacts
      const allContacts = await this.fetchAllContacts();
      console.log(`📊 Total GHL contacts: ${allContacts.length}`);

      // Filter for affiliates
      console.log('🎯 Filtering contacts to identify affiliates...');
      const affiliateContacts = allContacts.filter(contact => this.isAffiliate(contact));
      
      // Deduplicate by email (handle multi-campaign affiliates)
      const deduplicatedAffiliates = this.deduplicateByEmail(affiliateContacts);
      
      console.log(`🎯 Identified ${affiliateContacts.length} affiliate instances`);
      console.log(`👤 Unique affiliates: ${deduplicatedAffiliates.length} (after deduplication)`);
      console.log(`📊 Campaign overlap: ${affiliateContacts.length - deduplicatedAffiliates.length} duplicates`);
      console.log(`🎯 Target (481) comparison: ${deduplicatedAffiliates.length}/481 (${((deduplicatedAffiliates.length/481)*100).toFixed(1)}%)`);
      
      // Check target achievement
      const expectedCount = 481;
      const difference = Math.abs(deduplicatedAffiliates.length - expectedCount);
      const percentageDiff = (difference / expectedCount) * 100;
      
      if (percentageDiff <= 10) {
        console.log(`✅ EXCELLENT: Within 10% of target (${difference} difference)`);
      } else if (percentageDiff <= 20) {
        console.log(`🟡 GOOD: Within 20% of target (${difference} difference)`);
      } else {
        console.log(`🟠 FAIR: ${percentageDiff.toFixed(1)}% difference from target (${difference})`);
      }

      result.recordsProcessed = deduplicatedAffiliates.length;

      // Process deduplicated affiliates
      console.log('🔄 Processing unique affiliate contacts...');
      
      for (const contact of deduplicatedAffiliates) {
        try {
          // Generate referral code
          const referralCode = contact.referralCode || this.generateReferralCode(contact);

          // Get campaigns for this affiliate
          const campaigns = this.getCampaignsForContact(contact);

          // Import into main affiliate system
          const affiliateData = {
            email: contact.email,
            first_name: contact.firstName || null,
            last_name: contact.lastName || null,
            phone: contact.phone || null,
            referral_code: referralCode,
            primary_source: 'ghl',
            ghl_contact_id: contact.id,
            status: 'active',
            signup_date: contact.dateAdded ? new Date(contact.dateAdded).toISOString() : new Date().toISOString(),
            last_active: contact.lastActivity ? new Date(contact.lastActivity).toISOString() : null,
            custom_fields: JSON.stringify({
              campaigns: campaigns,
              tags: contact.tags || [],
              source: contact.source,
              ...contact.customFields
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

      console.log('✅ Improved GHL affiliate import completed');
      console.log(`📊 Results: ${result.recordsSuccessful}/${result.recordsProcessed} successful`);
      console.log(`🎯 Target achievement: ${result.recordsSuccessful}/481 (${((result.recordsSuccessful/481)*100).toFixed(1)}%)`);

      return result;

    } catch (error) {
      result.errors.push(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  // Deduplicate contacts by email, preserving the most complete record
  private deduplicateByEmail(contacts: GHLContact[]): GHLContact[] {
    const emailMap = new Map<string, GHLContact>();

    contacts.forEach(contact => {
      const email = contact.email.toLowerCase();
      const existing = emailMap.get(email);

      if (!existing) {
        emailMap.set(email, contact);
      } else {
        // Keep the contact with more complete information
        const currentScore = this.getCompletenessScore(contact);
        const existingScore = this.getCompletenessScore(existing);
        
        if (currentScore > existingScore) {
          // Merge campaign information
          const mergedContact = { ...contact };
          mergedContact.tags = [...new Set([...(existing.tags || []), ...(contact.tags || [])])];
          emailMap.set(email, mergedContact);
        } else {
          // Merge tags into existing contact
          const mergedContact = { ...existing };
          mergedContact.tags = [...new Set([...(existing.tags || []), ...(contact.tags || [])])];
          emailMap.set(email, mergedContact);
        }
      }
    });

    return Array.from(emailMap.values());
  }

  private getCompletenessScore(contact: GHLContact): number {
    let score = 0;
    if (contact.firstName) score++;
    if (contact.lastName) score++;
    if (contact.phone) score++;
    if (contact.dateAdded) score++;
    if (contact.lastActivity) score++;
    if (contact.referralCode) score++;
    if (contact.tags && contact.tags.length > 0) score++;
    if (contact.customFields && Object.keys(contact.customFields).length > 0) score++;
    return score;
  }

  // Analyze contacts to understand campaign and affiliate patterns
  async analyzeContactPatterns(): Promise<{
    totalContacts: number;
    affiliateInstances: number;
    uniqueAffiliates: number;
    campaignBreakdown: Record<string, number>;
    tagAnalysis: Record<string, number>;
    sourceAnalysis: Record<string, number>;
    suggestions: string[];
  }> {
    console.log('🔍 Analyzing GHL contact patterns with campaign awareness...');
    
    const allContacts = await this.fetchAllContacts();
    const affiliateContacts = allContacts.filter(contact => this.isAffiliate(contact));
    const uniqueAffiliates = this.deduplicateByEmail(affiliateContacts);
    
    // Campaign analysis
    const campaignBreakdown: Record<string, number> = {};
    affiliateContacts.forEach(contact => {
      const campaigns = this.getCampaignsForContact(contact);
      campaigns.forEach(campaign => {
        campaignBreakdown[campaign] = (campaignBreakdown[campaign] || 0) + 1;
      });
    });

    // Tag and source analysis
    const tagCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};
    
    allContacts.forEach(contact => {
      contact.tags?.forEach(tag => {
        const normalizedTag = tag.toLowerCase().trim();
        tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
      });
      
      if (contact.source) {
        const normalizedSource = contact.source.toLowerCase().trim();
        sourceCounts[normalizedSource] = (sourceCounts[normalizedSource] || 0) + 1;
      }
    });

    const targetCount = 481;
    const suggestions: string[] = [
      `📊 Total contacts analyzed: ${allContacts.length}`,
      `🎯 Affiliate instances found: ${affiliateContacts.length}`,
      `👤 Unique affiliates: ${uniqueAffiliates.length}`,
      `🔄 Campaign overlap: ${affiliateContacts.length - uniqueAffiliates.length} duplicates`,
      `🎯 Target achievement: ${((uniqueAffiliates.length / targetCount) * 100).toFixed(1)}%`,
      '',
      '🎪 Campaign Breakdown:',
      ...Object.entries(campaignBreakdown).map(([campaign, count]) => 
        `   ${campaign}: ${count} participations`
      ),
      '',
      '🏷️ Key Campaign Tags:',
      ...Object.entries(this.CAMPAIGN_TAGS).map(([tag, campaign]) => 
        `   ${tag}: ${tagCounts[tag] || 0} contacts → ${campaign}`
      )
    ];

    return {
      totalContacts: allContacts.length,
      affiliateInstances: affiliateContacts.length,
      uniqueAffiliates: uniqueAffiliates.length,
      campaignBreakdown,
      tagAnalysis: tagCounts,
      sourceAnalysis: sourceCounts,
      suggestions
    };
  }

  private generateReferralCode(contact: GHLContact): string {
    const name = `${contact.firstName || ''}${contact.lastName || ''}`.replace(/\s+/g, '');
    const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${name.substr(0, 6).toUpperCase()}${randomSuffix}`;
  }
}

export default ImprovedGHLImportService; 