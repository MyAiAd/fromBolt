#!/usr/bin/env node

/**
 * Test script for performance level calculation
 * Tests the new thresholds to ensure they work correctly
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing required environment variables');
    console.error('   VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

/**
 * Test the performance level calculation function
 */
async function testPerformanceLevels() {
    console.log('🧪 Testing Performance Level Calculation Function');
    console.log('================================================');
    
    // Test cases with expected results
    const testCases = [
        { earnings: 0, expected: 'Aligned' },
        { earnings: 500, expected: 'Aligned' },
        { earnings: 999, expected: 'Aligned' },
        { earnings: 1000, expected: 'Activated' },
        { earnings: 2500, expected: 'Activated' },
        { earnings: 4999, expected: 'Activated' },
        { earnings: 5000, expected: 'Ascended' },
        { earnings: 15000, expected: 'Ascended' },
        { earnings: 24999, expected: 'Ascended' },
        { earnings: 25000, expected: 'Magnetic' },
        { earnings: 35000, expected: 'Magnetic' },
        { earnings: 49999, expected: 'Magnetic' },
        { earnings: 50000, expected: 'Luminary' },
        { earnings: 75000, expected: 'Luminary' },
        { earnings: 99999, expected: 'Luminary' },
        { earnings: 100000, expected: 'Visionary' },
        { earnings: 250000, expected: 'Visionary' },
        { earnings: 499999, expected: 'Visionary' },
        { earnings: 500000, expected: 'Oracle' },
        { earnings: 750000, expected: 'Oracle' },
        { earnings: 999999, expected: 'Oracle' },
        { earnings: 1000000, expected: 'Sovereign' },
        { earnings: 2500000, expected: 'Sovereign' }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const testCase of testCases) {
        try {
            const { data, error } = await supabase
                .rpc('calculate_performance_level', { monthly_earnings: testCase.earnings });
            
            if (error) {
                console.error(`❌ Error testing $${testCase.earnings}: ${error.message}`);
                failed++;
                continue;
            }
            
            const result = data;
            if (result === testCase.expected) {
                console.log(`✅ $${testCase.earnings.toLocaleString()} → ${result}`);
                passed++;
            } else {
                console.log(`❌ $${testCase.earnings.toLocaleString()} → ${result} (expected ${testCase.expected})`);
                failed++;
            }
        } catch (error) {
            console.error(`❌ Exception testing $${testCase.earnings}: ${error.message}`);
            failed++;
        }
    }
    
    console.log('\n📊 Test Results:');
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    return failed === 0;
}

/**
 * Test the monthly commission earnings function
 */
async function testMonthlyEarningsFunction() {
    console.log('\n🧪 Testing Monthly Commission Earnings Function');
    console.log('===============================================');
    
    try {
        // Test with a sample email (this will likely return 0 unless there's real data)
        const { data, error } = await supabase
            .rpc('get_monthly_commission_earnings', {
                p_email: 'test@example.com',
                p_source: 'goaffpro'
            });
        
        if (error) {
            console.error(`❌ Error testing monthly earnings function: ${error.message}`);
            return false;
        }
        
        console.log(`✅ Function executed successfully, returned: $${data || 0}`);
        console.log('   (Note: Returns 0 for non-existent email, which is expected)');
        
        return true;
    } catch (error) {
        console.error(`❌ Exception testing monthly earnings: ${error.message}`);
        return false;
    }
}

/**
 * Check current performance level distribution
 */
async function checkCurrentDistribution() {
    console.log('\n📊 Current Performance Level Distribution');
    console.log('========================================');
    
    const tables = ['goaffpro_affiliates', 'mightynetworks_affiliates', 'affiliate_system_users'];
    let totalAffiliates = 0;
    const distribution = {};
    
    for (const table of tables) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('current_performance_level, current_month_earnings')
                .not('current_performance_level', 'is', null);
            
            if (error) {
                console.warn(`⚠️  Could not check ${table}: ${error.message}`);
                continue;
            }
            
            console.log(`\n📋 ${table}:`);
            data.forEach(row => {
                const level = row.current_performance_level;
                const earnings = row.current_month_earnings || 0;
                distribution[level] = (distribution[level] || 0) + 1;
                totalAffiliates++;
                console.log(`   • ${level}: $${earnings.toLocaleString()}`);
            });
            
        } catch (error) {
            console.warn(`⚠️  Error checking ${table}: ${error.message}`);
        }
    }
    
    if (totalAffiliates > 0) {
        console.log(`\n📈 Summary (${totalAffiliates} total affiliates):`);
        Object.entries(distribution)
            .sort(([,a], [,b]) => b - a)
            .forEach(([level, count]) => {
                const percentage = ((count / totalAffiliates) * 100).toFixed(1);
                console.log(`   • ${level}: ${count} affiliates (${percentage}%)`);
            });
    } else {
        console.log('   No affiliates found with performance levels set');
    }
}

/**
 * Main test execution
 */
async function main() {
    console.log('🎯 Performance Level System Test Suite');
    console.log('======================================');
    
    try {
        // Test database connection
        console.log('🔌 Testing database connection...');
        const { data, error } = await supabase
            .from('goaffpro_affiliates')
            .select('count(*)')
            .limit(1);
        
        if (error) {
            throw new Error(`Database connection failed: ${error.message}`);
        }
        
        console.log('✅ Database connection successful');
        
        // Run tests
        const levelTestsPassed = await testPerformanceLevels();
        const earningsTestsPassed = await testMonthlyEarningsFunction();
        
        // Check current distribution
        await checkCurrentDistribution();
        
        // Summary
        console.log('\n🎯 Test Suite Summary');
        console.log('====================');
        console.log(`✅ Performance Level Function: ${levelTestsPassed ? 'PASSED' : 'FAILED'}`);
        console.log(`✅ Monthly Earnings Function: ${earningsTestsPassed ? 'PASSED' : 'FAILED'}`);
        
        if (levelTestsPassed && earningsTestsPassed) {
            console.log('\n🎉 All tests passed! The performance level system is working correctly.');
            console.log('💡 You can now run the monthly scheduler to update all affiliate levels.');
        } else {
            console.log('\n❌ Some tests failed. Please check the database migration.');
        }
        
        process.exit(levelTestsPassed && earningsTestsPassed ? 0 : 1);
        
    } catch (error) {
        console.error('\n❌ Test suite failed:', error.message);
        process.exit(1);
    }
}

// Run the tests
main(); 