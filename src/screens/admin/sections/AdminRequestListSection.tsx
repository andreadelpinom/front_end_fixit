import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../ui';

interface Request {
  idSolicitud: number;
  titulo: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;
  cliente: {
    nombres: string;
    apellidos: string;
  };
  tecnico?: {
    nombres: string;
    apellidos: string;
  };
  categoria: {
    nombre: string;
  };
}

interface AdminRequestListSectionProps {
  requests: Request[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export const AdminRequestListSection: React.FC<AdminRequestListSectionProps> = ({
  requests,
  loading,
  refreshing,
  onRefresh,
}) => {
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return '#FF9800';
      case 'ACEPTADA': return '#2196F3';
      case 'COMPLETADA': return '#4CAF50';
      case 'CANCELADA': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const renderRequest = ({ item }: { item: Request }) => (
    <TouchableOpacity style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <ThemedText variant="h3" style={styles.requestTitle}>
          {item.titulo}
        </ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}>
          <ThemedText variant="caption" style={styles.statusText}>
            {item.estado}
          </ThemedText>
        </View>
      </View>
      <ThemedText variant="body" style={styles.requestDescription} numberOfLines={2}>
        {item.descripcion}
      </ThemedText>
      <View style={styles.requestDetails}>
        <ThemedText variant="caption" color="muted">
          Cliente: {item.cliente.nombres} {item.cliente.apellidos}
        </ThemedText>
        {item.tecnico && (
          <ThemedText variant="caption" color="muted">
            Técnico: {item.tecnico.nombres} {item.tecnico.apellidos}
          </ThemedText>
        )}
        <ThemedText variant="caption" color="muted">
          Categoría: {item.categoria.nombre}
        </ThemedText>
      </View>
      <ThemedText variant="caption" color="muted">
        Creada: {new Date(item.fechaCreacion).toLocaleDateString()}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView variant="surface" style={styles.section}>
      <ThemedText variant="h3" style={styles.sectionTitle}>
        Lista de Solicitudes ({requests.length})
      </ThemedText>

      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.idSolicitud.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText variant="body" color="muted">
              {loading ? 'Cargando solicitudes...' : 'No hay solicitudes registradas'}
            </ThemedText>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 0,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  requestDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  requestDetails: {
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
});