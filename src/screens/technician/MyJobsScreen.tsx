import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import {
  getMyProposals,
  SolicitudTecnico,
} from '../../services/technician.service';
import { formatCurrency } from '../../utils/currency.utils';

type Props = NativeStackScreenProps<any>;
type SubTab = 'EN_CURSO' | 'HISTORIAL';

export default function MyJobsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [subTab, setSubTab] = useState<SubTab>('EN_CURSO');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [proposals, setProposals] = useState<SolicitudTecnico[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [user])
  );

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const data = await getMyProposals();
      setProposals(data);
    } catch (err) {
      console.error('Error loading proposals:', err);
      setProposals([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Filter proposals by subtab
  const getFilteredProposals = (): SolicitudTecnico[] => {
    return proposals.filter((p) => {
      if (subTab === 'EN_CURSO') {
        // Only show ACCEPTED jobs
        return p.estadoAcuerdo === 'ACEPTADO';
      } else {
        // Show REJECTED or completed
        return p.estadoAcuerdo === 'RECHAZADO' || (p.estadoAcuerdo === 'ACEPTADO' && p.fechaConfirmada);
      }
    });
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
        ${formatCurrency(item.costoAcordado)}
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

      {item.estadoAcuerdo === 'ACEPTADO' && subTab === 'EN_CURSO' && (
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => {
            navigation.navigate('Dashboard', { 
              screen: 'ActiveJobs', 
              params: { idSolicitud: item.idSolicitud } 
            });
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

  const filteredProposals = getFilteredProposals();

  return (
    <View style={styles.container}>
      {/* Subtabs */}
      <View style={styles.subtabsContainer}>
        <TouchableOpacity
          style={[styles.subtab, subTab === 'EN_CURSO' && styles.subtabActive]}
          onPress={() => setSubTab('EN_CURSO')}
        >
          <Text style={[styles.subtabText, subTab === 'EN_CURSO' && styles.subtabTextActive]}>
            En curso ({proposals.filter(p => p.estadoAcuerdo === 'ACEPTADO').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subtab, subTab === 'HISTORIAL' && styles.subtabActive]}
          onPress={() => setSubTab('HISTORIAL')}
        >
          <Text style={[styles.subtabText, subTab === 'HISTORIAL' && styles.subtabTextActive]}>
            Historial
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        data={filteredProposals}
        renderItem={renderItem}
        keyExtractor={(item) => item.idSolTec.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {subTab === 'EN_CURSO' 
                ? '📭 No tienes trabajos en curso' 
                : '📭 No hay historial'}
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
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});