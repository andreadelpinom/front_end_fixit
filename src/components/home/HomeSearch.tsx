import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { WIZARD_COLORS } from '../../screens/client/request-wizard/WizardShared';

const HomeSearch: React.FC = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar servicios..."
        placeholderTextColor={WIZARD_COLORS.textLight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: WIZARD_COLORS.white,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: WIZARD_COLORS.text,
    borderWidth: 1,
    borderColor: WIZARD_COLORS.border,
  },
});

export default HomeSearch;
