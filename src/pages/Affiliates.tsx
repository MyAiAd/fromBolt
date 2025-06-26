import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Eye, Users, Search, PlusCircle, ChevronDown, ChevronUp, Filter, Database, RefreshCw, Download } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AffiliateAggregationService, AggregatedAffiliate } from '../services/affiliateAggregationService';
import { UnifiedImportService } from '../services/unifiedImportService';

type AffiliateLevel = 'All' | 'Direct' | 'Level 2' | 'Level 3' | 'GoAFF Pro' | 'Mighty Networks';
type AffiliateStatus = 'All' | 'Active' | 'Pending' | 'Inactive';
type AffiliateSource = 'All' | 'SHP' | 'MN' | 'GHL' | 'goaffpro' | 'mightynetworks' | 'native';

const Affiliates = () => {
  const { supabase, user, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<AffiliateLevel>('All');
  const [statusFilter, setStatusFilter] = useState<AffiliateStatus>('All');
  const [sourceFilter, setSourceFilter] = useState<AffiliateSource>('All');
  const [sortField, setSortField] = useState<keyof AggregatedAffiliate>('dateJoined');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoUserForm, setDemoUserForm] = useState({
    email: 'sage@risewith.us',
    firstName: 'Sage',
    lastName: 'Michael',
    performanceLevel: 'medium' as 'low' | 'medium' | 'high',
    source: 'manual' as 'manual' | 'ghl' | 'goaffpro'
  });
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentials, setCredentials] = useState({
    ghlApiKey: '',
    ghlLocationId: 'w01Gc7T4b0tKSDQdKhuN',
    goaffproApiKey: '',
    goaffproStoreId: ''
  });
  const [affiliates, setAffiliates] = useState<AggregatedAffiliate[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
    bySource: {
      goaffpro: 0,
      mightynetworks: 0,
      native: 0
    }
  });

  const aggregationService = useMemo(() => new AffiliateAggregationService(supabase), [supabase]);
  const unifiedImportService = useMemo(() => new UnifiedImportService(supabase), [supabase]);

  useEffect(() => {
    loadAffiliates();
  }, [supabase]);

  const createDemoUser = async () => {
    setIsCreatingDemo(true);
    try {
      console.log('🚀 Starting demo user creation...');
      console.log('📋 Form data:', demoUserForm);

      // Generate performance-based mock data
      const getPerformanceData = (level: string) => {
        switch (level) {
          case 'low':
            return {
              referrals: Math.floor(Math.random() * 3) + 1, // 1-3
              commission: Math.floor(Math.random() * 200) + 50, // $50-250
              teamSize: Math.floor(Math.random() * 2) + 1, // 1-2
            };
          case 'medium':
            return {
              referrals: Math.floor(Math.random() * 8) + 4, // 4-11
              commission: Math.floor(Math.random() * 800) + 300, // $300-1100
              teamSize: Math.floor(Math.random() * 10) + 5, // 5-14
            };
          case 'high':
            return {
              referrals: Math.floor(Math.random() * 15) + 12, // 12-26
              commission: Math.floor(Math.random() * 2000) + 1000, // $1000-3000
              teamSize: Math.floor(Math.random() * 20) + 20, // 20-39
            };
          default:
            return { referrals: 5, commission: 500, teamSize: 8 };
        }
      };

      const performanceData = getPerformanceData(demoUserForm.performanceLevel);
      console.log('📊 Performance data generated:', performanceData);
      
      // Generate referral code
      const referralCode = `${demoUserForm.firstName.substring(0, 2).toUpperCase()}${demoUserForm.lastName.substring(0, 2).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      console.log('🔖 Referral code generated:', referralCode);
      
      // Create user in Supabase Auth (simulate)
      console.log('🔐 Creating auth user...');
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: demoUserForm.email,
        password: 'DemoUser123!', // Temporary password
        options: {
          data: {
            first_name: demoUserForm.firstName,
            last_name: demoUserForm.lastName,
          }
        }
      });

      if (authError && !authError.message.includes('already registered')) {
        console.error('❌ Auth error:', authError);
        throw authError;
      }
      console.log('✅ Auth user created/exists:', authUser?.user?.email);

      // Add to affiliate_system_users table
      console.log('📝 Inserting into affiliate_system_users table...');
      const affiliateData = {
        email: demoUserForm.email,
        first_name: demoUserForm.firstName,
        last_name: demoUserForm.lastName,
        referral_code: referralCode,
        primary_source: demoUserForm.source,
        status: 'active',
        signup_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 90 days
        total_team_size: performanceData.teamSize,
        total_l1_affiliates: Math.floor(performanceData.teamSize * 0.6),
        total_l2_affiliates: Math.floor(performanceData.teamSize * 0.3),
        total_l3_affiliates: Math.floor(performanceData.teamSize * 0.1),
        total_earnings: performanceData.commission,
        total_l1_earnings: performanceData.commission * 0.7,
        total_l2_earnings: performanceData.commission * 0.2,
        total_l3_earnings: performanceData.commission * 0.1,
        pending_earnings: Math.floor(performanceData.commission * 0.2),
        paid_earnings: Math.floor(performanceData.commission * 0.8),
      };
      console.log('📋 Affiliate data to insert:', affiliateData);

      const { error: affiliateError } = await supabase
        .from('affiliate_system_users')
        .upsert([affiliateData], { onConflict: 'email' });

      if (affiliateError) {
        console.error('❌ Affiliate insert error:', affiliateError);
        throw affiliateError;
      }
      console.log('✅ Affiliate data inserted successfully');

      // Reset form and close modal
      setDemoUserForm({
        email: `demo${Math.floor(Math.random() * 1000)}@example.com`,
        firstName: '',
        lastName: '',
        performanceLevel: 'medium',
        source: 'manual'
      });
      setIsDemoModalOpen(false);
      
      // Reload affiliates to show the new demo user
      console.log('🔄 Reloading affiliates...');
      await loadAffiliates();
      
      alert(`Demo user created successfully!\nEmail: ${demoUserForm.email}\nPassword: DemoUser123!\nPerformance Level: ${demoUserForm.performanceLevel}`);
      
    } catch (error: any) {
      console.error('❌ Error creating demo user:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        stack: error?.stack
      });
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object') {
        errorMessage = JSON.stringify(error, null, 2);
      } else if (error) {
        errorMessage = String(error);
      }
      
      alert(`Error creating demo user:\n${errorMessage}`);
    } finally {
      setIsCreatingDemo(false);
    }
  };

  const handleUnifiedImport = async () => {
    if (!isAdmin) {
      alert('Only administrators can perform imports');
      return;
    }

    // Use the known working GHL credentials directly
    const ghlCredentials = {
      apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwiY29tcGFueV9pZCI6IjY2ZTcxZmYzZjI5YzU0MjY0MzZmMjMzNSIsInZlcnNpb24iOjEsImlhdCI6MTczNzU0Mzg5MCwiZXhwIjoxNzM4MTQ4NjkwfQ.QhvPGwvFxlQ6QGIcFHhwfLsOyiPT4rVJ2G3mhfFPEWg',
      locationId: 'w01Gc7T4b0tKSDQdKhuN'
    };

    // For now, skip GoAffPro since we don't have working credentials
    const goaffproCredentials = undefined;

    setIsImporting(true);
    setImportStatus('Starting import from GHL...');

    try {
      console.log('🚀 Starting unified import from Affiliates page...');
      console.log('🔑 Using GHL credentials:', { locationId: ghlCredentials.locationId, hasApiKey: !!ghlCredentials.apiKey });

      setImportStatus('Executing GHL import...');

      const result = await unifiedImportService.importAllData(
        ghlCredentials,
        goaffproCredentials
      );

      console.log('✅ Unified import completed:', result);

      // Show results
      let message = `Import completed!\n\n`;
      message += `Total processed: ${result.totalRecordsProcessed}\n`;
      message += `Successful: ${result.totalRecordsSuccessful}\n`;
      message += `Failed: ${result.totalRecordsFailed}\n`;
      message += `Duration: ${(result.duration / 1000).toFixed(2)}s\n\n`;

      if (result.results.ghl) {
        message += `GHL: ${result.results.ghl.recordsSuccessful}/${result.results.ghl.recordsProcessed} successful\n`;
      }
      if (result.results.goaffpro) {
        message += `GoAffPro: ${result.results.goaffpro.recordsSuccessful}/${result.results.goaffpro.recordsProcessed} successful\n`;
      }

      if (result.errors.length > 0) {
        message += `\nErrors:\n${result.errors.slice(0, 5).join('\n')}`;
        if (result.errors.length > 5) {
          message += `\n... and ${result.errors.length - 5} more errors`;
        }
      }

      if (result.warnings.length > 0) {
        message += `\nWarnings:\n${result.warnings.slice(0, 3).join('\n')}`;
        if (result.warnings.length > 3) {
          message += `\n... and ${result.warnings.length - 3} more warnings`;
        }
      }

      alert(message);

      // Reload affiliates to show the imported data
      setImportStatus('Refreshing affiliate list...');
      await loadAffiliates();

    } catch (error) {
      console.error('❌ Unified import error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Import failed: ${errorMessage}`);
    } finally {
      setIsImporting(false);
      setImportStatus('');
    }
  };

  const loadAffiliates = async () => {
    console.log('🔄 Affiliates.tsx: loadAffiliates() called');
    console.log('🔄 Supabase client available:', !!supabase);
    console.log('🔄 AggregationService instance:', !!aggregationService);
    console.log('🔄 User email:', user?.email);
    console.log('🔄 Is admin:', isAdmin);
    
    try {
      setIsLoading(true);
      console.log('🔄 Loading state set to true');
      
      let affiliateDataPromise;
      let statsDataPromise;
      
      if (isAdmin) {
        console.log('🔄 Admin user: Calling aggregationService.getAllAffiliates()...');
        affiliateDataPromise = aggregationService.getAllAffiliates();
        console.log('🔄 Admin user: Calling aggregationService.getAffiliateStats()...');
        statsDataPromise = aggregationService.getAffiliateStats();
      } else {
        if (!user?.email) {
          console.warn('⚠️ Regular user has no email, cannot load user-specific data');
          setAffiliates([]);
          setStats({
            total: 0,
            active: 0,
            pending: 0,
            inactive: 0,
            bySource: { goaffpro: 0, mightynetworks: 0, native: 0 }
          });
          return;
        }
        
        console.log('🔄 Regular user: Calling aggregationService.getUserAffiliateData() for:', user.email);
        affiliateDataPromise = aggregationService.getUserAffiliateData(user.email);
        // For regular users, calculate stats from their own data
        statsDataPromise = Promise.resolve({
          total: 0,
          active: 0,
          pending: 0,
          inactive: 0,
          bySource: { goaffpro: 0, mightynetworks: 0, native: 0 }
        });
      }
      
      const [affiliateData, statsData] = await Promise.all([
        affiliateDataPromise,
        statsDataPromise
      ]);
      
      console.log('🔄 Received affiliate data:', affiliateData);
      console.log('🔄 Affiliate data length:', affiliateData?.length);
      console.log('🔄 Affiliate data sample:', affiliateData?.length > 0 ? affiliateData[0] : 'none');
      console.log('🔄 Received stats data:', statsData);
      
      // For regular users, calculate stats from their affiliate data
      if (!isAdmin && affiliateData && affiliateData.length > 0) {
        const userStats = {
          total: affiliateData.length,
          active: affiliateData.filter(a => a.status === 'Active').length,
          pending: affiliateData.filter(a => a.status === 'Pending').length,
          inactive: affiliateData.filter(a => a.status === 'Inactive').length,
          bySource: {
            goaffpro: affiliateData.filter(a => a.source === 'goaffpro').length,
            mightynetworks: affiliateData.filter(a => a.source === 'mightynetworks').length,
            native: affiliateData.filter(a => a.source === 'native').length,
          }
        };
        setStats(userStats);
        console.log('🔄 Calculated user stats:', userStats);
      } else {
        setStats(statsData);
      }
      
      console.log('🔄 Setting affiliates state...');
      setAffiliates(affiliateData);
      
      console.log('🔄 State updated successfully');
    } catch (error) {
      console.error('❌ Error loading affiliates:', error);
      console.error('❌ Error stack:', (error as Error).stack);
    } finally {
      console.log('🔄 Setting loading state to false');
      setIsLoading(false);
    }
  };

  const handleSort = (field: keyof AggregatedAffiliate) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAffiliates = affiliates
    .filter(affiliate => {
      const matchesSearch = affiliate.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            affiliate.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = levelFilter === 'All' || 
                          (levelFilter === 'GoAFF Pro' && affiliate.source === 'goaffpro') ||
                          (levelFilter === 'Mighty Networks' && affiliate.source === 'mightynetworks') ||
                          affiliate.level === levelFilter;
      
      const matchesStatus = statusFilter === 'All' || affiliate.status === statusFilter;
      
      const matchesSource = sourceFilter === 'All' || 
                            affiliate.source === sourceFilter ||
                            (sourceFilter === 'SHP' && affiliate.source === 'goaffpro') ||
                            (sourceFilter === 'MN' && affiliate.source === 'mightynetworks') ||
                            (sourceFilter === 'GHL' && affiliate.source === 'native') ||
                            (sourceFilter === 'goaffpro' && affiliate.source === 'SHP') ||
                            (sourceFilter === 'mightynetworks' && affiliate.source === 'MN') ||
                            (sourceFilter === 'native' && affiliate.source === 'GHL');
      
      return matchesSearch && matchesLevel && matchesStatus && matchesSource;
    })
    .sort((a, b) => {
      if (sortField === 'commission') {
        // Strip the $ and convert to number for commission sorting
        const valueA = parseFloat(a[sortField].replace('$', '').replace(',', ''));
        const valueB = parseFloat(b[sortField].replace('$', '').replace(',', ''));
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      } else if (sortField === 'dateJoined') {
        // Date comparison
        return sortDirection === 'asc' 
          ? new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime()
          : new Date(b[sortField]).getTime() - new Date(a[sortField]).getTime();
      } else if (sortField === 'referrals') {
        // Number comparison
        return sortDirection === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
      } else {
        // String comparison
        const aValue = (a[sortField] || '').toString().toLowerCase();
        const bValue = (b[sortField] || '').toString().toLowerCase();
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'SHP':
      case 'goaffpro':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">SHP</span>;
      case 'MN':
      case 'mightynetworks':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">MN</span>;
      case 'GHL':
      case 'native':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">GHL</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">Unknown</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">Active</span>;
      case 'Pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">Pending</span>;
      case 'Inactive':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">Inactive</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">Unknown</span>;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100,
        damping: 15
      },
    },
  };

  const getSortIcon = (field: keyof AggregatedAffiliate) => {
    if (sortField !== field) return <ChevronDown size={14} className="opacity-40" />;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  // Debug logging
  console.log('🔄 About to render. Affiliates state:', affiliates);
  console.log('🔄 Filtered affiliates:', filteredAffiliates);
  console.log('🔄 Filtered affiliates length:', filteredAffiliates.length);
  console.log('🔄 Current filters - search:', searchQuery, 'level:', levelFilter, 'status:', statusFilter, 'source:', sourceFilter);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-12"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-white flex items-center">
            <Users className="mr-2 h-6 w-6 text-rise-gold" />
            {isAdmin ? 'Raw Data' : 'My Affiliate Profile'}
          </h1>
          <p className="text-gray-400">
            {isAdmin 
              ? 'Import all of your affiliate partners from multiple sources'
              : 'View and manage your affiliate profile and performance data'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          {isAdmin && (
            <button
              onClick={handleUnifiedImport}
              disabled={isImporting}
              className="btn btn-primary flex items-center space-x-2"
              title="Import affiliate contacts from Go High Level"
            >
              <Download className={`h-4 w-4 ${isImporting ? 'animate-pulse' : ''}`} />
              <span>{isImporting ? 'Importing...' : 'Import GHL Data'}</span>
            </button>
          )}
          <button
            onClick={() => {
              localStorage.clear();
              console.log('🗑️ localStorage cleared');
              window.location.reload();
            }}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <span>Clear Cache</span>
          </button>
          <button
            onClick={loadAffiliates}
            disabled={isLoading}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          {isAdmin && (
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Database size={16} />
              <span>Add Demo User</span>
            </button>
          )}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <PlusCircle size={16} />
            <span>Invite Affiliate</span>
          </button>
        </div>
      </motion.div>

      {/* Import Status */}
      {isImporting && (
        <motion.div 
          variants={itemVariants} 
          className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-3">
            <Download className="h-5 w-5 text-blue-400 animate-pulse" />
            <div>
              <p className="text-blue-400 font-medium">Import in Progress</p>
              <p className="text-gray-300 text-sm">{importStatus}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Affiliates</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Database className="h-8 w-8 text-rise-gold" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Inactive</p>
              <p className="text-2xl font-bold text-red-400">{stats.inactive}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Source Breakdown */}
      <motion.div variants={itemVariants} className="card mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Affiliates by Source</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-rise-dark-light rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 rounded-full bg-blue-400"></div>
              <span className="text-gray-300">Shopify</span>
            </div>
            <span className="text-white font-semibold">{stats.bySource.goaffpro}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-rise-dark-light rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 rounded-full bg-purple-400"></div>
              <span className="text-gray-300">Mighty Networks</span>
            </div>
            <span className="text-white font-semibold">{stats.bySource.mightynetworks}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-rise-dark-light rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <span className="text-gray-300">GHL</span>
            </div>
            <span className="text-white font-semibold">{stats.bySource.native}</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search affiliates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap md:flex-nowrap gap-3">
            <div className="flex items-center bg-rise-dark-light rounded-md px-3">
              <Filter size={14} className="text-gray-400 mr-2" />
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as AffiliateSource)}
                className="bg-transparent text-gray-300 py-2 pr-8 text-sm appearance-none focus:outline-none"
              >
                <option value="All">All Sources</option>
                <option value="goaffpro">GoAFF Pro</option>
                <option value="mightynetworks">Mighty Networks</option>
                <option value="native">GHL</option>
              </select>
            </div>
            
            <div className="flex items-center bg-rise-dark-light rounded-md px-3">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as AffiliateLevel)}
                className="bg-transparent text-gray-300 py-2 pr-8 text-sm appearance-none focus:outline-none"
              >
                <option value="All">All Levels</option>
                <option value="Direct">Direct</option>
                <option value="Level 2">Level 2</option>
                <option value="Level 3">Level 3</option>
                <option value="GoAFF Pro">GoAFF Pro</option>
                <option value="Mighty Networks">Mighty Networks</option>
              </select>
            </div>
            
            <div className="flex items-center bg-rise-dark-light rounded-md px-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AffiliateStatus)}
                className="bg-transparent text-gray-300 py-2 pr-8 text-sm appearance-none focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Eye className="animate-pulse-slow inline-block h-12 w-12 text-rise-gold mb-4" />
            <p className="text-gray-400">Loading affiliates...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th 
                    className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      {getSortIcon('email')}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('source')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Source</span>
                      {getSortIcon('source')}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('level')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Level</span>
                      {getSortIcon('level')}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('referrals')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Leads</span>
                      {getSortIcon('referrals')}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('commission')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Commission</span>
                      {getSortIcon('commission')}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('dateJoined')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date Joined</span>
                      {getSortIcon('dateJoined')}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAffiliates.map((affiliate) => (
                  <motion.tr
                    key={affiliate.id}
                    variants={itemVariants}
                    className="border-b border-gray-800 hover:bg-rise-dark-light/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{affiliate.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-300">{affiliate.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      {getSourceBadge(affiliate.source)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-300">{affiliate.level}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-300">{affiliate.referrals}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-rise-gold font-medium">{affiliate.commission}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-300">{affiliate.dateJoined}</div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(affiliate.status)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredAffiliates.length === 0 && (
              <div className="text-center py-12">
                <Users className="inline-block h-12 w-12 text-gray-600 mb-4" />
                {isAdmin ? (
                  <p className="text-gray-400">No affiliates found matching your criteria</p>
                ) : (
                  <div>
                    <p className="text-gray-400 mb-2">No affiliate profile found</p>
                    <p className="text-gray-500 text-sm">
                      Your account may not be set up as an affiliate yet. Contact support if you believe this is an error.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Add Affiliate Modal */}
      <Transition appear show={isAddModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsAddModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-rise-dark p-6 text-left align-middle shadow-xl transition-all border border-gray-700">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white mb-4"
                  >
                    Invite New Affiliate
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-400 mb-4">
                      Send an invitation to a new affiliate partner.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="input-field w-full"
                          placeholder="affiliate@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Commission Rate (%)
                        </label>
                        <input
                          type="number"
                          className="input-field w-full"
                          placeholder="10"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      type="button"
                      className="btn btn-secondary flex-1"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary flex-1"
                      onClick={() => {
                        // TODO: Implement invite functionality
                        setIsAddModalOpen(false);
                      }}
                    >
                      Send Invitation
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add Demo User Modal */}
      <Transition appear show={isDemoModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDemoModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-rise-dark p-6 text-left align-middle shadow-xl transition-all border border-gray-700">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white mb-4"
                  >
                    Create Demo User
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-400 mb-4">
                      Create a demo affiliate user with mock performance data for testing.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="input-field w-full"
                          placeholder="demo@example.com"
                          value={demoUserForm.email}
                          onChange={(e) => setDemoUserForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="input-field w-full"
                            placeholder="John"
                            value={demoUserForm.firstName}
                            onChange={(e) => setDemoUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="input-field w-full"
                            placeholder="Doe"
                            value={demoUserForm.lastName}
                            onChange={(e) => setDemoUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Performance Level
                        </label>
                        <select
                          className="input-field w-full"
                          value={demoUserForm.performanceLevel}
                          onChange={(e) => setDemoUserForm(prev => ({ ...prev, performanceLevel: e.target.value as 'low' | 'medium' | 'high' }))}
                        >
                          <option value="low">Low Performer (1-3 referrals, $50-250)</option>
                          <option value="medium">Medium Performer (4-11 referrals, $300-1100)</option>
                          <option value="high">High Performer (12-26 referrals, $1000-3000)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Source Platform
                        </label>
                        <select
                          className="input-field w-full"
                          value={demoUserForm.source}
                          onChange={(e) => setDemoUserForm(prev => ({ ...prev, source: e.target.value as 'manual' | 'ghl' | 'goaffpro' }))}
                        >
                          <option value="manual">GHL (Manual)</option>
                          <option value="ghl">GHL (Go High Level)</option>
                          <option value="goaffpro">GoAFF Pro (GoAffPro)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                      <p className="text-sm text-blue-400 font-medium mb-1">Demo User Details:</p>
                      <ul className="text-xs text-gray-300 space-y-1">
                        <li>• Password: DemoUser123!</li>
                        <li>• Magic link login available</li>
                        <li>• Performance data auto-generated</li>
                        <li>• Can be used to test user experience</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      type="button"
                      className="btn btn-secondary flex-1"
                      onClick={() => setIsDemoModalOpen(false)}
                      disabled={isCreatingDemo}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary flex-1"
                      onClick={createDemoUser}
                      disabled={isCreatingDemo || !demoUserForm.email || !demoUserForm.firstName || !demoUserForm.lastName}
                    >
                      {isCreatingDemo ? 'Creating...' : 'Create Demo User'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </motion.div>
  );
};

export default Affiliates;