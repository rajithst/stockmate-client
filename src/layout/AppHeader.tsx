import React, { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Bell, Moon, Sun, UserCircle2, Search, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';

const notifications = [
  { id: 1, text: 'AAPL reached new 52-week high.' },
  { id: 2, text: 'TSLA quarterly earnings released.' },
  { id: 3, text: 'S&P 500 up 1.2% today.' },
];

// Mock company data for search
const mockCompanies = [
  { symbol: 'AAPL', name: 'Apple Inc.', logo: 'https://logo.clearbit.com/apple.com' },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    logo: 'https://logo.clearbit.com/microsoft.com',
  },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', logo: 'https://logo.clearbit.com/google.com' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', logo: 'https://logo.clearbit.com/amazon.com' },
  { symbol: 'TSLA', name: 'Tesla Inc.', logo: 'https://logo.clearbit.com/tesla.com' },
  { symbol: 'META', name: 'Meta Platforms Inc.', logo: 'https://logo.clearbit.com/meta.com' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', logo: 'https://logo.clearbit.com/nvidia.com' },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    logo: 'https://logo.clearbit.com/jpmorganchase.com',
  },
  { symbol: 'V', name: 'Visa Inc.', logo: 'https://logo.clearbit.com/visa.com' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', logo: 'https://logo.clearbit.com/jnj.com' },
  { symbol: 'WMT', name: 'Walmart Inc.', logo: 'https://logo.clearbit.com/walmart.com' },
  { symbol: 'DIS', name: 'The Walt Disney Company', logo: 'https://logo.clearbit.com/disney.com' },
];

interface AppHeaderProps {
  hideSearch?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ hideSearch = false }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockCompanies>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const filtered = mockCompanies.filter(
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
    navigate(`/company/${symbol}`);
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
                      <img
                        src={company.logo}
                        alt={company.symbol}
                        className="w-8 h-8 rounded flex-shrink-0 object-contain bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
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
            className="rounded-full hover:bg-indigo-100 transition"
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell className="w-6 h-6 text-indigo-500" />
          </Button>
          {notifOpen && (
            <div
              ref={notifDropdownRef}
              className="absolute right-0 top-full mt-2 min-w-[260px] bg-white border border-gray-200 shadow-2xl rounded-xl z-50 py-2 animate-fade-in"
            >
              <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b">
                Notifications
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">No new notifications.</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition"
                  >
                    {n.text}
                  </div>
                ))
              )}
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
              className="absolute right-0 top-full mt-2 min-w-[200px] bg-white border border-gray-200 shadow-2xl rounded-xl z-50 py-2 animate-fade-in"
            >
              <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b">
                My Profile
              </div>
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 transition"
                onClick={() => setProfileOpen(false)}
              >
                View Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition"
                onClick={() => setProfileOpen(false)}
              >
                Settings
              </a>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                onClick={() => {
                  setProfileOpen(false);
                  // Add logout logic here
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
