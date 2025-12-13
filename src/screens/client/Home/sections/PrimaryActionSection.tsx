import React from 'react';
import { Pressable } from 'react-native';
import { ThemedText } from '../../../../ui';
import { theme } from '../../../../theme';
import { styles } from './PrimaryActionSection.styles';
import { ServiceCardVariant } from '../useHomeClient';

const buttonLabels: Record<ServiceCardVariant, string> = {
  EMPTY: 'Crear solicitud',
  PROPOSALS: 'Ver propuestas',
  IN_PROGRESS: 'Ver progreso en tiempo real',
  WAITING: 'Ver detalles',
};

type PrimaryActionSectionProps = {
  variant: ServiceCardVariant;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryActionSection({ variant, onPress, disabled }: PrimaryActionSectionProps) {
  const label = buttonLabels[variant];

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        pressed && { opacity: 0.8 },
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <ThemedText variant="subtitle" color="inverse" style={styles.buttonLabel}>
        {label}
      </ThemedText>
    </Pressable>
  );
}
