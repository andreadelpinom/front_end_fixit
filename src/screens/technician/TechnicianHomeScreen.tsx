import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import {
  getTechnicianByUser,
  getTechnicianStats,
  TechnicianStats,
} from '../../services/technician.service';
import { TecnicoWithDetails } from '../../types/api';

export default function TechnicianHomeScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [technician, setTechnician] = useState<TecnicoWithDetails | null>(null);
  const [stats, setStats] = useState<TechnicianStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!user) return;

    try {
      setError(null);
      const techData = await getTechnicianByUser(user.idUser);
      setTechnician(techData);

      // El backend resuelve automáticamente desde el JWT
      const statsData = await getTechnicianStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Error loading technician data:', err);
      setError(err?.message || 'Error al cargar datos');
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Verificar si el técnico no está verificado
  const isNotVerified = technician && technician.status !== 'VERIFICADO';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Banner de no verificado */}
      {isNotVerified && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Cuenta no verificada</Text>
            <Text style={styles.warningText}>
              Completa tu verificación para mejorar tu visibilidad
            </Text>
          </View>
        </View>
      )}

      {/* Header con bienvenida */}
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Hola, {user?.nombres}!</Text>
        <Text style={styles.subtitle}>Bienvenido a tu panel de técnico</Text>
      </View>

      {/* Estadísticas principales */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalProposals}</Text>
            <Text style={styles.statLabel}>Propuestas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.acceptedJobs}</Text>
            <Text style={styles.statLabel}>Aceptados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.completedJobs}</Text>
            <Text style={styles.statLabel}>Completados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              ${stats.totalEarnings.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Ganancias</Text>
          </View>
        </View>
      )}

      {/* Información del perfil */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mi Perfil Técnico</Text>
        <View style={styles.card}>
          <InfoRow label="ID Técnico" value={`#${technician?.idTecnico}`} />
          <InfoRow
            label="Calificaciones"
            value={`${technician?.totalCalificaciones || 0}`}
          />
          <InfoRow
            label="Promedio"
            value={`${technician?.promedioCalificaciones?.toFixed(1) || 'N/A'} ⭐`}
          />
          <InfoRow
            label="Estado Cuenta"
            value={getStatusDisplay(technician?.status || 'REGISTRADO')}
          />
          <InfoRow
            label="Estado"
            value={technician?.isActive ? '✅ Activo' : '❌ Inactivo'}
          />
        </View>
      </View>

      {/* Acciones rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📋 Ver Solicitudes Disponibles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>💼 Mis Trabajos Activos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>⚙️ Configurar Servicios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Componente auxiliar
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

// Función para mostrar el estado de forma legible
function getStatusDisplay(status: string): string {
  switch (status) {
    case 'REGISTRADO':
      return '🟡 No Verificado';
    case 'VERIFICACION_PENDIENTE':
      return '🟠 En Revisión';
    case 'VERIFICADO':
      return '✅ Verificado';
    case 'BLOQUEADO':
      return '🔴 Bloqueado';
    default:
      return '🟡 No Verificado';
  }
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
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginHorizontal: 32,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  infoLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  warningBanner: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
  },
});