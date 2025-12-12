import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
  getAvailableRequests,
  getMyProposals,
  createProposal,
  Solicitud,
  SolicitudTecnico,
} from '../../services/technician.service';
import SubmitProposalModal from '../../components/SubmitProposalModal';

type SubTab = 'DISPONIBLES' | 'OFERTAS';

export default function AvailableRequestsScreen() {
  const { user } = useAuth();
  const [subTab, setSubTab] = useState<SubTab>('DISPONIBLES');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [availableRequests, setAvailableRequests] = useState<Solicitud[]>([]);
  const [myProposals, setMyProposals] = useState<SolicitudTecnico[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Solicitud | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [user])
  );

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Load both available and proposals in parallel
      const [available, proposals] = await Promise.all([
        getAvailableRequests(),
        getMyProposals(),
      ]);
      setAvailableRequests(available);
      setMyProposals(proposals);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setAvailableRequests([]);
      setMyProposals([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSubmitProposal = async (cost: number, notes?: string) => {
    if (!selectedRequest) return;

    try {
      await createProposal({
        idSolicitud: selectedRequest.idSolicitud,
        costoAcordado: cost,
        notas: notes || 'Propuesta enviada desde la app',
      });

      // Refresh data after successful submission
      setModalVisible(false);
      setSelectedRequest(null);
      loadData();
    } catch (err: any) {
      console.error('Error:', err);
    }
  };

  // Render DISPONIBLES tab
  const renderAvailableItem = ({ item }: { item: Solicitud }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.tituloProblema}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.descripcionProblema}
      </Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          💰 ${typeof item.costoEstimado === 'string' 
            ? item.costoEstimado 
            : item.costoEstimado?.toFixed(2) || 'N/A'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => {
          setSelectedRequest(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.ctaButtonText}>Enviar Propuesta</Text>
      </TouchableOpacity>
    </View>
  );

  // Render MIS OFERTAS tab
  const renderProposalItem = ({ item }: { item: SolicitudTecnico }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.id}>Solicitud #{item.idSolicitud}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estadoAcuerdo) }]}>
          <Text style={styles.statusText}>{getStatusLabel(item.estadoAcuerdo)}</Text>
        </View>
      </View>

      <Text style={styles.cost}>
        ${typeof item.costoAcordado === 'string' 
          ? parseFloat(item.costoAcordado).toFixed(2)
          : item.costoAcordado?.toFixed(2) || 'N/A'}
      </Text>
      
      {item.notas && (
        <Text style={styles.notes} numberOfLines={2}>
          {item.notas}
        </Text>
      )}

      {item.estadoAcuerdo === 'ACEPTADO' && (
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Ir al Trabajo</Text>
        </TouchableOpacity>
      )}
    </View>
  );

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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Subtabs */}
      <View style={styles.subtabsContainer}>
        <TouchableOpacity
          style={[styles.subtab, subTab === 'DISPONIBLES' && styles.subtabActive]}
          onPress={() => setSubTab('DISPONIBLES')}
        >
          <Text style={[styles.subtabText, subTab === 'DISPONIBLES' && styles.subtabTextActive]}>
            Disponibles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subtab, subTab === 'OFERTAS' && styles.subtabActive]}
          onPress={() => setSubTab('OFERTAS')}
        >
          <Text style={[styles.subtabText, subTab === 'OFERTAS' && styles.subtabTextActive]}>
            Mis Ofertas ({myProposals.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList<any>
        data={subTab === 'DISPONIBLES' ? availableRequests : myProposals}
        renderItem={subTab === 'DISPONIBLES' ? renderAvailableItem : renderProposalItem}
        keyExtractor={(item: any) => 
          subTab === 'DISPONIBLES' 
            ? `req-${item.idSolicitud}`
            : `prop-${item.idSolTec}`
        }
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {subTab === 'DISPONIBLES' 
                ? 'No hay solicitudes disponibles' 
                : 'No has enviado ofertas aún'}
            </Text>
          </View>
        }
      />

      {/* Modal */}
      <SubmitProposalModal
        visible={modalVisible}
        requestTitle={selectedRequest?.tituloProblema || ''}
        onClose={() => {
          setModalVisible(false);
          setSelectedRequest(null);
        }}
        onSubmit={handleSubmitProposal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  subtab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  subtabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  subtabText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  subtabTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  id: {
    fontSize: 12,
    color: '#757575',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  infoContainer: {
    marginVertical: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  cost: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  notes: {
    fontSize: 12,
    color: '#999',
    marginVertical: 8,
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});