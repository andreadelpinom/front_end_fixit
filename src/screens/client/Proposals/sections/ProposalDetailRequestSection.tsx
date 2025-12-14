import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProposalsRequestSummary } from '../useProposalsList';
import { styles as screenStyles } from '../ProposalDetailScreen.styles';
import { styles } from './ProposalDetailRequestSection.styles';
import { theme } from '../../../../theme';

type ProposalDetailRequestSectionProps = {
  requestId: number;
  summary: ProposalsRequestSummary | null;
};

const getToneVisuals = (
  tone: ProposalsRequestSummary['statusTone'],
): { icon: keyof typeof Ionicons.glyphMap; color: string } => {
  switch (tone) {
    case 'assigned':
      return { icon: 'checkmark-circle', color: theme.colors.success };
    case 'completed':
      return { icon: 'ribbon-outline', color: theme.colors.success };
    case 'cancelled':
      return { icon: 'close-circle', color: theme.colors.error };
    case 'proposals':
      return { icon: 'chatbubbles-outline', color: theme.colors.primary };
    case 'waiting':
      return { icon: 'time-outline', color: theme.colors.warning };
    default:
      return { icon: 'information-circle-outline', color: theme.colors.info };
  }
};

export function ProposalDetailRequestSection({ requestId, summary }: ProposalDetailRequestSectionProps) {
  if (!summary) {
    return (
      <View style={[screenStyles.sectionCard, styles.placeholder]}>
        <View style={styles.placeholderLine} />
        <View style={[styles.placeholderLine, { width: '50%' }]} />
        <View style={[styles.placeholderLine, { width: '60%' }]} />
      </View>
    );
  }

  const tone = getToneVisuals(summary.statusTone);

  return (
    <View style={screenStyles.sectionCard}>
      <View style={screenStyles.sectionHeader}>
        <Text style={screenStyles.sectionLabel}>Solicitud #{requestId}</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${tone.color}14` }]}>
          <Ionicons name={tone.icon} size={16} color={tone.color} />
          <Text style={[styles.statusText, { color: tone.color }]}>{summary.statusLabel}</Text>
        </View>
      </View>

      <View style={styles.titleBlock}>
        <Text style={screenStyles.sectionTitle}>{summary.title}</Text>
        {summary.serviceName ? <Text style={styles.serviceText}>{summary.serviceName}</Text> : null}
      </View>

      <View style={screenStyles.metaRow}>
        {summary.locationLabel ? (
          <View style={screenStyles.metaChip}>
            <Ionicons name="location-outline" size={14} color={theme.colors.text.muted} />
            <Text style={screenStyles.metaText}>{summary.locationLabel}</Text>
          </View>
        ) : null}
        {summary.budgetLabel ? (
          <View style={screenStyles.metaChip}>
            <Ionicons name="pricetag-outline" size={14} color={theme.colors.text.muted} />
            <Text style={screenStyles.metaText}>{summary.budgetLabel}</Text>
          </View>
        ) : null}
        {summary.publishedLabel ? (
          <View style={screenStyles.metaChip}>
            <Ionicons name="calendar-outline" size={14} color={theme.colors.text.muted} />
            <Text style={screenStyles.metaText}>Publicado {summary.publishedLabel}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
