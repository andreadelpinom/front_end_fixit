// src/screens/admin/StatisticsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { adminService, PerformanceMetrics } from '../../services/admin.service';
import { LoadingView } from '../../components/common';
import { AdminStyles } from '../../styles/AdminScreens.style';

export default function StatisticsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  const loadData = async () => {
    try {
      const data = await adminService.getStatistics();
      setMetrics(data);
    } catch (err: any) {
      console.error('Error loading statistics:', err);
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

  if (!metrics) {
    return (
      <View style={AdminStyles.centerContainer}>
        <Text style={styles.errorText}>No se pudieron cargar las estadísticas</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={AdminStyles.container}>
      <ScrollView
        style={AdminStyles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Services by Type */}
        <View style={styles.section}>
          <Text style={AdminStyles.sectionTitle}>Servicios por Tipo</Text>
          {Object.entries(metrics.totalServicesByType).map(([service, count]) => (
            <View key={service} style={styles.statRow}>
              <Text style={styles.statLabel}>{service}</Text>
              <Text style={styles.statValue}>{count}</Text>
            </View>
          ))}
        </View>

        {/* Requests by Status */}
        <View style={styles.section}>
          <Text style={AdminStyles.sectionTitle}>Solicitudes por Estado</Text>
          {Object.entries(metrics.requestsByStatus).map(([status, count]) => (
            <View key={status} style={styles.statRow}>
              <Text style={styles.statLabel}>{status}</Text>
              <Text style={styles.statValue}>{count}</Text>
            </View>
          ))}
        </View>

        {/* Top Technicians */}
        <View style={styles.section}>
          <Text style={AdminStyles.sectionTitle}>Top Técnicos</Text>
          {metrics.topTechnicians.map((tech, index) => (
            <View key={tech.idTecnico} style={styles.techRow}>
              <Text style={styles.techRank}>#{index + 1}</Text>
              <View style={styles.techInfo}>
                <Text style={styles.techName}>{tech.nombres}</Text>
                <Text style={styles.techStats}>
                  {tech.totalServicios} servicios • ⭐ {tech.calificacionPromedio.toFixed(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Top Zones */}
        {metrics.topZones && metrics.topZones.length > 0 && (
          <View style={styles.section}>
            <Text style={AdminStyles.sectionTitle}>Zonas con Más Demanda</Text>
            {metrics.topZones.map((zone, index) => (
              <View key={zone.zona} style={styles.statRow}>
                <Text style={styles.statLabel}>
                  #{index + 1} {zone.zona}
                </Text>
                <Text style={styles.statValue}>{zone.totalSolicitudes}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Revenue Estimate */}
        <View style={styles.section}>
          <Text style={AdminStyles.sectionTitle}>Ingresos Estimados</Text>
          <Text style={styles.revenueText}>${metrics.revenueEstimate.toFixed(2)}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  statLabel: {
    fontSize: 14,
    color: '#2C3E50',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  techRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F39C12',
    marginRight: 12,
    width: 35,
  },
  techInfo: {
    flex: 1,
  },
  techName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  techStats: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  revenueText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#27AE60',
    textAlign: 'center',
    paddingVertical: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
