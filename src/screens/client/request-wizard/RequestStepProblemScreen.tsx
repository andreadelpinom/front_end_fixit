import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
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
  showValidationAlert,
  WIZARD_COLORS,
} from './WizardShared';

const STEP = 2;
const TOTAL_STEPS = 5;
const MIN_TOTAL_LENGTH = 20;

export default function RequestStepProblemScreen({ navigation }: any): React.ReactElement {
  const { draft, updateDraft, resetDraft } = useRequestDraft();
  const [titulo, setTitulo] = useState(draft.tituloProblema ?? '');
  const [descripcion, setDescripcion] = useState(draft.descripcionProblema ?? '');

  // Validate current state
  const isValid =
    titulo.trim().length > 0 &&
    (titulo.trim().length + descripcion.trim().length) >= MIN_TOTAL_LENGTH;

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

  // Handle next
  const handleNext = useCallback(() => {
    if (!isValid) {
      showValidationAlert(
        `El título y descripción deben sumar al menos ${MIN_TOTAL_LENGTH} caracteres.`
      );
      return;
    }
    // Update draft before navigating
    updateDraft({
      tituloProblema: titulo.trim(),
      descripcionProblema: descripcion.trim(),
    });
    navigation.navigate('RequestStepSchedule');
  }, [isValid, titulo, descripcion, updateDraft, navigation]);

  // Handle previous
  const handlePrevious = useCallback(() => {
    // Save current state before going back
    updateDraft({
      tituloProblema: titulo.trim(),
      descripcionProblema: descripcion.trim(),
    });
    navigation.goBack();
  }, [titulo, descripcion, updateDraft, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <WizardHeader step={STEP} total={TOTAL_STEPS} onCancel={handleCancel} />
      <ProgressBar step={STEP} total={TOTAL_STEPS} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.title}>Describe el problema</Text>
          <Text style={styles.subtitle}>
            Proporciona detalles claros para que el técnico entienda qué necesita repararse
          </Text>
        </View>

        {/* Title input */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Título del problema *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Fugas en la cocina"
            placeholderTextColor={WIZARD_COLORS.textLight}
            value={titulo}
            onChangeText={setTitulo}
            maxLength={100}
          />
          <Text style={styles.charCount}>
            {titulo.length}/100
          </Text>
        </View>

        {/* Description input */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Descripción detallada *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe el problema con más detalle..."
            placeholderTextColor={WIZARD_COLORS.textLight}
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            maxLength={500}
          />
          <Text style={styles.charCount}>
            {descripcion.length}/500
          </Text>
        </View>

        {/* Validation info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {`✓ Mínimo ${MIN_TOTAL_LENGTH} caracteres en total (título + descripción)`}
          </Text>
          <Text style={styles.infoCounter}>
            {titulo.trim().length + descripcion.trim().length}/{MIN_TOTAL_LENGTH}
          </Text>
        </View>
      </ScrollView>

      <BottomButtons
        onPrevious={handlePrevious}
        onNext={handleNext}
        nextDisabled={!isValid}
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
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: WIZARD_COLORS.text,
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: WIZARD_COLORS.border,
    borderRadius: 8,
    backgroundColor: WIZARD_COLORS.white,
    fontSize: 14,
    color: WIZARD_COLORS.text,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: WIZARD_COLORS.textLight,
    marginTop: 6,
    textAlign: 'right',
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: WIZARD_COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 18,
    marginBottom: 6,
  },
  infoCounter: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
});
