import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { ThemedText, ThemedView } from '../../ui';
import { AdminProfileInfoSection } from './sections/AdminProfileInfoSection';
import { AdminProfileStatsSection } from './sections/AdminProfileStatsSection';
import { AdminProfileActionsSection } from './sections/AdminProfileActionsSection';
import { homeService } from '../../services/home.service';

interface AdminProfile {
  idUser: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  roles: string[];
  estado: string;
  createdAt: string;
  lastLogin?: string;
  totalActions?: number;
}

export function AdminProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    activeRequests: 0,
  });

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  const loadProfile = async () => {
    try {
      if (!user?.idUser) return;
      // Use user data from AuthContext
      setProfile({
        idUser: user.idUser,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono,
        roles: user.roles.map(role => role.toString()),
        estado: 'ACTIVO',
        createdAt: user.createdAt,
        lastLogin: new Date().toISOString(),
        totalActions: 0,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to user data
      setProfile({
        idUser: user?.idUser || 0,
        nombres: user?.nombres || '',
        apellidos: user?.apellidos || '',
        email: user?.email || '',
        telefono: user?.telefono || '',
        roles: user?.roles?.map(role => role.toString()) || ['ADMIN'],
        estado: 'ACTIVO',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        totalActions: 0,
      });
    }
  };

  const loadStats = async () => {
    try {
      // Use admin stats endpoints
      const [usersStats, requestsStats] = await Promise.all([
        homeService.getUsersStats(),
        homeService.getRequestsStats(),
      ]);
      setStats({
        totalUsers: usersStats.totalUsers || 0,
        totalRequests: requestsStats.totalRequests || 0,
        activeRequests: requestsStats.activeRequests || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({ totalUsers: 0, totalRequests: 0, activeRequests: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText variant="body">Cargando perfil...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView variant="surface" style={styles.header}>
        <ThemedText variant="h2" style={styles.title}>Mi Perfil Admin</ThemedText>
        <ThemedText variant="body" color="muted">Información y estadísticas de administración</ThemedText>
      </ThemedView>

      <AdminProfileInfoSection profile={profile} />
      <AdminProfileStatsSection stats={stats} />
      <AdminProfileActionsSection actions={[
        { title: 'Editar Perfil', onPress: () => console.log('Editar perfil') },
        { title: 'Cambiar Contraseña', onPress: () => console.log('Cambiar contraseña') },
        { title: 'Cerrar Sesión', onPress: () => console.log('Cerrar sesión'), style: 'danger' }
      ]} />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    margin: 12,
    borderRadius: 12,
  },
  title: {
    marginBottom: 8,
  },
});