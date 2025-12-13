import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const appNavigatorStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
