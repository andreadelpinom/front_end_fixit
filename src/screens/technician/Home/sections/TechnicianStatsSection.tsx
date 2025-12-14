import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../../ui';
import { TechnicianStats } from '../../../../services/technician.service';

interface TechnicianStatsSectionProps {
  stats: TechnicianStats | null;
}

export const TechnicianStatsSection: React.FC<TechnicianStatsSectionProps> = ({
  stats,
}) => {
  if (!stats) return null;

  return (
    <View style={styles.container}>
      <ThemedView variant="surface" style={styles.statBox}>
        <ThemedText variant="h3" color="primary" style={styles.number}>
          {stats.completedJobs}
        </ThemedText>
        <ThemedText variant="caption" color="muted" style={styles.label}>
          Trabajos
        </ThemedText>
      </ThemedView>
      <ThemedView variant="surface" style={styles.statBox}>
        <ThemedText variant="h3" color="primary" style={styles.number}>
          {stats.averageRating?.toFixed(1) || '—'}
        </ThemedText>
        <ThemedText variant="caption" color="muted" style={styles.label}>
          Calificación
        </ThemedText>
      </ThemedView>
      <ThemedView variant="surface" style={styles.statBox}>
        <ThemedText variant="h3" color="primary" style={styles.number}>
          {stats.totalEarnings || '$0'}
        </ThemedText>
        <ThemedText variant="caption" color="muted" style={styles.label}>
          Ganancias
        </ThemedText>
      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  number: {
    fontWeight: '700',
  },
  label: {
    marginTop: 4,
  },
});