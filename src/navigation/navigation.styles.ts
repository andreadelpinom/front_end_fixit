import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const navigationStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    height: 60,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  },
  header: {
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    color: theme.colors.text.inverse,
    fontFamily: theme.typography.families.bold,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.lg,
  },
});
