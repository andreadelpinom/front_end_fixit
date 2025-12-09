import { apiClient } from './api-client.service';
import { storageService } from './storage.service';
import { getApiUrl, API_CONFIG } from '../config/api.config';
import { AuthResponse, LoginDto, User, RegisterDto } from '../types/auth.types';
import { ErrorUtils } from '../utils/error.utils';

class AuthService {
  async login(
    credentials: LoginDto,
    rememberMe: boolean = false,
  ): Promise<AuthResponse> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN);

    try {
      console.log('[AuthService] Login attempt with:', { email: credentials.email || credentials.cedula });
      const response = await apiClient.post<AuthResponse>(url, credentials);
      
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
      const response = await apiClient.post(url, payload);
      return response;
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
      const response = await apiClient.post<AuthResponse>(url, {
        refresh_token: refreshToken,
      });

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
    const url = getApiUrl(API_CONFIG.ENDPOINTS.USERS.SWITCH_ROLE);

    try {
      console.log('[AuthService] Switching role to:', nuevoRol);
      const response = await apiClient.put<AuthResponse>(url, { nuevoRol });

      // ✅ VALIDACIÓN: Verificar que backend devolvió los tokens requeridos
      if (!response.access_token || !response.refresh_token) {
        throw new Error(
          '[AuthService] Server error: Missing access_token or refresh_token in response',
        );
      }

      if (!response.user || !response.user.rol) {
        throw new Error(
          '[AuthService] Server error: Missing user data or role in response',
        );
      }

      console.log('[AuthService] Role switch response validated:', {
        hasAccessToken: !!response.access_token,
        hasRefreshToken: !!response.refresh_token,
        newRole: response.user.rol,
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
        console.log('[AuthService] User data updated with new role:', {
          newRole: response.user.rol,
          userId: response.user.idUser,
        });
      }

      return response;
    } catch (error) {
      console.error('[AuthService] Switch role failed:', error);
      ErrorUtils.logError(error, 'Switch Role');
      throw new Error(ErrorUtils.getErrorMessage(error));
    }
  }

  async checkAuthStatus() {
    const rememberMe = await storageService.getRememberMe();
    if (!rememberMe) {
      return { isAuthenticated: false, user: null };
    }

    const token = await storageService.getAccessToken();
    const user = await storageService.getUserData();

    if (token && user) {
      return { isAuthenticated: true, user };
    }

    return { isAuthenticated: false, user: null };
  }

  async getStoredUser(): Promise<User | null> {
    return storageService.getUserData();
  }
}

export const authService = new AuthService();
