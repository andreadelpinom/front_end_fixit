import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './EmptyProposalsSection.styles';
import { theme } from '../../../../theme';

type EmptyProposalsSectionProps = {
  onRetry?: () => void;
  error?: string | null;
};

const DEFAULT_DESCRIPTION = 'Cuando recibas propuestas de técnicos certificados aparecerán en esta lista.';

export function EmptyProposalsSection({ onRetry, error }: EmptyProposalsSectionProps) {
  const hasError = Boolean(error);
  const description = hasError ? error : DEFAULT_DESCRIPTION;
  const iconName: keyof typeof Ionicons.glyphMap = hasError ? 'alert-circle-outline' : 'chatbubbles-outline';

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name={iconName} size={32} color={hasError ? theme.colors.error : theme.colors.primary} />
      </View>
      <Text style={styles.title}>Aún no hay propuestas</Text>
      <Text style={[styles.description, hasError ? styles.errorText : null]}>{description}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} style={({ pressed }) => [styles.refreshButton, pressed && styles.refreshButtonPressed]}>
          <Text style={styles.refreshButtonText}>{hasError ? 'Reintentar' : 'Actualizar'}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
