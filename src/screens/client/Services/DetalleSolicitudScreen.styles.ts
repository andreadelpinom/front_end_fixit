import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const detalleSolicitudStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeights.relaxed,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  statusText: {
    fontSize: 13,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadgeWaiting: {
    backgroundColor: 'rgba(255,149,0,0.12)',
  },
  statusTextWaiting: {
    color: theme.colors.warning,
  },
  statusBadgeProposals: {
    backgroundColor: 'rgba(52,199,89,0.12)',
  },
  statusTextProposals: {
    color: theme.colors.success,
  },
  statusBadgeAssigned: {
    backgroundColor: 'rgba(90,200,250,0.12)',
  },
  statusTextAssigned: {
    color: theme.colors.info,
  },
  statusBadgeCompleted: {
    backgroundColor: 'rgba(52,199,89,0.12)',
  },
  statusTextCompleted: {
    color: theme.colors.success,
  },
  statusBadgeCancelled: {
    backgroundColor: 'rgba(255,59,48,0.12)',
  },
  statusTextCancelled: {
    color: theme.colors.error,
  },
  statusBadgeDefault: {
    backgroundColor: theme.colors.divider,
  },
  statusTextDefault: {
    color: theme.colors.text.primary,
  },
  section: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sectionContent: {
    fontSize: 16,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeights.normal,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  infoCard: {
    flexGrow: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: 13,
    color: theme.colors.text.muted,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  buttonsContainer: {
    gap: theme.spacing.sm,
  },
  buttonBase: {
    borderRadius: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  primaryButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: theme.typography.weights.medium,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.background,
  },
  secondaryButtonText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: theme.typography.weights.medium,
  },
  ghostButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  ghostButtonText: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: theme.typography.weights.medium,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  errorBanner: {
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255,59,48,0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,59,48,0.2)',
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
  },
  loaderText: {
    color: theme.colors.text.muted,
    fontSize: 16,
  },
  emptyValue: {
    color: theme.colors.text.muted,
  },
});
