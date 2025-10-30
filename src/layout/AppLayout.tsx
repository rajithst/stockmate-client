import React from 'react';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { useLocation } from 'react-router-dom';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-56">
        <AppHeader hideSearch={isHomePage} />
        <main className="pt-16 px-6 pb-10 bg-muted/10 min-h-screen">{children}</main>
      </div>
    </div>
  );
};
