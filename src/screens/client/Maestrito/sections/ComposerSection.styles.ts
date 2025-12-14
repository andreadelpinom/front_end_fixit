import { StyleSheet } from 'react-native';
import { theme } from '../../../../theme';

export const composerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: theme.spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
  },
  inputDisabled: {
    backgroundColor: theme.colors.surface,
    opacity: 0.6,
  },
  sendButton: {
    height: 44,
    minWidth: 96,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  sendButtonPressed: {
    opacity: 0.9,
  },
  sendButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.families.medium,
    fontWeight: theme.typography.weights.medium,
  },
  indicator: {
    transform: [{ scale: 0.9 }],
  },
});
