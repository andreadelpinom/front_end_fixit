import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { homeService, RequestPreview } from '../../services/home.service';
import { WIZARD_COLORS } from '../../screens/client/request-wizard/WizardShared';
import SectionTitle from './SectionTitle';

const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  } catch {
    return '-';
  }
};

const getStatusColor = (status?: string): string => {
  switch (status) {
    case 'PENDIENTE':
      return '#FFC107';
    case 'ACEPTADA':
      return '#17A2B8';
    case 'COMPLETADA':
      return '#28A745';
    case 'CANCELADA':
      return '#DC3545';
    default:
      return WIZARD_COLORS.textLight;
  }
};

const RecentActivity: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<RequestPreview[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await homeService.getRecentRequests();
        if (mounted) {
          setRequests(data.slice(0, 5));
        }
      } catch (err) {
        if (mounted) {
          setError('No se pudieron cargar las solicitudes');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const renderRequest = (item: RequestPreview) => (
    <TouchableOpacity style={styles.requestCard} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.titulo || 'Sin título'}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.estado) },
          ]}
        >
          <Text style={styles.statusText}>{item.estado || 'N/A'}</Text>
        </View>
      </View>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.descripcion || 'Sin descripción'}
      </Text>
      <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <SectionTitle title="Actividad Reciente" />
        <ActivityIndicator size="large" color={WIZARD_COLORS.primary} />
      </View>
    );
  }

  if (error || requests.length === 0) {
    return (
      <View style={styles.container}>
        <SectionTitle title="Actividad Reciente" />
        <Text style={styles.emptyText}>
          {error || 'No hay solicitudes recientes'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionTitle title="Actividad Reciente" />
      <FlatList
        data={requests}
        keyExtractor={(item) => String(item.idSolicitud)}
        renderItem={({ item }) => renderRequest(item)}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  requestCard: {
    backgroundColor: WIZARD_COLORS.white,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: WIZARD_COLORS.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: WIZARD_COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: WIZARD_COLORS.white,
  },
  cardDescription: {
    fontSize: 12,
    color: WIZARD_COLORS.textSecondary,
    marginBottom: 6,
    lineHeight: 16,
  },
  cardDate: {
    fontSize: 11,
    color: WIZARD_COLORS.textLight,
  },
  emptyText: {
    fontSize: 14,
    color: WIZARD_COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default RecentActivity;
