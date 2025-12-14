import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../ui';

interface Action {
  title: string;
  onPress: () => void;
  style?: 'default' | 'danger';
}

interface AdminProfileActionsSectionProps {
  actions: Action[];
}

export const AdminProfileActionsSection: React.FC<AdminProfileActionsSectionProps> = ({ actions }) => {
  return (
    <ThemedView variant="surface" style={styles.section}>
      <ThemedText variant="h3" style={styles.sectionTitle}>Acciones</ThemedText>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.actionButton,
            action.style === 'danger' && styles.dangerButton
          ]}
          onPress={action.onPress}
        >
          <ThemedText variant="body" style={[
            styles.actionText,
            action.style === 'danger' && styles.dangerText
          ]}>
            {action.title}
          </ThemedText>
        </TouchableOpacity>
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
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  dangerText: {
    color: '#FFFFFF',
  },
});