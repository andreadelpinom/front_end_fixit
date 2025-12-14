import { apiClient } from './api-client.service';
import { getApiUrl } from '../config/api.config';
import { extractCollection, extractData } from './response-helpers';

/**
 * Tipos de notificación disponibles según backend
 */
export enum TipoNotificacion {
  SOLICITUD_NUEVA = 'SOLICITUD_NUEVA',
  SOLICITUD_ACEPTADA = 'SOLICITUD_ACEPTADA',
  SOLICITUD_COMPLETADA = 'SOLICITUD_COMPLETADA',
  CALIFICACION_RECIBIDA = 'CALIFICACION_RECIBIDA',
  RECORDATORIO = 'RECORDATORIO',
}

/**
 * Interface para una notificación individual
 * Basada en el modelo Prisma del backend
 */
export interface Notification {
  idNotificacion: number;
  idUser: number;
  titulo: string;
  mensaje: string;
  estadoLectura: boolean;
  tipoNotificacion: TipoNotificacion;
  fechaEnvio: string; // ISO DateTime
  createdAt: string; // ISO DateTime
  updatedAt: string; // ISO DateTime
}

/**
 * Interface para la respuesta paginada de notificaciones
 */
export interface NotificationPaginationResponse {
  notificaciones: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const ARRAY_KEYS = ['notificaciones', 'items', 'data', 'rows'];

const toNumber = (value: unknown, fallback = 0): number => {
  if (value === null || value === undefined) {
    return fallback;
  }

  const numeric = typeof value === 'string' ? parseFloat(value) : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const buildPagination = (
  source: Record<string, unknown> | undefined,
  page: number,
  limit: number,
  totalFallback: number,
) => {
  const total = toNumber(source?.total, totalFallback);
  const normalizedLimit = Math.max(1, toNumber(source?.limit, limit));
  const normalizedPage = Math.max(1, toNumber(source?.page, page));
  const totalPages = toNumber(
    source?.totalPages,
    normalizedLimit > 0 ? Math.ceil(total / normalizedLimit) : 0,
  );

  return {
    total,
    page: normalizedPage,
    limit: normalizedLimit,
    totalPages,
  };
};

/**
 * Servicio para la gestión de notificaciones del usuario
 */
export const notificationService = {
  /**
   * Obtiene las notificaciones del usuario autenticado con paginación y filtros
   * @param params - Parámetros de búsqueda (page, limit, tipoNotificacion, estadoLectura)
   * @returns Respuesta paginada de notificaciones
   *
   * Endpoint: GET /api/v1/notifications/my/notifications
   */
  async getNotifications(params: {
    page: number;
    limit: number;
    tipoNotificacion?: string;
    estadoLectura?: string;
  }): Promise<NotificationPaginationResponse> {
    try {
      // Sanitizar parámetros numéricos
      const parsedLimit = Number.parseInt(String(params.limit), 10);
      const parsedPage = Number.parseInt(String(params.page), 10);
      const sanitizedLimit = Number.isNaN(parsedLimit) ? 20 : Math.max(1, parsedLimit);
      const sanitizedPage = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);

      const url = getApiUrl('/notifications/my/notifications');

      // Construir query params
      const queryParams: Record<string, any> = {
        limit: sanitizedLimit,
        page: sanitizedPage,
      };

      // Agregar filtros opcionales
      if (params.tipoNotificacion) {
        queryParams.tipoNotificacion = params.tipoNotificacion;
      }

      if (params.estadoLectura !== undefined) {
        // Convertir "true"/"false" a boolean si es string
        queryParams.estadoLectura =
          params.estadoLectura === 'true' ? true : params.estadoLectura === 'false' ? false : params.estadoLectura;
      }

      console.log('[notificationService] Fetching notifications', { url, queryParams });

      const response = await apiClient.get<unknown>(url, {
        params: queryParams,
      });

      const data = extractData<Record<string, unknown>>(response);
      const notifications = extractCollection<Notification>(data, ARRAY_KEYS);
      const paginationSource =
        data && typeof data === 'object' && data.pagination && typeof data.pagination === 'object'
          ? (data.pagination as Record<string, unknown>)
          : undefined;

      return {
        notificaciones: notifications,
        pagination: buildPagination(
          paginationSource,
          sanitizedPage,
          sanitizedLimit,
          notifications.length,
        ),
      };
    } catch (error) {
      console.error('[notificationService] Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Obtiene estadísticas de notificaciones para admin
   * @returns Estadísticas de notificaciones
   *
   * Endpoint: GET /api/v1/notifications/admin/stats
   */
  async getAdminNotificationStats(): Promise<{ unreadCount: number; totalNotifications: number }> {
    try {
      const url = getApiUrl('/notifications/admin/stats');

      console.log('[notificationService] Fetching admin notification stats', { url });

      const response = await apiClient.get<unknown>(url);
      const data = extractData<Record<string, unknown>>(response);
      return {
        unreadCount: toNumber(data?.unreadCount ?? 0),
        totalNotifications: toNumber(data?.totalNotifications ?? 0),
      };
    } catch (error) {
      console.error('[notificationService] Error fetching admin notification stats:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las notificaciones del sistema (solo ADMIN)
   * @param params - Parámetros de búsqueda
   * @returns Respuesta paginada de notificaciones
   *
   * Endpoint: GET /api/v1/notifications
   */
  async getAllNotifications(params: {
    page: number;
    limit: number;
    tipoNotificacion?: string;
    estadoLectura?: string;
    idUser?: number;
  }): Promise<NotificationPaginationResponse> {
    try {
      const parsedLimit = Number.parseInt(String(params.limit), 10);
      const parsedPage = Number.parseInt(String(params.page), 10);
      const sanitizedLimit = Number.isNaN(parsedLimit) ? 20 : Math.max(1, parsedLimit);
      const sanitizedPage = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);

      const url = getApiUrl('/notifications');

      const queryParams: Record<string, any> = {
        limit: sanitizedLimit,
        page: sanitizedPage,
      };

      if (params.tipoNotificacion) {
        queryParams.tipoNotificacion = params.tipoNotificacion;
      }

      if (params.estadoLectura !== undefined) {
        queryParams.estadoLectura =
          params.estadoLectura === 'true' ? true : params.estadoLectura === 'false' ? false : params.estadoLectura;
      }

      if (params.idUser) {
        queryParams.idUser = params.idUser;
      }

      console.log('[notificationService] Fetching all notifications (admin)', { url, queryParams });

      const response = await apiClient.get<unknown>(url, {
        params: queryParams,
      });

      const data = extractData<Record<string, unknown>>(response);
      const notifications = extractCollection<Notification>(data, ARRAY_KEYS);
      const paginationSource =
        data && typeof data === 'object' && data.pagination && typeof data.pagination === 'object'
          ? (data.pagination as Record<string, unknown>)
          : undefined;

      return {
        notificaciones: notifications,
        pagination: buildPagination(
          paginationSource,
          sanitizedPage,
          sanitizedLimit,
          notifications.length,
        ),
      };
    } catch (error) {
      console.error('[notificationService] Error fetching all notifications:', error);
      throw error;
    }
  },

  /**
   * Marca todas las notificaciones del usuario como leídas
   * @returns void
   *
   * Endpoint: PUT /api/v1/notifications/mark-all-read
   */
  async markAllNotificationsAsRead(): Promise<void> {
    try {
      const url = getApiUrl('/notifications/mark-all-read');

      console.log('[notificationService] Marking all notifications as read', { url });

      await apiClient.put<unknown>(url);
      console.log('[notificationService] All notifications marked as read');
    } catch (error) {
      console.error('[notificationService] Error marking all notifications as read:', error);
      throw error;
    }
  },
