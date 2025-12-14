import { ApiResponse } from '../types/api';

const DEFAULT_COLLECTION_KEYS = ['data', 'items', 'solicitudes', 'notificaciones', 'rows'];

const isApiResponse = <T>(payload: unknown): payload is ApiResponse<T> => {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  return 'success' in (payload as Record<string, unknown>);
};

/**
 * Extrae arreglos desde respuestas con distintos envoltorios.
 * Devuelve un arreglo vacío si no encuentra datos compatibles.
 */
export function extractArray<T>(payload: unknown, keys: string[] = DEFAULT_COLLECTION_KEYS): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const record = payload as Record<string, unknown>;

  if (isApiResponse<unknown>(record)) {
    if (record.success === false) {
      throw new Error(String(record.error ?? record.message ?? 'Request failed'));
    }

    return extractArray<T>(record.data, keys);
  }

  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  return [];
}

/**
 * Obtiene un objeto desde una respuesta con envelope. Lanza error si la
 * respuesta indica fallo explícito.
 */
export function extractData<T>(payload: unknown): T {
  if (isApiResponse<T>(payload)) {
    if (payload.success === false) {
      throw new Error(String(payload.error ?? payload.message ?? 'Request failed'));
    }

    return extractData<T>(payload.data);
  }

  if (payload === null || payload === undefined) {
    throw new Error('Empty response payload');
  }

  return payload as T;
}

/**
 * Localiza arreglos dentro de estructuras anidadas usando rutas comunes.
 */
export function extractCollection<T>(
  payload: unknown,
  keys: string[] = DEFAULT_COLLECTION_KEYS,
): T[] {
  const root = extractData<unknown>(payload);
  const queue: unknown[] = [root];
  const visited = new Set<unknown>();

  while (queue.length > 0) {
    const current = queue.shift();

    if (current === null || current === undefined || visited.has(current)) {
      continue;
    }

    visited.add(current);

    if (Array.isArray(current)) {
      return current as T[];
    }

    const extracted = extractArray<T>(current, keys);
    if (Array.isArray(extracted) && extracted.length > 0) {
      return extracted;
    }

    if (current && typeof current === 'object') {
      const record = current as Record<string, unknown>;

      for (const key of keys) {
        const value = record[key];
        if (Array.isArray(value)) {
          return value as T[];
        }
      }

      for (const key of keys) {
        const value = record[key];
        if (value && typeof value === 'object' && !visited.has(value)) {
          queue.push(value);
        }
      }
    }
  }

  return [];
}
