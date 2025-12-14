import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText, ThemedView } from '../../../ui';
import { theme } from '../../../theme';

interface DashboardStats {
  totalUsers: number;
  totalRequests: number;
  activeRequests: number;
  totalTechnicians: number;
  totalClients: number;
  unreadNotifications: number;
}

interface AdminStatsSectionProps {
  stats: DashboardStats;
  onNotificationsPress: () => void;
}

export const AdminStatsSection: React.FC<AdminStatsSectionProps> = ({
  stats,
  onNotificationsPress,
}) => {
  const StatCard = ({ title, value, onPress }: { title: string; value: string | number; onPress?: () => void }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress} disabled={!onPress}>
      <ThemedText variant="h3" style={styles.statValue}>{value}</ThemedText>
      <ThemedText variant="body" style={styles.statTitle}>{title}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView variant="surface" style={styles.section}>
      <ThemedText variant="h3" style={styles.sectionTitle}>Estadísticas Generales</ThemedText>
      <View style={styles.statsGrid}>
        <StatCard title="Total Usuarios" value={stats.totalUsers} />
        <StatCard title="Solicitudes Totales" value={stats.totalRequests} />
        <StatCard title="Solicitudes Activas" value={stats.activeRequests} />
        <StatCard title="Técnicos" value={stats.totalTechnicians} />
        <StatCard title="Clientes" value={stats.totalClients} />
        <StatCard
          title="Notificaciones No Leídas"
          value={stats.unreadNotifications}
          onPress={onNotificationsPress}
        />
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