import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '../../../../ui';
import { theme } from '../../../../theme';
import { styles } from './ServiceStatusSection.styles';
import { ServiceCardVariant, ServiceStateModel } from '../useHomeClient';

type ServiceStatusSectionProps = {
  state: ServiceStateModel;
};

const toneColors: Record<string, string> = {
  info: theme.colors.info,
  success: theme.colors.success,
  warning: theme.colors.warning,
};

const iconForVariant: Record<ServiceCardVariant, keyof typeof Ionicons.glyphMap> = {
  EMPTY: 'clipboard-outline',
  PROPOSALS: 'notifications-outline',
  IN_PROGRESS: 'flash-outline',
  WAITING: 'hourglass-outline',
};

export function ServiceStatusSection({ state }: ServiceStatusSectionProps) {
  const badgeColor = state.badgeTone ? toneColors[state.badgeTone] : theme.colors.primary;
  const iconName = iconForVariant[state.variant];

  return (
    <ThemedView variant="surface" style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name={iconName} color={theme.colors.primary} size={24} />
        {state.badgeLabel ? (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <ThemedText variant="caption" color="inverse">
              {state.badgeLabel}
            </ThemedText>
          </View>
        ) : null}
      </View>

      <View style={styles.textBlock}>
        <ThemedText variant="subtitle" style={styles.title}>
          {state.title}
        </ThemedText>
        <ThemedText variant="body" color="muted">
          {state.description}
        </ThemedText>
      </View>

      {state.requestTitle ? (
        <View style={styles.requestCard}>
          <ThemedText variant="body" style={styles.requestTitle}>
            {state.requestTitle}
          </ThemedText>
          {state.requestSubtitle ? (
            <ThemedText variant="caption" color="muted">
              {state.requestSubtitle}
            </ThemedText>
          ) : null}
        </View>
      ) : null}
    </ThemedView>
  );
}
