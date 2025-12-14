import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface CancelServiceModalProps {
  visible: boolean;
  serviceTitle: string;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

export default function CancelServiceModal({
  visible,
  serviceTitle,
  onClose,
  onConfirm,
  isLoading = false,
}: CancelServiceModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setReason('');
      setError(null);
    }
  }, [visible]);

  const handleConfirm = async () => {
    // Validation
    if (!reason.trim()) {
      setError('Ingresa el motivo de cancelación');
      return;
    }

    if (reason.trim().length < 10) {
      setError('El motivo debe tener al menos 10 caracteres');
      return;
    }

    // Clear error
    setError(null);

    try {
      await onConfirm(reason.trim());
      // Close modal after successful cancellation
      onClose();
    } catch (err: any) {
      const errorMsg = err?.message || 'No se pudo cancelar el servicio';
      setError(errorMsg);
      console.error('[CancelServiceModal] Error:', err);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
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
              <Text style={styles.headerTitle}>Cancelar Servicio</Text>
              <TouchableOpacity
                onPress={handleClose}
                disabled={isLoading}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Service Title */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Servicio a Cancelar</Text>
              <Text style={styles.serviceTitleText} numberOfLines={2}>
                {serviceTitle}
              </Text>
            </View>

            {/* Reason Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Motivo de Cancelación *</Text>
              <TextInput
                style={styles.reasonInput}
                placeholder="Ej: Imprevisto personal, falta de materiales, etc."
                placeholderTextColor="#ccc"
                multiline={true}
                numberOfLines={4}
                value={reason}
                onChangeText={setReason}
                editable={!isLoading}
                maxLength={500}
              />
              <Text style={styles.charCounter}>{reason.length}/500</Text>
            </View>

            {/* Warning */}
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                ⚠️ Esta acción cancelará el servicio y notificará al cliente. La solicitud volverá a estar disponible para otros técnicos.
              </Text>
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
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Mantener Servicio</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.confirmButton,
                  isLoading && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={isLoading || !reason.trim()}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirmar Cancelación</Text>
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
  serviceTitleText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
    lineHeight: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#333',
    textAlignVertical: 'top',
    maxHeight: 100,
  },
  charCounter: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 3,
    borderLeftColor: '#FFC107',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '500',
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
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#ff3b30',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
});