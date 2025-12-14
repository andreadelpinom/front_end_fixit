import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import { WIZARD_COLORS } from './request-wizard/WizardShared';

const RegisterTechnicianScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Registrarse como Técnico</Text>
        <Text style={styles.description}>
          Pantalla de registro de técnico (por implementar)
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WIZARD_COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: WIZARD_COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: WIZARD_COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default RegisterTechnicianScreen;
