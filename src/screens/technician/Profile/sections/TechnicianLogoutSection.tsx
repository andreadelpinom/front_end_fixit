import React from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../../ui';
import { useAuth } from '../../../../context/AuthContext';

export const TechnicianLogoutSection: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <ThemedView variant="surface" style={styles.section}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText variant="button" color="error" style={styles.logoutText}>
          🚪 Cerrar Sesión
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  section: {
    margin: 12,
    borderRadius: 12,
    padding: 16,
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    fontWeight: '600',
  },
});