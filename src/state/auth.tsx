/* import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AuthContextType, User } from '../types';
import { authService } from '../services/AuthService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setSessionChecked(true);
    };
    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    const loggedUser = await authService.login(email, password);
    setUser(loggedUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, sessionChecked, login, logout }),
    [user, sessionChecked]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
 */