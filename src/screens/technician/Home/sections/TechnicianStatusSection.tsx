import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../../ui';

interface TechnicianStatusSectionProps {
  mainStatus: {
    title: string;
    status: string | null;
    statusColor: string | null;
    details: string;
  };
}

export const TechnicianStatusSection: React.FC<TechnicianStatusSectionProps> = ({
  mainStatus,
}) => {
  return (
    <ThemedView variant="surface" style={styles.card}>
      {mainStatus.status && (
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: mainStatus.statusColor || '#8E8E93' },
          ]}
        >
          <Text style={styles.statusBadgeText}>{mainStatus.status}</Text>
        </View>
      )}
      <ThemedText variant="h2" style={styles.title}>
        {mainStatus.title}
      </ThemedText>
      <ThemedText variant="body" color="muted" style={styles.details}>
        {mainStatus.details}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    marginBottom: 8,
  },
  details: {
    fontSize: 14,
  },
});