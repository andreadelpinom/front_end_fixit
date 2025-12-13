import { StyleSheet } from 'react-native';
import { theme } from '../../../../theme';

export const activityListStyles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  listContentEmpty: {
    justifyContent: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  cardPressed: {
    opacity: 0.96,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  title: {
    flex: 1,
    marginRight: theme.spacing.sm,
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  statusBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.lg,
  },
  statusText: {
    color: theme.colors.text.inverse,
    fontSize: 12,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.normal,
    marginBottom: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metaItemGrow: {
    flex: 1,
  },
  metaText: {
    fontSize: 13,
    color: theme.colors.text.muted,
    flexShrink: 1,
  },
});
