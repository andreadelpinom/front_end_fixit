import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WIZARD_COLORS } from '../../screens/client/request-wizard/WizardShared';
import SectionTitle from './SectionTitle';

const UrgentBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <SectionTitle title="¿Emergencia?" subtitle="Conecta con técnicos disponibles ahora" />
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>🚨 Servicio de Emergencia</Text>
        <Text style={styles.bannerDescription}>
          Obtén respuesta en menos de 30 minutos
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  banner: {
    backgroundColor: WIZARD_COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: WIZARD_COLORS.white,
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 13,
    color: WIZARD_COLORS.white,
    fontWeight: '400',
    lineHeight: 18,
  },
});

export default UrgentBanner;
