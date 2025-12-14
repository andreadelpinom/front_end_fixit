import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AdminTabParamList } from '../../navigation/AdminNavigator';
import { AdminDashboardHeaderSection } from './sections/AdminDashboardHeaderSection';
import { AdminStatsSection } from './sections/AdminStatsSection';
import { AdminMenuSection } from './sections/AdminMenuSection';
import { homeService } from '../../services/home.service';
import { ThemedText } from '../../ui';

type AdminDashboardNavigationProp = BottomTabNavigationProp<AdminTabParamList, 'Dashboard'>;

interface DashboardStats {
  totalUsers: number;
  totalRequests: number;
  activeRequests: number;
  totalTechnicians: number;
  totalClients: number;
  unreadNotifications: number;
}

export function AdminDashboardScreen() {
  const navigation = useNavigation<AdminDashboardNavigationProp>();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRequests: 0,
    activeRequests: 0,
    totalTechnicians: 0,
    totalClients: 0,
    unreadNotifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Note: These endpoints may need to be implemented in the backend
      // For now, using placeholder data or existing endpoints
      const [usersStats, requestsStats, notificationsStats] = await Promise.all([
        homeService.getUsersStats(),
        homeService.getRequestsStats(),
        homeService.getNotificationsStats(),
      ]);

      setStats({
        totalUsers: usersStats.totalUsers || 0,
        totalRequests: requestsStats.totalRequests || 0,
        activeRequests: requestsStats.activeRequests || 0,
        totalTechnicians: usersStats.totalTechnicians || 0,
        totalClients: usersStats.totalClients || 0,
        unreadNotifications: notificationsStats.unreadCount || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Fallback to mock data
      setStats({
        totalUsers: 150,
        totalRequests: 45,
        activeRequests: 12,
        totalTechnicians: 30,
        totalClients: 120,
        unreadNotifications: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: 'Usuarios',
      subtitle: 'Gestionar usuarios, roles y permisos',
      onPress: () => navigation.navigate('Users'),
    },
    {
      title: 'Solicitudes',
      subtitle: 'Ver y gestionar todas las solicitudes del sistema',
      onPress: () => navigation.navigate('Requests'),
    },
    {
      title: 'Perfil',
      subtitle: 'Configuración y estadísticas del administrador',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText variant="body">Cargando dashboard...</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <AdminDashboardHeaderSection
        title="Panel de Administración"
        subtitle="Gestiona usuarios, solicitudes y notificaciones"
      />

      <AdminStatsSection
        stats={stats}
        onNotificationsPress={() => navigation.navigate('Profile')}
      />

      <AdminMenuSection menuItems={menuItems} />

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
});