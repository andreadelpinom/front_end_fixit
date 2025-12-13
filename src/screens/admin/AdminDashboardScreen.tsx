// src/screens/admin/AdminDashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { adminService, AdminStats } from '../../services/admin.service';
import { LoadingView, ErrorView } from '../../components/common';
import { AdminStyles, AdminColors } from '../../styles/AdminScreens.style';

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      console.error('[AdminDashboard] Error:', err);
      setError(err?.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  return (
    <View style={AdminStyles.container}>
      <ScrollView
        style={AdminStyles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={AdminStyles.section}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Dashboard</Text>
            <Text style={styles.subtitleText}>Estado general del sistema</Text>
          </View>
        </View>

        {/* Métricas clave */}
        <View style={AdminStyles.section}>
          <Text style={AdminStyles.sectionTitle}>Métricas clave</Text>
          <View style={styles.metricsRow}>
            <StatCard
              label="Usuarios totales"
              value={stats?.totalUsers || 0}
            />
            <StatCard
              label="Técnicos activos"
              value={stats?.totalTechnicians || 0}
            />
            <StatCard
              label="Solicitudes activas"
              value={stats?.activeRequests || 0}
            />
            <StatCard
              label="Rating promedio"
              value={stats?.averageRating?.toFixed(1) || '0.0'}
            />
          </View>
        </View>

        {/* Pendientes importantes */}
        <View style={AdminStyles.section}>
          <Text style={AdminStyles.sectionTitle}>Pendientes importantes</Text>
          <View style={styles.pendingContainer}>
            <View style={styles.pendingItem}>
              <Text style={styles.pendingNumber}>{stats?.totalTechnicians || 0}</Text>
              <Text style={styles.pendingLabel}>Técnicos registrados</Text>
            </View>
            <View style={styles.pendingItem}>
              <Text style={styles.pendingNumber}>{stats?.pendingCertifications || 0}</Text>
              <Text style={styles.pendingLabel}>Certificaciones por revisar</Text>
            </View>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Technicians' as never)}
            >
              <Text style={styles.ctaButtonText}>Ver verificación</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estado general */}
        <View style={AdminStyles.section}>
          <Text style={AdminStyles.sectionTitle}>Estado general</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Actividad del día:</Text>
              <Text style={styles.statusValue}>
                {stats?.activeRequests || 0} solicitudes activas
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Estado del sistema:</Text>
              <Text style={[
                styles.statusValue,
                { color: (stats?.pendingCertifications || 0) === 0 ? '#27AE60' : '#E74C3C' }
              ]}>
                {(stats?.pendingCertifications || 0) === 0 ? 'Normal' : 'Alerta'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: AdminColors.primary,
    padding: 24,
    paddingTop: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: '#BDC3C7',
  },
  dateText: {
    fontSize: 12,
    color: '#ECF0F1',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AdminColors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: AdminColors.textSecondary,
    textAlign: 'center',
  },
  pendingContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pendingItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pendingNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AdminColors.primary,
  },
  pendingLabel: {
    fontSize: 14,
    color: AdminColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: AdminColors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: AdminColors.textSecondary,
  },
  statusValue: {
    fontSize: 14,
    color: AdminColors.textPrimary,
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  businessStatusContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    minWidth: 140,
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    color: AdminColors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
});
