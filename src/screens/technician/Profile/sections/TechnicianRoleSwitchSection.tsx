import React, { useState } from 'react';
import { TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText, ThemedView } from '../../../../ui';
import { useAuth } from '../../../../context/AuthContext';

export const TechnicianRoleSwitchSection: React.FC = () => {
  const { switchRole, isLoading } = useAuth();
  const [switchingRole, setSwitchingRole] = useState(false);

  const handleSwitchToClient = async () => {
    Alert.alert(
      '¿Ver Vista de Cliente?',
      'Cambiarás a tu perfil de cliente. Podrás volver a la vista de técnico en cualquier momento desde tu perfil de cliente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, ver vista cliente',
          style: 'default',
          onPress: async () => {
            try {
              setSwitchingRole(true);
              await switchRole('CLIENTE');
            } catch (error) {
              Alert.alert(
                'Error',
                'No se pudo cambiar la vista. Intenta de nuevo.',
              );
              setSwitchingRole(false);
            }
          },
        },
      ],
    );
  };

  return (
    <ThemedView variant="surface" style={styles.section}>
      <ThemedText variant="h3" style={styles.title}>
        👤 Ver Perfil de Cliente
      </ThemedText>
      <ThemedText variant="body" color="muted" style={styles.description}>
        Cambia a tu vista de cliente para solicitar servicios, ver tu historial y gestionar tus solicitudes.
      </ThemedText>
      <TouchableOpacity
        style={[
          styles.button,
          (switchingRole || isLoading) && styles.buttonDisabled,
        ]}
        onPress={handleSwitchToClient}
        disabled={switchingRole || isLoading}
        activeOpacity={0.7}
      >
        {switchingRole ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <ThemedText variant="button" color="inverse" style={styles.buttonText}>
            Cambiar a Vista de Cliente
          </ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: '600',
  },
});