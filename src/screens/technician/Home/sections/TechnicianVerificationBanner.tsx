import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../../ui';
import { theme } from '../../../../theme';

interface TechnicianVerificationBannerProps {
  visible: boolean;
}

export const TechnicianVerificationBanner: React.FC<TechnicianVerificationBannerProps> = ({
  visible,
}) => {
  if (!visible) return null;

  return (
    <ThemedView variant="surface" style={[styles.banner, { backgroundColor: theme.colors.warning }]}>
      <Text style={styles.icon}>⚠️</Text>
      <View style={styles.content}>
        <ThemedText variant="body" color="inverse" style={styles.title}>
          Cuenta no verificada
        </ThemedText>
        <ThemedText variant="caption" color="inverse" style={styles.text}>
          Completa tu verificación para mejorar tu visibilidad
        </ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderLeftColor: '#FF9800',
    borderLeftWidth: 4,
    padding: 12,
    margin: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  text: {
    marginTop: 4,
  },
});