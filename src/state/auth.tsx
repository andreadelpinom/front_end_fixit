import React, { createContext, useContext, useEffect, useState } from 'react';

type User = { id: string; name: string } | null;

type AuthContextType = {
  user: User;
  sessionChecked: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

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

  return (
    <AuthContext.Provider value={{ user, sessionChecked, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
