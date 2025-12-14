import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../../ui';

interface TechnicianCertificationsSectionProps {
  certifications: any[];
}

export const TechnicianCertificationsSection: React.FC<TechnicianCertificationsSectionProps> = ({
  certifications,
}) => {
  if (!certifications || certifications.length === 0) {
    return (
      <ThemedView variant="surface" style={styles.section}>
        <ThemedText variant="h3" style={styles.sectionTitle}>
          Certificaciones
        </ThemedText>
        <ThemedText variant="body" color="muted">
          No tienes certificaciones registradas.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView variant="surface" style={styles.section}>
      <ThemedText variant="h3" style={styles.sectionTitle}>
        Certificaciones
      </ThemedText>
      {certifications.map((certification, index) => (
        <View key={certification.id || index} style={styles.card}>
          <ThemedText variant="h3" style={styles.cardTitle}>
            {certification.nombre || certification.title || 'Certificación'}
          </ThemedText>
          <ThemedText variant="body" style={styles.cardDescription}>
            {certification.descripcion || certification.description || 'Sin descripción'}
          </ThemedText>
        </View>
      ))}
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
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#555',
  },
});