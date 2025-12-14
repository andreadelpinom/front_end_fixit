import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { ThemedText, ThemedView } from '../../../../ui';

interface TechnicianPersonalInfoSectionProps {
  user: any;
  editing?: boolean;
  editData?: { telefono: string };
  onUpdateEditData?: (field: string, value: string) => void;
}

export const TechnicianPersonalInfoSection: React.FC<TechnicianPersonalInfoSectionProps> = ({
  user,
  editing = false,
  editData,
  onUpdateEditData,
}) => {
  return (
    <ThemedView variant="surface" style={styles.section}>
      <ThemedText variant="h3" style={styles.sectionTitle}>
        Información Personal
      </ThemedText>
      <View style={styles.card}>
        <InfoRow label="Nombre" value={`${user?.nombres} ${user?.apellidos}`} />
        <InfoRow label="Email" value={user?.email || 'N/A'} />
        <InfoRow label="Cédula" value={user?.cedula || 'N/A'} />
        <InfoRow label="Rol" value={user?.roles?.[0] || 'N/A'} />
        {editing ? (
          <EditableRow
            label="Teléfono"
            value={editData?.telefono || ''}
            onChange={(value) => onUpdateEditData?.('telefono', value)}
          />
        ) : (
          <InfoRow label="Teléfono" value={user?.telefono || 'N/A'} />
        )}
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

function EditableRow({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText variant="body" color="muted" style={styles.label}>
        {label}:
      </ThemedText>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={`Ingrese ${label.toLowerCase()}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    margin: 12,
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
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    textAlign: 'right',
  },
});