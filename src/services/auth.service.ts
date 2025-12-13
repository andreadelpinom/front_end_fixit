import { apiClient } from './api-client.service';
import { storageService } from './storage.service';
import { getApiUrl, API_CONFIG } from '../config/api.config';
import { AuthResponse, LoginDto, User, RegisterDto } from '../types/auth.types';
import { ErrorUtils } from '../utils/error.utils';
import { extractData } from './response-helpers';

class AuthService {
  async login(
    credentials: LoginDto,
    rememberMe: boolean = false,
  ): Promise<AuthResponse> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN);

    try {
      // LoginDto is union type, safely access either email or cedula
      const identifier = 'email' in credentials ? credentials.email : ('cedula' in credentials ? credentials.cedula : 'unknown');
      console.log('[AuthService] Login attempt with:', { identifier });
      const response = extractData<AuthResponse>(
        await apiClient.post<unknown>(url, credentials),
      );
      
      console.log('[AuthService] Login response received:', {
        hasAccessToken: !!response.access_token,
        hasRefreshToken: !!response.refresh_token,
        hasUser: !!response.user,
      });

      if (!response.access_token) {
        throw new Error('No access token received from server');
      }

      await storageService.saveTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      console.log('[AuthService] Tokens saved successfully');

      if (response.user) {
        await storageService.saveUserData(response.user);
        console.log('[AuthService] User data saved');
      }

      await storageService.setRememberMe(rememberMe);
      console.log('[AuthService] Login completed successfully');

      return response;
    } catch (error) {
      console.error('[AuthService] Login failed:', error);
      ErrorUtils.logError(error, 'Login');
      throw new Error(ErrorUtils.getErrorMessage(error));
    }
  }

  async register(payload: RegisterDto): Promise<any> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.USERS.CREATE);

    try {
      const response = await apiClient.post<unknown>(url, payload);
      return extractData(response);
    } catch (error) {
      ErrorUtils.logError(error, 'Register');
      throw new Error(ErrorUtils.getErrorMessage(error));
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = await storageService.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const url = getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH);

    try {
      const response = extractData<AuthResponse>(
        await apiClient.post<unknown>(url, {
        refresh_token: refreshToken,
        }),
      );

      await storageService.saveTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      return response;
    } catch (error) {
      ErrorUtils.logError(error, 'Refresh Token');
      await storageService.clearAll();
      throw new Error(ErrorUtils.getErrorMessage(error));
    }
  }

  async logout(): Promise<void> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);

    try {
      await apiClient.post(url);
    } catch (err: any) {
      const status = err?.response?.status ?? err?.statusCode;
      if (status !== 401) {
        console.error('[Logout]', err);
      }
    } finally {
      await storageService.clearTokens();
    }
  }

  async switchRole(nuevoRol: string): Promise<AuthResponse> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.AUTH.SWITCH_ROLE);

    try {
      console.log('[AuthService] Switching role to:', nuevoRol);
      console.log('[AuthService] Request URL:', url);
      
      // Agregar timeout de 10 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = extractData<AuthResponse>(
        await apiClient.post<unknown>(
          url,
          { nuevoRol },
          {
            signal: controller.signal as any,
          },
        ),
      );
      clearTimeout(timeoutId);

      // ✅ VALIDACIÓN: Verificar que backend devolvió los tokens requeridos
      if (!response.access_token || !response.refresh_token) {
        throw new Error(
          '[AuthService] Server error: Missing access_token or refresh_token in response',
        );
      }

      if (!response.user || !response.user.roles || response.user.roles.length === 0) {
        throw new Error(
          '[AuthService] Server error: Missing user data or roles in response',
        );
      }

      console.log('[AuthService] Role switch response validated:', {
        hasAccessToken: !!response.access_token,
        hasRefreshToken: !!response.refresh_token,
        newRoles: response.user.roles,
        accessTokenLength: response.access_token.length,
      });

      // Guardar nuevo token con nuevo rol (con validación interna en saveTokens)
      await storageService.saveTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      // Guardar datos de usuario actualizado
      if (response.user) {
        await storageService.saveUserData(response.user);
        console.log('[AuthService] User data updated with new roles:', {
          newRoles: response.user.roles,
          userId: response.user.idUser,
        });
      }

      // ✅ switchRole solo cambia tokens y rol activo
      // NO intenta crear técnico aquí - eso es responsabilidad del onboarding inicial
      // El perfil técnico se crea una sola vez en BecomeTechnicianScreen o registro

      return response;
    } catch (error: any) {
      console.error('[AuthService] Switch role failed:', error);
      
      // Logging detallado para debugging
      if (error?.name === 'AbortError') {
        console.error('[AuthService] Request timed out (>10s)');
        ErrorUtils.logError(new Error('Switch role request timeout'), 'Switch Role Timeout');
      } else {
        ErrorUtils.logError(error, 'Switch Role');
      }
      
      throw new Error(ErrorUtils.getErrorMessage(error));
    }
  }

  /**
   * Chequea si la sesión actual es válida
   * Se enfoca solo en si hay token + usuario, no en rememberMe
   * (rememberMe es solo para persistencia entre sesiones)
   */
  async checkAuthStatus() {
    const token = await storageService.getAccessToken();
    const user = await storageService.getUserData();

    // La sesión es válida si hay token Y usuario
    if (token && user) {
      return { isAuthenticated: true, user };
    }

    return { isAuthenticated: false, user: null };
  }

  /**
   * Chequea si la sesión debe ser restaurada al iniciar la app
   * Esto SÍ considera rememberMe
   */
  async checkSessionPersistence() {
    const rememberMe = await storageService.getRememberMe();
    if (!rememberMe) {
      return { shouldRestore: false, user: null };
    }

    const token = await storageService.getAccessToken();
    const user = await storageService.getUserData();

    if (token && user) {
      return { shouldRestore: true, user };
    }

    return { shouldRestore: false, user: null };
  }

  async getStoredUser(): Promise<User | null> {
    return storageService.getUserData();
  }
}

export const authService = new AuthService();

/**
 * Función helper para cambiar de rol directamente
 * Usada en BecomeTechnicianScreen para cambiar a TECNICO
 */
export async function switchRole(nuevoRol: string): Promise<AuthResponse> {
  return authService.switchRole(nuevoRol);
}
