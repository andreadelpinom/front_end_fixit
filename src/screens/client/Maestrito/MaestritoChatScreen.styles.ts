import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const maestritoChatStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  listWrapper: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  headerAction: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.sm,
  },
  headerActionPressed: {
    opacity: 0.7,
  },
  headerActionText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.families.medium,
    fontWeight: theme.typography.weights.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.sizes.sm,
    marginTop: theme.spacing.sm,
  },
  banner: {
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
  },
  errorBanner: {
    backgroundColor: theme.colors.error,
  },
  warningBanner: {
    backgroundColor: theme.colors.warning,
  },
  bannerText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.sm,
    marginBottom: theme.spacing.xs,
  },
  bannerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  bannerButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  bannerButtonPressed: {
    opacity: 0.9,
  },
  bannerButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.families.medium,
    fontWeight: theme.typography.weights.medium,
  },
  completionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  completionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.families.bold,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  completionDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  completionButton: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  completionButtonPressed: {
    opacity: 0.9,
  },
  completionButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.families.medium,
    fontWeight: theme.typography.weights.medium,
  },
  disabledInputNotice: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
});
