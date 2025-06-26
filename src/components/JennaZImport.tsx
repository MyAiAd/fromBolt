import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Users, ShoppingCart, Gift, CreditCard, Trash2, AlertCircle, CheckCircle, Clock, Database, Key, Settings, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ImportResult {
  success: boolean;
  recordsProcessed: number;
  recordsImported: number;
  recordsUpdated: number;
  recordsSkipped: number;
  errors: string[];
  startTime: Date;
  endTime: Date;
  duration: number;
}

interface ImportLog {
  id: string;
  import_type: string;
  import_source: string;
  status: string;
  records_processed: number;
  records_successful: number;
  records_failed: number;
  errors: string[];
  warnings: string[];
  import_config: Record<string, unknown>;
  started_by: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ImportStatus {
  isImporting: boolean;
  currentOperation: string;
  results: {
    affiliates?: ImportResult;
    orders?: ImportResult;
    rewards?: ImportResult;
    payments?: ImportResult;
  };
}

interface GHLCredentials {
  apiKey: string;
  locationId: string;
}

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
}

const JennaZImport: React.FC = () => {
  const { supabase, user } = useAuth();
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    isImporting: false,
    currentOperation: '',
    results: {}
  });
  const [importLogs, setImportLogs] = useState<ImportLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [credentials, setCredentials] = useState<GHLCredentials>({
    apiKey: '',
    locationId: ''
  });
  const [showCredentials, setShowCredentials] = useState(true);
  const [isCredentialsValid, setIsCredentialsValid] = useState(false);

  useEffect(() => {
    loadImportLogs();
    // Check if credentials are already stored
    const savedCredentials = localStorage.getItem('ghl-credentials');
    if (savedCredentials) {
      try {
        const parsed = JSON.parse(savedCredentials);
        setCredentials(parsed);
        setIsCredentialsValid(!!parsed.apiKey && !!parsed.locationId);
        setShowCredentials(false);
      } catch (error) {
        console.error('Error loading saved credentials:', error);
      }
    } else {
      // Pre-populate with the user's provided credentials
      const userCredentials = {
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI',
        locationId: 'w01Gc7T4b0tKSDQdKhuN'
      };
      setCredentials(userCredentials);
      setIsCredentialsValid(true);
      setShowCredentials(false);
      // Save them automatically
      localStorage.setItem('ghl-credentials', JSON.stringify(userCredentials));
    }
  }, []);

  const loadImportLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('import_logs')
        .select('*')
        .eq('import_type', 'jennaz')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading import logs:', error);
        return;
      }

      setImportLogs(data || []);
    } catch (error) {
      console.error('Error loading import logs:', error);
    }
  };

  const createImportLog = async (
    importType: string,
    status: string,
    result: ImportResult
  ): Promise<void> => {
    try {
      // Map status to valid database values
      const validStatus = status === 'success' ? 'completed' : 
                         status === 'failed' ? 'failed' : 
                         status === 'error' ? 'failed' : 
                         'pending';

      const logData = {
        import_type: `jennaz_${importType}`,
        import_source: 'manual', // or 'ghl' for GHL imports
        status: validStatus,
        records_processed: result.recordsProcessed,
        records_successful: result.recordsImported,
        records_failed: result.recordsSkipped,
        errors: result.errors,
        started_by: user?.id || null,
        import_config: {
          source: importType,
          timestamp: new Date().toISOString()
        }
      };

      console.log('📝 Creating import log with data:', logData);
      
      const { data, error } = await supabase
        .from('import_logs')
        .insert(logData)
        .select();

      if (error) {
        console.error('❌ Error creating import log:', error);
        console.error('❌ Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.log('✅ Import log created successfully:', data);
      }
    } catch (error) {
      console.error('❌ Exception creating import log:', error);
    }
  };

  const handleCredentialsSubmit = () => {
    if (credentials.apiKey && credentials.locationId) {
      setIsCredentialsValid(true);
      setShowCredentials(false);
      // Save to localStorage for convenience
      localStorage.setItem('ghl-credentials', JSON.stringify(credentials));
      setErrorMessage('');
    } else {
      setErrorMessage('Please provide both API Key and Location ID');
    }
  };

  const handleCredentialsEdit = () => {
    setShowCredentials(true);
    setIsCredentialsValid(false);
  };

  const handleImportAffiliates = async () => {
    if (!isCredentialsValid) {
      setErrorMessage('Please configure GHL credentials first');
      return;
    }

    console.log('Import GHL Affiliates clicked - User:', user);
    console.log('User ID:', user?.id);
    console.log('Credentials:', { apiKey: credentials.apiKey.substring(0, 30) + '...', locationId: credentials.locationId });
    
    setImportStatus(prev => ({ ...prev, isImporting: true, currentOperation: 'Connecting to Go High Level...' }));
    setErrorMessage('');
    
    try {
      setImportStatus(prev => ({ ...prev, currentOperation: 'Fetching contacts from GHL API...' }));
      
      console.log('Fetching contacts from GHL API...');
      const startTime = new Date();

      // Fetch contacts directly from GHL API
      const baseUrl = 'https://rest.gohighlevel.com/v1';
      let allContacts: GHLContact[] = [];
      let nextCursor: string | null = null;
      
      do {
        const endpoint: string = `/contacts/?locationId=${credentials.locationId}&limit=100${
          nextCursor ? `&cursor=${nextCursor}` : ''
        }`;
        
        const response: Response = await fetch(`${baseUrl}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${credentials.apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`GHL API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const responseData: any = await response.json();
        
        if (responseData.contacts && Array.isArray(responseData.contacts)) {
          allContacts = allContacts.concat(responseData.contacts);
          console.log(`📥 Fetched ${responseData.contacts.length} contacts (total: ${allContacts.length})`);
        }
        
        nextCursor = responseData.meta?.nextCursor || null;
        
        // Rate limiting
        if (nextCursor) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
      } while (nextCursor);

      console.log(`✅ Total contacts fetched: ${allContacts.length}`);

      setImportStatus(prev => ({ ...prev, currentOperation: 'Filtering for affiliates only...' }));

      // Filter contacts to identify only actual affiliates
      const isAffiliate = (contact: GHLContact): boolean => {
        // Check multiple criteria to identify affiliates
        const customFields = contact.customFields || {};
        
        // 1. Check for affiliate-specific tags or custom fields
        const affiliateIndicators = [
          'affiliate',
          'partner',
          'referral',
          'commission',
          'ambassador'
        ];
        
        // Check custom fields for affiliate indicators
        for (const [key, value] of Object.entries(customFields)) {
          const keyLower = key.toLowerCase();
          const valueLower = String(value).toLowerCase();
          
          if (affiliateIndicators.some(indicator => 
            keyLower.includes(indicator) || valueLower.includes(indicator)
          )) {
            return true;
          }
        }
        
        // 2. Check if contact has a referral code
        if (contact.referralCode) {
          return true;
        }
        
        // 3. Check for specific custom field that marks affiliates
        // You can customize these field names based on your GHL setup
        if (customFields['affiliate_status'] || 
            customFields['is_affiliate'] || 
            customFields['partner_type'] ||
            customFields['referral_code']) {
          return true;
        }
        
        // 4. If none of the above, this is likely just a regular contact
        return false;
      };

      // Filter to get only affiliates
      const affiliateContacts = allContacts.filter(isAffiliate);
      console.log(`🎯 Filtered to ${affiliateContacts.length} potential affiliates from ${allContacts.length} total contacts`);

      setImportStatus(prev => ({ ...prev, currentOperation: `Processing ${affiliateContacts.length} affiliate contacts into system...` }));

      // Process only affiliate contacts into affiliate system
      let recordsSuccessful = 0;
      let recordsFailed = 0;
      const recordsUpdated = 0;
      const errors: string[] = [];

      for (const contact of affiliateContacts) {
        try {
          // Generate referral code if not provided
          const generateReferralCode = (contact: GHLContact): string => {
            const baseName = contact.firstName || contact.lastName || contact.email.split('@')[0];
            const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
            return `${cleanName.substr(0, 6)}${randomSuffix}`;
          };

          const referralCode = contact.referralCode || generateReferralCode(contact);

          // Import into main affiliate system using user client
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
            custom_fields: contact.customFields ? JSON.stringify(contact.customFields) : null
          };

          const { error: affiliateError } = await supabase
            .from('affiliate_system_users')
            .upsert([affiliateData], { 
              onConflict: 'email',
              ignoreDuplicates: false 
            });

          if (affiliateError) {
            errors.push(`Affiliate system - Contact ${contact.id}: ${affiliateError.message}`);
            recordsFailed++;
          } else {
            recordsSuccessful++;
          }

        } catch (error) {
          errors.push(`Contact ${contact.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          recordsFailed++;
        }
      }

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      const affiliatesResult: ImportResult = {
        success: recordsFailed === 0,
        recordsProcessed: affiliateContacts.length,
        recordsImported: recordsSuccessful,
        recordsUpdated: recordsUpdated,
        recordsSkipped: recordsFailed,
        errors: errors || [],
        startTime,
        endTime,
        duration
      };

      setImportStatus(prev => ({ 
        ...prev, 
        isImporting: false, 
        currentOperation: '',
        results: { ...prev.results, affiliates: affiliatesResult }
      }));
      
      await createImportLog('affiliates', affiliatesResult.success ? 'success' : 'failed', affiliatesResult);
      await loadImportLogs();
      
      if (!affiliatesResult.success || affiliatesResult.errors.length > 0) {
        setErrorMessage(`Import completed with issues: ${affiliatesResult.errors.slice(0, 3).join(', ')}${affiliatesResult.errors.length > 3 ? '...' : ''}`);
      } else {
        setErrorMessage(`✅ Successfully imported ${affiliatesResult.recordsImported} affiliates from GHL!`);
        
        // Clear any cached affiliate data to force refresh on other pages
        const keysToRemove = [
          'affiliate_data_affiliates',
          'affiliate_data_orders', 
          'affiliate_data_rewards',
          'affiliate_data_payments',
          'affiliate_data_last_updated'
        ];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log('🧹 Cleared affiliate data cache to force refresh on other pages');
        
        // Trigger a page refresh for all data contexts by dispatching a custom event
        window.dispatchEvent(new CustomEvent('affiliate-data-updated'));
        
        // Also trigger a browser storage event to refresh other tabs/windows
        window.dispatchEvent(new CustomEvent('affiliate-import-success', {
          detail: { 
            recordsImported: affiliatesResult.recordsImported,
            source: 'ghl'
          }
        }));
      }
    } catch (error) {
      console.error('Detailed error information:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      let errorMsg = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMsg = error.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      } else if (error && typeof error === 'object') {
        errorMsg = JSON.stringify(error);
      }
      
      setErrorMessage(`Import failed: ${errorMsg}`);
      setImportStatus(prev => ({ ...prev, isImporting: false, currentOperation: '' }));
    }
  };

  const handleImportOrders = async () => {
    console.log('Import JennaZ Orders clicked - User:', user);
    
    setImportStatus(prev => ({ ...prev, isImporting: true, currentOperation: 'Importing JennaZ orders...' }));
    setErrorMessage('');
    
    try {
      const result = await simulateImport('orders');
      setImportStatus(prev => ({ 
        ...prev, 
        isImporting: false, 
        currentOperation: '',
        results: { ...prev.results, orders: result }
      }));
      
      await createImportLog('orders', result.success ? 'success' : 'failed', result);
      await loadImportLogs();
      
      if (!result.success || result.errors.length > 0) {
        setErrorMessage(`Import completed with info: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Error importing orders:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Import failed: ${errorMsg}`);
      setImportStatus(prev => ({ ...prev, isImporting: false, currentOperation: '' }));
    }
  };

  const handleImportRewards = async () => {
    console.log('Import JennaZ Rewards clicked - User:', user);
    
    setImportStatus(prev => ({ ...prev, isImporting: true, currentOperation: 'Importing JennaZ rewards...' }));
    setErrorMessage('');
    
    try {
      const result = await simulateImport('rewards');
      setImportStatus(prev => ({ 
        ...prev, 
        isImporting: false, 
        currentOperation: '',
        results: { ...prev.results, rewards: result }
      }));
      
      await createImportLog('rewards', result.success ? 'success' : 'failed', result);
      await loadImportLogs();
      
      if (!result.success || result.errors.length > 0) {
        setErrorMessage(`Import completed with info: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Error importing rewards:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Import failed: ${errorMsg}`);
      setImportStatus(prev => ({ ...prev, isImporting: false, currentOperation: '' }));
    }
  };

  const handleImportPayments = async () => {
    console.log('Import JennaZ Payments clicked - User:', user);
    
    setImportStatus(prev => ({ ...prev, isImporting: true, currentOperation: 'Importing JennaZ payments...' }));
    setErrorMessage('');
    
    try {
      const result = await simulateImport('payments');
      setImportStatus(prev => ({ 
        ...prev, 
        isImporting: false, 
        currentOperation: '',
        results: { ...prev.results, payments: result }
      }));
      
      await createImportLog('payments', result.success ? 'success' : 'failed', result);
      await loadImportLogs();
      
      if (!result.success || result.errors.length > 0) {
        setErrorMessage(`Import completed with info: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Error importing payments:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Import failed: ${errorMsg}`);
      setImportStatus(prev => ({ ...prev, isImporting: false, currentOperation: '' }));
    }
  };

  const handleImportAll = async () => {
    if (!isCredentialsValid) {
      setErrorMessage('Please configure GHL credentials first');
      return;
    }

    console.log('Import All GHL Data clicked - User:', user);
    
    setImportStatus(prev => ({ ...prev, isImporting: true, currentOperation: 'Starting comprehensive GHL import...' }));
    setErrorMessage('');
    
    try {
      // 1. Import Affiliates (Real GHL Import via direct API)
      setImportStatus(prev => ({ ...prev, currentOperation: 'Fetching contacts from GHL API...' }));
      
      console.log('Fetching contacts from GHL API...');
      const startTime = new Date();

      // Fetch contacts directly from GHL API
      const baseUrl = 'https://rest.gohighlevel.com/v1';
      let allContacts: GHLContact[] = [];
      let nextCursor: string | null = null;
      
      do {
        const endpoint: string = `/contacts/?locationId=${credentials.locationId}&limit=100${
          nextCursor ? `&cursor=${nextCursor}` : ''
        }`;
        
        const response: Response = await fetch(`${baseUrl}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${credentials.apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`GHL API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const responseData: any = await response.json();
        
        if (responseData.contacts && Array.isArray(responseData.contacts)) {
          allContacts = allContacts.concat(responseData.contacts);
          console.log(`📥 Fetched ${responseData.contacts.length} contacts (total: ${allContacts.length})`);
        }
        
        nextCursor = responseData.meta?.nextCursor || null;
        
        // Rate limiting
        if (nextCursor) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
      } while (nextCursor);

      console.log(`✅ Total contacts fetched: ${allContacts.length}`);

      setImportStatus(prev => ({ ...prev, currentOperation: 'Filtering for affiliates only...' }));

      // Filter contacts to identify only actual affiliates  
      const isAffiliate = (contact: GHLContact): boolean => {
        // Check multiple criteria to identify affiliates
        const customFields = contact.customFields || {};
        
        // 1. Check for affiliate-specific tags or custom fields
        const affiliateIndicators = [
          'affiliate',
          'partner',
          'referral',
          'commission',
          'ambassador'
        ];
        
        // Check custom fields for affiliate indicators
        for (const [key, value] of Object.entries(customFields)) {
          const keyLower = key.toLowerCase();
          const valueLower = String(value).toLowerCase();
          
          if (affiliateIndicators.some(indicator => 
            keyLower.includes(indicator) || valueLower.includes(indicator)
          )) {
            return true;
          }
        }
        
        // 2. Check if contact has a referral code
        if (contact.referralCode) {
          return true;
        }
        
        // 3. Check for specific custom field that marks affiliates
        // You can customize these field names based on your GHL setup
        if (customFields['affiliate_status'] || 
            customFields['is_affiliate'] || 
            customFields['partner_type'] ||
            customFields['referral_code']) {
          return true;
        }
        
        // 4. If none of the above, this is likely just a regular contact
        return false;
      };

      // Filter to get only affiliates
      const affiliateContacts = allContacts.filter(isAffiliate);
      console.log(`🎯 Filtered to ${affiliateContacts.length} potential affiliates from ${allContacts.length} total contacts`);

      setImportStatus(prev => ({ ...prev, currentOperation: `Processing ${affiliateContacts.length} affiliate contacts into system...` }));

      // Process only affiliate contacts into affiliate system
      let recordsSuccessful = 0;
      let recordsFailed = 0;
      const recordsUpdated = 0;
      const errors: string[] = [];

      for (const contact of affiliateContacts) {
        try {
          // Generate referral code if not provided
          const generateReferralCode = (contact: GHLContact): string => {
            const baseName = contact.firstName || contact.lastName || contact.email.split('@')[0];
            const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
            return `${cleanName.substr(0, 6)}${randomSuffix}`;
          };

          const referralCode = contact.referralCode || generateReferralCode(contact);

          // Import into main affiliate system using user client
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
            custom_fields: contact.customFields ? JSON.stringify(contact.customFields) : null
          };

          const { error: affiliateError } = await supabase
            .from('affiliate_system_users')
            .upsert([affiliateData], { 
              onConflict: 'email',
              ignoreDuplicates: false 
            });

          if (affiliateError) {
            errors.push(`Affiliate system - Contact ${contact.id}: ${affiliateError.message}`);
            recordsFailed++;
          } else {
            recordsSuccessful++;
          }

        } catch (error) {
          errors.push(`Contact ${contact.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          recordsFailed++;
        }
      }

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      const affiliatesResult: ImportResult = {
        success: recordsFailed === 0,
        recordsProcessed: affiliateContacts.length,
        recordsImported: recordsSuccessful,
        recordsUpdated: recordsUpdated,
        recordsSkipped: recordsFailed,
        errors: errors || [],
        startTime,
        endTime,
        duration
      };

      // 2. Other imports (Placeholder for now)
      setImportStatus(prev => ({ ...prev, currentOperation: 'Checking for additional GHL data types...' }));
      
      const ordersResult = await simulateImport('orders');
      const rewardsResult = await simulateImport('rewards');  
      const paymentsResult = await simulateImport('payments');
      
      setImportStatus(prev => ({ 
        ...prev, 
        isImporting: false, 
        currentOperation: '',
        results: { 
          affiliates: affiliatesResult,
          orders: ordersResult,
          rewards: rewardsResult,
          payments: paymentsResult
        }
      }));
      
      // Create logs for all import types
      await Promise.all([
        createImportLog('affiliates', affiliatesResult.success ? 'success' : 'failed', affiliatesResult),
        createImportLog('orders', ordersResult.success ? 'success' : 'failed', ordersResult),
        createImportLog('rewards', rewardsResult.success ? 'success' : 'failed', rewardsResult),
        createImportLog('payments', paymentsResult.success ? 'success' : 'failed', paymentsResult)
      ]);
      
      await loadImportLogs();
      
      // Show success message for affiliates, info for others
      const messages = [];
      if (affiliatesResult.success) {
        messages.push(`✅ Imported ${affiliatesResult.recordsImported} affiliates from GHL`);
      }
      if (affiliatesResult.errors.length > 0) {
        messages.push(`⚠️ Affiliate import issues: ${affiliatesResult.errors.slice(0, 2).join(', ')}`);
      }
      messages.push('ℹ️ Orders, rewards, and payments import from GHL will be implemented in future updates');
      
      setErrorMessage(messages.join(' | '));
      
    } catch (error) {
      console.error('Detailed error information (Import All):', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      let errorMsg = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMsg = error.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      } else if (error && typeof error === 'object') {
        errorMsg = JSON.stringify(error);
      }
      
      setErrorMessage(`Import failed: ${errorMsg}`);
      setImportStatus(prev => ({ ...prev, isImporting: false, currentOperation: '' }));
    }
  };

  const handleDeleteTestData = async () => {
    if (!confirm('Are you sure you want to delete all JennaZ test data? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error: affiliatesError } = await supabase
        .from('jennaz_affiliates')
        .delete()
        .eq('data_source', 'test');

      const { error: ordersError } = await supabase
        .from('jennaz_orders')
        .delete()
        .eq('data_source', 'test');

      const { error: rewardsError } = await supabase
        .from('jennaz_rewards')
        .delete()
        .eq('data_source', 'test');

      const { error: paymentsError } = await supabase
        .from('jennaz_payments')
        .delete()
        .eq('data_source', 'test');

      if (affiliatesError || ordersError || rewardsError || paymentsError) {
        throw new Error('Failed to delete some test data');
      }

      console.log('JennaZ test data deleted successfully');
    } catch (error) {
      console.error('Error deleting test data:', error);
      setErrorMessage('Failed to delete test data');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'running':
        return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const renderImportResult = (result: ImportResult | undefined, title: string) => {
    if (!result) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 bg-gray-800 rounded-lg"
      >
        <h4 className="text-sm font-medium text-white mb-2">{title} Import Result</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{result.recordsProcessed}</div>
            <div className="text-xs text-gray-400">Processed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-400">{result.recordsImported}</div>
            <div className="text-xs text-gray-400">Imported</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-400">{result.recordsUpdated}</div>
            <div className="text-xs text-gray-400">Updated</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-400">{result.recordsSkipped}</div>
            <div className="text-xs text-gray-400">Skipped</div>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          Duration: {result.duration}ms | 
          Status: <span className={result.success ? 'text-green-400' : 'text-red-400'}>
            {result.success ? 'Success' : 'Failed'}
          </span>
        </div>
        {result.errors.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-yellow-400 mb-1">Messages:</div>
            <div className="text-xs text-gray-300 bg-gray-900 p-2 rounded">
              {result.errors.join(', ')}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const simulateImport = async (type: string): Promise<ImportResult> => {
    const startTime = new Date();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    // More specific messaging about what's implemented vs what's not
    let message = '';
    switch (type) {
      case 'orders':
        message = 'GHL opportunities/orders import will be implemented in a future update';
        break;
      case 'rewards':
        message = 'GHL rewards/incentives import will be implemented in a future update';
        break;
      case 'payments':
        message = 'GHL payment tracking import will be implemented in a future update';
        break;
      default:
        message = `GHL ${type} import not yet implemented`;
    }

    return {
      success: true,
      recordsProcessed: 0,
      recordsImported: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
      errors: [message],
      startTime,
      endTime,
      duration
    };
  };

  return (
    <div className="space-y-6">
      {/* Credentials Configuration */}
      {showCredentials && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Key className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-medium text-white">GHL API Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API Key
              </label>
              <input
                type="text"
                value={credentials.apiKey}
                onChange={(e) => setCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location ID
              </label>
              <input
                type="text"
                value={credentials.locationId}
                onChange={(e) => setCredentials(prev => ({ ...prev, locationId: e.target.value }))}
                placeholder="w01Gc7T4b0tKSDQdKhuN"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4 pt-2">
              <button
                onClick={handleCredentialsSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                Save Configuration
              </button>
              
              <div className="text-sm text-gray-400">
                Credentials will be saved locally for convenience
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Credentials Status */}
      {isCredentialsValid && !showCredentials && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-900/20 border border-green-500/30 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <h3 className="text-sm font-medium text-green-400">GHL API Configured</h3>
                <p className="text-sm text-gray-300">
                  Location: {credentials.locationId}
                </p>
              </div>
            </div>
            <button
              onClick={handleCredentialsEdit}
              className="flex items-center space-x-2 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors"
            >
              <Settings className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Status Display */}
      {importStatus.isImporting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-blue-400 animate-spin" />
            <div>
              <h3 className="text-sm font-medium text-blue-400">Import in Progress</h3>
              <p className="text-sm text-gray-300">{importStatus.currentOperation}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div>
              <h3 className="text-sm font-medium text-yellow-400">Notice</h3>
              <p className="text-sm text-gray-300">{errorMessage}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Debug Environment Variables */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 border border-gray-600 rounded-lg p-4"
        >
          <h3 className="text-sm font-medium text-gray-300 mb-2">Debug: Environment Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-400">VITE_SUPABASE_URL:</span>
              <span className={import.meta.env.VITE_SUPABASE_URL ? 'text-green-400' : 'text-red-400'}>
                {import.meta.env.VITE_SUPABASE_URL ? 'Available' : 'Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">User Client:</span>
              <span className={supabase ? 'text-green-400' : 'text-red-400'}>
                {supabase ? 'Available' : 'Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">User ID:</span>
              <span className={user?.id ? 'text-green-400' : 'text-yellow-400'}>
                {user?.id || 'Not logged in'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Credentials Valid:</span>
              <span className={isCredentialsValid ? 'text-green-400' : 'text-red-400'}>
                {isCredentialsValid ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          {import.meta.env.VITE_SUPABASE_URL && (
            <div className="mt-2 text-xs text-gray-400">
              Supabase URL: {import.meta.env.VITE_SUPABASE_URL}
            </div>
          )}
          <div className="mt-2 text-xs text-blue-400">
            ℹ️ Using user client for browser security (service role keys are server-side only)
          </div>
        </motion.div>
      )}

      {/* Import Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={handleImportAffiliates}
          disabled={importStatus.isImporting}
          className="flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <Users className="w-5 h-5 mr-2" />
          Import Affiliates
        </button>

        <button
          onClick={handleImportOrders}
          disabled={importStatus.isImporting}
          className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Import Orders
        </button>

        <button
          onClick={handleImportRewards}
          disabled={importStatus.isImporting}
          className="flex items-center justify-center p-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <Gift className="w-5 h-5 mr-2" />
          Import Rewards
        </button>

        <button
          onClick={handleImportPayments}
          disabled={importStatus.isImporting}
          className="flex items-center justify-center p-4 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Import Payments
        </button>

        <button
          onClick={handleImportAll}
          disabled={importStatus.isImporting}
          className="flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors font-semibold"
        >
          <Download className="w-5 h-5 mr-2" />
          Import All Data
        </button>

        <button
          onClick={handleDeleteTestData}
          disabled={importStatus.isImporting || isDeleting}
          className="flex items-center justify-center p-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          {isDeleting ? 'Deleting...' : 'Delete Test Data'}
        </button>
      </div>

      {/* Import Results */}
      {renderImportResult(importStatus.results.affiliates, 'Affiliates')}
      {renderImportResult(importStatus.results.orders, 'Orders')}
      {renderImportResult(importStatus.results.rewards, 'Rewards')}
      {renderImportResult(importStatus.results.payments, 'Payments')}

      {/* Success Message with Navigation */}
      {importStatus.results.affiliates?.success && importStatus.results.affiliates.recordsImported > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-900/20 border border-green-500/30 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div>
                <h3 className="text-lg font-medium text-green-400">Import Successful!</h3>
                <p className="text-sm text-gray-300">
                  {importStatus.results.affiliates.recordsImported} affiliates imported from GHL
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <a
                href="/jennaz-data"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View JennaZ Data
              </a>
              <a
                href="/affiliates"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                <Users className="w-4 h-4 mr-2" />
                View All Affiliates
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Import Logs */}
      <div className="border-t border-gray-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Recent Import Logs</h3>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showLogs ? 'Hide Logs' : 'Show Logs'}
          </button>
        </div>

        {showLogs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            {importLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No import logs found</p>
              </div>
            ) : (
              importLogs.map((log) => (
                <div key={log.id} className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <div className="text-sm font-medium text-white">
                          {log.import_type.replace('jennaz_', 'JennaZ ')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">
                        {log.records_successful} / {log.records_processed}
                      </div>
                      <div className="text-xs text-gray-400">
                        {log.records_successful} successful, {log.records_failed} failed
                      </div>
                    </div>
                  </div>
                  {log.errors.length > 0 && (
                    <div className="mt-2 text-xs text-yellow-400">
                      {log.errors.join(', ')}
                    </div>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-400 mb-1">JennaZ (GHL) Integration Status</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                <span className="text-green-400">✅ Affiliates Import:</span> Fully implemented and working with GHL API v1.0
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-yellow-400">🚧 Orders Import:</span> Planned for future update (GHL Opportunities integration)
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-yellow-400">🚧 Rewards Import:</span> Planned for future update (GHL custom fields/tags)
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-yellow-400">🚧 Payments Import:</span> Planned for future update (GHL payment tracking)
              </p>
            </div>
            <p className="text-sm text-gray-400 mt-3">
              Your GHL contacts are successfully importing as affiliates with referral codes and commission tracking ready. Using GHL API v1.0 endpoint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JennaZImport; 