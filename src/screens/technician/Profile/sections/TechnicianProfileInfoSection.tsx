import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../../ui';
import { TecnicoWithDetails } from '../../../../services/technician.service';

interface TechnicianProfileInfoSectionProps {
  technician: TecnicoWithDetails | null;
}

export const TechnicianProfileInfoSection: React.FC<TechnicianProfileInfoSectionProps> = ({
  technician,
}) => {
  if (!technician) return null;

  return (
    <ThemedView variant="surface" style={styles.section}>
      <ThemedText variant="h3" style={styles.sectionTitle}>
        Perfil Técnico
      </ThemedText>
      <View style={styles.card}>
        <InfoRow label="ID Técnico" value={`#${technician?.idTecnico}`} />
        <InfoRow
          label="Total Calificaciones"
          value={`${technician?.totalCalificaciones || 0}`}
        />
        <InfoRow
          label="Promedio"
          value={`${technician?.promedioCalificaciones?.toFixed(1) || 'N/A'} ⭐`}
        />
        <InfoRow
          label="Estado"
          value={technician?.isActive ? '✅ Activo' : '❌ Inactivo'}
        />
        <InfoRow
          label="Miembro desde"
          value={technician?.createdAt
            ? new Date(technician.createdAt).toLocaleDateString()
            : 'N/A'}
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