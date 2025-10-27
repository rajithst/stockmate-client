import React, { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Bell, Moon, Sun, UserCircle2 } from 'lucide-react';
import { useTheme } from 'next-themes';

const notifications = [
  { id: 1, text: 'AAPL reached new 52-week high.' },
  { id: 2, text: 'TSLA quarterly earnings released.' },
  { id: 3, text: 'S&P 500 up 1.2% today.' },
];

export const AppHeader: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (profileOpen || notifOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileOpen, notifOpen]);

  // Icon size for all icons
  const iconSize = 24;

  return (
    <header className="fixed top-0 left-56 right-0 h-14 border-b border-gray-200 bg-background flex items-center justify-end px-6 z-10">
      <div className="flex items-center gap-3 relative">
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
