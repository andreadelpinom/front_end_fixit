import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { ThemedText, ThemedView } from '../../ui';
import { AdminUserListSection } from './sections/AdminUserListSection';
import { homeService } from '../../services/home.service';

interface User {
  idUser: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  roles: string[];
  estado: string;
  createdAt: string;
}

export function AdminUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Get all users for admin
      const users = await homeService.getAllUsers();
      setUsers(users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
      // Fallback data
      setUsers([
        {
          idUser: 1,
          nombres: 'Juan',
          apellidos: 'Pérez',
          email: 'juan@example.com',
          telefono: '099123456',
          roles: ['CLIENTE'],
          estado: 'ACTIVO',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView variant="surface" style={styles.header}>
        <ThemedText variant="h2" style={styles.title}>Gestión de Usuarios</ThemedText>
        <ThemedText variant="body" color="muted">
          Total de usuarios: {users.length}
        </ThemedText>
      </ThemedView>

      <AdminUserListSection
        users={users}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    margin: 12,
    borderRadius: 12,
  },
  title: {
    marginBottom: 8,
  },
});