// Test script to verify commission plans are set up correctly
import { createClient } from '@supabase/supabase-js';

// Local Supabase instance configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testCommissionPlans() {
  console.log('🧪 Testing Commission Plans Setup\n');

  try {
    // Query all commission plans
    const { data: plans, error } = await supabase
      .from('commission_plans')
      .select('*')
      .order('product_name');

    if (error) {
      console.error('❌ Error fetching commission plans:', error);
      return;
    }

    if (!plans || plans.length === 0) {
      console.log('⚠️ No commission plans found in database');
      return;
    }

    console.log('✅ Commission Plans Found:', plans.length);
    console.log('\n📊 Commission Structure:');
    console.log('-'.repeat(80));
    console.log('Product'.padEnd(20) + 'L1'.padEnd(8) + 'L2'.padEnd(8) + 'L3'.padEnd(8) + 'Status');
    console.log('-'.repeat(80));

    plans.forEach(plan => {
      const status = plan.is_active ? '✅ Active' : '❌ Inactive';
      console.log(
        plan.product_name.padEnd(20) + 
        `${plan.level_1_rate}%`.padEnd(8) + 
        `${plan.level_2_rate}%`.padEnd(8) + 
        `${plan.level_3_rate}%`.padEnd(8) + 
        status
      );
    });

    console.log('-'.repeat(80));

    // Verify Jennaz's specific requirements
    console.log('\n🎯 Verification against Jennaz\'s Requirements:');
    const requirements = {
      'Bae': { l1: 20, l2: 10, l3: 5 },
      'Coaching Packs': { l1: 20, l2: 10, l3: 5 },
      'Online Mastery': { l1: 20, l2: 10, l3: 5 },
      'BRAVO Fitness': { l1: 20, l2: 10, l3: 5 },
      'AI System': { l1: 20, l2: 10, l3: 5 },
      'REACTION CBD': { l1: 15, l2: 5, l3: 5 },
      'EVENTS': { l1: 5, l2: 2.5, l3: 2.5 }
    };

    let allMatch = true;
    for (const [productName, expectedRates] of Object.entries(requirements)) {
      const plan = plans.find(p => p.product_name === productName);
      if (!plan) {
        console.log(`❌ Missing plan for: ${productName}`);
        allMatch = false;
      } else {
        const l1Match = plan.level_1_rate == expectedRates.l1;
        const l2Match = plan.level_2_rate == expectedRates.l2;
        const l3Match = plan.level_3_rate == expectedRates.l3;
        const isActive = plan.is_active;

        if (l1Match && l2Match && l3Match && isActive) {
          console.log(`✅ ${productName}: ${plan.level_1_rate}%/${plan.level_2_rate}%/${plan.level_3_rate}%`);
        } else {
          console.log(`❌ ${productName}: Expected ${expectedRates.l1}%/${expectedRates.l2}%/${expectedRates.l3}%, Got ${plan.level_1_rate}%/${plan.level_2_rate}%/${plan.level_3_rate}%`);
          allMatch = false;
        }
      }
    }

    if (allMatch) {
      console.log('\n🎉 SUCCESS: All commission plans match Jennaz\'s requirements!');
    } else {
      console.log('\n⚠️ Some commission plans need adjustment');
    }

    // Test the commission calculation function
    console.log('\n🔧 Testing Commission Calculation Function:');
    try {
      const { data: testResult, error: funcError } = await supabase
        .rpc('get_commission_plan_for_product', {
          p_product_name: 'Bae'
        });

      if (funcError) {
        console.log('❌ Error testing function:', funcError.message);
      } else if (testResult && testResult.length > 0) {
        const plan = testResult[0];
        console.log(`✅ Function works: ${plan.product_name} returns ${plan.level_1_rate}%/${plan.level_2_rate}%/${plan.level_3_rate}%`);
      } else {
        console.log('⚠️ Function returned no results');
      }
    } catch (error) {
      console.log('❌ Function test failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testCommissionPlans().then(() => {
  console.log('\n✅ Commission Plans Test Complete');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
}); 