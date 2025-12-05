import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { AuthTokens, User } from '../types/auth.types';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  REMEMBER_ME: 'remember_me',
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
  // TOKENS
  // -------------------------
  async saveTokens(tokens: AuthTokens): Promise<void> {
    await this.tokenStorage.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
    await this.tokenStorage.set(
      STORAGE_KEYS.REFRESH_TOKEN,
      tokens.refresh_token,
    );
  }

  async getAccessToken() {
    return this.tokenStorage.get(STORAGE_KEYS.ACCESS_TOKEN);
  }

  async getRefreshToken() {
    return this.tokenStorage.get(STORAGE_KEYS.REFRESH_TOKEN);
  }

  async clearTokens() {
    await this.tokenStorage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    await this.tokenStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
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
  }
}

export const storageService = new StorageService();
