import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WIZARD_COLORS } from '../../screens/client/request-wizard/WizardShared';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
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

export default SectionTitle;
