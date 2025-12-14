import { StyleSheet } from 'react-native';
import { theme } from '../../../../theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${theme.colors.primary}14`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  description: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontSize: theme.typography.sizes.sm,
    lineHeight: theme.typography.lineHeights.normal,
  },
  errorText: {
    color: theme.colors.error,
  },
  refreshButton: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  refreshButtonPressed: {
    opacity: 0.9,
  },
  refreshButtonText: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.weights.medium,
  },
});
