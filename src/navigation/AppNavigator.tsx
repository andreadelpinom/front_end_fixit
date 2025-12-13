import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storage.service';
import AuthNavigator from './AuthNavigator';
import ClientNavigator from './ClientNavigator';
import TechnicianNavigator from './TechnicianNavigator';
import { RequestProvider } from '../context/RequestContext';
import { ActivityIndicator } from 'react-native';
import { appNavigatorStyles } from './AppNavigator.styles';
import { theme } from '../theme';
import { ThemedView } from '../ui';

// ✅ Crear un listener externo para cambios de activeRole
// Esto permite que AppNavigator reaccione sin necesitar cambios en user
let roleChangeListeners: Set<(role: 'CLIENTE' | 'TECNICO') => void> = new Set();

export const notifyRoleChange = (role: 'CLIENTE' | 'TECNICO') => {
  roleChangeListeners.forEach(listener => listener(role));
};

export default function AppNavigator() {
  const { isAuthenticated, user, isRoleSelectionNeeded } = useAuth();
  const [activeRole, setActiveRole] = useState<'CLIENTE' | 'TECNICO' | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Escuchar cambios de rol desde switchRole
  useEffect(() => {
    const listener = (role: 'CLIENTE' | 'TECNICO') => {
      setActiveRole(role);
      console.log('[AppNavigator] Role changed to:', role);
    };
    
    roleChangeListeners.add(listener);
    return () => {
      roleChangeListeners.delete(listener);
    };
  }, []);

  // ✅ Cargar rol inicial cuando auth cambia
  useEffect(() => {
    const loadActiveRole = async () => {
      if (isAuthenticated && user) {
        try {
          const role = await storageService.getActiveRole();
          setActiveRole(role);
          console.log('[AppNavigator] Loaded initial active role:', role);
        } catch (error) {
          console.error('Error loading active role:', error);
          setActiveRole('CLIENTE');
        }
      }
      setLoading(false);
    };

    loadActiveRole();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Si estamos en el flujo de selección de rol, no mostrar navegador
  // El modal se muestra en LoginScreen
  if (isRoleSelectionNeeded) {
    return <AuthNavigator />;
  }

  if (loading) {
    return (
      <ThemedView style={appNavigatorStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </ThemedView>
    );
  }

  // Verificar que el usuario tenga el rol TECNICO en su array de roles
  const hasTechnicianRole = user?.roles?.includes('TECNICO' as any);

  // Si el rol activo es TECNICO y el usuario tiene ese rol, mostrar TechnicianNavigator
  if (activeRole === 'TECNICO' && hasTechnicianRole) {
    return <TechnicianNavigator />;
  }

  // Default to client navigator
  return (
    <RequestProvider>
      <ClientNavigator />
    </RequestProvider>
  );
}
