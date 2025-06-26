import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Eye, Users, Search, PlusCircle, ChevronDown, ChevronUp, Filter, Database, RefreshCw, Download, Settings as SettingsIcon, CheckCircle, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AffiliateAggregationService, AggregatedAffiliate } from '../services/affiliateAggregationService';
import JennaZImport from '../components/JennaZImport';
import GoAffProImport from '../components/GoAffProImport';

type AffiliateLevel = 'All' | 'Aligned' | 'Activated' | 'Ascended' | 'Magnetic' | 'Luminary' | 'Visionary' | 'Oracle' | 'Sovereign';
type AffiliateStatus = 'All' | 'Active' | 'Pending' | 'Inactive';
type AffiliateSource = 'All' | 'goaffpro' | 'mightynetworks' | 'native' | 'ghl';

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
  const [showImportSection, setShowImportSection] = useState(false);
  const [importNotification, setImportNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'info' | 'warning';
  }>({ show: false, message: '', type: 'success' });
  const [demoUserForm, setDemoUserForm] = useState({
    email: 'sage@risewith.us',
    firstName: 'Sage',
    lastName: 'Michael',
    performanceLevel: 'medium' as 'low' | 'medium' | 'high',
    source: 'manual' as 'manual' | 'ghl' | 'goaffpro'
  });
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  const [affiliates, setAffiliates] = useState<AggregatedAffiliate[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
    bySource: {
      shopify: 0,  // Combined goaffpro 
      mightynetworks: 0,
      ghl: 0  // Combined ghl + native
    }
  });

  const aggregationService = useMemo(() => new AffiliateAggregationService(supabase), [supabase]);

  useEffect(() => {
    loadAffiliates();
    
    // Listen for import success events to refresh data
    const handleImportSuccess = (event: CustomEvent) => {
      console.log('🎉 Import success detected, refreshing affiliates data...', event.detail);
      const { recordsImported, source } = event.detail;
      
      // Show success notification
      setImportNotification({
        show: true,
        message: `Successfully imported ${recordsImported} affiliates from ${source.toUpperCase()}! Data refreshed automatically.`,
        type: 'success'
      });
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setImportNotification(prev => ({ ...prev, show: false }));
      }, 5000);
      
      setTimeout(() => {
        loadAffiliates();
      }, 1000); // Small delay to ensure import is fully committed
    };
    
    const handleDataUpdated = () => {
      console.log('🔄 Affiliate data updated event detected, refreshing...');
      loadAffiliates();
    };
    
    window.addEventListener('affiliate-import-success', handleImportSuccess as EventListener);
    window.addEventListener('affiliate-data-updated', handleDataUpdated);
    
    return () => {
      window.removeEventListener('affiliate-import-success', handleImportSuccess as EventListener);
      window.removeEventListener('affiliate-data-updated', handleDataUpdated);
    };
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
            bySource: { shopify: 0, mightynetworks: 0, ghl: 0 }
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
          bySource: { shopify: 0, mightynetworks: 0, ghl: 0 }
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
            shopify: affiliateData.filter(a => a.source === 'goaffpro').length,
            mightynetworks: affiliateData.filter(a => a.source === 'mightynetworks').length,
            ghl: affiliateData.filter(a => a.source === 'ghl' || a.source === 'native').length, // Combine GHL and native
          }
        };
        setStats(userStats);
        console.log('🔄 Calculated user stats:', userStats);
      } else {
        // For admin users, consolidate the stats from statsData
        if (statsData) {
          const consolidatedStats = {
            total: statsData.total,
            active: statsData.active,
            pending: statsData.pending,
            inactive: statsData.inactive,
            bySource: {
              shopify: (statsData.bySource as any)?.goaffpro || (statsData.bySource as any)?.shopify || 0,
              mightynetworks: statsData.bySource?.mightynetworks || 0,
              ghl: ((statsData.bySource as any)?.ghl || 0) + ((statsData.bySource as any)?.native || 0) // Combine GHL and native
            }
          };
          setStats(consolidatedStats);
        } else {
          setStats(statsData);
        }
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
      
      const matchesLevel = levelFilter === 'All' || affiliate.level === levelFilter;
      
      const matchesStatus = statusFilter === 'All' || affiliate.status === statusFilter;
      
      const matchesSource = sourceFilter === 'All' || affiliate.source === sourceFilter;
      
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
      case 'goaffpro':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">SHP</span>;
      case 'mightynetworks':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">MN</span>;
      case 'ghl':
      case 'native':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">GHL</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">Unknown</span>;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Aligned':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">Aligned</span>;
      case 'Activated':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">Activated</span>;
      case 'Ascended':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">Ascended</span>;
      case 'Magnetic':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">Magnetic</span>;
      case 'Luminary':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">Luminary</span>;
      case 'Visionary':
        return <span className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400">Visionary</span>;
      case 'Oracle':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">Oracle</span>;
      case 'Sovereign':
        return <span className="px-2 py-1 text-xs rounded-full bg-rise-gold/20 text-rise-gold">Sovereign</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">{level}</span>;
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
              ? 'Manage and track all your affiliate partners from multiple sources'
              : 'View and manage your affiliate profile and performance data'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
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
              onClick={() => setShowImportSection(!showImportSection)}
              className={`btn ${showImportSection ? 'btn-primary' : 'btn-secondary'} flex items-center space-x-2`}
            >
              <Download size={16} />
              <span>Import Data</span>
            </button>
          )}
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
            className="btn btn-primary flex items-center space-x-2"
          >
            <PlusCircle size={16} />
            <span>Invite Affiliate</span>
          </button>
        </div>
      </motion.div>

      {/* Import Success Notification */}
      {importNotification.show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`card mb-6 ${
            importNotification.type === 'success' ? 'bg-green-900/20 border-green-500/30' :
            importNotification.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500/30' :
            'bg-blue-900/20 border-blue-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className={`h-5 w-5 ${
                importNotification.type === 'success' ? 'text-green-400' :
                importNotification.type === 'warning' ? 'text-yellow-400' :
                'text-blue-400'
              }`} />
              <div>
                <h3 className={`text-sm font-medium ${
                  importNotification.type === 'success' ? 'text-green-400' :
                  importNotification.type === 'warning' ? 'text-yellow-400' :
                  'text-blue-400'
                }`}>Import Complete</h3>
                <p className="text-sm text-gray-300">{importNotification.message}</p>
              </div>
            </div>
            <button
              onClick={() => setImportNotification(prev => ({ ...prev, show: false }))}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Source Breakdown - Primary prominence */}
      <motion.div variants={itemVariants} className="card mb-6">
        <h3 className="text-xl font-bold text-white mb-6">Affiliates by Source</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-between p-4 bg-rise-dark-light rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 rounded-full bg-blue-400"></div>
              <span className="text-gray-300 font-medium">Shopify</span>
            </div>
            <span className="text-white font-bold text-lg">{stats.bySource.shopify}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-rise-dark-light rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 rounded-full bg-purple-400"></div>
              <span className="text-gray-300 font-medium">Mighty Networks</span>
            </div>
            <span className="text-white font-bold text-lg">{stats.bySource.mightynetworks}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-rise-dark-light rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 rounded-full bg-yellow-400"></div>
              <span className="text-gray-300 font-medium">GHL</span>
            </div>
            <span className="text-white font-bold text-lg">{stats.bySource.ghl}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards - Secondary visibility */}
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

      {/* Import Section */}
      {showImportSection && isAdmin && (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white flex items-center">
                <SettingsIcon className="mr-3 h-5 w-5 text-rise-gold" />
                Data Import & Integration
              </h3>
              <p className="text-gray-400 text-sm">
                Import and sync affiliate data from your platforms. Use proper filtering to import only affiliates, not all contacts.
              </p>
            </div>
            <button
              onClick={() => setShowImportSection(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronUp size={20} />
            </button>
          </div>
          
          <div className="space-y-8">
            {/* JennaZ (GHL) Import Section */}
            <div className="border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-white">JennaZ Import (Go High Level)</h4>
                  <p className="text-gray-400 text-sm">Import affiliate contacts from your Go High Level platform with proper filtering</p>
                </div>
                <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <Database className="h-4 w-4 text-white" />
                </div>
              </div>
              <JennaZImport />
            </div>

            {/* GoAffPro Import Section */}
            <div className="border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-white">ReAction Import (GoAffPro)</h4>
                  <p className="text-gray-400 text-sm">Import affiliate data from your GoAffPro/Shopify platform</p>
                </div>
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Database className="h-4 w-4 text-white" />
                </div>
              </div>
              <GoAffProImport />
            </div>
          </div>
        </motion.div>
      )}

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
                <option value="goaffpro">SHP</option>
                <option value="mightynetworks">MN</option>
                <option value="ghl">GHL</option>
              </select>
            </div>
            
            <div className="flex items-center bg-rise-dark-light rounded-md px-3">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as AffiliateLevel)}
                className="bg-transparent text-gray-300 py-2 pr-8 text-sm appearance-none focus:outline-none"
              >
                <option value="All">All Levels</option>
                <option value="Aligned">Aligned ($0-$1K)</option>
                <option value="Activated">Activated ($1K-$5K)</option>
                <option value="Ascended">Ascended ($5K-$25K)</option>
                <option value="Magnetic">Magnetic ($25K-$50K)</option>
                <option value="Luminary">Luminary ($50K-$100K)</option>
                <option value="Visionary">Visionary ($100K-$500K)</option>
                <option value="Oracle">Oracle ($500K-$1M)</option>
                <option value="Sovereign">Sovereign ($1M+)</option>
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
                      <span>Referrals</span>
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
                      {getLevelBadge(affiliate.level)}
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
                          <option value="manual">JennaZ.co (Manual)</option>
                          <option value="ghl">JennaZ (Go High Level)</option>
                          <option value="goaffpro">ReAction (GoAffPro)</option>
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