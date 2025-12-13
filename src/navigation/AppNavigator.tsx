import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RolUsuario } from '../types/auth.types';
import { storageService } from '../services/storage.service';
import AuthNavigator from './AuthNavigator';
import ClientNavigator from './ClientNavigator';
import TechnicianNavigator from './TechnicianNavigator';
import AdminNavigator from './AdminNavigator';
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
          // Admin NO usa activeRole - siempre va directo a AdminNavigator
          if (user?.rol === 'ADMIN' || user?.roles?.includes('ADMIN')) {
            setLoading(false);
            return;
          }

          // Solo Cliente/Técnico usan activeRole para switch
          const role = await storageService.getActiveRole();
          setActiveRole(role);
        } catch (error) {
          console.error('Error loading active role:', error);
          // Por defecto, todos empiezan como CLIENTE
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

  // ==================== ADMIN: COMPLETAMENTE SEPARADO ====================
  // Admin NO puede hacer switch role - solo tiene acceso al panel admin
  // Si user.rol === 'ADMIN' o user.roles incluye 'ADMIN', SIEMPRE va al AdminNavigator (no importa activeRole)
  if (user?.rol === 'ADMIN' || user?.roles?.includes('ADMIN')) {
    return <AdminNavigator />;
  }

  // ==================== CLIENTE/TÉCNICO: PUEDEN HACER SWITCH ROLE ====================
  // Estos usuarios comparten el mismo login y pueden cambiar entre vistas
  
  // Técnico - verificar que el usuario tenga el rol TECNICO en su array de roles
  const hasTechnicianRole = user?.roles?.includes(RolUsuario.TECNICO);
  if (activeRole === 'TECNICO' && hasTechnicianRole) {
    return <TechnicianNavigator />;
  }

  // Cliente - navegador por defecto (todos los usuarios pueden ser clientes)
  return (
    <RequestProvider>
      <ClientNavigator />
    </RequestProvider>
  );
}
