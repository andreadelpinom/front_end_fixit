import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProposalListItem } from '../useProposalsList';
import { styles as screenStyles } from '../ProposalDetailScreen.styles';
import { styles } from './ProposalDetailTechnicianSection.styles';
import { theme } from '../../../../theme';

type ProposalDetailTechnicianSectionProps = {
  proposal: ProposalListItem;
};

const getInitials = (value: string): string => {
  if (!value) {
    return 'T';
  }

  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${(parts[0][0] ?? '').toUpperCase()}${(parts[1][0] ?? '').toUpperCase()}`;
};

export function ProposalDetailTechnicianSection({ proposal }: ProposalDetailTechnicianSectionProps) {
  const initials = useMemo(() => getInitials(proposal.technicianName), [proposal.technicianName]);
  const ratingLabel = proposal.ratingValue > 0 ? proposal.ratingValue.toFixed(1) : 'N/R';

  return (
    <View style={screenStyles.sectionCard}>
      <Text style={screenStyles.sectionLabel}>Técnico</Text>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={screenStyles.sectionTitle}>{proposal.technicianName}</Text>
          {proposal.specialty ? <Text style={styles.specialtyText}>{proposal.specialty}</Text> : null}
          <View style={styles.metaRow}>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={16} color={theme.colors.warning} />
              <Text style={styles.ratingValue}>{ratingLabel}</Text>
              {proposal.ratingCount != null ? (
                <Text style={styles.ratingCount}>({proposal.ratingCount})</Text>
              ) : null}
            </View>
            {proposal.isVerified ? (
              <View style={styles.verifiedRow}>
                <Ionicons name="shield-checkmark" size={16} color={theme.colors.success} />
                <Text style={styles.verifiedText}>Verificado por FixIt</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
