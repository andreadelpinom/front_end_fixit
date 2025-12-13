import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../../../ui';
import { styles } from './EmptyStateIllustrationSection.styles';
import { theme } from '../../../../theme';

type EmptyStateIllustrationSectionProps = {
  visible: boolean;
};

export function EmptyStateIllustrationSection({ visible }: EmptyStateIllustrationSectionProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="clipboard-outline" size={48} color={theme.colors.primary} />
      </View>
      <ThemedText variant="subtitle" style={styles.title}>
        Sin servicios activos
      </ThemedText>
      <ThemedText variant="body" color="muted" style={styles.description}>
        Crea una solicitud para recibir propuestas de técnicos calificados.
      </ThemedText>
    </View>
  );
}
