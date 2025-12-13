import { StyleSheet } from 'react-native';
import { theme } from '../../../../theme';

export const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  greetingRow: {
    gap: theme.spacing.xs,
  },
  greetingText: {
    color: theme.colors.text.primary,
  },
  wave: {
    color: theme.colors.text.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  locationTextContainer: {
    flexDirection: 'column',
  },
  locationMainText: {
    fontWeight: theme.typography.weights.medium,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  searchIcon: {
    marginRight: theme.spacing.xs,
  },
});
