import React, { createContext, useState, useCallback, useEffect, useMemo } from "react";
import { getData, saveData, removeData, StorageKeys } from "../shared/storage";
import { AuthContextType, AuthProviderProps, User } from "../interface";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Rehydrate session on mount
  useEffect(() => {
    (async () => {
      const session = await getData<User | null>(StorageKeys.Auth.Session);
      if (session) setUser(session);
    })();
  }, []);

  // MOCK USERS DATABASE (se define fuera de render)
  const mockUsersDB: User[] = useMemo(() => [
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
  ], []);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API call

      if (!email.includes("@") || password.length < 6) {
        throw new Error("Credenciales inválidas");
      }

      const existingUser = mockUsersDB.find(u => u.email === email);
      if (!existingUser) throw new Error("Usuario no encontrado");

      setUser(existingUser);
      await saveData(StorageKeys.Auth.Session, existingUser);
    } finally {
      setIsLoading(false);
    }
  }, [mockUsersDB]);

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
          id: "user_" + Math.random().toString(36).slice(2, 11), // ✅ slice en lugar de substr
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

  // UPDATE USER
  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const next = { ...prevUser, ...userData };
      saveData(StorageKeys.Auth.Session, next);
      return next;
    });
  }, []);

  // REQUEST TECHNICIAN
  const requestTechnician = useCallback(() => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const next: User = {
        ...prevUser,
        isTechnicianRequested: true,
        isTechnicianVerified: true,
        role: "tecnico"
      };
      saveData(StorageKeys.Auth.Session, next);
      return next;
    });
  }, []);

  // Memoizar value del contexto
  const value = useMemo<AuthContextType>(() => ({
    user,
    isLoading,
    isSignedIn: user !== null,
    login,
    register,
    logout,
    updateUser,
    requestTechnician
  }), [user, isLoading, login, register, logout, updateUser, requestTechnician]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar AuthContext
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
