import { StyleSheet } from 'react-native';
import { theme } from '../../../../theme';

export const styles = StyleSheet.create({
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.lg,
  },
  statusText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  titleBlock: {
    gap: theme.spacing.xs,
  },
  serviceText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  placeholder: {
    gap: theme.spacing.sm,
  },
  placeholderLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: `${theme.colors.border}55`,
  },
});
