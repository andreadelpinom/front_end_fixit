import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../ui';
import { theme } from '../../../theme';

interface AdminProfileStats {
  totalUsers: number;
  totalRequests: number;
  activeRequests: number;
  totalActions?: number;
}

interface AdminProfileStatsSectionProps {
  stats: AdminProfileStats;
}

export const AdminProfileStatsSection: React.FC<AdminProfileStatsSectionProps> = ({ stats }) => {
  const StatCard = ({ title, value }: { title: string; value: string | number }) => (
    <View style={styles.statCard}>
      <ThemedText variant="h3" style={styles.statValue}>{value}</ThemedText>
      <ThemedText variant="body" style={styles.statTitle}>{title}</ThemedText>
    </View>
  );

  return (
    <ThemedView variant="surface" style={styles.section}>
      <ThemedText variant="h3" style={styles.sectionTitle}>Estadísticas de Administración</ThemedText>
      <View style={styles.statsGrid}>
        <StatCard title="Total Usuarios" value={stats.totalUsers} />
        <StatCard title="Total Solicitudes" value={stats.totalRequests} />
        <StatCard title="Solicitudes Activas" value={stats.activeRequests} />
        <StatCard title="Acciones Realizadas" value={stats.totalActions || 0} />
      </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  statTitle: {
    textAlign: 'center',
    color: '#666',
  },
});