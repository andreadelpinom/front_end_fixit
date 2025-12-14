import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../../ui';
import { TecnicoWithDetails } from '../../../../services/technician.service';

interface TechnicianStatsSectionProps {
  technician: TecnicoWithDetails | null;
  averageHours?: number;
}

export const TechnicianStatsSection: React.FC<TechnicianStatsSectionProps> = ({
  technician,
  averageHours,
}) => {
  if (!technician?._count) return null;

  return (
    <ThemedView variant="surface" style={styles.section}>
      <ThemedText variant="h3" style={styles.sectionTitle}>
        Estadísticas
      </ThemedText>
      <View style={styles.card}>
        <InfoRow
          label="Trabajos Realizados"
          value={`${technician._count.solicitudesTecnico || 0}`}
        />
        <InfoRow
          label="Calificaciones Recibidas"
          value={`${technician._count.calificaciones || 0}`}
        />
        <InfoRow
          label="Horas Promedio por Trabajo"
          value={averageHours !== undefined ? `${averageHours.toFixed(1)}h` : 'N/A'}
        />
      </View>
    </ThemedView>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText variant="body" color="muted" style={styles.label}>
        {label}:
      </ThemedText>
      <ThemedText variant="body" style={styles.value}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    flex: 1,
  },
  value: {
    flex: 2,
    textAlign: 'right',
  },
});