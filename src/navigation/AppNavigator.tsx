import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import ClientNavigator from './ClientNavigator';
import TechnicianNavigator from './TechnicianNavigator';

export default function AppNavigator() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  const role = user?.rol;

  if (role === 'TECNICO') {
    return <TechnicianNavigator />;
  }

  // Default to client navigator for CLIENTE and any other roles
  return <ClientNavigator />;
}
