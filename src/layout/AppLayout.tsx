import React from 'react';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-56">
        <AppHeader />
        <main className="pt-16 px-6 pb-10 bg-muted/10 min-h-screen">{children}</main>
      </div>
    </div>
  );
};
