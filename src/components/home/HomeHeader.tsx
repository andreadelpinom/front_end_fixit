import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WIZARD_COLORS } from '../../screens/client/request-wizard/WizardShared';
import SectionTitle from './SectionTitle';

const HomeHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>¡Hola! 👋</Text>
      <Text style={styles.subtitle}>¿Qué necesitas reparar hoy?</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: WIZARD_COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: WIZARD_COLORS.textSecondary,
    fontWeight: '400',
  },
});

export default HomeHeader;
