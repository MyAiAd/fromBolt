// FINAL FIXED - GHL import using cursor-based pagination with correct schema
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

class FinalGHLImportService {
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
    console.log('🔄 Fetching ALL contacts using CURSOR pagination...');
    console.log('');

    let allContacts = [];
    let page = 1;
    let startAfter = null;
    let startAfterId = null;

    try {
      while (allContacts.length < 2000) { // Safety limit
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
        
        if (data.contacts && data.contacts.length > 0) {
          allContacts.push(...data.contacts);
          console.log(`   ✅ Added ${data.contacts.length} contacts`);
          console.log(`   📊 Running total: ${allContacts.length}`);
          
          // Extract cursor for next page from meta
          if (data.meta && data.meta.startAfter && data.meta.startAfterId) {
            startAfter = data.meta.startAfter;
            startAfterId = data.meta.startAfterId;
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
        
        // Safety break
        if (page > 100) {
          console.log('🛑 Safety break at page 100');
          break;
        }
      }

      console.log(`\\n📊 CURSOR PAGINATION RESULTS:`);
      console.log(`✅ Total contacts fetched: ${allContacts.length}`);
      
      return allContacts;

    } catch (error) {
      console.error('❌ Error fetching contacts:', error.message);
      throw error;
    }
  }

  async processContacts(contacts) {
    console.log(`\\n🔄 Processing ${contacts.length} contacts...`);
    
    let processed = 0;
    let successful = 0;
    let failed = 0;
    let skipped = 0;

    for (const contact of contacts) {
      processed++;
      
      if (processed % 100 === 0) {
        console.log(`   📊 Progress: ${processed}/${contacts.length} (${successful} success, ${failed} failed, ${skipped} skipped)`);
      }

      try {
        // Check if contact already exists
        const { data: existingAffiliate } = await this.serviceRoleClient
          .from('ghl_affiliates')
          .select('id')
          .eq('ghl_contact_id', contact.id)
          .single();

        if (existingAffiliate) {
          skipped++;
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

        // Create affiliate system user (fixed column name)
        const affiliateData = {
          email: contact.email || '',
          first_name: contact.firstName || '',
          last_name: contact.lastName || '',
          phone: contact.phone || '', // FIXED: phone instead of phone_number
          primary_source: 'ghl',
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
    console.log(`⏭️ Skipped (existing): ${skipped}`);
    console.log(`📊 Total processed: ${processed}`);
    
    return { successful, failed, skipped, processed };
  }

  async run() {
    console.log('🚀 FINAL FIXED GHL IMPORT - Cursor Pagination + Correct Schema');
    console.log('='.repeat(70));
    
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
      console.log('\\n🔍 Final database state...');
      
      const { count: ghlCount } = await this.serviceRoleClient
        .from('ghl_affiliates')
        .select('*', { count: 'exact', head: true });
        
      const { count: affCount } = await this.serviceRoleClient
        .from('affiliate_system_users')
        .select('*', { count: 'exact', head: true });
      
      console.log(`\\n📊 FINAL SUCCESS SUMMARY:`);
      console.log(`=`.repeat(50));
      console.log(`✅ Total GHL Affiliates: ${ghlCount}`);
      console.log(`✅ Total Affiliate Users: ${affCount}`);
      console.log(`🎯 Expected 300-400: ${affCount >= 300 ? '✅ ACHIEVED' : '⚠️ PARTIAL'}`);
      console.log(`🚀 Import Status: COMPLETE`);
      
    } catch (error) {
      console.error('❌ Import failed:', error.message);
    }
  }
}

// Run the final fixed import
const importService = new FinalGHLImportService();
importService.run().catch(console.error); 