import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../ui';

interface AdminProfile {
  idUser: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  roles: string[];
  estado: string;
  createdAt: string;
  lastLogin?: string;
  totalActions?: number;
}

interface AdminProfileInfoSectionProps {
  profile: AdminProfile | null;
}

export const AdminProfileInfoSection: React.FC<AdminProfileInfoSectionProps> = ({ profile }) => {
  if (!profile) return null;

  return (
    <ThemedView variant="surface" style={styles.section}>
      <ThemedText variant="h3" style={styles.sectionTitle}>Información Personal</ThemedText>
      <View style={styles.infoRow}>
        <ThemedText variant="body" style={styles.label}>Nombre:</ThemedText>
        <ThemedText variant="body">{profile.nombres} {profile.apellidos}</ThemedText>
      </View>
      <View style={styles.infoRow}>
        <ThemedText variant="body" style={styles.label}>Email:</ThemedText>
        <ThemedText variant="body">{profile.email}</ThemedText>
      </View>
      <View style={styles.infoRow}>
        <ThemedText variant="body" style={styles.label}>Teléfono:</ThemedText>
        <ThemedText variant="body">{profile.telefono || 'No registrado'}</ThemedText>
      </View>
      <View style={styles.infoRow}>
        <ThemedText variant="body" style={styles.label}>Roles:</ThemedText>
        <ThemedText variant="body">{profile.roles.join(', ')}</ThemedText>
      </View>
      <View style={styles.infoRow}>
        <ThemedText variant="body" style={styles.label}>Estado:</ThemedText>
        <ThemedText variant="body" style={[styles.status, profile.estado === 'ACTIVO' ? styles.active : styles.inactive]}>
          {profile.estado}
        </ThemedText>
      </View>
      <View style={styles.infoRow}>
        <ThemedText variant="body" style={styles.label}>Último acceso:</ThemedText>
        <ThemedText variant="body">
          {profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'N/A'}
        </ThemedText>
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  label: {
    fontWeight: 'bold',
    flex: 1,
  },
  status: {
    fontWeight: 'bold',
  },
  active: {
    color: '#4CAF50',
  },
  inactive: {
    color: '#F44336',
  },
});