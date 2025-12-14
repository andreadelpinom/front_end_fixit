import { StyleSheet } from 'react-native';
import { theme } from '../../../../theme';

export const servicesTabsStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabPressed: {
    opacity: 0.85,
  },
  tabPressedActive: {
    opacity: 0.9,
  },
  label: {
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
  },
  labelActive: {
    color: theme.colors.text.inverse,
  },
  countBadge: {
    marginTop: theme.spacing.xs / 2,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  countBadgeActive: {
    backgroundColor: theme.colors.primaryDark,
  },
  countText: {
    fontSize: 12,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
  },
  countTextActive: {
    color: theme.colors.text.inverse,
  },
});
