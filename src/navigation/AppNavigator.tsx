import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import ClientNavigator from './ClientNavigator';
import TechnicianNavigator from './TechnicianNavigator';
import { RequestProvider } from '../context/RequestContext';

export default function AppNavigator() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Verificar si el usuario tiene el rol TECNICO en su array de roles
  const hasTechnicianRole = user?.roles?.includes('TECNICO');

  if (hasTechnicianRole) {
    return <TechnicianNavigator />;
  }

  // Default to client navigator for CLIENTE and any other roles
  return (
    <RequestProvider>
      <ClientNavigator />
    </RequestProvider>
  );
}
