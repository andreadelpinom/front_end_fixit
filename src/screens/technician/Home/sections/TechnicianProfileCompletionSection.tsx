import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../../ui';

interface TechnicianProfileCompletionSectionProps {
  visible: boolean;
  onPress: () => void;
}

export const TechnicianProfileCompletionSection: React.FC<TechnicianProfileCompletionSectionProps> = ({
  visible,
  onPress,
}) => {
  if (!visible) return null;

  return (
    <ThemedView variant="info" style={styles.card}>
      <ThemedText variant="body" color="inverse" style={styles.title}>
        📋 Completa tu Perfil
      </ThemedText>
      <ThemedText variant="caption" color="inverse" style={styles.text}>
        Los clientes ven mejor tu perfil cuando está 100% completo
      </ThemedText>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <ThemedText variant="button" color="inverse" style={styles.buttonText}>
          Editar Perfil
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    lineHeight: 18,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});