import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  logoutLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('stockmate_access_token');
      const storedUser = localStorage.getItem('stockmate_user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (err) {
          // Invalid stored user data
          localStorage.removeItem('stockmate_user');
          localStorage.removeItem('stockmate_access_token');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for token expiration events from API client
    const handleTokenExpired = () => {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('stockmate_user');
      localStorage.removeItem('stockmate_access_token');
    };

    window.addEventListener('auth-token-expired', handleTokenExpired);
    return () => window.removeEventListener('auth-token-expired', handleTokenExpired);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      // Call backend API for login (email parameter is actually username now)
      await apiClient.login(username, password);

      // On success, store user info (token is already stored by apiClient)
      const userData: User = {
        username: username,
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('stockmate_user', JSON.stringify(userData));

      return true;
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        errorMessage = JSON.stringify(err);
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLogoutLoading(true);
    try {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      localStorage.removeItem('stockmate_user');
      localStorage.removeItem('stockmate_access_token');
      apiClient.logout();
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading, error, logoutLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
