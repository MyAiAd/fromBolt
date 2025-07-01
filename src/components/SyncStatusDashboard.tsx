import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle, Activity } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SyncLog {
  id: string;
  source: string;
  sync_type: string;
  status: 'started' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  records_processed?: number;
  records_successful?: number;
  records_failed?: number;
  error_details?: any;
}

interface SyncStatusProps {
  className?: string;
}

const SyncStatusDashboard: React.FC<SyncStatusProps> = ({ className = '' }) => {
  const { supabase, user, isAdmin } = useAuth();
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSyncLogs();
  }, []);

  const loadSyncLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('data_sync_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);

      if (error) {
        console.warn('Sync logs table not available:', error.message);
        setSyncLogs([]);
      } else {
        setSyncLogs(data || []);
      }
    } catch (error) {
      console.error('Error loading sync logs:', error);
      setSyncLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const createSyncLog = async (source: string, syncType: string = 'manual'): Promise<string | undefined> => {
    try {
      const { data, error } = await supabase
        .from('data_sync_logs')
        .insert({
          sync_type: syncType,
          source: source,
          status: 'started',
          trigger_user_id: user?.id
        })
        .select()
        .single();

      if (error) {
        console.warn('Could not create sync log (table may not exist):', error.message);
        return undefined;
      }

      return data.id;
    } catch (error) {
      console.warn('Sync logging not available:', error);
      return undefined;
    }
  };

  const updateSyncLog = async (logId: string | undefined, updates: {
    status: 'completed' | 'failed';
    records_processed?: number;
    records_successful?: number;
    records_failed?: number;
    error_details?: any;
  }) => {
    if (!logId) {
      console.log('No log ID provided, skipping sync log update');
      return;
    }

    try {
      const { error } = await supabase
        .from('data_sync_logs')
        .update({
          ...updates,
          completed_at: new Date().toISOString()
        })
        .eq('id', logId);

      if (error) {
        console.warn('Error updating sync log:', error.message);
      }
    } catch (error) {
      console.warn('Sync logging not available:', error);
    }
  };

  const triggerManualSync = async (source: string, types: string[] = []) => {
    if (!isAdmin) {
      alert('Only administrators can trigger manual syncs');
      return;
    }

    // Check if required environment variables are configured
    if (source === 'ghl') {
      // Hardcoded fallbacks for GHL credentials (temporary fix for Vercel env var issues)
      const hardcodedApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRSDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI';
      const hardcodedLocationId = 'w01Gc7T4b0tKSDQdKhuN';
      
      const apiKey = import.meta.env.VITE_GHL_API_KEY || process.env.VITE_GHL_API_KEY || hardcodedApiKey;
      const locationId = import.meta.env.VITE_GHL_LOCATION_ID || process.env.VITE_GHL_LOCATION_ID || hardcodedLocationId;
      
      if (!apiKey || !locationId) {
        alert('GHL API credentials are not configured. Please check your environment variables.');
        return;
      }
    }

    if (source === 'goaffpro') {
      if (!import.meta.env.VITE_GOAFFPRO_ACCESS_TOKEN || !import.meta.env.VITE_GOAFFPRO_PUBLIC_TOKEN) {
        alert('ReAction API credentials are not configured. Please check your environment variables.');
        return;
      }
    }

    setIsRefreshing(prev => ({ ...prev, [source]: true }));

    let logId: string | undefined;
    try {
      console.log(`🚀 Starting sync for ${source}...`);
      
      // Create sync log entry (optional)
      logId = await createSyncLog(source);
      if (logId) {
        console.log(`✅ Created sync log with ID: ${logId}`);
      } else {
        console.log(`⚠️ Sync logging not available, continuing with sync...`);
      }
      
      let result: { success: boolean; message: string; recordsProcessed: number };

      // Perform direct API sync instead of using Edge Functions
      if (source === 'goaffpro') {
        console.log('🔄 Performing GoAffPro sync...');
        result = await performGoAffProSync(types.length > 0 ? types : ['affiliates']);
      } else if (source === 'ghl') {
        console.log('🔄 Performing GHL sync...');
        result = await performGHLSync();
      } else {
        throw new Error(`Unknown sync source: ${source}`);
      }

      console.log('🎯 Sync result:', result);

      if (result.success) {
        // Update sync log with success
        console.log('✅ Sync successful, updating log...');
        await updateSyncLog(logId, {
          status: 'completed',
          records_processed: result.recordsProcessed,
          records_successful: result.recordsProcessed,
          records_failed: 0
        });

        alert(`✅ ${source === 'goaffpro' ? 'ReAction' : source.toUpperCase()} sync completed successfully!\n\n${result.message}`);
        
        // Refresh logs after successful sync
        setTimeout(loadSyncLogs, 1000);
      } else {
        throw new Error(result.message || 'Sync failed with unknown error');
      }

    } catch (error) {
      console.error(`Sync error for ${source}:`, error);
      
              // Update sync log with failure (only if logId was successfully created)
        await updateSyncLog(logId, {
          status: 'failed',
          records_processed: 0,
          records_successful: 0,
          records_failed: 0,
          error_details: { message: error instanceof Error ? error.message : 'Unknown error' }
        });
        
        // Refresh logs to show the failed entry (if logging is available)
        if (logId) {
          setTimeout(loadSyncLogs, 1000);
        }
      
      alert(`❌ ${source === 'goaffpro' ? 'ReAction' : source.toUpperCase()} sync failed:\n\n${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRefreshing(prev => ({ ...prev, [source]: false }));
    }
  };

  // Direct GoAffPro sync implementation
  const performGoAffProSync = async (types: string[]): Promise<{ success: boolean; message: string; recordsProcessed: number }> => {
    try {
      console.log('🔄 Starting ReAction direct sync', { types });

      const accessToken = import.meta.env.VITE_GOAFFPRO_ACCESS_TOKEN;
      const publicToken = import.meta.env.VITE_GOAFFPRO_PUBLIC_TOKEN;

      if (!accessToken || !publicToken) {
        throw new Error('ReAction API credentials not configured');
      }

      let totalRecords = 0;

      for (const type of types) {
        if (type === 'affiliates') {
          const count = await syncGoAffProAffiliates(accessToken, publicToken);
          totalRecords += count;
        }
      }

      return {
        success: true,
        message: `ReAction sync completed successfully. Processed ${totalRecords} affiliates.`,
        recordsProcessed: totalRecords
      };

    } catch (error) {
      console.error('❌ ReAction sync failed:', error);
      throw error;
    }
  };

  // Direct GHL sync implementation  
  const performGHLSync = async (): Promise<{ success: boolean; message: string; recordsProcessed: number }> => {
    try {
      console.log('🔄 Starting GHL direct sync');

      // Hardcoded fallbacks for GHL credentials (temporary fix for Vercel env var issues)
      const hardcodedApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRSDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI';
      const hardcodedLocationId = 'w01Gc7T4b0tKSDQdKhuN';

      const apiKey = import.meta.env.VITE_GHL_API_KEY || process.env.VITE_GHL_API_KEY || hardcodedApiKey;
      const locationId = import.meta.env.VITE_GHL_LOCATION_ID || process.env.VITE_GHL_LOCATION_ID || hardcodedLocationId;

      if (!apiKey || !locationId) {
        throw new Error('GHL API credentials not configured');
      }

      const recordsProcessed = await syncGHLContacts(apiKey, locationId);

      return {
        success: true,
        message: `GHL sync completed successfully. Processed ${recordsProcessed} contacts.`,
        recordsProcessed
      };

    } catch (error) {
      console.error('❌ GHL sync failed:', error);
      throw error;
    }
  };

  // GoAffPro affiliates sync helper
  const syncGoAffProAffiliates = async (accessToken: string, publicToken: string): Promise<number> => {
    console.log('📥 Fetching ReAction affiliates...');

    const response = await fetch('https://api.goaffpro.com/v1/admin/affiliates?fields=id,email,first_name,last_name,phone,status,signup_date,referral_code,commission_rate,balance,total_earnings,total_orders,tags&limit=100', {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': accessToken,
        'X-GOAFFPRO-PUBLIC-TOKEN': publicToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ReAction API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const affiliates = data.affiliates || [];

    console.log(`📥 Fetched ${affiliates.length} affiliates from ReAction`);

    // Upsert affiliates to Supabase
    let successCount = 0;
    for (const affiliate of affiliates) {
      const { error } = await supabase
        .from('goaffpro_affiliates')
        .upsert({
          id: affiliate.id,
          email: affiliate.email,
          first_name: affiliate.first_name,
          last_name: affiliate.last_name,
          phone: affiliate.phone,
          status: affiliate.status,
          signup_date: affiliate.signup_date,
          referral_code: affiliate.referral_code,
          commission_rate: affiliate.commission_rate,
          balance: affiliate.balance,
          total_earnings: affiliate.total_earnings,
          total_orders: affiliate.total_orders,
          tags: affiliate.tags,
          last_sync_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error(`Error upserting affiliate ${affiliate.id}:`, error);
      } else {
        successCount++;
      }
    }

    console.log(`✅ ReAction affiliates sync completed: ${successCount}/${affiliates.length} successful`);
    return successCount;
  };

  // GHL contacts sync helper
  const syncGHLContacts = async (apiKey: string, locationId: string): Promise<number> => {
    console.log('📥 Fetching GHL contacts...');

    let allContacts: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 100) { // Safety limit
      console.log(`📥 Fetching page ${page}...`);
      
      // Use skip-based pagination that works with GHL v1 API
      const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/?locationId=${locationId}&limit=100&skip=${(page - 1) * 100}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GHL API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const contacts = data.contacts || [];
      allContacts.push(...contacts);

      console.log(`📥 Page ${page}: ${contacts.length} contacts (total: ${allContacts.length})`);

      // Check if we got fewer contacts than the limit - means we're done
      hasMore = contacts.length === 100;
      page++;
    }

    console.log(`✅ Total contacts fetched: ${allContacts.length}`);

    // Upsert contacts to Supabase
    let successCount = 0;
    for (const contact of allContacts) {
      const { error } = await supabase
        .from('ghl_contacts')
        .upsert({
          id: contact.id,
          location_id: contact.locationId,
          contact_name: contact.contactName,
          first_name: contact.firstName,
          last_name: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          source: contact.source,
          date_added: contact.dateAdded,
          date_updated: contact.dateUpdated,
          tags: contact.tags,
          custom_fields: contact.customField,
          user_id: user?.id,
          last_sync_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error(`Error upserting contact ${contact.id}:`, error);
      } else {
        successCount++;
      }
    }

    console.log(`✅ GHL contacts sync completed: ${successCount}/${allContacts.length} successful`);
    return successCount;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'started':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDisplayName = (source: string) => {
    return source === 'goaffpro' ? 'ReAction' : source.toUpperCase();
  };

  if (loading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Sync Status</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Sync Status</h3>
        </div>
        <button
          onClick={loadSyncLogs}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {isAdmin && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Manual Sync</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => triggerManualSync('goaffpro', ['affiliates'])}
              disabled={isRefreshing.goaffpro}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors flex items-center space-x-2"
            >
              {isRefreshing.goaffpro ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              <span>Sync ReAction</span>
            </button>
            <button
              onClick={() => triggerManualSync('ghl')}
              disabled={isRefreshing.ghl}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors flex items-center space-x-2"
            >
              {isRefreshing.ghl ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              <span>Sync GHL</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Recent Sync Activity</h4>
        {syncLogs.length === 0 ? (
          <p className="text-gray-500 text-sm">No sync activity found</p>
        ) : (
          <div className="space-y-2">
            {syncLogs.map((log) => (
              <div key={log.id} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-md">
                {getStatusIcon(log.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {getDisplayName(log.source)} - {log.sync_type}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {log.status === 'failed' && log.error_details 
                      ? `Error: ${log.error_details.message || 'Unknown error'}` 
                      : `Status: ${log.status}`}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(log.started_at)}</p>
                </div>
                {log.records_processed && log.records_processed > 0 && (
                  <span className="text-xs text-gray-400">
                    {log.records_processed} records
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncStatusDashboard;