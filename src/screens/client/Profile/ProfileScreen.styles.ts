import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const profileStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  loaderMessage: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  errorBanner: {
    borderRadius: 12,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
    backgroundColor: '#FFE9E9',
  },
  errorText: {
    textAlign: 'center',
  },
  errorBannerText: {
    textAlign: 'center',
    color: theme.colors.error,
  },
});
