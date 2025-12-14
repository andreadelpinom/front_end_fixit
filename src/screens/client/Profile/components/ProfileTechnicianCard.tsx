import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../../../ui';
import { theme } from '../../../../theme';

interface ProfileTechnicianCardProps {
  onSwitchPress: () => void;
}

export function ProfileTechnicianCard({ onSwitchPress }: ProfileTechnicianCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <Ionicons name="briefcase-outline" size={20} color={theme.colors.primary} />
        </View>
        <ThemedText variant="subtitle" style={styles.title}>
          Ver perfil de técnico
        </ThemedText>
      </View>

      <ThemedText variant="caption" color="secondary" style={styles.description}>
        Cambia a tu vista de técnico para gestionar solicitudes, ofertar servicios y administrar tu perfil profesional.
      </ThemedText>

      <Pressable onPress={onSwitchPress} style={styles.button} accessibilityRole="button">
        <ThemedText variant="body" color="inverse" style={styles.buttonLabel}>
          Cambiar a vista de técnico
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  title: {
    flex: 1,
  },
  description: {
    marginBottom: theme.spacing.lg,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  buttonLabel: {
    fontWeight: '600',
  },
});
