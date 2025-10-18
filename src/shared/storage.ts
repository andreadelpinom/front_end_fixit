// Cross-platform storage utility for React Native (AsyncStorage) and Web (localStorage)
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

export async function saveData<T>(key: string, value: T): Promise<void> {
  const serialized = JSON.stringify(value);
  if (isWeb && window.localStorage) {
    window.localStorage.setItem(key, serialized);
    return;
  }
  await AsyncStorage.setItem(key, serialized);
}

export async function getData<T>(key: string): Promise<T | null> {
  if (isWeb && window.localStorage) {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function removeData(key: string): Promise<void> {
  if (isWeb && window.localStorage) {
    window.localStorage.removeItem(key);
    return;
  }
  await AsyncStorage.removeItem(key);
}

export async function pushToList<T>(key: string, item: T): Promise<T[]> {
  const list = (await getData<T[]>(key)) ?? [];
  const next = [...list, item];
  await saveData(key, next);
  return next;
}

export async function updateData<T>(key: string, updater: (prev: T | null) => T): Promise<T> {
  const prev = await getData<T>(key);
  const next = updater(prev);
  await saveData(key, next);
  return next;
}

export const StorageKeys = {
  Technician: {
    MyServices: 'technician:myServices',
    CertBannerSeen: 'technician:certBannerSeen',
    Requests: 'technician:requests',
    Profile: 'technician:profile',
  },
  Client: {
    SearchQuery: 'client:searchQuery',
    Filters: 'client:filters',
    RecentRequests: 'client:recentRequests',
    Profile: 'client:profile',
  },
  Auth: {
    Session: 'auth:session', // { isSignedIn, user }
  },
} as const;
