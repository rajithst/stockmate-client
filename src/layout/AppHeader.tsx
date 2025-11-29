import React, { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Bell, Moon, Sun, UserCircle2, Search, X, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { StockSymbol } from '../types/user';

const notifications = [
  { id: 1, text: 'AAPL reached new 52-week high.' },
  { id: 2, text: 'TSLA quarterly earnings released.' },
  { id: 3, text: 'S&P 500 up 1.2% today.' },
];

interface AppHeaderProps {
  hideSearch?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ hideSearch = false }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, logout, logoutLoading, companies } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockSymbol[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle logout
  const handleLogout = async () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const filtered = companies.filter(
        (company) =>
          company.symbol.toLowerCase().includes(query.toLowerCase()) ||
          company.name.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filtered);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  // Handle company selection
  const handleSelectCompany = (symbol: string) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    setSearchResults([]);
    navigate(`/app/company/${symbol}`);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    if (profileOpen || notifOpen || showSearchDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileOpen, notifOpen, showSearchDropdown]);

  return (
    <header className="fixed top-0 left-56 right-0 h-14 border-b border-gray-200 bg-background flex items-center px-6 z-10">
      {/* Search Bar - Center (Hidden on Home Page) */}
      {!hideSearch && (
        <div ref={searchContainerRef} className="flex-1 max-w-md relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
              className="w-full h-8 pl-9 pr-9 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                  setSearchResults([]);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Search Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                {searchResults.map((company) => (
                  <button
                    key={company.symbol}
                    onClick={() => handleSelectCompany(company.symbol)}
                    className="w-full px-3 py-2.5 text-left hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                  >
                    <div className="flex items-center gap-3">
                      {company.image && (
                        <img
                          src={company.image}
                          alt={company.symbol}
                          className="w-8 h-8 rounded flex-shrink-0 object-contain bg-gray-100"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                          {company.symbol}
                        </p>
                        <p className="text-xs text-gray-500 group-hover:text-gray-700 truncate">
                          {company.name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right Side - Icons (Always on the right) */}
      <div className="flex items-center gap-3 relative ml-auto">
        {/* Notification Icon and Dropdown */}
        <div className="relative flex items-center">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="rounded-full hover:bg-indigo-100 transition relative"
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell className="w-6 h-6 text-indigo-500" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-gradient-to-br from-red-500 to-rose-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg">
                {notifications.length}
              </span>
            )}
          </Button>
          {notifOpen && (
            <div
              ref={notifDropdownRef}
              className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 shadow-2xl rounded-xl z-50 overflow-hidden animate-fade-in"
            >
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 px-4 py-3 border-b border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                </div>
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((n, index) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                        index === 0 ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Bell className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                            {n.text}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Just now</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                <button className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-1">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          className="rounded-full hover:bg-indigo-100 transition"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="w-6 h-6 text-yellow-500" />
          ) : (
            <Moon className="w-6 h-6 text-indigo-500" />
          )}
        </Button>
        {/* Profile Icon and Dropdown */}
        <div className="relative flex items-center">
          <button
            className="ml-2 rounded-full hover:bg-indigo-100 transition p-1 border border-transparent focus:border-indigo-400 focus:outline-none"
            onClick={() => setProfileOpen((v) => !v)}
            aria-label="Profile"
          >
            <UserCircle2 className="w-6 h-6 text-indigo-700" />
          </button>
          {profileOpen && (
            <div
              ref={profileDropdownRef}
              className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 shadow-2xl rounded-xl z-50 overflow-hidden animate-fade-in"
            >
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 px-4 py-4 border-b border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <UserCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {user?.username || 'User'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {user?.username || 'user'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    navigate('/app/settings');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-gray-600 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Settings</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    {logoutLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600" />
                    ) : (
                      <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <span className="font-medium">{logoutLoading ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
