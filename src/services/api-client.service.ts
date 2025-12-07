import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from '../config/api.config';
import { storageService } from './storage.service';
import { AuthError } from '../types/auth.types';

class ApiClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await storageService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          const tokenPreview = token.substring(0, 20) + '...' + token.substring(token.length - 20);
          console.log(`🔐 [ApiClient] Token set for ${config.method?.toUpperCase()} ${config.url}: ${tokenPreview}`);
        } else {
          console.log(`⚠️ [ApiClient] No token found for ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          console.log('⚠️ [ApiClient] 401 Unauthorized - Session expired. Clearing auth tokens only.');
          // OPTION C: Only clear auth tokens, preserve user preferences and drafts
          await storageService.clearTokens();
          // TODO: Future - Implement refresh token flow here before clearing tokens
          // const refreshToken = await storageService.getRefreshToken();
          // if (refreshToken) {
          //   try {
          //     const newTokens = await authService.refreshToken(refreshToken);
          //     // Retry original request with new token
          //     return this.client(error.config as InternalAxiosRequestConfig);
          //   } catch {
          //     await storageService.clearTokens();
          //   }
          // }
        }
        throw this.handleError(error);
      },
    );
  }

  private handleError(error: AxiosError): AuthError {
    if (error.response?.data) {
      const errorData = error.response.data as any;
      return {
        success: false,
        error: errorData.error || errorData.message || 'An error occurred',
        statusCode: error.response.status,
      };
      
    }
    

    if (error.request) {
      return {
        success: false,
        error: 'Network error. Please check your connection.',
        statusCode: 0,
      };
    }

    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      statusCode: 0,
    };
  }

  private unwrap<T>(response: any): T {
  const payload = response?.data;

  // Caso 1: Envelope válido
  if (payload && typeof payload === 'object' && 'success' in payload) {
    if (payload.success === true) {
      return payload.data as T;
    }
    throw new Error(payload.error || payload.message || 'API Error');
  }

  // Caso 2: Respuesta directa (sin envelope)
  return payload as T;
}


  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return this.unwrap<T>(response);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return this.unwrap<T>(response);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return this.unwrap<T>(response);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return this.unwrap<T>(response);
  }
}
export const apiClient = new ApiClient();

