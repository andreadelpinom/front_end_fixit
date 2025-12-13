// src/screens/admin/RequestsManagementScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { adminService, RequestManagement } from '../../services/admin.service';
import { LoadingView } from '../../components/common';
import { AdminStyles, getStatusColor } from '../../styles/AdminScreens.style';
export default function RequestsManagementScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState<RequestManagement[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestManagement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDIENTE' | 'ACEPTADA' | 'COMPLETADA' | 'CANCELADA'>('ALL');

  const loadData = async () => {
    try {
      const data = await adminService.getAllRequests();
      setRequests(data);
      setFilteredRequests(data);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'No se pudieron cargar solicitudes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, filterStatus, requests]);

  const filterRequests = () => {
    let filtered = requests;

    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(r => r.estadoSolicitud === filterStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.tituloProblema.toLowerCase().includes(query) ||
          r.nombreCliente.toLowerCase().includes(query) ||
          r.nombreServicio.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCancelRequest = async (request: RequestManagement) => {
    Alert.alert(
      'Cancelar Solicitud',
      `¿Cancelar solicitud "${request.tituloProblema}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.cancelRequest(request.idSolicitud, 'Cancelado por administrador');
              await adminService.logAdminAction(
                'REQUEST_CANCELED',
                `Solicitud ${request.idSolicitud} - ${request.tituloProblema}`
              );
              Alert.alert('Éxito', '✅ Solicitud cancelada');
              loadData();
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'No se pudo cancelar la solicitud');
            }
          },
        },
      ]
    );
  };

  const renderRequest = ({ item }: { item: RequestManagement }) => (
    <View style={AdminStyles.card}>
      <View style={AdminStyles.cardHeader}>
        <Text style={AdminStyles.title} numberOfLines={2}>
          {item.tituloProblema}
        </Text>
        <View style={[AdminStyles.statusBadge, { backgroundColor: getStatusColor(item.estadoSolicitud) }]}>
          <Text style={AdminStyles.statusText}>{item.estadoSolicitud}</Text>
        </View>
      </View>

      <Text style={AdminStyles.subtitle} numberOfLines={2}>
        {item.descripcionProblema}
      </Text>

      <View style={AdminStyles.metaRow}>
        <Text style={AdminStyles.smallText}>👤 {item.nombreCliente}</Text>
        <Text style={AdminStyles.smallText}>🔧 {item.nombreServicio}</Text>
      </View>

      <View style={AdminStyles.metaRow}>
        <Text style={AdminStyles.smallText}>📍 {item.codigoParroquia}</Text>
        <Text style={AdminStyles.dateText}>
          📅 {new Date(item.fechaPublicacion).toLocaleDateString()}
        </Text>
      </View>

      {item.costoEstimado && (
        <Text style={styles.costText}>💰 ${item.costoEstimado}</Text>
      )}

      {item.estadoSolicitud !== 'CANCELADA' && item.estadoSolicitud !== 'COMPLETADA' && (
        <TouchableOpacity
          style={[AdminStyles.actionBtn, AdminStyles.dangerBtn, { marginTop: 8 }]}
          onPress={() => handleCancelRequest(item)}
        >
          <Text style={AdminStyles.actionBtnText}>🚫 Cancelar Solicitud</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) return <LoadingView />;

  return (
    <SafeAreaView style={AdminStyles.container}>
      <View style={AdminStyles.searchContainer}>
        <TextInput
          style={AdminStyles.searchInput}
          placeholder="Buscar solicitud..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={AdminStyles.filterContainer}>
        {(['ALL', 'PENDIENTE', 'ACEPTADA', 'COMPLETADA', 'CANCELADA'] as const).map(status => (
          <TouchableOpacity
            key={status}
            style={[
              AdminStyles.filterBtn,
              filterStatus === status && AdminStyles.filterBtnActive,
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text style={[
              AdminStyles.filterBtnText,
              filterStatus === status && AdminStyles.filterBtnTextActive,
            ]}>
              {status === 'ALL' ? 'Todas' : status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Request List */}
      <View style={AdminStyles.section}>
        <FlatList
          data={filteredRequests}
          renderItem={renderRequest}
          keyExtractor={item => item.idSolicitud.toString()}
          contentContainerStyle={AdminStyles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={AdminStyles.emptyContainer}>
              <Text style={AdminStyles.emptyText}>No se encontraron solicitudes</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#BDC3C7',
  },
  searchInput: {
    backgroundColor: '#ECF0F1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#BDC3C7',
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    borderRadius: 6,
    backgroundColor: '#ECF0F1',
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#2C3E50',
  },
  filterBtnText: {
    fontSize: 10,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  filterBtnTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 12,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  requestTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2C3E50',
  },
  requestDesc: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  requestMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#95A5A6',
  },
  costText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27AE60',
    marginTop: 4,
    marginBottom: 8,
  },
  cancelBtn: {
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#95A5A6',
  },
});
