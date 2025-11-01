import React from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, Eye, Settings, Home as HomeIcon, Newspaper } from 'lucide-react';

const navItems = [
  { name: 'Home', icon: HomeIcon, path: '/app' },
  { name: 'Holdings', icon: Eye, path: '/app/holdings' },
  { name: 'Dividends', icon: Briefcase, path: '/app/dividend' },
  { name: 'Watchlist', icon: Eye, path: '/app/watchlist' },
  { name: 'Screener', icon: Eye, path: '/app/screener' },
  { name: 'News', icon: Newspaper, path: '/app/news' },
  { name: 'Settings', icon: Settings, path: '/app/settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-56 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col z-20">
      {/* Logo/title */}
      <div className="h-14 flex items-center justify-center border-b border-gray-200 bg-white">
        <span className="text-xl font-bold text-indigo-700 tracking-tight select-none font-display">
          StockMate
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 mt-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-5 py-2 rounded-lg transition-all duration-150
                  ${
                    isActive
                      ? 'bg-indigo-50 font-semibold text-indigo-700 border-l-4 border-indigo-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon
                  className={`w-5 h-5 transition-all duration-150 ${
                    window.location.pathname === item.path
                      ? 'text-indigo-700'
                      : 'text-gray-400 group-hover:text-indigo-600'
                  }`}
                />
                <span className="tracking-tight text-base">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-gray-200 mx-5 mb-2" />
      <div className="px-5 pb-4 pt-2 text-xs text-gray-400">
        © {new Date().getFullYear()}{' '}
        <span className="font-semibold text-indigo-600">StockMate</span>
      </div>
    </aside>
  );
};
