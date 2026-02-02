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
      const response = await apiClient.post<AuthResponse>(url, credentials);

      await storageService.saveTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      if (response.user) {
        await storageService.saveUserData(response.user);
      }

      await storageService.setRememberMe(rememberMe);

      return response;
    } catch (error) {
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
    } catch (error) {
      ErrorUtils.logError(error, 'Logout');
    } finally {
      await storageService.clearAll();
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
