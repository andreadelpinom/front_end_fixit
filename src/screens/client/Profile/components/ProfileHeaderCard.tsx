import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../../../../ui';
import { theme } from '../../../../theme';

interface ProfileHeaderCardProps {
  fullName: string;
  email: string;
  memberSinceLabel: string;
  onEditPress: () => void;
}

export function ProfileHeaderCard({
  fullName,
  email,
  memberSinceLabel,
  onEditPress,
}: ProfileHeaderCardProps) {
  const avatarLetter = fullName.trim().charAt(0).toUpperCase() || 'U';

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <ThemedText variant="heading" color="inverse" style={styles.avatarLetter}>
          {avatarLetter}
        </ThemedText>
      </View>

      <ThemedText variant="subtitle" style={styles.fullName}>
        {fullName}
      </ThemedText>

      <ThemedText variant="caption" color="muted" style={styles.email}>
        {email}
      </ThemedText>

      <ThemedText variant="caption" color="secondary" style={styles.memberSince}>
        {memberSinceLabel}
      </ThemedText>

      <Pressable onPress={onEditPress} style={styles.editButton} accessibilityRole="button">
        <ThemedText variant="body" color="inverse" style={styles.editButtonText}>
          Editar perfil
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarLetter: {
    fontSize: theme.typography.sizes.display,
  },
  fullName: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  email: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  memberSince: {
    textAlign: 'center',
  },
  editButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  editButtonText: {
    fontWeight: '600',
  },
});
