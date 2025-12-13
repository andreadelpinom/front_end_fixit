import { StyleSheet } from 'react-native';
import { theme } from '../../../../theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: `${theme.colors.border}88`,
    shadowColor: '#00000012',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 2,
    gap: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  technicianInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: theme.spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.colors.primary}1A`,
  },
  avatarText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.md,
  },
  nameAndBadge: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  nameText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  roleText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  verifiedText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.success,
    fontWeight: theme.typography.weights.medium,
  },
  verifiedIcon: {
    marginRight: theme.spacing.xs,
  },
  priceWrapper: {
    alignItems: 'flex-end',
    minWidth: 120,
    gap: theme.spacing.xs,
  },
  priceLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  timeframeLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  ratingIcon: {
    color: theme.colors.warning,
  },
  ratingValue: {
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  ratingCount: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
  },
  messageCard: {
    backgroundColor: `${theme.colors.background}cc`,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: `${theme.colors.border}80`,
  },
  messageLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.4,
  },
  messageText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.normal,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  scheduleIcon: {
    color: theme.colors.text.muted,
  },
  scheduleText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
  },
  ctaButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  ctaButtonPressed: {
    opacity: 0.85,
  },
  ctaButtonText: {
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: -theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: `${theme.colors.surface}ee`,
  },
  statusText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: theme.colors.text.secondary,
  },
});
