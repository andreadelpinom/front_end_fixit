import React from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';

// ============================================================================
// COLORS & THEME
// ============================================================================
export const WIZARD_COLORS = {
  primary: '#2196F3',
  primaryDark: '#1976D2',
  white: '#FFFFFF',
  background: '#F5F5F5',
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#BDBDBD',
  border: '#E0E0E0',
  error: '#F44336',
  success: '#4CAF50',
};

// ============================================================================
// WIZARD HEADER COMPONENT
// ============================================================================
export interface WizardHeaderProps {
  step: number;
  total: number;
  onCancel: () => void;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({
  step,
  total,
  onCancel,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Programa la solicitud</Text>
        <Text style={styles.progressLabel}>Paso {step} de {total}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.cancelButton,
          pressed && styles.cancelButtonPressed,
        ]}
        onPress={onCancel}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </Pressable>
    </View>
  );
};

// ============================================================================
// PROGRESS BAR COMPONENT
// ============================================================================
export interface ProgressBarProps {
  step: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ step, total }) => {
  const percentage = (step / total) * 100;
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
};

// ============================================================================
// BOTTOM BUTTONS COMPONENT
// ============================================================================
export interface BottomButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
}

export const BottomButtons: React.FC<BottomButtonsProps> = ({
  onPrevious,
  onNext,
  nextLabel = 'Siguiente',
  nextDisabled = false,
  nextLoading = false,
}) => {
  return (
    <View style={styles.bottomButtons}>
      <Pressable
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={onPrevious}
      >
        <Text style={styles.secondaryButtonText}>Anterior</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          nextDisabled && styles.primaryButtonDisabled,
          pressed && !nextDisabled && styles.buttonPressed,
        ]}
        onPress={onNext}
        disabled={nextDisabled || nextLoading}
      >
        <Text style={styles.primaryButtonText}>
          {nextLoading ? '...' : nextLabel}
        </Text>
      </Pressable>
    </View>
  );
};

// ============================================================================
// CANCEL HANDLER
// ============================================================================
export const showCancelAlert = (
  onConfirm: () => void,
) => {
  Alert.alert(
    '¿Cancelar solicitud?',
    '¿Estás seguro que deseas cancelar? Se descartará el borrador.',
    [
      {
        text: 'Seguir creando',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Sí, cancelar',
        onPress: onConfirm,
        style: 'destructive',
      },
    ]
  );
};

// ============================================================================
// VALIDATION ALERT HELPER
// ============================================================================
export const showValidationAlert = (message: string) => {
  Alert.alert('Validación', message);
};

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WIZARD_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: WIZARD_COLORS.border,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WIZARD_COLORS.text,
  },
  progressLabel: {
    fontSize: 12,
    color: WIZARD_COLORS.textSecondary,
    marginTop: 4,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonPressed: {
    opacity: 0.7,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: WIZARD_COLORS.error,
  },

  // Progress Bar
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: WIZARD_COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: WIZARD_COLORS.success,
  },

  // Bottom Buttons
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WIZARD_COLORS.white,
    borderTopWidth: 1,
    borderTopColor: WIZARD_COLORS.border,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: WIZARD_COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: WIZARD_COLORS.textLight,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: WIZARD_COLORS.white,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: WIZARD_COLORS.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: WIZARD_COLORS.text,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
