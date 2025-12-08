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
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import {
  getAvailableRequests,
  createProposal,
  Solicitud,
} from '../../services/technician.service';

export default function AvailableRequestsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState<Solicitud[]>([]);

  const loadData = async () => {
    if (!user) return;

    try {
      // Obtener solicitudes disponibles
      const data = await getAvailableRequests();
      setRequests(data);
    } catch (err: any) {
      console.error('Error loading requests:', err);
      Alert.alert('Error', 'No se pudieron cargar las solicitudes');
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

  const handleApply = async (request: Solicitud) => {
  Alert.prompt(
    'Enviar Propuesta',
    `Ingresa tu costo propuesto para: "${request.tituloProblema}"`,
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Enviar',
        onPress: async (costo?: string) => {
          try {
            const costoNum = parseFloat(costo || '0');
            if (isNaN(costoNum) || costoNum <= 0) {
              Alert.alert('Error', 'Ingresa un costo válido');
              return;
            }

            // El backend resuelve idTecnico automáticamente desde el JWT
            await createProposal({
              idSolicitud: request.idSolicitud,
              costoAcordado: costoNum,
              notas: 'Propuesta enviada desde la app',
            });

            Alert.alert('Éxito', '✅ Propuesta enviada correctamente');
            loadData();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'No se pudo enviar la propuesta');
          }
        },
      },
    ],
    'plain-text'
  );
};

  const renderItem = ({ item }: { item: Solicitud }) => (
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
        onPress={() => handleApply(item)}
      >
        <Text style={styles.applyButtonText}>Enviar Propuesta</Text>
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
  applyButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
});