import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '../../../../ui';

interface TechnicianPrimaryActionSectionProps {
  cta: {
    text: string;
    action: () => void;
  };
}

export const TechnicianPrimaryActionSection: React.FC<TechnicianPrimaryActionSectionProps> = ({
  cta,
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={cta.action}>
      <ThemedText variant="button" color="inverse" style={styles.text}>
        {cta.text}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});