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

interface ContactAnalysis {
  id: string;
  email: string;
  name: string;
  hasReferralCode: boolean;
  referralCode?: string;
  tags: string[];
  customFieldKeys: string[];
  affiliateIndicators: string[];
  isInDatabase: boolean;
  databaseSource?: string;
}

interface GHLAnalysisResult {
  totalContacts: number;
  contactsWithReferralCodes: number;
  contactsWithAffiliateTags: number;
  contactsWithAffiliateCustomFields: number;
  contactsInDatabase: number;
  contactsNotInDatabase: number;
  sampleContacts: ContactAnalysis[];
  tagFrequency: Record<string, number>;
  customFieldFrequency: Record<string, number>;
  recommendations: string[];
}

export class GHLAnalysisService {
  private supabase: any;

  constructor(supabase: any) {
    this.supabase = supabase;
  }

  async analyzeGHLContacts(credentials: { apiKey: string; locationId: string }): Promise<GHLAnalysisResult> {
    console.log('🔍 Starting GHL contact analysis...');
    
    const result: GHLAnalysisResult = {
      totalContacts: 0,
      contactsWithReferralCodes: 0,
      contactsWithAffiliateTags: 0,
      contactsWithAffiliateCustomFields: 0,
      contactsInDatabase: 0,
      contactsNotInDatabase: 0,
      sampleContacts: [],
      tagFrequency: {},
      customFieldFrequency: {},
      recommendations: []
    };

    // First, get existing emails from database
    console.log('📊 Fetching existing affiliate emails from database...');
    const { data: existingAffiliates } = await this.supabase
      .from('affiliate_system_users')
      .select('email, primary_source');
    
    const existingEmails = new Set(existingAffiliates?.map((a: any) => a.email.toLowerCase()) || []);
    console.log(`📊 Found ${existingEmails.size} existing affiliates in database`);

    // Fetch GHL contacts (limit to first 500 for analysis)
    const allContacts: GHLContact[] = [];
    let page = 1;
    let hasMore = true;
    const limit = 100;
    
    while (hasMore && page <= 5) { // Limit to 5 pages (500 contacts) for analysis
      console.log(`📥 Analyzing GHL page ${page}...`);
      
      const url = `https://rest.gohighlevel.com/v1/contacts/?locationId=${credentials.locationId}&limit=${limit}&skip=${(page - 1) * limit}`;
      
      const response = await fetch(url, {
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
        allContacts.push(...responseData.contacts);
        console.log(`📊 Collected ${responseData.contacts.length} contacts from page ${page} (total: ${allContacts.length})`);
        
        const contactsReceived = responseData.contacts.length;
        hasMore = contactsReceived === limit;
        page++;
      } else {
        hasMore = false;
      }
    }

    result.totalContacts = allContacts.length;
    console.log(`📊 Total contacts to analyze: ${result.totalContacts}`);

    // Analyze each contact
    for (const contact of allContacts) {
      if (!contact.email) continue;

      const analysis: ContactAnalysis = {
        id: contact.id,
        email: contact.email,
        name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unknown',
        hasReferralCode: !!(contact.referralCode && contact.referralCode.trim()),
        referralCode: contact.referralCode,
        tags: contact.tags || [],
        customFieldKeys: contact.customFields ? Object.keys(contact.customFields) : [],
        affiliateIndicators: [],
        isInDatabase: existingEmails.has(contact.email.toLowerCase()),
        databaseSource: undefined
      };

      // Check for affiliate indicators
      if (analysis.hasReferralCode) {
        analysis.affiliateIndicators.push('referralCode');
        result.contactsWithReferralCodes++;
      }

      // Check tags
      const affiliateTags = analysis.tags.filter(tag => {
        const tagLower = tag.toLowerCase();
        return tagLower.includes('affiliate') || 
               tagLower.includes('partner') || 
               tagLower.includes('referrer') ||
               tagLower.includes('ambassador') ||
               tagLower.includes('influencer');
      });
      
      if (affiliateTags.length > 0) {
        analysis.affiliateIndicators.push(`tags: ${affiliateTags.join(', ')}`);
        result.contactsWithAffiliateTags++;
      }

      // Check custom fields
      const affiliateCustomFields = analysis.customFieldKeys.filter(key => {
        const keyLower = key.toLowerCase();
        return keyLower.includes('referral') ||
               keyLower.includes('affiliate') ||
               keyLower.includes('commission') ||
               keyLower.includes('payout');
      });

      if (affiliateCustomFields.length > 0) {
        analysis.affiliateIndicators.push(`customFields: ${affiliateCustomFields.join(', ')}`);
        result.contactsWithAffiliateCustomFields++;
      }

      // Track tag frequency
      analysis.tags.forEach(tag => {
        result.tagFrequency[tag] = (result.tagFrequency[tag] || 0) + 1;
      });

      // Track custom field frequency
      analysis.customFieldKeys.forEach(key => {
        result.customFieldFrequency[key] = (result.customFieldFrequency[key] || 0) + 1;
      });

      // Database status
      if (analysis.isInDatabase) {
        result.contactsInDatabase++;
        const existing = existingAffiliates?.find((a: any) => a.email.toLowerCase() === contact.email.toLowerCase());
        analysis.databaseSource = existing?.primary_source;
      } else {
        result.contactsNotInDatabase++;
      }

      // Keep first 50 contacts as samples
      if (result.sampleContacts.length < 50) {
        result.sampleContacts.push(analysis);
      }
    }

    // Generate recommendations
    result.recommendations = this.generateRecommendations(result);

    console.log('📊 Analysis Summary:', {
      total: result.totalContacts,
      withReferralCodes: result.contactsWithReferralCodes,
      withAffiliateTags: result.contactsWithAffiliateTags,
      withAffiliateCustomFields: result.contactsWithAffiliateCustomFields,
      inDatabase: result.contactsInDatabase,
      notInDatabase: result.contactsNotInDatabase
    });

    return result;
  }

  private generateRecommendations(result: GHLAnalysisResult): string[] {
    const recommendations: string[] = [];

    // Analyze the data patterns
    const potentialAffiliates = result.contactsWithReferralCodes + 
                               result.contactsWithAffiliateTags + 
                               result.contactsWithAffiliateCustomFields;

    if (result.contactsWithReferralCodes > 0) {
      recommendations.push(`✅ ${result.contactsWithReferralCodes} contacts have referral codes - these are likely real affiliates`);
    }

    if (result.contactsWithAffiliateTags > 0) {
      recommendations.push(`🏷️ ${result.contactsWithAffiliateTags} contacts have affiliate-related tags`);
    }

    if (result.contactsWithAffiliateCustomFields > 0) {
      recommendations.push(`📝 ${result.contactsWithAffiliateCustomFields} contacts have affiliate-related custom fields`);
    }

    if (result.contactsNotInDatabase > result.contactsInDatabase) {
      recommendations.push(`📈 ${result.contactsNotInDatabase} contacts are NOT in database yet - potential for import`);
    }

    // Analyze top tags
    const topTags = Object.entries(result.tagFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    if (topTags.length > 0) {
      recommendations.push(`🔝 Most common tags: ${topTags.map(([tag, count]) => `${tag} (${count})`).join(', ')}`);
    }

    // Analyze top custom fields
    const topFields = Object.entries(result.customFieldFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    if (topFields.length > 0) {
      recommendations.push(`🔝 Most common custom fields: ${topFields.map(([field, count]) => `${field} (${count})`).join(', ')}`);
    }

    return recommendations;
  }
} 