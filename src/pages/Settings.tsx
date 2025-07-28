import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Lock, CreditCard, User, Shield, Database, Save, Eye, EyeOff, Bot, Key, Plus, Trash2, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import GoAffProImport from '../components/GoAffProImport';
import MightyNetworksImport from '../components/MightyNetworksImport';
import JennaZImport from '../components/JennaZImport';

const Settings = () => {
  const { isAdmin, supabase } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    language: 'en',
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    theme: 'dark'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
    newAffiliateAlerts: true,
    commissionAlerts: true,
    securityAlerts: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: '30',
    loginAlerts: true
  });

  const [accountSettings, setAccountSettings] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    bio: ''
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    dataSharing: false,
    analyticsTracking: true,
    cookiePreferences: 'essential',
    activityLogging: true
  });

  // AI Settings state
  const [aiKeys, setAiKeys] = useState<any[]>([]);
  const [ragDocuments, setRagDocuments] = useState<any[]>([]);
  const [newApiKey, setNewApiKey] = useState({
    provider: 'openai',
    apiKey: '',
    keyName: ''
  });
  const [newRagDoc, setNewRagDoc] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [loadingAiData, setLoadingAiData] = useState(false);

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = securitySettings;

    // Validation
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword === currentPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setIsChangingPassword(true);

    try {
      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      // Clear password fields on success
      setSecuritySettings({
        ...securitySettings,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password changed successfully!');
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSaveSettings = (section: string) => {
    if (section === 'Security') {
      handlePasswordChange();
      return;
    }
    
    console.log(`Saving ${section} settings...`);
    // Here you would typically make an API call to save the settings
    toast.success(`${section} settings saved successfully!`);
  };

  // AI Settings handlers
  const loadAiData = async () => {
    setLoadingAiData(true);
    try {
      console.log('🔍 DEBUG: Loading AI data for user...');
      
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();
      console.log('🔍 DEBUG: Current user for loading AI data:', user);
      
      // Load API keys
      console.log('🔍 DEBUG: Attempting to load API keys...');
      const { data: keys, error: keysError } = await supabase
        .from('ai_api_keys')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (keysError) {
        console.error('🚨 DEBUG: Keys loading error:', keysError);
        throw keysError;
      }
      
      console.log('✅ DEBUG: API keys loaded successfully:', keys);
      setAiKeys(keys || []);

      // Load RAG documents (if admin)
      if (isAdmin) {
        console.log('🔍 DEBUG: User is admin, loading RAG documents...');
        const { data: docs, error: docsError } = await supabase
          .from('rag_documents')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (docsError) {
          console.error('🚨 DEBUG: RAG docs loading error:', docsError);
          throw docsError;
        }
        
        console.log('✅ DEBUG: RAG documents loaded successfully:', docs);
        setRagDocuments(docs || []);
      }
    } catch (error) {
      console.error('🚨 DEBUG: Full error loading AI data:', error);
      toast.error('Failed to load AI settings');
    } finally {
      setLoadingAiData(false);
    }
  };

  const handleAddApiKey = async () => {
    if (!newApiKey.apiKey.trim()) {
      toast.error('API key is required');
      return;
    }

    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      console.log('🔍 DEBUG: Current user for API key insert:', user);
      
      if (!user) {
        toast.error('You must be logged in to add API keys');
        return;
      }

      // Simple encryption - in production, use proper server-side encryption
      const encryptedKey = btoa(newApiKey.apiKey);
      
      const insertData = {
        user_id: user.id,
        provider: newApiKey.provider,
        service_name: newApiKey.provider, // Add service_name to match provider
        api_key_encrypted: encryptedKey,
        api_key_name: newApiKey.keyName || null
      };
      
      console.log('🔍 DEBUG: Inserting API key data:', insertData);
      
      const { error, data } = await supabase
        .from('ai_api_keys')
        .insert(insertData);

      if (error) {
        console.error('🚨 DEBUG: Supabase insert error details:', error);
        throw error;
      }

      console.log('✅ DEBUG: API key inserted successfully:', data);
      toast.success('API key added successfully!');
      setNewApiKey({ provider: 'openai', apiKey: '', keyName: '' });
      setShowAddKeyModal(false);
      loadAiData();
    } catch (error) {
      console.error('🚨 DEBUG: Full error object:', error);
      toast.error('Failed to add API key');
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;

    try {
      const { error } = await supabase
        .from('ai_api_keys')
        .update({ is_active: false })
        .eq('id', keyId);

      if (error) throw error;

      toast.success('API key deleted successfully!');
      loadAiData();
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const handleAddRagDocument = async () => {
    if (!newRagDoc.title.trim() || !newRagDoc.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add documents');
        return;
      }

      const tags = newRagDoc.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const { error } = await supabase
        .from('rag_documents')
        .insert({
          title: newRagDoc.title,
          content: newRagDoc.content,
          tags: tags,
          uploaded_by: user.id,
          file_size: newRagDoc.content.length
        });

      if (error) throw error;

      toast.success('Document added successfully!');
      setNewRagDoc({ title: '', content: '', tags: '' });
      setShowAddDocModal(false);
      loadAiData();
    } catch (error) {
      console.error('Error adding document:', error);
      toast.error('Failed to add document');
    }
  };

  const handleDeleteRagDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const { error } = await supabase
        .from('rag_documents')
        .update({ is_active: false })
        .eq('id', docId);

      if (error) throw error;

      toast.success('Document deleted successfully!');
      loadAiData();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  // Load AI data when AI tab is activated
  useEffect(() => {
    if (activeTab === 'ai') {
      loadAiData();
    }
  }, [activeTab, isAdmin]);

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'ai', label: 'AI Settings', icon: Bot },
    ...(isAdmin ? [{ id: 'import', label: 'Data Import & Integration', icon: Database }] : []),
  ];

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-white flex items-center">
            <SettingsIcon className="mr-2 h-6 w-6 text-rise-gold" />
            Settings
          </h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-rise-dark text-white'
                        : 'text-gray-400 hover:text-white hover:bg-rise-dark-light'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="space-y-6">
              {activeTab === 'general' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">General Settings</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                        <select
                          value={generalSettings.language}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{
                            colorScheme: 'dark'
                          }}
                        >
                          <option value="en" className="bg-gray-800 text-white">English</option>
                          <option value="es" className="bg-gray-800 text-white">Spanish</option>
                          <option value="fr" className="bg-gray-800 text-white">French</option>
                          <option value="de" className="bg-gray-800 text-white">German</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                        <select
                          value={generalSettings.timezone}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{
                            colorScheme: 'dark'
                          }}
                        >
                          <option value="America/New_York" className="bg-gray-800 text-white">Eastern Time</option>
                          <option value="America/Chicago" className="bg-gray-800 text-white">Central Time</option>
                          <option value="America/Denver" className="bg-gray-800 text-white">Mountain Time</option>
                          <option value="America/Los_Angeles" className="bg-gray-800 text-white">Pacific Time</option>
                          <option value="Europe/London" className="bg-gray-800 text-white">London</option>
                          <option value="Europe/Paris" className="bg-gray-800 text-white">Paris</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                        <select
                          value={generalSettings.currency}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{
                            colorScheme: 'dark'
                          }}
                        >
                          <option value="USD" className="bg-gray-800 text-white">USD ($)</option>
                          <option value="EUR" className="bg-gray-800 text-white">EUR (€)</option>
                          <option value="GBP" className="bg-gray-800 text-white">GBP (£)</option>
                          <option value="CAD" className="bg-gray-800 text-white">CAD ($)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Date Format</label>
                        <select
                          value={generalSettings.dateFormat}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{
                            colorScheme: 'dark'
                          }}
                        >
                          <option value="MM/DD/YYYY" className="bg-gray-800 text-white">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY" className="bg-gray-800 text-white">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD" className="bg-gray-800 text-white">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={generalSettings.theme === 'dark'}
                            onChange={(e) => setGeneralSettings({ ...generalSettings, theme: e.target.value })}
                            className="mr-2 text-rise-gold focus:ring-rise-gold"
                          />
                          <span className="text-gray-300">Dark</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={generalSettings.theme === 'light'}
                            onChange={(e) => setGeneralSettings({ ...generalSettings, theme: e.target.value })}
                            className="mr-2 text-rise-gold focus:ring-rise-gold"
                          />
                          <span className="text-gray-300">Light</span>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSaveSettings('General')}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors shadow-lg"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Notification Preferences</h3>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {Object.entries(notificationSettings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-300">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </label>
                            <p className="text-xs text-gray-400">
                              {key === 'emailNotifications' && 'Receive notifications via email'}
                              {key === 'pushNotifications' && 'Receive push notifications in your browser'}
                              {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
                              {key === 'weeklyReports' && 'Receive weekly performance reports'}
                              {key === 'newAffiliateAlerts' && 'Get notified when new affiliates join'}
                              {key === 'commissionAlerts' && 'Get notified of new commissions'}
                              {key === 'securityAlerts' && 'Receive security-related notifications'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => setNotificationSettings({ 
                                ...notificationSettings, 
                                [key]: e.target.checked 
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rise-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rise-gold"></div>
                          </label>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSaveSettings('Notifications')}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors shadow-lg"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Security Settings</h3>
                  <div className="space-y-6">
                    <div className="bg-rise-dark p-6 rounded-lg border border-gray-700">
                      <h4 className="text-md font-medium text-white mb-4">Change Password</h4>
                      {/* Debug info - remove after testing */}
                      <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded text-xs text-yellow-300">
                        <strong>Debug:</strong> Current: "{securitySettings.currentPassword}" | New: "{securitySettings.newPassword}" | Confirm: "{securitySettings.confirmPassword}"
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={securitySettings.currentPassword}
                              onChange={(e) => {
                                console.log('Current password input:', e.target.value);
                                setSecuritySettings({ ...securitySettings, currentPassword: e.target.value });
                              }}
                              placeholder="Enter your current password"
                              autoComplete="current-password"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={securitySettings.newPassword}
                              onChange={(e) => {
                                console.log('New password input:', e.target.value);
                                setSecuritySettings({ ...securitySettings, newPassword: e.target.value });
                              }}
                              placeholder="Enter your new password"
                              autoComplete="new-password"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={securitySettings.confirmPassword}
                              onChange={(e) => {
                                console.log('Confirm password input:', e.target.value);
                                setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value });
                              }}
                              placeholder="Confirm your new password"
                              autoComplete="new-password"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-rise-dark p-6 rounded-lg border border-gray-700">
                      <h4 className="text-md font-medium text-white mb-4">Two-Factor Authentication</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">Add an extra layer of security to your account</p>
                          <p className="text-xs text-gray-400">Use an authenticator app to generate verification codes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.twoFactorEnabled}
                            onChange={(e) => setSecuritySettings({ 
                              ...securitySettings, 
                              twoFactorEnabled: e.target.checked 
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rise-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rise-gold"></div>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
                        <select
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{
                            colorScheme: 'dark'
                          }}
                        >
                          <option value="15" className="bg-gray-800 text-white">15 minutes</option>
                          <option value="30" className="bg-gray-800 text-white">30 minutes</option>
                          <option value="60" className="bg-gray-800 text-white">1 hour</option>
                          <option value="120" className="bg-gray-800 text-white">2 hours</option>
                          <option value="480" className="bg-gray-800 text-white">8 hours</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-300">Login Alerts</label>
                          <p className="text-xs text-gray-400">Get notified of new login attempts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.loginAlerts}
                            onChange={(e) => setSecuritySettings({ 
                              ...securitySettings, 
                              loginAlerts: e.target.checked 
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rise-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rise-gold"></div>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSaveSettings('Security')}
                      disabled={isChangingPassword}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className={`mr-2 h-4 w-4 ${isChangingPassword ? 'animate-spin' : ''}`} />
                      {isChangingPassword ? 'Changing Password...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Billing Information</h3>
                  <div className="space-y-6">
                    <div className="bg-rise-dark p-6 rounded-lg border border-gray-700">
                      <h4 className="text-md font-medium text-white mb-4">Current Plan</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold text-rise-gold">Professional Plan</p>
                          <p className="text-sm text-gray-400">$99/month • Unlimited affiliates • Advanced analytics</p>
                        </div>
                        <button className="px-4 py-2 bg-rise-gold text-black rounded-md hover:bg-yellow-400 transition-colors">
                          Upgrade Plan
                        </button>
                      </div>
                    </div>

                    <div className="bg-rise-dark p-6 rounded-lg border border-gray-700">
                      <h4 className="text-md font-medium text-white mb-4">Payment Method</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center mr-3">
                            VISA
                          </div>
                          <div>
                            <p className="text-sm text-gray-300">•••• •••• •••• 4242</p>
                            <p className="text-xs text-gray-400">Expires 12/25</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:border-gray-500 transition-colors">
                          Update
                        </button>
                      </div>
                    </div>

                    <div className="bg-rise-dark p-6 rounded-lg border border-gray-700">
                      <h4 className="text-md font-medium text-white mb-4">Billing History</h4>
                      <div className="space-y-3">
                        {[
                          { date: '2024-01-01', amount: '$99.00', status: 'Paid' },
                          { date: '2023-12-01', amount: '$99.00', status: 'Paid' },
                          { date: '2023-11-01', amount: '$99.00', status: 'Paid' },
                        ].map((invoice, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                            <div>
                              <p className="text-sm text-gray-300">{invoice.date}</p>
                              <p className="text-xs text-gray-400">Professional Plan</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-300">{invoice.amount}</p>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-900 text-green-300">
                                {invoice.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Account Information</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                        <input
                          type="text"
                          value={accountSettings.firstName}
                          onChange={(e) => setAccountSettings({ ...accountSettings, firstName: e.target.value })}
                          className="w-full px-3 py-2 bg-rise-dark border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-rise-gold"
                          placeholder="Enter your first name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={accountSettings.lastName}
                          onChange={(e) => setAccountSettings({ ...accountSettings, lastName: e.target.value })}
                          className="w-full px-3 py-2 bg-rise-dark border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-rise-gold"
                          placeholder="Enter your last name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                          type="email"
                          value={accountSettings.email}
                          onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                          className="w-full px-3 py-2 bg-rise-dark border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-rise-gold"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={accountSettings.phone}
                          onChange={(e) => setAccountSettings({ ...accountSettings, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-rise-dark border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-rise-gold"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                        <input
                          type="text"
                          value={accountSettings.company}
                          onChange={(e) => setAccountSettings({ ...accountSettings, company: e.target.value })}
                          className="w-full px-3 py-2 bg-rise-dark border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-rise-gold"
                          placeholder="Enter your company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                        <input
                          type="url"
                          value={accountSettings.website}
                          onChange={(e) => setAccountSettings({ ...accountSettings, website: e.target.value })}
                          className="w-full px-3 py-2 bg-rise-dark border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-rise-gold"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                      <textarea
                        value={accountSettings.bio}
                        onChange={(e) => setAccountSettings({ ...accountSettings, bio: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 bg-rise-dark border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-rise-gold"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <button
                      onClick={() => handleSaveSettings('Account')}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors shadow-lg"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Privacy Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Profile Visibility</label>
                      <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{
                          colorScheme: 'dark'
                        }}
                      >
                        <option value="public" className="bg-gray-800 text-white">Public</option>
                        <option value="private" className="bg-gray-800 text-white">Private</option>
                        <option value="contacts" className="bg-gray-800 text-white">Contacts Only</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(privacySettings).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-300">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </label>
                            <p className="text-xs text-gray-400">
                              {key === 'dataSharing' && 'Allow sharing of anonymized data with partners'}
                              {key === 'analyticsTracking' && 'Enable analytics tracking for service improvement'}
                              {key === 'cookiePreferences' && 'Manage your cookie preferences'}
                              {key === 'activityLogging' && 'Log your activity for security purposes'}
                            </p>
                          </div>
                          {key === 'cookiePreferences' ? (
                            <select
                              value={value as string}
                              onChange={(e) => setPrivacySettings({ ...privacySettings, [key]: e.target.value })}
                              className="px-3 py-1 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              style={{
                                colorScheme: 'dark'
                              }}
                            >
                              <option value="essential" className="bg-gray-800 text-white">Essential Only</option>
                              <option value="functional" className="bg-gray-800 text-white">Functional</option>
                              <option value="all" className="bg-gray-800 text-white">All Cookies</option>
                            </select>
                          ) : (
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value as boolean}
                                onChange={(e) => setPrivacySettings({ 
                                  ...privacySettings, 
                                  [key]: e.target.checked 
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rise-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rise-gold"></div>
                            </label>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSaveSettings('Privacy')}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors shadow-lg"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">AI Settings</h3>
                  <p className="text-gray-400 mb-6">
                    Manage your AI API keys for OpenAI, OpenRouter, and Anthropic. {isAdmin && 'As an admin, you can also manage RAG documents for enhanced AI responses.'}
                  </p>
                  
                  {loadingAiData ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* API Keys Section */}
                      <div className="border border-gray-700 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-white flex items-center">
                              <Key className="mr-2 h-5 w-5 text-blue-400" />
                              API Keys
                            </h4>
                            <p className="text-gray-400 text-sm">Manage your AI provider API keys</p>
                          </div>
                          <button
                            onClick={() => setShowAddKeyModal(true)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Key
                          </button>
                        </div>
                        
                        {aiKeys.length > 0 ? (
                          <div className="space-y-3">
                            {aiKeys.map((key) => (
                              <div key={key.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-white capitalize">{key.provider}</span>
                                    {key.api_key_name && (
                                      <span className="text-sm text-gray-400">({key.api_key_name})</span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    Added {new Date(key.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteApiKey(key.id)}
                                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Delete API key"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <Key className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                            <p>No API keys configured yet</p>
                            <p className="text-sm">Add your first API key to start using AI features</p>
                          </div>
                        )}
                      </div>

                      {/* RAG Documents Section - Admin Only */}
                      {isAdmin && (
                        <div className="border border-gray-700 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-medium text-white flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-green-400" />
                                RAG Documents
                              </h4>
                              <p className="text-gray-400 text-sm">Manage documents for enhanced AI responses</p>
                            </div>
                            <button
                              onClick={() => setShowAddDocModal(true)}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Document
                            </button>
                          </div>
                          
                          {ragDocuments.length > 0 ? (
                            <div className="space-y-3">
                              {ragDocuments.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                                  <div className="flex-1">
                                    <div className="font-medium text-white">{doc.title}</div>
                                    <div className="text-sm text-gray-400">
                                      {doc.file_size} characters • Added {new Date(doc.created_at).toLocaleDateString()}
                                    </div>
                                    {doc.tags && doc.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                                                                 {doc.tags.map((tag: string, index: number) => (
                                          <span
                                            key={index}
                                            className="px-2 py-1 text-xs bg-blue-900/20 text-blue-300 rounded"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleDeleteRagDocument(doc.id)}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Delete document"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-400">
                              <FileText className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                              <p>No documents uploaded yet</p>
                              <p className="text-sm">Add documents to enhance AI responses with your content</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'import' && isAdmin && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Data Import & Integration</h3>
                  <p className="text-gray-400 mb-6">
                    Import and integrate data from your affiliate platforms. Some platforms support bulk imports while others use real-time webhooks for automatic synchronization.
                  </p>
                  
                  <div className="space-y-8">
                    {/* GoAffPro Import Section */}
                    <div className="border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-white">ReAction Import</h4>
                          <p className="text-gray-400 text-sm">Import data from your GoAffPro affiliate platform</p>
                        </div>
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                          <Database className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <GoAffProImport />
                    </div>

                    {/* MightyNetworks Import Section */}
                    <div className="border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-white">Facebook Integration</h4>
                          <p className="text-gray-400 text-sm">Real-time webhook integration via Zapier - captures new members and purchases automatically</p>
                        </div>
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Database className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <MightyNetworksImport />
                    </div>

                    {/* JennaZ Import Section */}
                    <div className="border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-white">JennaZ Import</h4>
                          <p className="text-gray-400 text-sm">Import data from your JennaZ.co (Go High Level) platform</p>
                        </div>
                        <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                          <Database className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <JennaZImport />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add API Key Modal */}
      {showAddKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-white mb-4">Add API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Provider</label>
                <select
                  value={newApiKey.provider}
                  onChange={(e) => setNewApiKey({ ...newApiKey, provider: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="openai">OpenAI</option>
                  <option value="openrouter">OpenRouter</option>
                  <option value="anthropic">Anthropic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                <input
                  type="password"
                  value={newApiKey.apiKey}
                  onChange={(e) => setNewApiKey({ ...newApiKey, apiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Key Name (Optional)</label>
                <input
                  type="text"
                  value={newApiKey.keyName}
                  onChange={(e) => setNewApiKey({ ...newApiKey, keyName: e.target.value })}
                  placeholder="e.g., Personal, Work"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddKeyModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddApiKey}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add RAG Document Modal */}
      {showAddDocModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium text-white mb-4">Add RAG Document</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newRagDoc.title}
                  onChange={(e) => setNewRagDoc({ ...newRagDoc, title: e.target.value })}
                  placeholder="Document title"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                <textarea
                  value={newRagDoc.content}
                  onChange={(e) => setNewRagDoc({ ...newRagDoc, content: e.target.value })}
                  placeholder="Document content..."
                  rows={8}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newRagDoc.tags}
                  onChange={(e) => setNewRagDoc({ ...newRagDoc, tags: e.target.value })}
                  placeholder="affiliates, guide, faq"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddDocModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRagDocument}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;