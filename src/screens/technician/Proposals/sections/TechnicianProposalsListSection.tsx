import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SolicitudTecnico } from '../../../../services/technician.service';
import { formatCurrency } from '../../../../utils/currency.utils';
import { ThemedText, ThemedView } from '../../../../ui';

interface TechnicianProposalsListSectionProps {
  proposals: SolicitudTecnico[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onViewRequestDetail: (idSolicitud: number) => void;
}

export const TechnicianProposalsListSection: React.FC<TechnicianProposalsListSectionProps> = ({
  proposals,
  loading,
  refreshing,
  onRefresh,
  onViewRequestDetail,
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ACEPTADO':
        return '#34C759';
      case 'RECHAZADO':
        return '#FF3B30';
      case 'PROPUESTO':
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'ACEPTADO':
        return '✅ ACEPTADO';
      case 'RECHAZADO':
        return '❌ RECHAZADO';
      case 'PROPUESTO':
        return '⏳ PROPUESTO';
      default:
        return status;
    }
  };

  const renderItem = ({ item }: { item: SolicitudTecnico }) => (
    <ThemedView variant="surface" style={styles.card}>
      <View style={styles.header}>
        <ThemedText variant="body" style={styles.id}>
          Solicitud #{item.idSolicitud}
        </ThemedText>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.estadoAcuerdo) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(item.estadoAcuerdo)}</Text>
        </View>
      </View>

      <ThemedText variant="h3" style={styles.cost}>
        ${formatCurrency(item.costoAcordado)}
      </ThemedText>

      {item.notas && (
        <ThemedText variant="caption" color="muted" style={styles.notes} numberOfLines={2}>
          📝 {item.notas}
        </ThemedText>
      )}

      <View style={styles.dateContainer}>
        <ThemedText variant="caption" color="muted" style={styles.date}>
          📅 Enviada: {new Date(item.fechaPropuesta).toLocaleDateString()}
        </ThemedText>
        {item.fechaConfirmada && (
          <ThemedText variant="caption" color="muted" style={styles.date}>
            ✅ Confirmada: {new Date(item.fechaConfirmada).toLocaleDateString()}
          </ThemedText>
        )}
      </View>

      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => onViewRequestDetail(item.idSolicitud)}
      >
        <ThemedText variant="button" color="primary" style={styles.detailButtonText}>
          Ver Detalle de Solicitud
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={proposals}
      renderItem={renderItem}
      keyExtractor={(item) => item.idSolTec.toString()}
      contentContainerStyle={styles.listContent}
      refreshControl={{
        refreshing,
        onRefresh,
      }}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <ThemedText variant="body" color="muted" style={styles.emptyText}>
            📭 No has enviado propuestas aún
          </ThemedText>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 12,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  id: {
    fontWeight: '600',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cost: {
    marginBottom: 8,
  },
  notes: {
    marginBottom: 8,
  },
  dateContainer: {
    marginBottom: 12,
  },
  date: {
    marginBottom: 4,
  },
  detailButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
  },
});