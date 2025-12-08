import { apiClient } from './api-client.service';
import { getApiUrl } from '../config/api.config';

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

/**
 * Interface para respuesta de mark as read
 */
interface MarkAsReadResponse {
  success: boolean;
  data: Notification;
  error?: string;
  statusCode?: number;
}

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

      const data = await apiClient.get<NotificationPaginationResponse>(url, {
        params: queryParams,
      });

      return data;
    } catch (error) {
      console.error('[notificationService] Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Obtiene el contador de notificaciones no leídas del usuario autenticado
   * @returns Número de notificaciones no leídas
   *
   * Endpoint: GET /api/v1/notifications/my/unread-count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const url = getApiUrl('/notifications/my/unread-count');

      console.log('[notificationService] Fetching unread count', { url });

      const data = await apiClient.get<{ unreadCount: number }>(url);

      return data.unreadCount;
    } catch (error) {
      console.error('[notificationService] Error fetching unread count:', error);
      throw error;
    }
  },

  /**
   * Marca una notificación específica como leída
   * @param idNotificacion - ID de la notificación a marcar como leída
   * @returns void (la notificación actualizada se retorna pero no se usa)
   *
   * Endpoint: PUT /api/v1/notifications/:id/mark-read
   */
  async markNotificationAsRead(idNotificacion: number): Promise<void> {
    try {
      const url = getApiUrl(`/notifications/${idNotificacion}/mark-read`);

      console.log('[notificationService] Marking notification as read', { url, idNotificacion });

      const response = await apiClient.put<MarkAsReadResponse>(url);

      if (!response.success) {
        throw new Error('Error marking notification as read');
      }

      console.log('[notificationService] Notification marked as read', { idNotificacion });
    } catch (error) {
      console.error('[notificationService] Error marking notification as read:', error);
      throw error;
    }
  },
};
