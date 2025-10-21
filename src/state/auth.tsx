import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    // TODO: load session from secure storage
    setSessionChecked(true);
  }, []);

  const login = async (email: string, _password: string) => {
    // TODO: call backend and store token
    setUser({ id: '1', name: email });
  };

  const logout = () => setUser(null);

  // Memorizar value del contexto
  const value = useMemo(
    () => ({
      user,
      sessionChecked,
      login,
      logout
    }),
    [user, sessionChecked, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
