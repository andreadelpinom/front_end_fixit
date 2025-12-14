import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProposalListItem } from '../useProposalsList';
import { styles as screenStyles } from '../ProposalDetailScreen.styles';
import { styles } from './ProposalDetailOfferSection.styles';
import { theme } from '../../../../theme';

type ProposalDetailOfferSectionProps = {
  proposal: ProposalListItem;
};

export function ProposalDetailOfferSection({ proposal }: ProposalDetailOfferSectionProps) {
  return (
    <View style={screenStyles.sectionCard}>
      <Text style={screenStyles.sectionLabel}>Propuesta</Text>

      <View style={styles.priceRow}>
        <View>
          <Text style={styles.priceLabel}>{proposal.priceLabel}</Text>
          {proposal.estimatedTimeLabel ? (
            <Text style={styles.timeText}>Tiempo estimado: {proposal.estimatedTimeLabel}</Text>
          ) : null}
        </View>
        {proposal.submittedLabel ? (
          <View style={styles.submittedPill}>
            <Ionicons name="time-outline" size={16} color={theme.colors.text.muted} />
            <Text style={styles.submittedText}>Enviada {proposal.submittedLabel}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={18} color={theme.colors.primary} />
        <Text style={styles.metaValue}>
          {proposal.arrivalLabel ?? 'Horario por confirmar'}
        </Text>
      </View>

      {proposal.message ? (
        <View style={styles.messageCard}>
          <Text style={styles.messageLabel}>Mensaje del técnico</Text>
          <Text style={styles.messageText}>{proposal.message}</Text>
        </View>
      ) : null}
    </View>
  );
}
