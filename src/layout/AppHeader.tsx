import React from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Bell, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export const AppHeader: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-56 right-0 h-14 border-b bg-background flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search companies..." className="w-64 text-sm" />
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold">
          R
        </div>
      </div>
    </header>
  );
};
