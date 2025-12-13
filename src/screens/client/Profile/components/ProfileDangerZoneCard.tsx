import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../../../ui';
import { theme } from '../../../../theme';

interface ProfileDangerZoneCardProps {
  onLogoutPress: () => void;
}

export function ProfileDangerZoneCard({ onLogoutPress }: ProfileDangerZoneCardProps) {
  return (
    <View style={styles.container}>
      <ThemedText variant="subtitle" color="secondary" style={styles.title}>
        Zona segura
      </ThemedText>

      <ThemedText variant="caption" color="muted" style={styles.description}>
        Cierra tu sesión en este dispositivo. Tendrás que ingresar de nuevo con tus credenciales para continuar usando la aplicación.
      </ThemedText>

      <Pressable onPress={onLogoutPress} style={styles.logoutButton} accessibilityRole="button">
        <Ionicons
          name="log-out-outline"
          size={18}
          color={theme.colors.error}
          style={styles.logoutIcon}
        />
        <ThemedText variant="body" style={styles.logoutLabel}>
          Cerrar sesión
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
    borderColor: theme.colors.border,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  description: {
    marginBottom: theme.spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.surface,
  },
  logoutIcon: {
    marginRight: theme.spacing.sm,
  },
  logoutLabel: {
    color: theme.colors.error,
    fontWeight: '600',
  },
});
