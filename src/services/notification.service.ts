import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { apiClient } from './api-client.service';
import { getApiUrl } from '../config/api.config';

// Tipo de respuesta al marcar como leída
interface MarkAsReadResponse {
  success: boolean;
  message?: string;
}

/**
 * Tipos de notificación disponibles según backend
 */
export enum TipoNotificacion {
  SOLICITUD_NUEVA = 'SOLICITUD_NUEVA',
  SOLICITUD_ACEPTADA = 'SOLICITUD_ACEPTADA',
  SOLICITUD_COMPLETADA = 'SOLICITUD_COMPLETADA',
  CALIFICACION_RECIBIDA = 'CALIFICACION_RECIBIDA',
  RECORDATORIO = 'RECORDATORIO',
  // Tipos específicos para técnicos
  PROPUESTA_ACEPTADA = 'PROPUESTA_ACEPTADA',
  PROPUESTA_RECHAZADA = 'PROPUESTA_RECHAZADA',
  TRABAJO_CANCELADO = 'TRABAJO_CANCELADO',
  // Tipos específicos para clientes
  NUEVA_PROPUESTA = 'NUEVA_PROPUESTA',
  TECNICO_EN_CAMINO = 'TECNICO_EN_CAMINO',
  SERVICIO_INICIADO = 'SERVICIO_INICIADO',
  SERVICIO_COMPLETADO = 'SERVICIO_COMPLETADO',
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
// ==================== CONFIGURACIÓN EXPO NOTIFICATIONS ====================

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ==================== FUNCIONES PARA PUSH TOKENS ====================

/**
 * Registrar token de notificaciones push
 * @param idUser - ID del usuario
 * @param userType - Tipo de usuario: CLIENTE o TECNICO
 * @returns Token de push o null si falla
 */
export async function registerForPushNotifications(
  idUser: number,
  userType: 'CLIENTE' | 'TECNICO'
): Promise<string | null> {
  try {
    // Verificar si es dispositivo físico
    if (!Device.isDevice) {
      console.warn('Las notificaciones push solo funcionan en dispositivos físicos');
      return null;
    }

    // Obtener permisos
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.warn('No se obtuvieron permisos para notificaciones');
      return null;
    }

    // Obtener token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // ⚠️ CAMBIAR por el project ID real de Expo
    });
    const token = tokenData.data;
    console.log(`✅ Push token obtenido para ${userType}:`, token);

    // Enviar token al backend con el tipo de usuario
    await savePushToken(idUser, token, userType);

    // Configurar canal de notificaciones para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (error) {
    console.error('Error registrando notificaciones push:', error);
    return null;
  }
}

/**
 * Guardar token en el backend con tipo de usuario
 */
async function savePushToken(
  idUser: number,
  token: string,
  userType: 'CLIENTE' | 'TECNICO'
): Promise<void> {
  try {
    const url = getApiUrl('/notifications/register-token');
    await apiClient.post(url, {
      idUser,
      token,
      userType, // ✅ Diferencia entre cliente y técnico
      platform: Platform.OS,
    });
    console.log(`✅ Token guardado en backend para ${userType}`);
  } catch (error) {
    console.error('Error guardando token en backend:', error);
  }
}

// ==================== LISTENERS DE NOTIFICACIONES ====================

/**
 * Configurar listener para notificaciones recibidas mientras la app está en foreground
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Configurar listener para cuando el usuario toca una notificación
 */
export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Actualizar badge count con el número de notificaciones no leídas
 */
export async function updateBadgeCount(): Promise<void> {
  try {
    const count = await notificationService.getUnreadCount();
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error updating badge count:', error);
  }
}

/**
 * Limpiar todas las notificaciones locales
 */
export async function clearAllNotifications(): Promise<void> {
  try {
    await Notifications.dismissAllNotificationsAsync();
    await Notifications.setBadgeCountAsync(0);
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
}

// ==================== API BACKEND ====================

/**
 * Servicio para la gestión de notificaciones del usuario
 * ✅ El backend automáticamente filtra por tipo de usuario según el token JWT
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
