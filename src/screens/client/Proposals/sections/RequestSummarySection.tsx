import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProposalsRequestSummary } from '../useProposalsList';
import { styles } from './RequestSummarySection.styles';
import { theme } from '../../../../theme';

type RequestSummarySectionProps = {
  summary: ProposalsRequestSummary | null;
  subtitle: string;
  onRefresh?: () => void;
  isLoading?: boolean;
};

const getToneColor = (
  tone: ProposalsRequestSummary['statusTone'],
): { background: string; foreground: string; icon: keyof typeof Ionicons.glyphMap } => {
  switch (tone) {
    case 'assigned':
      return {
        background: `${theme.colors.success}1A`,
        foreground: theme.colors.success,
        icon: 'checkmark-circle',
      };
    case 'completed':
      return {
        background: `${theme.colors.success}1A`,
        foreground: theme.colors.success,
        icon: 'ribbon-outline',
      };
    case 'cancelled':
      return {
        background: `${theme.colors.error}1A`,
        foreground: theme.colors.error,
        icon: 'close-circle',
      };
    case 'proposals':
      return {
        background: `${theme.colors.primary}12`,
        foreground: theme.colors.primary,
        icon: 'chatbubbles-outline',
      };
    case 'waiting':
      return {
        background: `${theme.colors.warning}12`,
        foreground: theme.colors.warning,
        icon: 'time-outline',
      };
    default:
      return {
        background: `${theme.colors.info}12`,
        foreground: theme.colors.info,
        icon: 'information-circle-outline',
      };
  }
};

export function RequestSummarySection({ summary, subtitle, onRefresh, isLoading }: RequestSummarySectionProps) {
  const toneColors = summary ? getToneColor(summary.statusTone) : null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.sectionTitle}>Propuestas</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
        {onRefresh ? (
          <Pressable
            accessibilityRole="button"
            onPress={onRefresh}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && { opacity: 0.85 },
              isLoading && { opacity: 0.6 },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.text.primary} />
            ) : (
              <Text style={styles.actionButtonText}>Actualizar</Text>
            )}
          </Pressable>
        ) : null}
      </View>

      {summary ? (
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryLabel}>Solicitud</Text>
            <View
              style={[
                styles.statusBadge,
                toneColors ? { backgroundColor: toneColors.background } : null,
              ]}
            >
              {toneColors ? (
                <Ionicons name={toneColors.icon} size={14} color={toneColors.foreground} />
              ) : null}
              <Text
                style={[
                  styles.statusText,
                  toneColors ? { color: toneColors.foreground } : null,
                ]}
              >
                {summary.statusLabel}
              </Text>
            </View>
          </View>

          <View>
            <Text style={styles.summaryTitle}>{summary.title}</Text>
            {summary.serviceName ? (
              <Text style={styles.serviceText}>{summary.serviceName}</Text>
            ) : null}
          </View>

          <View style={styles.metaRow}>
            {summary.locationLabel ? (
              <View style={styles.metaChip}>
                <Ionicons name="location-outline" size={14} color={theme.colors.text.muted} />
                <Text style={styles.metaText}>{summary.locationLabel}</Text>
              </View>
            ) : null}
            {summary.budgetLabel ? (
              <View style={styles.metaChip}>
                <Ionicons name="pricetag-outline" size={14} color={theme.colors.text.muted} />
                <Text style={styles.metaText}>{summary.budgetLabel}</Text>
              </View>
            ) : null}
            {summary.publishedLabel ? (
              <View style={styles.metaChip}>
                <Ionicons name="calendar-outline" size={14} color={theme.colors.text.muted} />
                <Text style={styles.metaText}>Publicado {summary.publishedLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : (
        <View style={styles.placeholderCard}>
          <View style={[styles.placeholderLine, { width: '40%' }]} />
          <View style={[styles.placeholderLine, { width: '70%', height: 16 }]} />
          <View style={[styles.placeholderLine, { width: '55%' }]} />
        </View>
      )}
    </View>
  );
}
