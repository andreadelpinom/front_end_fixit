import { apiClient } from './api-client.service';
import { getApiUrl } from '../config/api.config';
import { PaginatedSolicitudes } from '../types/api';
import { extractCollection, extractData } from './response-helpers';
import { ErrorUtils } from '../utils/error.utils';
import type { RequestDetails } from './home.service';

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

const mapRequestDetails = (item: any): RequestDetails => ({
  idSolicitud: Number(item.idSolicitud ?? 0),
  idUser: Number(item.idUser ?? item.usuario?.idUser ?? 0),
  idTipoServicio: Number(item.idTipoServicio ?? item.tipoServicioId ?? 0),
  codigoParroquia: item.codigoParroquia ?? '',
  tituloProblema: item.tituloProblema ?? item.titulo ?? '',
  descripcionProblema: item.descripcionProblema ?? item.descripcion ?? '',
  costoEstimado: item.costoEstimado ?? null,
  costoPromocion: item.costoPromocion ?? null,
  promocion: Boolean(item.promocion),
  estadoSolicitud: item.estadoSolicitud,
  fechaProgramada: item.fechaProgramada ?? null,
  fechaPublicacion: item.fechaPublicacion ?? item.createdAt ?? '',
  fechaInicio: item.fechaInicio ?? null,
  fechaFinalizacion: item.fechaFinalizacion ?? null,
  duracionEstimadaMin: item.duracionEstimadaMin ?? null,
  isActive: Boolean(item.isActive ?? true),
  createdAt: item.createdAt ?? item.fechaPublicacion ?? '',
  updatedAt: item.updatedAt ?? item.modifiedAt ?? item.createdAt ?? item.fechaPublicacion ?? '',
  createdBy: item.createdBy ?? null,
  updatedBy: item.updatedBy ?? null,
});

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
  * @param status - Estado de la solicitud (PENDIENTE, PUBLICADA, ACEPTADA, ASIGNADA, EN_PROCESO, COMPLETADA, CANCELADA)
   * @param limit - Límite de resultados por página (default: 20)
   * @param page - Página a obtener (default: 1)
   * @returns Array de solicitudes del estado especificado
   */
  async getRequestsByStatus(
    status: 'PENDIENTE' | 'PUBLICADA' | 'ACEPTADA' | 'ASIGNADA' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA',
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

  async getRequestDetails(idSolicitud: number): Promise<RequestDetails> {
    try {
      const response = await apiClient.get<unknown>(
        getApiUrl(`/request/solicitudes/${idSolicitud}`),
      );
      const data = extractData<any>(response);
      return mapRequestDetails(data);
    } catch (error) {
      console.error('[requestService] Error fetching request details:', error);
      ErrorUtils.logError(error, `requestService.getRequestDetails(${idSolicitud})`);
      throw error;
    }
  },
};
