import React from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RequestPreview } from '../../../../services/home.service';
import { servicesListStyles as styles } from './ServicesListSection.styles';
import { theme } from '../../../../theme';

type ServicesListSectionProps = {
  requests: RequestPreview[];
  refreshing: boolean;
  onRefresh: () => void;
  onRequestPress: (request: RequestPreview) => void;
};

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: 'Publicada',
  PUBLICADA: 'Publicada',
  ACEPTADA: 'Aceptada',
  EN_PROCESO: 'En curso',
  ASIGNADA: 'Asignada',
  COMPLETADA: 'Completada',
};

const STATUS_COLOR_MAP: Record<string, string> = {
  PENDIENTE: theme.colors.primary,
  PUBLICADA: theme.colors.primary,
  ACEPTADA: theme.colors.info,
  EN_PROCESO: theme.colors.warning,
  ASIGNADA: theme.colors.info,
  COMPLETADA: theme.colors.success,
};

const normalizeStatus = (status?: string): string => (status ?? '').trim().toUpperCase();

const formatDate = (dateString?: string): string => {
  if (!dateString) {
    return 'Fecha pendiente';
  }

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'Fecha pendiente';
  }
};

const getLocation = (request: RequestPreview): string => {
  if (request.ubicacion && request.ubicacion.trim().length > 0) {
    return request.ubicacion;
  }

  if (request.codigoParroquia && request.codigoParroquia.trim().length > 0) {
    return request.codigoParroquia;
  }

  return 'Ubicación pendiente';
};

export const ServicesListSection: React.FC<ServicesListSectionProps> = ({
  requests,
  refreshing,
  onRefresh,
  onRequestPress,
}) => {
  const renderItem = ({ item }: { item: RequestPreview }) => {
    const status = normalizeStatus(item.estado);
    const statusLabel = STATUS_LABELS[status] ?? item.estado ?? 'Estado';
    const statusColor = STATUS_COLOR_MAP[status] ?? theme.colors.primary;
    const locationLabel = getLocation(item);
    return (
      <Pressable
        onPress={() => onRequestPress(item)}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.titulo || 'Solicitud sin título'}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        {item.descripcion && (
          <Text style={styles.description} numberOfLines={3}>
            {item.descripcion}
          </Text>
        )}

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={16} color={theme.colors.text.muted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {locationLabel}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.text.muted} />
            <Text style={styles.metaText}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={requests}
      keyExtractor={item => String(item.idSolicitud)}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
      }
    />
  );
};
