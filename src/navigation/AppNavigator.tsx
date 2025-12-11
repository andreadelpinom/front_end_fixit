import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storage.service';
import AuthNavigator from './AuthNavigator';
import ClientNavigator from './ClientNavigator';
import TechnicianNavigator from './TechnicianNavigator';
import { RequestProvider } from '../context/RequestContext';
import { ActivityIndicator, View } from 'react-native';

export default function AppNavigator() {
  const { isAuthenticated, user } = useAuth();
  const [activeRole, setActiveRole] = useState<'CLIENTE' | 'TECNICO' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActiveRole = async () => {
      if (isAuthenticated && user) {
        try {
          const role = await storageService.getActiveRole();
          setActiveRole(role);
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Verificar que el usuario tenga el rol TECNICO en su array de roles
  const hasTechnicianRole = user?.roles?.includes('TECNICO');

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
