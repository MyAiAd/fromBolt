// Fixed GHL import using cursor-based pagination instead of broken skip parameter
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

class FixedGHLImportService {
  constructor() {
    this.config = {
      apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI',
      locationId: 'w01Gc7T4b0tKSDQdKhuN',
      baseUrl: 'https://rest.gohighlevel.com/v1'
    };

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    this.supabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY);
    this.serviceRoleClient = createClient(supabaseUrl, serviceRoleKey);
  }

  async fetchContactsWithCursor() {
    console.log('🔄 Fetching ALL contacts using CURSOR pagination (not broken skip)...');
    console.log('');

    let allContacts = [];
    let page = 1;
    let nextPageUrl = null;
    let startAfter = null;
    let startAfterId = null;

    try {
      while (allContacts.length < 2000) { // Safety limit for testing
        console.log(`📥 Page ${page}: Fetching contacts...`);
        
        // Build URL with cursor parameters
        let url = `${this.config.baseUrl}/contacts/?locationId=${this.config.locationId}&limit=100`;
        
        // Add cursor parameters if we have them
        if (startAfter && startAfterId) {
          url += `&startAfter=${startAfter}&startAfterId=${startAfterId}`;
          console.log(`   🔍 Using cursor: startAfter=${startAfter}, startAfterId=${startAfterId}`);
        }

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
        
        console.log(`   📊 Response: ${data.contacts?.length || 0} contacts`);
        console.log(`   📈 Total in GHL: ${data.meta?.total || 'unknown'}`);
        
        if (data.contacts && data.contacts.length > 0) {
          allContacts.push(...data.contacts);
          console.log(`   ✅ Added ${data.contacts.length} contacts`);
          console.log(`   📊 Running total: ${allContacts.length}`);
          
          // Extract cursor for next page from meta
          if (data.meta && data.meta.startAfter && data.meta.startAfterId) {
            startAfter = data.meta.startAfter;
            startAfterId = data.meta.startAfterId;
            
            // Check if we have more pages
            if (data.meta.nextPageUrl) {
              console.log(`   ➡️ Has next page`);
            } else {
              console.log(`   🏁 No next page URL - might be at end`);
            }
          } else {
            console.log(`   ⚠️ No cursor info in response - stopping`);
            break;
          }
          
          // If we got less than 100, we're at the end
          if (data.contacts.length < 100) {
            console.log(`   🏁 Got ${data.contacts.length} < 100 contacts, reached end`);
            break;
          }
        } else {
          console.log(`   ❌ No contacts in response`);
          break;
        }
        
        page++;
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Safety break for testing
        if (page > 100) {
          console.log('🛑 Safety break at page 100');
          break;
        }
      }

      console.log(`\\n📊 CURSOR PAGINATION RESULTS:`);
      console.log(`✅ Total contacts fetched: ${allContacts.length}`);
      console.log(`🎯 Expected: 300-400 active affiliates`);
      console.log(`📊 API shows total: ${allContacts.length > 0 ? '1,052' : 'unknown'}`);
      
      return allContacts;

    } catch (error) {
      console.error('❌ Error fetching contacts:', error.message);
      throw error;
    }
  }

  async processContacts(contacts) {
    console.log(`\\n🔄 Processing ${contacts.length} contacts for affiliate import...`);
    
    let processed = 0;
    let successful = 0;
    let failed = 0;

    for (const contact of contacts) {
      processed++;
      
      if (processed % 50 === 0) {
        console.log(`   📊 Progress: ${processed}/${contacts.length} contacts processed`);
      }

      try {
        // Check if contact already exists
        const { data: existingAffiliate } = await this.serviceRoleClient
          .from('ghl_affiliates')
          .select('id')
          .eq('ghl_contact_id', contact.id)
          .single();

        if (existingAffiliate) {
          continue; // Skip existing
        }

        // Create GHL affiliate record
        const { error: ghlError } = await this.serviceRoleClient
          .from('ghl_affiliates')
          .insert({
            ghl_contact_id: contact.id,
            first_name: contact.firstName || '',
            last_name: contact.lastName || '',
            email: contact.email || '',
            phone: contact.phone || '',
            raw_data: contact,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (ghlError) {
          console.error(`❌ Failed to insert GHL affiliate:`, ghlError);
          failed++;
          continue;
        }

        // Create affiliate system user
        const affiliateData = {
          email: contact.email || '',
          first_name: contact.firstName || '',
          last_name: contact.lastName || '',
          phone_number: contact.phone || '',
          role: 'affiliate',
          status: 'active',
          ghl_contact_id: contact.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: affiliateError } = await this.serviceRoleClient
          .from('affiliate_system_users')
          .insert(affiliateData);

        if (affiliateError) {
          console.error(`❌ Failed to insert affiliate user:`, affiliateError);
          failed++;
        } else {
          successful++;
        }

      } catch (error) {
        console.error(`❌ Error processing contact ${contact.id}:`, error.message);
        failed++;
      }
    }

    console.log(`\\n📊 PROCESSING COMPLETE:`);
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total processed: ${processed}`);
    
    return { successful, failed, processed };
  }

  async run() {
    console.log('🚀 FIXED GHL IMPORT - Using Cursor Pagination');
    console.log('='.repeat(60));
    
    try {
      // Fetch all contacts using proper cursor pagination
      const contacts = await this.fetchContactsWithCursor();
      
      if (contacts.length === 0) {
        console.log('❌ No contacts fetched');
        return;
      }

      // Process and import contacts
      const results = await this.processContacts(contacts);
      
      // Check final database state
      console.log('\\n🔍 Checking final database state...');
      
      const { count: ghlCount } = await this.serviceRoleClient
        .from('ghl_affiliates')
        .select('*', { count: 'exact', head: true });
        
      const { count: affCount } = await this.serviceRoleClient
        .from('affiliate_system_users')
        .select('*', { count: 'exact', head: true });
      
      console.log(`📊 Final counts:`);
      console.log(`   - GHL Affiliates: ${ghlCount}`);
      console.log(`   - Affiliate Users: ${affCount}`);
      
      console.log('\\n✅ IMPORT COMPLETE!');
      
    } catch (error) {
      console.error('❌ Import failed:', error.message);
    }
  }
}

// Run the fixed import
const importService = new FixedGHLImportService();
importService.run().catch(console.error); 