import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Users, ShoppingCart, Gift, CreditCard, Trash2, AlertCircle, CheckCircle, Clock, Database } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../contexts/DataContext';
import { GoAffProImportService, ImportResult, ImportLog } from '../services/goaffproImportService';

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

const GoAffProImport: React.FC = () => {
  const { supabase, user } = useAuth();
  const { refreshData } = useData();
  const [importService] = useState(() => new GoAffProImportService(supabase));
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    isImporting: false,
    currentOperation: '',
    results: {}
  });
  const [importLogs, setImportLogs] = useState<ImportLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    loadImportLogs();
  }, []);

  const loadImportLogs = async () => {
    try {
      const logs = await importService.getImportLogs();
      setImportLogs(logs);
    } catch (error) {
      console.error('Error loading import logs:', error);
    }
  };

  const handleImportAffiliates = async () => {
    console.log('Import Affiliates clicked - User:', user);
    console.log('User ID:', user?.id);
    
    if (!user?.id) {
      console.warn('No user ID available, but proceeding with import (service will use fallback)');
      // Don't return early, let the service handle the fallback
    }
    
    setImportStatus(prev => ({ ...prev, isImporting: true, currentOperation: 'Importing affiliates...' }));
    setErrorMessage(''); // Clear any previous errors
    
    try {
      const result = await importService.importAffiliates(user?.id || '');
      setImportStatus(prev => ({ 
        ...prev, 
        isImporting: false, 
        currentOperation: '',
        results: { ...prev.results, affiliates: result }
      }));
      await loadImportLogs();
      
      // Refresh global data context
      await refreshData();
      
      // Check if import failed and show error
      if (!result.success || result.errors.length > 0) {
        setErrorMessage(`Import completed with errors: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Error importing affiliates:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Import failed: ${errorMsg}`);
      setImportStatus(prev => ({ ...prev, isImporting: false, currentOperation: '' }));
    }
  };

  const handleImportOrders = async () => {
    console.log('Import Orders clicked - User:', user);
    console.log('User ID:', user?.id);
    
    if (!user?.id) {
      console.warn('No user ID available, but proceeding with import (service will use fallback)');
      // Don't return early, let the service handle the fallback
    }
    
    setImportStatus(prev => ({ ...prev, isImporting: true, currentOperation: 'Importing orders...' }));
    setErrorMessage(''); // Clear any previous errors
    
    try {
      const result = await importService.importOrders(user?.id || '');
      setImportStatus(prev => ({ 
        ...prev, 
        isImporting: false, 
        currentOperation: '',
        results: { ...prev.results, orders: result }
      }));
      await loadImportLogs();
      
      // Refresh global data context
      await refreshData();
      
      // Check if import failed and show error
      if (!result.success || result.errors.length > 0) {
        setErrorMessage(`Import completed with errors: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Error importing orders:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Import failed: ${errorMsg}`);
      setImportStatus(prev => ({ ...prev, isImporting: false, currentOperation: '' }));
    }
  };

  const handleImportRewards = async () => {
    console.log('Import Rewards clicked - User:', user);
    console.log('User ID:', user?.id);
    
    if (!user?.id) {
      console.warn('No user ID available, but proceeding with import (service will use fallback)');
      // Don't return early, let the service handle the fallback
    }
    
    setImportStatus(prev => ({ ...prev, isImporting: true, currentOperation: 'Importing rewards...' }));
    setErrorMessage(''); // Clear any previous errors
    
    try {
      const result = await importService.importRewards(user?.id || '');
      setImportStatus(prev => ({ 
        ...prev, 
        isImporting: false, 
        currentOperation: '',
        results: { ...prev.results, rewards: result }
      }));
      await loadImportLogs();
      
      // Refresh global data context
      await refreshData();
      
      // Check if import failed and show error
      if (!result.success || result.errors.length > 0) {
        setErrorMessage(`Import completed with errors: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Error importing rewards:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Import failed: ${errorMsg}`);
      setImportStatus(prev => ({ ...prev, isImporting: false, currentOperation: '' }));
    }
  };

  const handleImportPayments = async () => {
    console.log('Import Payments clicked - User:', user);
    console.log('User ID:', user?.id);
    
    if (!user?.id) {
      console.warn('No user ID available, but proceeding with import (service will use fallback)');
      // Don't return early, let the service handle the fallback
    }
    
    setImportStatus(prev => ({ ...prev, isImporting: true, currentOperation: 'Importing payments...' }));
    setErrorMessage(''); // Clear any previous errors
    
    try {
      const result = await importService.importPayments(user?.id || '');
      setImportStatus(prev => ({ 
        ...prev, 
        isImporting: false, 
        currentOperation: '',
        results: { ...prev.results, payments: result }
      }));
      await loadImportLogs();
      
      // Refresh global data context
      await refreshData();
      
      // Check if import failed and show error
      if (!result.success || result.errors.length > 0) {
        setErrorMessage(`Import completed with errors: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Error importing payments:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Import failed: ${errorMsg}`);
      setImportStatus(prev => ({ ...prev, isImporting: false, currentOperation: '' }));
    }
  };

  const handleImportAll = async () => {
    console.log('Import All clicked - User:', user);
    console.log('User ID:', user?.id);
    
    if (!user?.id) {
      console.warn('No user ID available, but proceeding with import (service will use fallback)');
      // Don't return early, let the service handle the fallback
    }
    
    setImportStatus(prev => ({ ...prev, isImporting: true, currentOperation: 'Importing all data...' }));
    setErrorMessage(''); // Clear any previous errors
    
    try {
      const results = await importService.importAllData(user?.id || '');
      setImportStatus(prev => ({ 
        ...prev, 
        isImporting: false, 
        currentOperation: '',
        results
      }));
      await loadImportLogs();
      
      // Refresh global data context
      await refreshData();
      
      // Check if any imports failed and show summary
      const hasErrors = Object.values(results).some(result => !result.success || result.errors.length > 0);
      if (hasErrors) {
        const errorSummary = Object.entries(results)
          .filter(([, result]) => !result.success || result.errors.length > 0)
          .map(([type, result]) => `${type}: ${result.errors.join(', ')}`)
          .join('; ');
        setErrorMessage(`Import completed with errors: ${errorSummary}`);
      }
    } catch (error) {
      console.error('Error importing all data:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Import failed: ${errorMsg}`);
      setImportStatus(prev => ({ ...prev, isImporting: false, currentOperation: '' }));
    }
  };

  const handleDeleteTestData = async () => {
    if (!confirm('Are you sure you want to delete all test data? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      await importService.deleteTestData();
      
      // Refresh global data context after deletion
      await refreshData();
      
      alert('Test data deleted successfully');
    } catch (error) {
      console.error('Error deleting test data:', error);
      alert('Error deleting test data. Please check the console for details.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'started':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderImportResult = (result: ImportResult | undefined, title: string) => {
    if (!result) return null;

    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Processed:</span>
            <span className="text-white ml-2">{result.recordsProcessed}</span>
          </div>
          <div>
            <span className="text-gray-400">Successful:</span>
            <span className="text-green-400 ml-2">{result.recordsSuccessful}</span>
          </div>
          <div>
            <span className="text-gray-400">Failed:</span>
            <span className="text-red-400 ml-2">{result.recordsFailed}</span>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>
            <span className={`ml-2 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
              {result.success ? 'Success' : 'Failed'}
            </span>
          </div>
        </div>
        {result.errors.length > 0 && (
          <div className="mt-3">
            <span className="text-gray-400 text-sm">Errors:</span>
            <div className="mt-1 max-h-32 overflow-y-auto">
              {result.errors.map((error, index) => (
                <div key={index} className="text-red-400 text-xs">{error}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">ReAction Import</h2>
            <p className="text-gray-400">Import affiliate data from GoAffPro into your local database</p>
          </div>
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-jennaz-purple-light">
              <Database className="w-8 h-8 text-jennaz-rose" />
            </div>
          </div>
        </div>

        {importStatus.isImporting && (
          <div className="mb-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
              <span className="text-blue-400">{importStatus.currentOperation}</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-3" />
              <span className="text-red-400">{errorMessage}</span>
            </div>
          </div>
        )}

        <div className="flex justify-center mb-6">
          {/* Hidden buttons - functionality preserved, only UI hidden per user request */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleImportAffiliates}
            disabled={importStatus.isImporting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            style={{ display: 'none' }} // Hidden per user request - functionality preserved
          >
            <Users className="w-5 h-5" />
            <span>Import Affiliates</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleImportOrders}
            disabled={importStatus.isImporting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            style={{ display: 'none' }} // Hidden per user request - functionality preserved
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Import Orders</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleImportRewards}
            disabled={importStatus.isImporting}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            style={{ display: 'none' }} // Hidden per user request - functionality preserved
          >
            <Gift className="w-5 h-5" />
            <span>Import Rewards</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleImportPayments}
            disabled={importStatus.isImporting}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            style={{ display: 'none' }} // Hidden per user request - functionality preserved
          >
            <CreditCard className="w-5 h-5" />
            <span>Import Payments</span>
          </motion.button>

          {/* Main visible button - Import All Data */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleImportAll}
            disabled={importStatus.isImporting}
            className="bg-jennaz-rose hover:bg-jennaz-rose/80 disabled:bg-gray-600 text-white px-6 py-4 rounded-lg flex items-center justify-center space-x-2 transition-colors font-semibold text-lg"
          >
            <Download className="w-6 h-6" />
            <span>Import All Data</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDeleteTestData}
            disabled={isDeleting || importStatus.isImporting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            style={{ display: 'none' }} // Hidden per user request - functionality preserved
          >
            <Trash2 className="w-5 h-5" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Test Data'}</span>
          </motion.button>
        </div>

        {Object.keys(importStatus.results).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Import Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderImportResult(importStatus.results.affiliates, 'Affiliates')}
              {renderImportResult(importStatus.results.orders, 'Orders')}
              {renderImportResult(importStatus.results.rewards, 'Rewards')}
              {renderImportResult(importStatus.results.payments, 'Payments')}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Import History</h3>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-jennaz-rose hover:text-jennaz-rose/80 transition-colors"
          >
            {showLogs ? 'Hide Logs' : 'Show Logs'}
          </button>
        </div>

        {showLogs && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {importLogs.length === 0 ? (
              <p className="text-gray-400">No import logs found</p>
            ) : (
              importLogs.map((log) => (
                <div key={log.import_type + log.started_by} className="bg-gray-800 rounded p-3 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(log.status)}
                      <span className="text-white font-medium capitalize">{log.import_type}</span>
                      <span className="text-gray-400">from {log.source}</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Processed: {log.records_processed} | Success: {log.records_successful} | Failed: {log.records_failed}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoAffProImport; 