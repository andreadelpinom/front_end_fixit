import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SolicitudTecnico } from '../../../../services/technician.service';
import { SolicitudTecnicoConCalificacion } from '../../../../types/api';
import { formatCurrency } from '../../../../utils/currency.utils';
import { ThemedText, ThemedView } from '../../../../ui';
import CancelServiceModal from '../../../../components/CancelServiceModal';

type Props = NativeStackScreenProps<any>;

interface TechnicianJobsListSectionProps {
  proposals: SolicitudTecnicoConCalificacion[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  activeTab: 'EN_CURSO' | 'HISTORIAL';
  navigation: Props['navigation'];
  onCancelJob?: (idSolTec: number, reason: string) => Promise<void>;
}

export const TechnicianJobsListSection: React.FC<TechnicianJobsListSectionProps> = ({
  proposals,
  loading,
  refreshing,
  onRefresh,
  activeTab,
  navigation,
  onCancelJob,
}) => {
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<SolicitudTecnicoConCalificacion | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleCancelPress = (job: SolicitudTecnicoConCalificacion) => {
    setSelectedJob(job);
    setCancelModalVisible(true);
  };

  const handleCancelConfirm = async (reason: string) => {
    if (!selectedJob || !onCancelJob) return;

    setCancelLoading(true);
    try {
      await onCancelJob(selectedJob.idSolTec, reason);
      setCancelModalVisible(false);
      setSelectedJob(null);
    } catch (error) {
      // Error is handled in the modal
      throw error;
    } finally {
      setCancelLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={[styles.star, i <= rating && styles.starFilled]}>
          ★
        </Text>
      );
    }
    return stars;
  };
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
        return '✅ EN CURSO';
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
          📅 Propuesta: {new Date(item.fechaPropuesta).toLocaleDateString()}
        </ThemedText>
        {item.fechaConfirmada && (
          <ThemedText variant="caption" color="muted" style={styles.date}>
            ✅ Confirmada: {new Date(item.fechaConfirmada).toLocaleDateString()}
          </ThemedText>
        )}
      </View>

      {/* Mostrar calificación solo en HISTORIAL para trabajos completados */}
      {activeTab === 'HISTORIAL' && item.calificacion && (
        <View style={styles.ratingContainer}>
          <View style={styles.ratingHeader}>
            <ThemedText variant="caption" style={styles.ratingTitle}>
              ⭐ Calificación del Cliente
            </ThemedText>
            <View style={styles.starsContainer}>
              {renderStars(item.calificacion.calificacion)}
              <ThemedText variant="caption" style={styles.ratingNumber}>
                {item.calificacion.calificacion}/5
              </ThemedText>
            </View>
          </View>

          {item.calificacion.comentario && (
            <View style={styles.commentContainer}>
              <ThemedText variant="caption" color="muted" style={styles.commentLabel}>
                💬 Comentario:
              </ThemedText>
              <ThemedText variant="caption" style={styles.commentText}>
                "{item.calificacion.comentario}"
              </ThemedText>
              <ThemedText variant="caption" color="muted" style={styles.commentDate}>
                📅 {new Date(item.calificacion.fechaCalificacion).toLocaleDateString()}
              </ThemedText>
            </View>
          )}
        </View>
      )}

      {item.estadoAcuerdo === 'ACEPTADO' && activeTab === 'EN_CURSO' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelPress(item)}
          >
            <ThemedText variant="button" color="error" style={styles.cancelButtonText}>
              ❌ Cancelar
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => {
              navigation.navigate('Dashboard', {
                screen: 'ActiveJobs',
                params: { idSolicitud: item.idSolicitud },
              });
            }}
          >
            <ThemedText variant="button" color="inverse" style={styles.ctaButtonText}>
              Ir al trabajo →
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
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
            {activeTab === 'EN_CURSO'
              ? '📭 No tienes trabajos en curso'
              : '📭 No hay historial'}
          </ThemedText>
        </View>
      }
    />
  );

  // Modal is rendered outside FlatList to avoid conflicts
  return (
    <>
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
              {activeTab === 'EN_CURSO'
                ? '📭 No tienes trabajos en curso'
                : '📭 No hay historial'}
            </ThemedText>
          </View>
        }
      />

      <CancelServiceModal
        visible={cancelModalVisible}
        serviceTitle={`Solicitud #${selectedJob?.idSolicitud || ''}`}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
        isLoading={cancelLoading}
      />
    </>
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFE5E5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ctaButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  ctaButtonText: {
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
  ratingContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingTitle: {
    fontWeight: '600',
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 16,
    color: '#DDD',
    marginRight: 2,
  },
  starFilled: {
    color: '#FFD700',
  },
  ratingNumber: {
    marginLeft: 4,
    fontWeight: '600',
    color: '#333',
  },
  commentContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
  },
  commentLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 6,
  },
  commentDate: {
    textAlign: 'right',
    fontSize: 11,
  },
});