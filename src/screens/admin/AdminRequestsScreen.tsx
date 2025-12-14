import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { ThemedText, ThemedView } from '../../ui';
import { AdminRequestListSection } from './sections/AdminRequestListSection';
import { homeService } from '../../services/home.service';

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

export function AdminRequestsScreen() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      // Get recent requests for admin view
      const requestPreviews = await homeService.getRecentRequests();
      // Map to local Request interface
      const mappedRequests: Request[] = requestPreviews.map(preview => ({
        idSolicitud: preview.idSolicitud,
        titulo: preview.titulo || 'Sin título',
        descripcion: preview.descripcion || 'Sin descripción',
        estado: preview.estado || 'DESCONOCIDO',
        fechaCreacion: preview.createdAt || '',
        cliente: {
          nombres: 'Cliente',
          apellidos: 'Desconocido',
        },
        categoria: {
          nombre: 'Servicio',
        },
      }));
      setRequests(mappedRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
      Alert.alert('Error', 'No se pudieron cargar las solicitudes');
      // Fallback data
      setRequests([
        {
          idSolicitud: 1,
          titulo: 'Reparación de computadora',
          descripcion: 'La computadora no enciende',
          estado: 'PENDIENTE',
          fechaCreacion: new Date().toISOString(),
          cliente: { nombres: 'María', apellidos: 'García' },
          categoria: { nombre: 'Informática' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView variant="surface" style={styles.header}>
        <ThemedText variant="h2" style={styles.title}>Gestión de Solicitudes</ThemedText>
        <ThemedText variant="body" color="muted">
          Total de solicitudes: {requests.length}
        </ThemedText>
      </ThemedView>

      <AdminRequestListSection
        requests={requests}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    margin: 12,
    borderRadius: 12,
  },
  title: {
    marginBottom: 8,
  },
});