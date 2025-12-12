import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import {
  getMyProposals,
  SolicitudTecnico,
} from '../../services/technician.service';
import { EstadoAceptacion } from '../../types/api';

type Props = NativeStackScreenProps<any>;

export default function MyJobsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [proposals, setProposals] = useState<SolicitudTecnico[]>([]);

  const loadData = async () => {
    if (!user) return;

    try {
      // El backend resuelve automáticamente desde el JWT
      const data = await getMyProposals();
      setProposals(data);
    } catch (err) {
      console.error('Error loading proposals:', err);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case EstadoAceptacion.ACEPTADO:
        return '#34C759';
      case EstadoAceptacion.RECHAZADO:
        return '#FF3B30';
      case EstadoAceptacion.PROPUESTO:
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case EstadoAceptacion.ACEPTADO:
        return '✅ ACEPTADO';
      case EstadoAceptacion.RECHAZADO:
        return '❌ RECHAZADO';
      case EstadoAceptacion.PROPUESTO:
        return '⏳ PROPUESTO';
      default:
        return status;
    }
  };

  const renderItem = ({ item }: { item: SolicitudTecnico }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.id}>Solicitud #{item.idSolicitud}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.estadoAcuerdo) },
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusLabel(item.estadoAcuerdo)}
          </Text>
        </View>
      </View>

      <Text style={styles.cost}>
        💰 ${typeof item.costoAcordado === 'string' 
          ? parseFloat(item.costoAcordado).toFixed(2)
          : item.costoAcordado?.toFixed(2) || 'N/A'}
      </Text>
      
      {item.notas && (
        <Text style={styles.notes} numberOfLines={2}>
          📝 {item.notas}
        </Text>
      )}

      <View style={styles.dateContainer}>
        <Text style={styles.date}>
          📅 Propuesta: {new Date(item.fechaPropuesta).toLocaleDateString()}
        </Text>
        {item.fechaConfirmada && (
          <Text style={styles.date}>
            ✅ Confirmada: {new Date(item.fechaConfirmada).toLocaleDateString()}
          </Text>
        )}
      </View>

      {item.estadoAcuerdo === EstadoAceptacion.ACEPTADO && (
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => {
            navigation.navigate('ActiveJobs', { idSolicitud: item.idSolicitud });
          }}
        >
          <Text style={styles.ctaButtonText}>Ir al trabajo →</Text>
        </TouchableOpacity>
      )}
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
        data={proposals}
        renderItem={renderItem}
        keyExtractor={(item) => item.idSolTec.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              📭 No tienes propuestas enviadas todavía
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  id: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cost: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  notes: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  dateContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 8,
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
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