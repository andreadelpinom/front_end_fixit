import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

interface RoleSelectionModalProps {
  visible: boolean;
  loading: boolean;
  onSelectRole: (role: 'CLIENTE' | 'TECNICO') => void;
  userName?: string;
}

/**
 * Modal para seleccionar rol cuando el usuario tiene múltiples roles
 * Estilo Uber: "¿Cómo quieres ingresar hoy?"
 */
export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  visible,
  loading,
  onSelectRole,
  userName = 'Usuario',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}} // No permitir cerrar sin seleccionar
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.greeting}>¡Bienvenido!</Text>
              <Text style={styles.subtitle}>{userName}</Text>
            </View>

            {/* Pregunta principal */}
            <Text style={styles.question}>¿Cómo quieres ingresar hoy?</Text>

            {/* Botones de rol */}
            <View style={styles.buttonContainer}>
              {/* Cliente Button */}
              <TouchableOpacity
                style={[styles.roleButton, styles.clienteButton]}
                onPress={() => !loading && onSelectRole('CLIENTE')}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.roleEmoji}>👤</Text>
                    <Text style={styles.roleButtonText}>Como Cliente</Text>
                    <Text style={styles.roleDescription}>
                      Solicitar servicios
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Tecnico Button */}
              <TouchableOpacity
                style={[styles.roleButton, styles.tecnicoButton]}
                onPress={() => !loading && onSelectRole('TECNICO')}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.roleEmoji}>🔧</Text>
                    <Text style={styles.roleButtonText}>Como Técnico</Text>
                    <Text style={styles.roleDescription}>
                      Ofertar servicios
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Info note */}
            <Text style={styles.infoNote}>
              Puedes cambiar de rol en cualquier momento desde tu perfil.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  roleButton: {
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  clienteButton: {
    backgroundColor: '#2196F3',
  },
  tecnicoButton: {
    backgroundColor: '#FF9800',
  },
  roleEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  infoNote: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
