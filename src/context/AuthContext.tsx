import React, { createContext, useState, useCallback, ReactNode } from "react";

/**
 * User type definition for authentication context
 * Represents a logged-in user with their profile information
 */
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
}

/**
 * AuthContext type definition
 * Provides authentication state and methods
 */
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
}

/**
 * Create authentication context
 * Uses mock authentication for demonstration purposes
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component
 * Manages authentication state and provides auth methods
 * 
 * Features:
 * - Mock user login/registration
 * - User state persistence
 * - Role-based access (cliente/tecnico)
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Mock login function
   * Validates email and password, creates mock user session
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Basic validation
      if (!email.includes("@") || password.length < 6) {
        throw new Error("Invalid credentials");
      }

      // Mock user creation
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0] ?? email,
        role: "cliente",
        isVerified: false,
        completedServices: 0,
        averageRating: 0,
        joinDate: new Date().toISOString()
      };

      setUser(mockUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mock register function
   * Validates input and creates new user account
   */
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Basic validation
        if (!fullName.trim() || !email.includes("@") || password.length < 6) {
          throw new Error("Invalid registration data");
        }

        // Mock user creation
        const mockUser: User = {
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

        setUser(mockUser);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Logout function
   * Clears user session
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update user profile information
   * Merges new data with existing user object
   */
  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return { ...prevUser, ...userData };
    });
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: user !== null,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
