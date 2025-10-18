import React, { createContext, useState, useCallback, ReactNode, useEffect } from "react";
import { getData, saveData, removeData, StorageKeys } from "../shared/storage";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "cliente" | "tecnico";
  isVerified: boolean;
  completedServices: number;
  averageRating: number;
  joinDate: string;
  certificates?: string[];
  // Flags para técnico
  isTechnicianRequested?: boolean;
  isTechnicianVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    phone: string,
    role: "cliente" | "tecnico"
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  requestTechnician: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Rehydrate session on mount
  useEffect(() => {
    (async () => {
      const session = await getData<User | null>(StorageKeys.Auth.Session);
      if (session) setUser(session);
    })();
  }, []);

  // MOCK USERS DATABASE
  const mockUsersDB: User[] = [
    {
      id: "1",
      email: "cliente@fixit.com",
      name: "Cliente Demo",
      role: "cliente",
      isVerified: true,
      completedServices: 5,
      averageRating: 4.5,
      joinDate: new Date().toISOString()
    },
    {
      id: "2",
      email: "tecnico@fixit.com",
      name: "Técnico Demo",
      role: "tecnico",
      isVerified: true,
      completedServices: 10,
      averageRating: 4.8,
      joinDate: new Date().toISOString(),
      certificates: []
    }
  ];

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API call

      if (!email.includes("@") || password.length < 6) {
        throw new Error("Credenciales inválidas");
      }

      // BUSCAR USUARIO EN MOCK DB
      const existingUser = mockUsersDB.find(u => u.email === email);

      if (!existingUser) {
        throw new Error("Usuario no encontrado");
      }

  // Guardar usuario en contexto y persistir
  setUser(existingUser);
  await saveData(StorageKeys.Auth.Session, existingUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // REGISTER
  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
      phone: string,
      role: "cliente" | "tecnico"
    ) => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (!fullName.trim() || !email.includes("@") || password.length < 6) {
          throw new Error("Datos de registro inválidos");
        }

        const newUser: User = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          email,
          name: fullName,
          phone,
          role,
          isVerified: false,
          completedServices: 0,
          averageRating: 0,
          joinDate: new Date().toISOString(),
          certificates: role === "tecnico" ? [] : undefined
        };

        setUser(newUser);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
  setUser(null);
  await removeData(StorageKeys.Auth.Session);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const next = { ...prevUser, ...userData };
      // Fire and forget persist
      saveData(StorageKeys.Auth.Session, next);
      return next;
    });
  }, []);

  // Solicitar ser técnico (simulado: solo marca flags y cambia rol)
  const requestTechnician = useCallback(() => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const next: User = {
        ...prevUser,
        isTechnicianRequested: true,
        // Simular verificación automática por ahora
        isTechnicianVerified: true,
        role: "tecnico"
      };
      saveData(StorageKeys.Auth.Session, next);
      return next;
    });
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: user !== null,
    login,
    register,
    logout,
    updateUser,
    requestTechnician
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar AuthContext
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}

