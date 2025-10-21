import Constants from 'expo-constants';
import type { DemoResponse } from '../shared/api';
const DEFAULT_API = 'http://localhost:8080/api';

export const API_URL = (Constants?.expoConfig?.extra as any)?.API_URL || DEFAULT_API;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  ping: () => request<DemoResponse>('/demo'),
};
