import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { AuthTokens, User } from '../types/auth.types';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  REMEMBER_ME: 'remember_me',
  ACTIVE_ROLE: 'active_role',
} as const;

interface StorageStrategy {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

class WebStorageStrategy implements StorageStrategy {
  async get(key: string) {
    return localStorage.getItem(key);
  }
  async set(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  async remove(key: string) {
    localStorage.removeItem(key);
  }
}

class SecureStoreStrategy implements StorageStrategy {
  async get(key: string) {
    return await SecureStore.getItemAsync(key);
  }
  async set(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }
  async remove(key: string) {
    await SecureStore.deleteItemAsync(key);
  }
}

class AsyncStorageStrategy implements StorageStrategy {
  async get(key: string) {
    return await AsyncStorage.getItem(key);
  }
  async set(key: string, value: string) {
    await AsyncStorage.setItem(key, value);
  }
  async remove(key: string) {
    await AsyncStorage.removeItem(key);
  }
}

class StorageService {
  private readonly tokenStorage: StorageStrategy;
  private readonly generalStorage: StorageStrategy;

  // 🚀 CACHE EN MEMORIA para tokens (mejora de performance)
  // Apps reales (Uber, Indriver) guardan tokens en memoria para acceso rápido
  private memoryCache = {
    accessToken: null as string | null,
    refreshToken: null as string | null,
  };

  constructor() {
    const isWeb = Platform.OS === 'web';
    this.tokenStorage = isWeb
      ? new WebStorageStrategy()
      : new SecureStoreStrategy();
    this.generalStorage = isWeb
      ? new WebStorageStrategy()
      : new AsyncStorageStrategy();
  }

  // -------------------------
  // TOKENS (CON CACHING EN MEMORIA)
  // -------------------------
  async saveTokens(tokens: AuthTokens): Promise<void> {
    // Validar que ambos tokens sean strings válidos
    if (typeof tokens.access_token !== 'string' || !tokens.access_token.trim()) {
      throw new Error('[StorageService] Invalid access_token: must be a non-empty string');
    }
    if (typeof tokens.refresh_token !== 'string' || !tokens.refresh_token.trim()) {
      throw new Error('[StorageService] Invalid refresh_token: must be a non-empty string');
    }

    console.log('[StorageService] Saving tokens...', { 
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      accessTokenLength: tokens.access_token.length,
      refreshTokenLength: tokens.refresh_token.length,
    });

    // Guardar en cache en memoria (instant)
    this.memoryCache.accessToken = tokens.access_token;
    this.memoryCache.refreshToken = tokens.refresh_token;

    // Guardar en storage persistente (async, background)
    await this.tokenStorage.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
    await this.tokenStorage.set(
      STORAGE_KEYS.REFRESH_TOKEN,
      tokens.refresh_token,
    );
    console.log('[StorageService] Tokens saved successfully');
  }

  async getAccessToken() {
    // 🟢 Primero intentar desde cache en memoria (instant, 0.1ms)
    if (this.memoryCache.accessToken) {
      return this.memoryCache.accessToken;
    }

    // 🔵 Si no está en cache, cargar desde storage (first time only)
    const token = await this.tokenStorage.get(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      this.memoryCache.accessToken = token;
    }
    console.log('[StorageService] getAccessToken called:', { hasToken: !!token });
    return token;
  }

  async getRefreshToken() {
    // 🟢 Primero intentar desde cache en memoria
    if (this.memoryCache.refreshToken) {
      return this.memoryCache.refreshToken;
    }

    // 🔵 Si no está en cache, cargar desde storage
    const token = await this.tokenStorage.get(STORAGE_KEYS.REFRESH_TOKEN);
    if (token) {
      this.memoryCache.refreshToken = token;
    }
    return token;
  }

  async clearTokens() {
    console.log('[StorageService] Clearing tokens...');
    // Limpiar cache en memoria
    this.memoryCache.accessToken = null;
    this.memoryCache.refreshToken = null;
    // Limpiar storage persistente
    await this.tokenStorage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    await this.tokenStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    console.log('[StorageService] Tokens cleared');
  }

  // -------------------------
  // USER DATA (JSON PARSE SEGURO)
  // -------------------------
  async saveUserData(user: User): Promise<void> {
    try {
      await this.generalStorage.set(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(user),
      );
    } catch (err) {
      console.error('[Storage] Error stringify user:', err);
    }
  }

  async getUserData(): Promise<User | null> {
    const raw = await this.generalStorage.get(STORAGE_KEYS.USER_DATA);

    if (!raw || raw === 'undefined' || raw === 'null') {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.warn('[Storage] USER_DATA corrupto — limpiando', err);
      await this.clearUserData();
      return null;
    }
  }

  async clearUserData() {
    await this.generalStorage.remove(STORAGE_KEYS.USER_DATA);
  }

  // -------------------------
  // REMEMBER ME (PARSE SEGURO)
  // -------------------------
  async setRememberMe(value: boolean) {
    await this.generalStorage.set(
      STORAGE_KEYS.REMEMBER_ME,
      JSON.stringify(value),
    );
  }

  async getRememberMe(): Promise<boolean> {
    const raw = await this.generalStorage.get(STORAGE_KEYS.REMEMBER_ME);

    if (!raw || raw === 'undefined' || raw === 'null') {
      return false;
    }

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error('[Storage] REMEMBER_ME corrupto — limpiando:', err);
      await this.generalStorage.remove(STORAGE_KEYS.REMEMBER_ME);
      return false;
    }
  }

  async clearAll() {
    await this.clearTokens();
    await this.clearUserData();
    await this.clearActiveRole();
  }

  // -------------------------
  // ACTIVE ROLE (Rol de vista actual - para navigation)
  // -------------------------
  async setActiveRole(role: 'CLIENTE' | 'TECNICO'): Promise<void> {
    await this.generalStorage.set(STORAGE_KEYS.ACTIVE_ROLE, role);
    console.log(`[StorageService] Active role set to: ${role}`);
  }

  async getActiveRole(): Promise<'CLIENTE' | 'TECNICO'> {
    const role = await this.generalStorage.get(STORAGE_KEYS.ACTIVE_ROLE);
    // Default to CLIENTE si no hay rol activo guardado
    return (role === 'TECNICO' ? 'TECNICO' : 'CLIENTE');
  }

  async clearActiveRole(): Promise<void> {
    await this.generalStorage.remove(STORAGE_KEYS.ACTIVE_ROLE);
  }
}

export const storageService = new StorageService();
