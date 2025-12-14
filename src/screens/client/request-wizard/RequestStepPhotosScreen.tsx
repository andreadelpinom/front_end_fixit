import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRequestDraft } from '../../../context/RequestContext';
import {
  WizardHeader,
  ProgressBar,
  BottomButtons,
  showCancelAlert,
  WIZARD_COLORS,
} from './WizardShared';

const STEP = 3;
const TOTAL_STEPS = 5;

export default function RequestStepPhotosScreen({ navigation }: any): React.ReactElement {
  const { resetDraft } = useRequestDraft();

  // Handle cancel
  const handleCancel = useCallback(() => {
    showCancelAlert(() => {
      resetDraft();
      navigation.reset({
        index: 0,
        routes: [{ name: 'ClientRequests' }],
      });
    });
  }, [navigation, resetDraft]);

  // Handle next (skip for now - photos are optional)
  const handleNext = useCallback(() => {
    navigation.navigate('RequestStepAddress');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <WizardHeader step={STEP} total={TOTAL_STEPS} onCancel={handleCancel} />
      <ProgressBar step={STEP} total={TOTAL_STEPS} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.title}>Fotos del problema</Text>
          <Text style={styles.subtitle}>
            Adjunta fotos para ayudar al técnico a entender mejor el problema
          </Text>
        </View>

        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={styles.placeholderText}>
            Las fotos están disponibles próximamente
          </Text>
          <Text style={styles.placeholderSubtext}>
            Por ahora puedes continuar sin fotos
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ✓ Este paso es opcional
          </Text>
          <Text style={styles.infoText}>
            ✓ Puedes continuar sin agregar fotos
          </Text>
        </View>
      </ScrollView>

      <BottomButtons
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WIZARD_COLORS.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: WIZARD_COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: WIZARD_COLORS.textSecondary,
    lineHeight: 20,
  },
  placeholderBox: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: WIZARD_COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: WIZARD_COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: WIZARD_COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 13,
    color: WIZARD_COLORS.textSecondary,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: WIZARD_COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 18,
    marginBottom: 4,
  },
});
