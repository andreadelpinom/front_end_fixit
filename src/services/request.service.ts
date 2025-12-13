import { apiClient } from './api-client.service';
import { getApiUrl } from '../config/api.config';
import { PaginatedSolicitudes } from '../types/api';
import { extractCollection, extractData } from './response-helpers';

const COLLECTION_KEYS = ['solicitudes', 'items', 'data', 'rows'];

const buildEmptyPaginated = (page: number, limit: number): PaginatedSolicitudes => ({
  solicitudes: [],
  pagination: {
    total: 0,
    page,
    limit,
    totalPages: 0,
  },
});

const normalizePaginatedSolicitudes = (
  payload: unknown,
  page: number,
  limit: number,
): PaginatedSolicitudes => {
  const data = extractData<Record<string, unknown>>(payload);
  const solicitudes = extractCollection<any>(data, COLLECTION_KEYS);
  const rawPagination =
    data && typeof data === 'object' && data.pagination && typeof data.pagination === 'object'
      ? (data.pagination as Record<string, unknown>)
      : {};

  const safeNumber = (value: unknown, fallback: number): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const total = safeNumber(rawPagination.total, solicitudes.length);
  const normalizedLimit = Math.max(1, safeNumber(rawPagination.limit, limit));
  const normalizedPage = Math.max(1, safeNumber(rawPagination.page, page));
  const totalPages = safeNumber(
    rawPagination.totalPages,
    normalizedLimit > 0 ? Math.ceil(total / normalizedLimit) : 0,
  );

  return {
    solicitudes,
    pagination: {
      total,
      page: normalizedPage,
      limit: normalizedLimit,
      totalPages,
    },
  };
};

/**
 * Servicio para obtener solicitudes de servicio del cliente
 */
export const requestService = {
  /**
   * Obtiene las solicitudes completadas (finalizadas) del usuario
   * @param limit - Límite de resultados por página (default: 20)
   * @param page - Página a obtener (default: 1)
   * @returns Array de solicitudes completadas
   */
  async getCompletedRequests(
    limit: number = 20,
    page: number = 1
  ): Promise<PaginatedSolicitudes> {
    try {
      const parsedLimit = Number.parseInt(String(limit), 10);
      const parsedPage = Number.parseInt(String(page), 10);
      const sanitizedLimit = Number.isNaN(parsedLimit) ? 20 : Math.max(1, parsedLimit);
      const sanitizedPage = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
      const url = getApiUrl('/request/solicitudes');
      const params = {
        estado: 'COMPLETADA',
        limit: sanitizedLimit,
        page: sanitizedPage,
      };

      console.log('[requestService] Fetching completed requests', { url, params });

      const response = await apiClient.get<unknown>(url, { params });
      return normalizePaginatedSolicitudes(response, sanitizedPage, sanitizedLimit);
    } catch (error) {
      console.error('[requestService] Error fetching completed requests:', error);
      return buildEmptyPaginated(1, 20);
    }
  },

  /**
   * Obtiene todas las solicitudes del usuario (todos los estados)
   * @param limit - Límite de resultados por página (default: 20)
   * @param page - Página a obtener (default: 1)
   * @returns Array de todas las solicitudes
   */
  async getAllRequests(
    limit: number = 20,
    page: number = 1
  ): Promise<PaginatedSolicitudes> {
    try {
      const response = await apiClient.get<unknown>(
        getApiUrl('/request/solicitudes/my/solicitudes'),
        {
          params: {
            limit,
            page,
          },
        },
      );

      return normalizePaginatedSolicitudes(response, page, limit);
    } catch (error) {
      console.error('[requestService] Error fetching all requests:', error);
      throw error;
    }
  },

  /**
   * Obtiene las solicitudes por estado específico
   * @param status - Estado de la solicitud (PENDIENTE, ACEPTADA, COMPLETADA, CANCELADA)
   * @param limit - Límite de resultados por página (default: 20)
   * @param page - Página a obtener (default: 1)
   * @returns Array de solicitudes del estado especificado
   */
  async getRequestsByStatus(
    status: 'PENDIENTE' | 'ACEPTADA' | 'COMPLETADA' | 'CANCELADA',
    limit: number = 20,
    page: number = 1
  ): Promise<PaginatedSolicitudes> {
    try {
      const response = await apiClient.get<unknown>(
        getApiUrl('/request/solicitudes'),
        {
          params: {
            estado: status,
            limit,
            page,
          },
        }
      );
      return normalizePaginatedSolicitudes(response, page, limit);
    } catch (error) {
      console.error('[requestService] Error fetching requests by status:', error);
      return buildEmptyPaginated(1, limit);
    }
  },
};
