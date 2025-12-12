import { apiClient } from './api-client.service';
import { getApiUrl } from '../config/api.config';

/**
 * Interface para una solicitud de servicio completada
 */
export interface Solicitud {
  idSolicitud: number;
  idUser: number;
  idTipoServicio: number;
  codigoParroquia: string;
  tituloProblema: string;
  descripcionProblema: string;
  costoEstimado: number | null;
  costoPromocion: number | null;
  promocion: boolean;
  estadoSolicitud: 'PENDIENTE' | 'ACEPTADA' | 'COMPLETADA' | 'CANCELADA';
  fechaProgramada: string | null;
  fechaPublicacion: string;
  fechaInicio: string | null;
  fechaFinalizacion: string | null;
  duracionEstimadaMin: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
  updatedBy: number | null;
  _count: {
    solicitudesTecnico: number;
    calificaciones: number;
  };
}

/**
 * Interface para la respuesta del servidor
 */
export interface SolicitudResponse {
  solicitudes: Solicitud[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Interface para la respuesta completa del API
 */
interface ApiResponse {
  success: boolean;
  data: SolicitudResponse;
  error?: string;
  statusCode?: number;
}

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
  ): Promise<SolicitudResponse> {
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

      const response = await apiClient.get<ApiResponse>(
        url,
        {
          params,
        }
      );

      if (!response.success) {
        console.warn('[requestService] Backend returned unsuccessful response for completed requests:', response);
        return {
          solicitudes: [],
          pagination: {
            total: 0,
            page: sanitizedPage,
            limit: sanitizedLimit,
            totalPages: 0,
          },
        };
      }

      return response.data;
    } catch (error) {
      console.error('[requestService] Error fetching completed requests:', error);
      return {
        solicitudes: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        },
      };
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
  ): Promise<SolicitudResponse> {
    try {
      const response = await apiClient.get<ApiResponse>(
        '/request/solicitudes/my/solicitudes',
        {
          params: {
            limit,
            page,
          },
        }
      );

      if (!response.success) {
        throw new Error('Error fetching all requests');
      }

      return response.data;
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
  ): Promise<SolicitudResponse> {
    try {
      const response = await apiClient.get<ApiResponse>(
        getApiUrl('/request/solicitudes'),
        {
          params: {
            estado: status,
            limit,
            page,
          },
        }
      );

      if (!response.success) {
        console.warn('[requestService] Backend returned unsuccessful response:', response);
        // Return empty response instead of throwing
        return {
          solicitudes: [],
          pagination: {
            total: 0,
            page: 1,
            limit: limit,
            totalPages: 0,
          },
        };
      }

      return response.data;
    } catch (error) {
      console.error('[requestService] Error fetching requests by status:', error);
      // Return empty response instead of throwing, for graceful degradation
      return {
        solicitudes: [],
        pagination: {
          total: 0,
          page: 1,
          limit: limit,
          totalPages: 0,
        },
      };
    }
  },
};
