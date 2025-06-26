#!/usr/bin/env node

/**
 * Monthly Performance Level Scheduler
 * Automatically calculates and updates affiliate performance levels
 * Should be run on the 1st of each month via cron job
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for admin access
const FORCE_RUN = process.env.FORCE_RUN === 'true' || process.argv.includes('--force');

// Initialize Supabase client with service role (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

/**
 * Check if today is the 1st of the month (or force run)
 */
function shouldRunCalculation() {
    if (FORCE_RUN) {
        console.log('🔄 Force run enabled - proceeding with calculation');
        return true;
    }
    
    const today = new Date();
    const dayOfMonth = today.getDate();
    
    if (dayOfMonth === 1) {
        console.log('📅 Today is the 1st of the month - proceeding with calculation');
        return true;
    }
    
    console.log(`⏸️  Today is day ${dayOfMonth} of the month - skipping calculation`);
    console.log('   Use --force flag or FORCE_RUN=true to run manually');
    return false;
}

/**
 * Main calculation function
 */
async function runMonthlyCalculation() {
    console.log('🚀 Starting monthly performance level calculation...');
    console.log(`📊 Current time: ${new Date().toISOString()}`);
    
    try {
        // Verify database connection
        const { data: connectionTest, error: connectionError } = await supabase
            .from('goaffpro_affiliates')
            .select('count(*)')
            .limit(1);
        
        if (connectionError) {
            throw new Error(`Database connection failed: ${connectionError.message}`);
        }
        
        console.log('✅ Database connection verified');
        
        // Check if function exists
        const { data: functionCheck, error: functionError } = await supabase
            .rpc('recalculate_monthly_performance_levels');
        
        if (functionError) {
            console.error('❌ Function execution failed:', functionError);
            throw new Error(`Performance calculation function failed: ${functionError.message}`);
        }
        
        const result = Array.isArray(functionCheck) ? functionCheck[0] : functionCheck;
        
        console.log('✅ Monthly calculation completed successfully!');
        console.log('📊 Results:');
        console.log(`   • Processed affiliates: ${result.processed_count || 0}`);
        console.log(`   • Month key: ${result.month_key || 'N/A'}`);
        console.log(`   • Execution time: ${result.execution_time_ms || 0}ms`);
        console.log(`   • Errors: ${result.errors_count || 0}`);
        console.log(`   • Status: ${result.status || 'unknown'}`);
        
        // Send notification if there were errors
        if (result.errors_count > 0) {
            console.warn('⚠️  Some errors occurred during calculation. Check logs for details.');
        }
        
        return result;
        
    } catch (error) {
        console.error('❌ Monthly calculation failed:', error.message);
        
        // Log the failure to database if possible
        try {
            await supabase
                .from('monthly_calculation_logs')
                .insert({
                    month_key: new Date().toISOString().slice(0, 7), // YYYY-MM
                    processed_count: 0,
                    errors_count: 1,
                    status: 'failed',
                    error_details: error.message,
                    execution_time_ms: 0
                });
        } catch (logError) {
            console.error('❌ Failed to log error to database:', logError.message);
        }
        
        throw error;
    }
}

/**
 * Verify current performance level distribution
 */
async function verifyResults() {
    console.log('\n🔍 Verifying performance level distribution...');
    
    try {
        // Get distribution from all tables
        const tables = ['goaffpro_affiliates', 'mightynetworks_affiliates', 'affiliate_system_users'];
        let totalAffiliates = 0;
        const distribution = {};
        
        for (const table of tables) {
            const { data, error } = await supabase
                .from(table)
                .select('current_performance_level')
                .not('current_performance_level', 'is', null);
                
            if (error) {
                console.warn(`⚠️  Warning: Could not verify ${table}: ${error.message}`);
                continue;
            }
            
            data.forEach(row => {
                const level = row.current_performance_level;
                distribution[level] = (distribution[level] || 0) + 1;
                totalAffiliates++;
            });
        }
        
        console.log(`📊 Performance Level Distribution (${totalAffiliates} total affiliates):`);
        Object.entries(distribution)
            .sort(([,a], [,b]) => b - a) // Sort by count descending
            .forEach(([level, count]) => {
                const percentage = ((count / totalAffiliates) * 100).toFixed(1);
                console.log(`   • ${level}: ${count} affiliates (${percentage}%)`);
            });
            
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    }
}

/**
 * Main execution
 */
async function main() {
    console.log('🎯 Monthly Performance Level Scheduler');
    console.log('=====================================');
    
    try {
        // Check if we should run
        if (!shouldRunCalculation()) {
            process.exit(0);
        }
        
        // Run the calculation
        const result = await runMonthlyCalculation();
        
        // Verify results
        await verifyResults();
        
        console.log('\n✅ Monthly calculation completed successfully!');
        console.log('📧 Consider setting up email notifications for calculation results.');
        
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ Monthly calculation failed:', error.message);
        console.error('🔧 Check your database connection and migration status.');
        
        process.exit(1);
    }
}

/**
 * Handle script termination
 */
process.on('SIGINT', () => {
    console.log('\n⏸️  Calculation interrupted by user');
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('\n⏸️  Calculation terminated');
    process.exit(1);
});

// Export for testing
export {
    runMonthlyCalculation,
    shouldRunCalculation,
    verifyResults
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
} 