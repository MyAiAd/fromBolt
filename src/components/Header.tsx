import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu as MenuIcon, Bell } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ setSidebarOpen }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications] = useState([
    { id: 1, text: 'New affiliate signup: Sarah J.', time: '10 min ago', unread: true },
    { id: 2, text: 'Commission payout processed: $234.50', time: '1 hour ago', unread: true },
    { id: 3, text: 'New sale from affiliate: Mark T.', time: '3 hours ago', unread: false },
  ]);
  
  const handleLogout = async () => {
    if (isLoggingOut) {
      console.log('Header: Logout already in progress, ignoring click');
      return;
    }
    
    console.log('Header: Logout button clicked - IMMEDIATE');
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
    <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-jennaz-purple shadow-sm border-b border-jennaz-rose border-opacity-10">
      <button
        type="button"
        className="px-4 border-r border-gray-700 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-jennaz-rose md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <div className="max-w-2xl w-full">
            <div className="flex items-center">
              <img 
                src="/JennaA-texta-logo-aqua.png" 
                alt="Jennaz Logo" 
                className="h-6 w-6 rounded-full object-cover mr-3"
              />
              <h1 className="text-xl font-serif text-white">
                <span className="hidden sm:inline">JennaZ - </span>Affiliate Dashboard
              </h1>
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          {/* Notifications dropdown */}
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="bg-jennaz-purple p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white relative">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-jennaz-purple"></span>
                )}
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-jennaz-purple ring-1 ring-black ring-opacity-5 focus:outline-none py-1 border border-jennaz-rose border-opacity-20">
                <div className="px-4 py-2 border-b border-jennaz-rose border-opacity-20">
                  <h3 className="text-sm font-medium text-gray-100">Notifications</h3>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-300">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <Menu.Item key={notification.id}>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-jennaz-purple-light' : ''
                          } ${
                            notification.unread ? 'bg-jennaz-purple bg-opacity-70' : ''
                          } px-4 py-3 flex items-start block text-sm`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${notification.unread ? 'font-medium text-white' : 'text-gray-400'}`}>
                              {notification.text}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </a>
                      )}
                    </Menu.Item>
                  ))
                )}
                <div className="border-t border-jennaz-rose border-opacity-20 px-4 py-2 text-center">
                  <a href="#" className="text-xs text-jennaz-rose hover:underline">View all notifications</a>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="max-w-xs bg-jennaz-purple rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-jennaz-rose text-jennaz-purple-dark flex items-center justify-center font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-jennaz-purple ring-1 ring-black ring-opacity-5 focus:outline-none border border-jennaz-rose border-opacity-20">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={`${
                        active ? 'bg-jennaz-purple-light' : ''
                      } block px-4 py-2 text-sm text-gray-300`}
                    >
                      Your Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={`${
                        active ? 'bg-jennaz-purple-light' : ''
                      } block px-4 py-2 text-sm text-gray-300`}
                    >
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className={`${
                        active && !isLoggingOut ? 'bg-jennaz-purple-light' : ''
                      } ${
                        isLoggingOut ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300'
                      } block px-4 py-2 text-sm w-full text-left transition-colors duration-200 hover:bg-jennaz-purple-light disabled:hover:bg-transparent`}
                    >
                      {isLoggingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;