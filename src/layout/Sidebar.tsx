import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, Eye, Settings, Home as HomeIcon, Newspaper, TrendingUp } from 'lucide-react';

const navItems = [
  { name: 'Home', icon: HomeIcon, path: '/app' },
  { name: 'Holdings', icon: Eye, path: '/app/holdings' },
  { name: 'Dividends', icon: Briefcase, path: '/app/dividend' },
  { name: 'Watchlist', icon: Eye, path: '/app/watchlist' },
  { name: 'Screener', icon: Eye, path: '/app/screener' },
  { name: 'News', icon: Newspaper, path: '/app/news' },
  { name: 'Settings', icon: Settings, path: '/app/settings' },
];

const NavItem = ({ item }: { item: (typeof navItems)[0] }) => (
  <NavLink
    to={item.path}
    end={item.path === '/app'}
    className={({ isActive }) =>
      `group relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-colors duration-200
      ${
        isActive
          ? 'text-indigo-300 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
          : 'text-slate-400 hover:text-slate-200'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <item.icon
          className={`w-4.5 h-4.5 transition-colors duration-200 flex-shrink-0 ${
            isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'
          }`}
        />
        <span className="truncate">{item.name}</span>
        {isActive && (
          <div className="absolute right-2.5 h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
        )}
      </>
    )}
  </NavLink>
);

export const Sidebar: React.FC = () => {
  const memoizedNavItems = useMemo(() => navItems, []);
  return (
    <aside className="w-52 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 fixed left-0 top-0 flex flex-col z-20 shadow-2xl dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Logo/Brand Header */}
      <div className="h-16 flex items-center justify-start px-4 border-b border-slate-700 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-base font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight block truncate">
              StockMate
            </span>
            <p className="text-xs text-slate-400 font-medium">Invest Smart</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4">
        <div className="space-y-0.5">
          {memoizedNavItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 px-3 py-3 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
        <div className="text-center">
          <p className="text-xs text-slate-500 truncate">
            © {new Date().getFullYear()}{' '}
            <span className="font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              StockMate
            </span>
          </p>
          <p className="text-xs text-slate-600 mt-0.5">Track & Analyze</p>
        </div>
      </div>
    </aside>
  );
};
