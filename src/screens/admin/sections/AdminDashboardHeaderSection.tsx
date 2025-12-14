import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../ui';

interface AdminDashboardHeaderSectionProps {
  title: string;
  subtitle: string;
}

export const AdminDashboardHeaderSection: React.FC<AdminDashboardHeaderSectionProps> = ({
  title,
  subtitle,
}) => {
  return (
    <ThemedView variant="surface" style={styles.header}>
      <ThemedText variant="h2" style={styles.title}>{title}</ThemedText>
      <ThemedText variant="body" color="muted" style={styles.subtitle}>{subtitle}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    margin: 12,
    borderRadius: 12,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 0,
  },
});