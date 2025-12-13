import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { emptyStateStyles as styles } from './EmptyStateSection.styles';
import { ThemedText } from '../../../../ui';
import { theme } from '../../../../theme';

type EmptyStateSectionProps = {
  onRetry: () => void;
  disabled: boolean;
};

export const EmptyStateSection: React.FC<EmptyStateSectionProps> = ({ onRetry, disabled }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name="chatbubble-ellipses-outline" size={36} color={theme.colors.primary} />
      </View>
      <ThemedText variant="subtitle" style={styles.title}>
        Comienza una nueva solicitud
      </ThemedText>
      <ThemedText style={styles.description}>
        Maestrito te guiará paso a paso para crear tu solicitud. Escribe el problema y sigue las indicaciones.
      </ThemedText>
      {!disabled && (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
        >
          <ThemedText style={styles.actionButtonText}>Reintentar conexión</ThemedText>
        </Pressable>
      )}
    </View>
  );
};
