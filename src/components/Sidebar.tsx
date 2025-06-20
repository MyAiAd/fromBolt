import { Link, useLocation } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { LayoutDashboard, Users, BarChart3, Settings, Award, Layers, LogOut, Database, RefreshCw, HelpCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { signOut, isAdmin } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Affiliates', href: '/affiliates', icon: Users },
    { name: 'Affiliate Management', href: '/affiliates-dashboard', icon: Users },
    { name: 'Campaigns', href: '/campaigns', icon: Layers },
    { name: 'Performance', href: '/performance', icon: BarChart3 },
    ...(isAdmin
      ? [
          { name: 'ReAction', href: '/reaction-data', icon: Database },
          { name: 'Bitcoin is BAE', href: '/mightynetworks-data', icon: Database },
          { name: 'JennaZ', href: '/jennaz-data', icon: Database },
          { name: 'Data Sync', href: '/data-sync', icon: RefreshCw },
        ]
      : []),
    { name: 'User Guide', href: '/user-guide', icon: HelpCircle },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async (source: string) => {
    if (isLoggingOut) {
      console.log(`Sidebar: ${source} logout already in progress, ignoring click`);
      return;
    }
    
    console.log(`Sidebar: ${source} logout button clicked - IMMEDIATE`);
    setIsLoggingOut(true);
    
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      // Reset state if logout fails for some reason
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-jennaz-purple">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>

              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <div className="flex items-center">
                    <img 
                      src="/JennaA-texta-logo-aqua.png" 
                      alt="Jennaz Logo" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="ml-2 text-white font-serif text-xl">JennaZ</span>
                  </div>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'bg-jennaz-purple-dark text-white border-l-4 border-jennaz-rose'
                          : 'text-gray-300 hover:bg-jennaz-purple-dark hover:text-white'
                      } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className={`${
                        isActive(item.href) ? 'text-jennaz-rose' : 'text-gray-400 group-hover:text-gray-300'
                      } mr-4 flex-shrink-0 h-6 w-6`} />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex p-4">
                <button
                  onClick={() => handleLogout('Mobile')}
                  disabled={isLoggingOut}
                  className={`flex-1 flex items-center px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                    isLoggingOut 
                      ? 'text-gray-500 bg-gray-800 cursor-not-allowed' 
                      : 'text-gray-300 hover:text-white hover:bg-jennaz-purple-dark'
                  }`}
                >
                  <LogOut className={`mr-3 h-5 w-5 ${isLoggingOut ? 'text-gray-500 animate-spin' : 'text-gray-400'}`} />
                  <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
                </button>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 bg-jennaz-purple">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <div className="flex items-center">
                  <img 
                    src="/JennaA-texta-logo-aqua.png" 
                    alt="Jennaz Logo" 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="ml-2 text-white font-serif text-xl">JennaZ</span>
                </div>
              </div>
              <div className="px-4">
                <div className="card bg-opacity-50 mb-6">
                  <div className="flex items-center">
                    <Award className="h-10 w-10 text-jennaz-rose" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-200">Affiliate Level</p>
                      <p className="text-xs text-jennaz-rose">Diamond Partner</p>
                    </div>
                  </div>
                </div>
              </div>
              <nav className="mt-2 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-jennaz-purple-dark text-white border-l-4 border-jennaz-rose'
                        : 'text-gray-300 hover:bg-jennaz-purple-dark hover:text-white'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon className={`${
                      isActive(item.href) ? 'text-jennaz-rose' : 'text-gray-400 group-hover:text-gray-300'
                    } mr-3 flex-shrink-0 h-5 w-5`} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-jennaz-rose border-opacity-20 p-4">
              <button
                onClick={() => handleLogout('Desktop')}
                disabled={isLoggingOut}
                className={`flex-1 flex items-center px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                  isLoggingOut 
                    ? 'text-gray-500 bg-gray-800 cursor-not-allowed' 
                    : 'text-gray-300 hover:text-white hover:bg-jennaz-purple-dark'
                }`}
              >
                <LogOut className={`mr-3 h-5 w-5 ${isLoggingOut ? 'text-gray-500 animate-spin' : 'text-gray-400'}`} />
                <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;