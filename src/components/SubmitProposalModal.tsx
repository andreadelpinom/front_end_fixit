import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface SubmitProposalModalProps {
  visible: boolean;
  requestTitle: string;
  onClose: () => void;
  onSubmit: (cost: number, notes?: string) => Promise<void>;
  isLoading?: boolean;
}

export default function SubmitProposalModal({
  visible,
  requestTitle,
  onClose,
  onSubmit,
  isLoading = false,
}: SubmitProposalModalProps) {
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setCost('');
      setNotes('');
      setError(null);
    }
  }, [visible]);

  const handleSubmit = async () => {
    // Validation
    const costNum = parseFloat(cost);

    if (!cost.trim()) {
      setError('Ingresa un costo propuesto');
      return;
    }

    if (isNaN(costNum) || costNum <= 0) {
      setError('El costo debe ser un número mayor a 0');
      return;
    }

    if (costNum > 999999) {
      setError('El costo no puede exceder $999,999');
      return;
    }

    // Clear error
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit(costNum, notes.trim() || undefined);
      // Close modal after successful submission
      onClose();
    } catch (err: any) {
      const errorMsg = err?.message || 'No se pudo enviar la propuesta';
      setError(errorMsg);
      console.error('[SubmitProposalModal] Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Enviar Propuesta</Text>
              <TouchableOpacity
                onPress={handleClose}
                disabled={submitting}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Request Title */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Solicitud</Text>
              <Text style={styles.requestTitleText} numberOfLines={2}>
                {requestTitle}
              </Text>
            </View>

            {/* Cost Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Costo Propuesto *</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.costInput}
                  placeholder="0.00"
                  placeholderTextColor="#ccc"
                  keyboardType="decimal-pad"
                  value={cost}
                  onChangeText={setCost}
                  editable={!submitting}
                  maxLength={10}
                />
              </View>
            </View>

            {/* Notes Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Comentarios (Opcional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Ej: Puedo hacerlo en 2 días, incluye servicio X..."
                placeholderTextColor="#ccc"
                multiline={true}
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
                editable={!submitting}
                maxLength={200}
              />
              <Text style={styles.charCounter}>{notes.length}/200</Text>
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.submitButton,
                  (submitting || !cost.trim()) && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={submitting || !cost.trim()}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Enviar Propuesta</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  section: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  requestTitleText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
    lineHeight: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  costInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#333',
    textAlignVertical: 'top',
    maxHeight: 80,
  },
  charCounter: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  errorContainer: {
    backgroundColor: '#FEE',
    borderLeftWidth: 3,
    borderLeftColor: '#d32f2f',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#d32f2f',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
