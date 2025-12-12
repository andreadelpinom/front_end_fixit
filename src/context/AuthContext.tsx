import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from 'react';
import { authService } from '../services/auth.service';
import { storageService } from '../services/storage.service';
import { AuthState, LoginDto, User } from '../types/auth.types';

/**
 * Estado extendido que incluye el flujo de selección de rol
 */
interface ExtendedAuthState extends AuthState {
  isRoleSelectionNeeded: boolean;
}

interface AuthContextType extends ExtendedAuthState {
  login: (credentials: LoginDto, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (nuevoRol: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
  completeRoleSelection: () => void;
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
  | { type: 'SET_USER'; payload: { user: User } }
  | { type: 'SHOW_ROLE_SELECTION' }
  | { type: 'COMPLETE_ROLE_SELECTION' };

const initialState: ExtendedAuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isRoleSelectionNeeded: false,
};

function authReducer(state: ExtendedAuthState, action: AuthAction): ExtendedAuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };

    case 'LOGIN_SUCCESS':
      // Si el usuario tiene múltiples roles, mostrar selector
      const hasMultipleRoles = action.payload.user.roles.length > 1;
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isRoleSelectionNeeded: hasMultipleRoles,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        isRoleSelectionNeeded: false,
      };

    case 'LOGOUT':
      return { ...initialState };

    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        isRoleSelectionNeeded: false,
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
        isRoleSelectionNeeded: false,
      };

    case 'SET_USER':
      return { ...state, user: action.payload.user };

    case 'SHOW_ROLE_SELECTION':
      return { ...state, isRoleSelectionNeeded: true };

    case 'COMPLETE_ROLE_SELECTION':
      return { ...state, isRoleSelectionNeeded: false };

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
      
      // Guardar el rol activo para la navegación (no quita los roles, solo marca cuál vista ver)
      await storageService.setActiveRole(nuevoRol as 'CLIENTE' | 'TECNICO');
      
      dispatch({
        type: 'SWITCH_ROLE',
        payload: { user: response.user },
      });
      console.log('[AuthContext] Role switched successfully to:', nuevoRol);
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

  const completeRoleSelection = () => {
    dispatch({ type: 'COMPLETE_ROLE_SELECTION' });
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
      completeRoleSelection,
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
