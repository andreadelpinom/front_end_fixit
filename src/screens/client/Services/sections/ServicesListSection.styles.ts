import { StyleSheet } from 'react-native';
import { theme } from '../../../../theme';

export const servicesListStyles = StyleSheet.create({
  listContent: {
    paddingBottom: theme.spacing.xxl * 2,
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    shadowColor: '#00000010',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    gap: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.lg,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.inverse,
    textTransform: 'capitalize',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  serviceLabel: {
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.normal,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  cardPressed: {
    opacity: 0.9,
  },
});
