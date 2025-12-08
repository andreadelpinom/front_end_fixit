import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { notificationService, Notification } from '../../../services/notification.service';
import { WIZARD_COLORS } from '../request-wizard/WizardShared';

type Props = NativeStackScreenProps<any, 'Notifications'>;

/**
 * Pantalla de centro de notificaciones in-app
 * Muestra un listado paginado de notificaciones del usuario autenticado
 */
export const NotificationsScreen: React.FC<Props> = ({  }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const LIMIT = 20;

  /**
   * Carga las notificaciones del backend
   */
  const fetchNotifications = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      try {
        const isInitial = pageNum === 1 && !append;
        if (isInitial) {
          setLoading(true);
        } else if (!append) {
          setRefreshing(true);
        } else {
          setLoadingMore(true);
        }

        setError(null);

        const response = await notificationService.getNotifications({
          page: pageNum,
          limit: LIMIT,
        });

        if (append) {
          // Agregar a la lista existente
          setNotifications((prev) => [...prev, ...response.notificaciones]);
        } else {
          // Reemplazar lista
          setNotifications(response.notificaciones);
        }

        setTotalPages(response.pagination.totalPages);
        setPage(pageNum);
      } catch (err) {
        console.error('[NotificationsScreen] Error fetching notifications:', err);
        setError('Error al cargar las notificaciones. Por favor, intenta de nuevo.');
        // En caso de error en append, no sobrescribir la lista actual
        if (!append) {
          setNotifications([]);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    []
  );

  /**
   * Cargar notificaciones al enfocar la pantalla (cuando se abre o se regresa)
   */
  useFocusEffect(
    useCallback(() => {
      fetchNotifications(1, false);
    }, [fetchNotifications])
  );

  /**
   * Manejar pull-to-refresh
   */
  const handleRefresh = useCallback(() => {
    fetchNotifications(1, false);
  }, [fetchNotifications]);

  /**
   * Cargar más notificaciones cuando se llega al final de la lista
   */
  const handleEndReached = useCallback(() => {
    if (page < totalPages && !loadingMore && !loading) {
      fetchNotifications(page + 1, true);
    }
  }, [page, totalPages, loadingMore, loading, fetchNotifications]);

  /**
   * Formatear fecha relativa (ej: "hace 3 horas")
   */
  const formatRelativeTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);

      if (diffSeconds < 60) return 'ahora mismo';
      if (diffSeconds < 3600) return `hace ${Math.floor(diffSeconds / 60)} min`;
      if (diffSeconds < 86400) return `hace ${Math.floor(diffSeconds / 3600)} h`;
      if (diffSeconds < 604800) return `hace ${Math.floor(diffSeconds / 86400)} d`;

      // Mostrar fecha corta si es hace más de una semana
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  /**
   * Manejar tap en una notificación - marcarla como leída
   */
  const handleNotificationPress = async (notification: Notification) => {
    try {
      // Si ya está leída, solo navegar
      if (notification.estadoLectura) {
        // TODO: Navegar a detalle de la solicitud si tiene idSolicitud
        // navigation.navigate('RequestDetail', { idSolicitud: notification.idSolicitud });
        Alert.alert('Detalle', 'Próximamente se abrirá el detalle de la solicitud');
        return;
      }

      // Marcar como leída en el backend
      await notificationService.markNotificationAsRead(notification.idNotificacion);

      // Actualizar estado local
      setNotifications((prev) =>
        prev.map((n) =>
          n.idNotificacion === notification.idNotificacion
            ? { ...n, estadoLectura: true }
            : n
        )
      );

      // TODO: Navegar a detalle de la solicitud si tiene idSolicitud
      // navigation.navigate('RequestDetail', { idSolicitud: notification.idSolicitud });
      Alert.alert('Detalle', 'Próximamente se abrirá el detalle de la solicitud');
    } catch (err) {
      console.error('[NotificationsScreen] Error marking notification as read:', err);
      Alert.alert('Error', 'No se pudo actualizar la notificación');
    }
  };

  /**
   * Renderizar cada notificación en la lista
   */
  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const isUnread = !item.estadoLectura;

    return (
      <TouchableOpacity
        style={[styles.notificationCard, isUnread && styles.notificationCardUnread]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        {/* Indicador de no leída */}
        {isUnread && <View style={styles.unreadDot} />}

        {/* Contenido */}
        <View style={styles.notificationContent}>
          <View style={styles.headerRow}>
            <Text
              style={[styles.notificationTitle, isUnread && styles.notificationTitleBold]}
              numberOfLines={1}
            >
              {item.titulo}
            </Text>
            <Text style={styles.timeText}>{formatRelativeTime(item.fechaEnvio)}</Text>
          </View>

          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.mensaje}
          </Text>

          {/* Badge de tipo */}
          <View style={styles.typeRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{formatTipoNotificacion(item.tipoNotificacion)}</Text>
            </View>
          </View>
        </View>

        {/* Indicador de leído/no leído con ícono */}
        <Ionicons
          name={isUnread ? 'ellipse-sharp' : 'checkmark-circle'}
          size={20}
          color={isUnread ? WIZARD_COLORS.primary : WIZARD_COLORS.success}
          style={styles.readIcon}
        />
      </TouchableOpacity>
    );
  };

  /**
   * Renderizar pantalla de carga inicial
   */
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={WIZARD_COLORS.primary} />
        <Text style={styles.loadingText}>Cargando notificaciones...</Text>
      </View>
    );
  }

  /**
   * Renderizar pantalla de error con botón de reintentar
   */
  if (error && notifications.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={WIZARD_COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchNotifications(1, false)}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Renderizar pantalla vacía
   */
  if (notifications.length === 0 && !error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="notifications-off-outline" size={64} color={WIZARD_COLORS.textLight} />
        <Text style={styles.emptyText}>No tienes notificaciones</Text>
        <Text style={styles.emptySubtext}>
          Cuando recibas notificaciones, aparecerán aquí
        </Text>
      </View>
    );
  }

  /**
   * Renderizar lista de notificaciones
   */
  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => `${item.idNotificacion}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={WIZARD_COLORS.primary}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={WIZARD_COLORS.primary} />
            </View>
          ) : null
        }
        scrollEventThrottle={400}
      />
    </View>
  );
};

/**
 * Formatear el tipo de notificación para mostrar en la UI
 */
function formatTipoNotificacion(tipo: string): string {
  const tipoMap: Record<string, string> = {
    SOLICITUD_NUEVA: 'Nueva solicitud',
    SOLICITUD_ACEPTADA: 'Aceptada',
    SOLICITUD_COMPLETADA: 'Completada',
    CALIFICACION_RECIBIDA: 'Calificación',
    RECORDATORIO: 'Recordatorio',
  };
  return tipoMap[tipo] || tipo;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WIZARD_COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WIZARD_COLORS.background,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: WIZARD_COLORS.textSecondary,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: WIZARD_COLORS.error,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: WIZARD_COLORS.text,
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: WIZARD_COLORS.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: WIZARD_COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    alignItems: 'center',
  },
  notificationCardUnread: {
    backgroundColor: '#F8F9FA',
    borderLeftColor: WIZARD_COLORS.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: WIZARD_COLORS.primary,
    marginRight: 8,
  },
  notificationContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 15,
    color: WIZARD_COLORS.text,
    marginRight: 8,
  },
  notificationTitleBold: {
    fontWeight: '700',
  },
  timeText: {
    fontSize: 12,
    color: WIZARD_COLORS.textSecondary,
  },
  notificationMessage: {
    fontSize: 13,
    color: WIZARD_COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  typeBadge: {
    backgroundColor: WIZARD_COLORS.profileTechBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 11,
    color: WIZARD_COLORS.primary,
    fontWeight: '600',
  },
  readIcon: {
    marginLeft: 8,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
