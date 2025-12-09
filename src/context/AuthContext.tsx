import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from 'react';
import { authService } from '../services/auth.service';
import { AuthState, LoginDto, User } from '../types/auth.types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginDto, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (nuevoRol: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: { user: User } }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SWITCH_ROLE'; payload: { user: User } }
  | { type: 'SET_USER'; payload: { user: User } };

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return { ...initialState, isLoading: false };

    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SWITCH_ROLE':
      return {
        ...state,
        user: action.payload.user,
        isLoading: false,
        error: null,
      };

    case 'SET_USER':
      return { ...state, user: action.payload.user };

    default:
      return state;
  }
}

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const { isAuthenticated, user } = await authService.checkAuthStatus();

      if (isAuthenticated && user) {
        dispatch({ type: 'RESTORE_SESSION', payload: { user } });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials: LoginDto, rememberMe: boolean) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await authService.login(credentials, rememberMe);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.user } });
    } catch (error: any) {
      const errorMessage =
        typeof error?.message === 'string' ? error.message : 'Login failed';

      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const switchRole = async (nuevoRol: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await authService.switchRole(nuevoRol);
      dispatch({
        type: 'SWITCH_ROLE',
        payload: { user: response.user },
      });
      console.log('[AuthContext] Role switched successfully');
    } catch (error: any) {
      const errorMessage =
        typeof error?.message === 'string'
          ? error.message
          : 'Error al cambiar de rol';

      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  const refreshAuth = async () => {
    try {
      await authService.refreshToken();
    } catch (error) {
      console.error('Error refreshing token:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  const setUser = (user: User) => {
    dispatch({ type: 'SET_USER', payload: { user } });
  };

  // ------------------------------
  // FIX: Memoize context value
  // ------------------------------
  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      switchRole,
      refreshAuth,
      clearError,
      setUser,
    }),
    [state], // Recalcula solo cuando el estado cambia
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
