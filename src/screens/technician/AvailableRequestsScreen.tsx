import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import {
  getAvailableRequests,
  createProposal,
  getMyProposals,
  Solicitud,
  SolicitudTecnico,
} from '../../services/technician.service';

export default function AvailableRequestsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState<Solicitud[]>([]);
  const [myProposals, setMyProposals] = useState<SolicitudTecnico[]>([]);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Solicitud | null>(null);
  const [estimatedCost, setEstimatedCost] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  const loadData = async () => {
    if (!user) return;

    try {
      console.log('[AvailableRequestsScreen] 🔍 Cargando solicitudes disponibles...');
      const [requestsData, proposalsData] = await Promise.all([
        getAvailableRequests(),
        getMyProposals(),
      ]);
      console.log('[AvailableRequestsScreen] ✅ Solicitudes:', requestsData.length);
      console.log('[AvailableRequestsScreen] ✅ Propuestas:', proposalsData.length);
      setRequests(requestsData);
      setMyProposals(proposalsData);
    } catch (err: any) {
      console.error('[AvailableRequestsScreen] ❌ Error loading requests:', err);
      Alert.alert(
        'Error al cargar solicitudes',
        err?.message || 'No se pudieron cargar las solicitudes'
      );
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

  // Verificar si ya envié propuesta para esta solicitud
  const hasProposal = (idSolicitud: number): boolean => {
    return myProposals.some(p => p.idSolicitud === idSolicitud);
  };

  // Abrir modal para nueva propuesta
  const handleOpenProposal = (request: Solicitud) => {
    setSelectedRequest(request);
    setEstimatedCost(request.costoEstimado?.toString() || '');
    setEstimatedTime(request.duracionEstimadaMin?.toString() || '');
    setShowProposalModal(true);
  };

  // Enviar propuesta
  const handleSubmitProposal = async () => {
    if (!selectedRequest) return;

    try {
      const costoNum = parseFloat(estimatedCost);
      const tiempoNum = parseInt(estimatedTime);

      if (isNaN(costoNum) || costoNum <= 0) {
        Alert.alert('Error', 'Ingresa un costo válido');
        return;
      }

      if (isNaN(tiempoNum) || tiempoNum <= 0) {
        Alert.alert('Error', 'Ingresa un tiempo estimado válido (en minutos)');
        return;
      }

      const notasCompletas = `Tiempo estimado: ${tiempoNum} min.`;

      // Enviar propuesta nueva
      await createProposal({
        idSolicitud: selectedRequest.idSolicitud,
        costoAcordado: costoNum,
        notas: notasCompletas,
      });
      
      // Cerrar modal y limpiar
      setShowProposalModal(false);
      setSelectedRequest(null);
      
      // Recargar datos para actualizar la lista
      await loadData();
      
      // Mensaje de éxito
      Alert.alert('Éxito', '📤 Propuesta enviada');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo enviar la propuesta');
    }
  };



  const renderItem = ({ item }: { item: Solicitud }) => {
    // Si ya envió propuesta, no mostrar esta solicitud
    if (hasProposal(item.idSolicitud)) {
      return null;
    }
    
    return (
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
          <Text style={styles.infoText}>
            ⏱️ {item.duracionEstimadaMin || 'N/A'} min
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoSmall}>📍 {item.codigoParroquia}</Text>
          <Text style={styles.infoSmall}>
            📅 {new Date(item.fechaPublicacion).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleOpenProposal(item)}
        >
          <Text style={styles.applyButtonText}>📤 Enviar Propuesta</Text>
        </TouchableOpacity>
      </View>
    );
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
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.idSolicitud.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              📭 No hay solicitudes disponibles en este momento
            </Text>
          </View>
        }
      />

      {/* Modal para Propuesta/Contraoferta */}
      <Modal
        visible={showProposalModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProposalModal(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.modalTitle}>
                📤 Nueva Propuesta
              </Text>
              
              {selectedRequest && (
                <View style={styles.requestInfo}>
                  <Text style={styles.requestTitle}>{selectedRequest.tituloProblema}</Text>
                  <Text style={styles.requestDetail}>
                    Cliente solicita: ${selectedRequest.costoEstimado} / {selectedRequest.duracionEstimadaMin} min
                  </Text>
                </View>
              )}

              <Text style={styles.label}>💰 Tu precio propuesto ($):</Text>
              <TextInput
                style={styles.input}
                value={estimatedCost}
                onChangeText={setEstimatedCost}
                placeholder="Ej: 50"
                keyboardType="numeric"
              />

              <Text style={styles.label}>⏱️ Tiempo estimado (minutos):</Text>
              <TextInput
                style={styles.input}
                value={estimatedTime}
                onChangeText={setEstimatedTime}
                placeholder="Ej: 120"
                keyboardType="numeric"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowProposalModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSubmitButton}
                  onPress={handleSubmitProposal}
                >
                  <Text style={styles.modalSubmitText}>
                    Enviar Propuesta
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  infoSmall: {
    fontSize: 12,
    color: '#8E8E93',
  },
  proposalBadge: {
    backgroundColor: '#34C759',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  proposalBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  counterOfferText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  counterOfferButton: {
    flex: 1,
    backgroundColor: '#FF9500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  requestInfo: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  requestDetail: {
    fontSize: 14,
    color: '#8E8E93',
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#E5E5EA',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
