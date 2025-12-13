import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProposalListItem } from '../useProposalsList';
import { styles } from './ProposalCardSection.styles';
import { theme } from '../../../../theme';

type ProposalCardSectionProps = {
  proposal: ProposalListItem;
  onPressDetail?: (proposal: ProposalListItem) => void;
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
export function ProposalCardSection({ proposal, onPressDetail }: ProposalCardSectionProps) {
  const initials = useMemo(() => getInitials(proposal.technicianName), [proposal.technicianName]);
  const ratingLabel = proposal.ratingValue > 0 ? proposal.ratingValue.toFixed(1) : '0.0';
  const ratingCountLabel = proposal.ratingCount != null ? proposal.ratingCount : 0;
  const statusKey = (proposal.status ?? '').trim().toUpperCase();
  const shouldDisplayStatus = statusKey !== '' && statusKey !== 'PROPUESTO';
  const statusStyles = useMemo(() => {
    switch (statusKey) {
      case 'ACEPTADO':
        return {
          color: theme.colors.success,
          icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
        };
      case 'RECHAZADO':
        return {
          color: theme.colors.error,
          icon: 'close-circle' as keyof typeof Ionicons.glyphMap,
        };
      case 'EN_REVISION':
        return {
          color: theme.colors.warning,
          icon: 'hourglass-outline' as keyof typeof Ionicons.glyphMap,
        };
      default:
        return {
          color: theme.colors.info,
          icon: 'chatbubbles-outline' as keyof typeof Ionicons.glyphMap,
        };
    }
  }, [statusKey]);
  const statusLabel = useMemo(() => {
    switch (statusKey) {
      case 'ACEPTADO':
        return 'Aceptada';
      case 'RECHAZADO':
        return 'Rechazada';
      case 'EN_REVISION':
        return 'En revisión';
      case 'PROPUESTO':
        return 'Propuesta';
      default:
        return proposal.status ?? 'Estado';
    }
  }, [proposal.status, statusKey]);

  return (
    <View style={styles.container}>
      <View>
        {shouldDisplayStatus ? (
          <View style={[styles.statusBadge, { borderColor: `${statusStyles.color}33`, backgroundColor: `${statusStyles.color}14` }]}>
            <View style={styles.verifiedRow}>
              <Ionicons name={statusStyles.icon} size={14} color={statusStyles.color} />
              <Text style={[styles.statusText, { color: statusStyles.color }]}>{statusLabel}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.headerRow}>
          <View style={styles.technicianInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.nameAndBadge}>
              <Text style={styles.nameText} numberOfLines={1}>
                {proposal.technicianName}
              </Text>
              {proposal.specialty ? (
                <Text style={styles.roleText} numberOfLines={1}>
                  {proposal.specialty}
                </Text>
              ) : null}
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} style={styles.ratingIcon} />
                <Text style={styles.ratingValue}>{ratingLabel}</Text>
                <Text style={styles.ratingCount}>({ratingCountLabel})</Text>
                {proposal.isVerified ? (
                  <View style={styles.verifiedRow}>
                    <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                    <Text style={styles.verifiedText}>Verificado</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.priceWrapper}>
            <Text style={styles.priceLabel}>{proposal.priceLabel}</Text>
            {proposal.estimatedTimeLabel ? (
              <Text style={styles.timeframeLabel}>{proposal.estimatedTimeLabel}</Text>
            ) : null}
            {proposal.submittedLabel ? (
              <Text style={styles.timeframeLabel}>Enviado {proposal.submittedLabel}</Text>
            ) : null}
          </View>
        </View>
      </View>

      {proposal.message ? (
        <View style={styles.messageCard}>
          <Text style={styles.messageLabel}>Mensaje</Text>
          <Text style={styles.messageText}>{proposal.message}</Text>
        </View>
      ) : null}

      <View style={styles.footerRow}>
        <View style={styles.scheduleRow}>
          <Ionicons name="calendar-outline" size={18} style={styles.scheduleIcon} />
          <Text style={styles.scheduleText} numberOfLines={1}>
            {proposal.arrivalLabel ?? 'Horario pendiente'}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => onPressDetail?.(proposal)}
          style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
        >
          <Text style={styles.ctaButtonText}>Ver detalle</Text>
        </Pressable>
      </View>
    </View>
  );
}
