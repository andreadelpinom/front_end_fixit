import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

export async function saveData<T>(key: string, value: T): Promise<void> {
  const serialized = JSON.stringify(value);
  if (isWeb && typeof localStorage !== 'undefined') {
    localStorage.setItem(key, serialized);
    return;
  }
  await AsyncStorage.setItem(key, serialized);
}

export async function getData<T>(key: string): Promise<T | null> {
  if (isWeb && typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function removeData(key: string): Promise<void> {
  if (isWeb && typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
    return;
  }
  await AsyncStorage.removeItem(key);
}
