import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
  getAvailableRequests,
  createProposal,
  Solicitud,
} from '../../services/technician.service';
import { formatCurrency } from '../../utils/currency.utils';
import SubmitProposalModal from '../../components/SubmitProposalModal';
import homeService from '../../services/home.service';
import { ServiceType, Parroquia } from '../../types/api';

export default function AvailableRequestsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [availableRequests, setAvailableRequests] = useState<Solicitud[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Solicitud | null>(null);

  // Filtros
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<number | null>(null);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [parroquias, setParroquias] = useState<Parroquia[]>([]);
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadFilterData();
      loadData();
    }, [user, selectedZone, selectedServiceType])
  );

  const loadFilterData = async () => {
    try {
      const [types, zones] = await Promise.all([
        homeService.getServiceTypes(),
        homeService.getParroquias(),
      ]);
      setServiceTypes(types);
      setParroquias(zones);
    } catch (err: any) {
      console.error('Error loading filter data:', err);
    }
  };

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const filters: any = {};
      if (selectedZone) filters.codigoParroquia = selectedZone;
      if (selectedServiceType) filters.idTipoServicio = selectedServiceType;

      const available = await getAvailableRequests(filters);
      setAvailableRequests(available);
    } catch (err: any) {
      console.error('Error loading available requests:', err);
      setAvailableRequests([]);
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
          navigation.navigate('RequestDetail', { request: item });
        }}
      >
        <Text style={styles.ctaButtonText}>Ver Detalles</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowZonePicker(true)}
        >
          <Text style={styles.filterButtonText}>
            Zona: {selectedZone ? parroquias.find(p => p.codigoParroquia === selectedZone)?.nombreParroquia || selectedZone : 'Todas'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowServicePicker(true)}
        >
          <Text style={styles.filterButtonText}>
            Servicio: {selectedServiceType ? serviceTypes.find(s => s.idTipoServicio === selectedServiceType)?.nombreTipoServicio || selectedServiceType : 'Todos'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={availableRequests}
        renderItem={renderAvailableItem}
        keyExtractor={(item) => `req-${item.idSolicitud}`}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              📭 No hay solicitudes disponibles
            </Text>
          </View>
        }
      />
      
      {/* Modal para seleccionar zona */}
      <Modal visible={showZonePicker} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Zona</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setSelectedZone('');
                setShowZonePicker(false);
              }}
            >
              <Text style={styles.modalOptionText}>Todas las zonas</Text>
            </TouchableOpacity>
            {parroquias.map((parroquia) => (
              <TouchableOpacity
                key={parroquia.codigoParroquia}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedZone(parroquia.codigoParroquia);
                  setShowZonePicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>{parroquia.nombreParroquia}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowZonePicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para seleccionar tipo de servicio */}
      <Modal visible={showServicePicker} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Tipo de Servicio</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setSelectedServiceType(null);
                setShowServicePicker(false);
              }}
            >
              <Text style={styles.modalOptionText}>Todos los servicios</Text>
            </TouchableOpacity>
            {serviceTypes.map((service) => (
              <TouchableOpacity
                key={service.idTipoServicio}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedServiceType(service.idTipoServicio);
                  setShowServicePicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>{service.nombreTipoServicio}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowServicePicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalClose: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});