import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from '../config/api.config';
import { storageService } from './storage.service';
import { AuthError } from '../types/auth.types';

// Configuración de reintentos
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // ms
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  retryableNetworkErrors: ['ECONNABORTED', 'ENOTFOUND', 'ECONNREFUSED'],
} as const;

class ApiClient {
  private readonly client: AxiosInstance;
  private retryCount: Map<string, number> = new Map();

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
          console.log(
            `🔐 [ApiClient] Token set for ${config.method?.toUpperCase()} ${config.url}: ${tokenPreview}`,
          );
        } else {
          console.log(
            `⚠️ [ApiClient] No token found for ${config.method?.toUpperCase()} ${config.url}`,
          );
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );

    // Response interceptor con retry logic
    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const config = error.config as InternalAxiosRequestConfig;

        // Handle 401 - sesión expirada
        if (error.response?.status === 401) {
          console.log('⚠️ [ApiClient] 401 Unauthorized - Session expired. Clearing auth tokens only.');
          await storageService.clearTokens();
        }

        // Retry logic para errores de red y status codes específicos
        if (config && this.shouldRetry(error)) {
          const requestKey = `${config.method}:${config.url}`;
          const retries = (this.retryCount.get(requestKey) || 0) + 1;

          if (retries <= RETRY_CONFIG.maxRetries) {
            this.retryCount.set(requestKey, retries);
            const delay = RETRY_CONFIG.retryDelay * Math.pow(2, retries - 1); // exponential backoff
            console.log(
              `🔄 [ApiClient] Reintentando (${retries}/${RETRY_CONFIG.maxRetries}) ${requestKey} en ${delay}ms`,
            );

            await new Promise(resolve => setTimeout(resolve, delay));
            return this.client(config);
          }

          this.retryCount.delete(requestKey);
        }

        throw this.handleError(error);
      },
    );
  }

  private shouldRetry(error: AxiosError): boolean {
    // No reintentar si no hay error de red
    if (!error.request) {
      return false;
    }

    // Reintentar en errores de red específicos
    if (
      error.code &&
      (RETRY_CONFIG.retryableNetworkErrors as readonly string[]).includes(error.code)
    ) {
      return true;
    }

    // Reintentar en status codes específicos
    if (
      error.response?.status &&
      (RETRY_CONFIG.retryableStatusCodes as readonly number[]).includes(error.response.status)
    ) {
      return true;
    }

    return false;
  }

  private handleError(error: AxiosError): AuthError {
    const requestInfo = `${error.config?.method?.toUpperCase()} ${error.config?.url}`;

    if (error.response?.data) {
      const errorData = error.response.data as any;
      console.error(
        `❌ [ApiClient] Request failed: ${requestInfo}`,
        error.response.status,
        errorData.error,
      );
      return {
        success: false,
        error: errorData.error || errorData.message || 'An error occurred',
        statusCode: error.response.status,
      };
    }

    if (error.request) {
      console.error(
        `❌ [ApiClient] Network error: ${requestInfo}`,
        error.code,
        error.message,
      );
      return {
        success: false,
        error: `Network error. Please check your connection. (${error.code || 'Unknown'})`,
        statusCode: 0,
      };
    }

    console.error(`❌ [ApiClient] Unexpected error: ${requestInfo}`, error.message);
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

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch(url, data, config);
    return this.unwrap<T>(response);
  }
}
export const apiClient = new ApiClient();

