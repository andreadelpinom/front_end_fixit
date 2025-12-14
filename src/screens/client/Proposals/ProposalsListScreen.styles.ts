import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const proposalsListStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  loaderText: {
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  errorBanner: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.md,
    backgroundColor: `${theme.colors.error}14`,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: `${theme.colors.error}33`,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    fontWeight: theme.typography.weights.medium,
    fontSize: theme.typography.sizes.sm,
  },
  refreshControl: {
    tintColor: theme.colors.primary,
  },
});
