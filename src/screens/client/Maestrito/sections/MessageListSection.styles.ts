import { StyleSheet } from 'react-native';
import { theme } from '../../../../theme';

export const messageListStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: theme.spacing.md,
  },
  messageRow: {
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  bubbleUser: {
    backgroundColor: theme.colors.primary,
  },
  bubbleAssistant: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bubbleSuccess: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  messageText: {
    fontSize: theme.typography.sizes.md,
  },
  messageTextUser: {
    color: theme.colors.text.inverse,
  },
  messageTextAssistant: {
    color: theme.colors.text.primary,
  },
  messageTextSuccess: {
    color: theme.colors.text.inverse,
  },
  missingFieldsText: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
  },
  typingContainer: {
    paddingVertical: theme.spacing.xs,
  },
  typingText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
  },
  typingSpacer: {
    height: theme.spacing.sm,
  },
});
