import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import {
  getMyProposals,
  getTechnicianByUser,
  getTechnicianRatings,
  completeService,
  SolicitudTecnico,
  CalificacionTecnico,
} from '../../services/technician.service';
import { EstadoAceptacion, EstadoSolicitud } from '../../types/api';

type TabType = 'jobs' | 'proposals' | 'ratings';

export default function MyJobsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('jobs');
  const [proposals, setProposals] = useState<SolicitudTecnico[]>([]);
  const [ratings, setRatings] = useState<CalificacionTecnico[]>([]);

  const loadData = async () => {
    if (!user) return;

    try {
      console.log('[MyJobsScreen] 🔍 Cargando datos del técnico...');
      
      // Obtener ID del técnico
      const techData = await getTechnicianByUser(user.idUser);
      
      // Cargar propuestas y calificaciones en paralelo
      const [proposalsData, ratingsData] = await Promise.all([
        getMyProposals(),
        getTechnicianRatings(techData.idTecnico),
      ]);
      
      console.log('[MyJobsScreen] ✅ Propuestas:', proposalsData.length);
      console.log('[MyJobsScreen] ✅ Calificaciones:', ratingsData.length);
      
      setProposals(proposalsData);
      setRatings(ratingsData);
    } catch (err: any) {
      console.error('[MyJobsScreen] ❌ Error loading data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCompleteService = async (proposal: SolicitudTecnico) => {
    Alert.alert(
      'Completar Servicio',
      '¿Marcar este trabajo como completado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Completar',
          onPress: async () => {
            try {
              await completeService(proposal.idSolicitud);
              Alert.alert('Éxito', '✅ Servicio completado');
              loadData();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'No se pudo completar el servicio');
            }
          },
        },
      ]
    );
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  const renderJobItem = ({ item }: { item: SolicitudTecnico }) => {
    // El backend puede retornar solicitud anidada o no
    const solicitud = (item as any).solicitud;
    const estadoSolicitud = solicitud?.estadoSolicitud || EstadoSolicitud.ACEPTADA;
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>
            {solicitud?.tituloProblema || `Solicitud #${item.idSolicitud}`}
          </Text>
          <Text style={[
            styles.statusBadge,
            estadoSolicitud === EstadoSolicitud.ACEPTADA && styles.statusInProgress,
            estadoSolicitud === EstadoSolicitud.COMPLETADA && styles.statusCompleted,
          ]}>
            {estadoSolicitud}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {solicitud?.descripcionProblema || 'Sin descripción disponible'}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>💰 ${item.costoAcordado}</Text>
          <Text style={styles.infoText}>
            📅 {new Date(item.fechaPropuesta).toLocaleDateString()}
          </Text>
        </View>

        {/* Botones de acción según el estado */}
        <View style={styles.actionButtons}>
          {estadoSolicitud === EstadoSolicitud.ACEPTADA && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleCompleteService(item)}
            >
              <Text style={styles.buttonText}>✅ Marcar como completado</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderProposalItem = ({ item }: { item: SolicitudTecnico }) => {
    const solicitud = (item as any).solicitud;
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>
            {solicitud?.tituloProblema || `Solicitud #${item.idSolicitud}`}
          </Text>
        <Text style={[
          styles.statusBadge,
          item.estadoAcuerdo === EstadoAceptacion.ACEPTADO && styles.statusAccepted,
          item.estadoAcuerdo === EstadoAceptacion.RECHAZADO && styles.statusRejected,
        ]}>
          {item.estadoAcuerdo}
        </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {solicitud?.descripcionProblema || 'Sin descripción disponible'}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>💰 ${item.costoAcordado}</Text>
          <Text style={styles.infoText}>
            📅 {new Date(item.fechaPropuesta).toLocaleDateString()}
          </Text>
        </View>

        {item.notas && (
          <Text style={styles.notes}>📝 {item.notas}</Text>
        )}
      </View>
    );
  };

  const renderRatingItem = ({ item }: { item: CalificacionTecnico }) => {
    const solicitud = (item as any).solicitud;
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>
            {solicitud?.tipoServicio?.nombre || 'Servicio'}
          </Text>
        <Text style={styles.stars}>{renderStars(item.puntuacion)}</Text>
      </View>

      <Text style={styles.ratingScore}>{item.puntuacion.toFixed(1)} / 5.0</Text>

      {item.comentario && (
        <Text style={styles.comment}>💬 "{item.comentario}"</Text>
      )}

      <View style={styles.infoRow}>
        <Text style={styles.infoSmall}>
          👤 {item.cliente?.nombre} {item.cliente?.apellido}
        </Text>
        <Text style={styles.infoSmall}>
          📅 {new Date(item.fechaCalificacion).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  const getFilteredData = () => {
    switch (activeTab) {
      case 'jobs':
        // Mostrar solo trabajos ACEPTADOS
        return proposals.filter(p => p.estadoAcuerdo === EstadoAceptacion.ACEPTADO);
      case 'proposals':
        // Mostrar todas las propuestas
        return proposals;
      case 'ratings':
        // Mostrar calificaciones
        return ratings;
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const data = getFilteredData();

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'jobs' && styles.activeTab]}
          onPress={() => setActiveTab('jobs')}
        >
          <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTabText]}>
            Trabajos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'proposals' && styles.activeTab]}
          onPress={() => setActiveTab('proposals')}
        >
          <Text style={[styles.tabText, activeTab === 'proposals' && styles.activeTabText]}>
            Propuestas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ratings' && styles.activeTab]}
          onPress={() => setActiveTab('ratings')}
        >
          <Text style={[styles.tabText, activeTab === 'ratings' && styles.activeTabText]}>
            Calificaciones
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista según el tab activo */}
      <FlatList
        data={data as any[]}
        renderItem={({ item }) => {
          if (activeTab === 'ratings') {
            return renderRatingItem({ item: item as CalificacionTecnico });
          } else if (activeTab === 'jobs') {
            return renderJobItem({ item: item as SolicitudTecnico });
          } else {
            return renderProposalItem({ item: item as SolicitudTecnico });
          }
        }}
        keyExtractor={(item) => {
          if (activeTab === 'ratings') {
            return (item as any).idCalificacion?.toString() || Math.random().toString();
          }
          return (item as any).idSolTec?.toString() || Math.random().toString();
        }}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'jobs' && '📭 No tienes trabajos aceptados'}
              {activeTab === 'proposals' && '📭 No tienes propuestas enviadas'}
              {activeTab === 'ratings' && '📭 No tienes calificaciones todavía'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FF9500',
  },
  statusAccepted: {
    backgroundColor: '#34C759',
  },
  statusRejected: {
    backgroundColor: '#FF3B30',
  },
  statusInProgress: {
    backgroundColor: '#007AFF',
  },
  statusCompleted: {
    backgroundColor: '#34C759',
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#000000',
  },
  infoSmall: {
    fontSize: 12,
    color: '#8E8E93',
  },
  notes: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#34C759',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  stars: {
    fontSize: 16,
  },
  ratingScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9500',
    marginVertical: 8,
  },
  comment: {
    fontSize: 14,
    color: '#000000',
    fontStyle: 'italic',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});