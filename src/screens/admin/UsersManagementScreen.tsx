// src/screens/admin/UsersManagementScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  StyleSheet,
} from 'react-native';
import { adminService, UserManagement } from '../../services/admin.service';
import { LoadingView } from '../../components/common';
import { AdminStyles, getRoleBadgeColor } from '../../styles/AdminScreens.style';

export default function UsersManagementScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserManagement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'CLIENTE' | 'TECNICO'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const loadData = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'No se pudieron cargar usuarios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, filterRole, filterStatus, users]);

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (filterRole !== 'ALL') {
      filtered = filtered.filter(u => u.rol === filterRole);
    }

    // Filter by status
    if (filterStatus !== 'ALL') {
      const isActive = filterStatus === 'ACTIVE';
      filtered = filtered.filter(u => u.activo === isActive);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        u =>
          u.nombres.toLowerCase().includes(query) ||
          u.apellidos.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleToggleStatus = async (user: UserManagement) => {
    const action = user.activo ? 'desactivar' : 'activar';
    const actionCapitalized = action.charAt(0).toUpperCase() + action.slice(1);
    
    Alert.alert(
      `${actionCapitalized} Usuario`,
      `¿Deseas ${action} a ${user.nombres} ${user.apellidos}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: actionCapitalized,
          onPress: async () => {
            try {
              await adminService.updateUserStatus(user.idUser, !user.activo);
              await adminService.logAdminAction(
                `USER_STATUS_${user.activo ? 'DISABLED' : 'ENABLED'}`,
                `Usuario ${user.idUser} - ${user.email}`
              );
              Alert.alert('Éxito', `✅ Usuario ${action}do`);
              loadData();
            } catch (err: any) {
              Alert.alert('Error', err?.message || `No se pudo ${action} el usuario`);
            }
          },
        },
      ]
    );
  };

  const handleChangeRole = async (user: UserManagement) => {
    const roles = ['CLIENTE', 'TECNICO', 'ADMIN'].filter(r => r !== user.rol);
    
    Alert.alert(
      'Cambiar Rol',
      'Selecciona el nuevo rol:',
      roles.map(rol => ({
        text: rol,
        onPress: async () => {
          try {
            await adminService.updateUserRole(user.idUser, rol);
            await adminService.logAdminAction(
              'USER_ROLE_CHANGED',
              `Usuario ${user.idUser} - ${user.rol} → ${rol}`
            );
            Alert.alert('Éxito', `✅ Rol cambiado a ${rol}`);
            loadData();
          } catch (err: any) {
            Alert.alert('Error', err?.message || 'No se pudo cambiar el rol');
          }
        },
      }))
    );
  };

  const renderUser = ({ item }: { item: UserManagement }) => (
    <View style={styles.userRow}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {item.nombres} {item.apellidos}
        </Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={styles.userBadges}>
        <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(item.rol || 'CLIENTE') }]}>
          <Text style={styles.roleText}>{item.rol || 'CLIENTE'}</Text>
        </View>
        <View style={[styles.statusBadge, item.activo ? styles.statusActive : styles.statusInactive]}>
          <Text style={styles.statusText}>{item.activo ? 'Activo' : 'Inactivo'}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => showUserActions(item)}
      >
        <Text style={styles.menuText}>⋮</Text>
      </TouchableOpacity>
    </View>
  );

  const showUserActions = (user: UserManagement) => {
    Alert.alert(
      'Acciones',
      `¿Qué deseas hacer con ${user.nombres}?`,
      [
        { text: 'Ver detalle', onPress: () => showUserDetail(user) },
        { text: user.activo ? 'Desactivar' : 'Activar', onPress: () => handleToggleStatus(user) },
        { text: 'Cambiar rol', onPress: () => handleChangeRole(user) },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const showUserDetail = (user: UserManagement) => {
    Alert.alert(
      'Detalle del usuario',
      `Nombre: ${user.nombres} ${user.apellidos}\nEmail: ${user.email}\nTeléfono: ${user.telefono || 'No registrado'}\nRol: ${user.rol}\nEstado: ${user.activo ? 'Activo' : 'Inactivo'}\nRegistro: ${new Date(user.createdAt).toLocaleDateString()}`,
      [{ text: 'Cerrar' }]
    );
  };

  if (loading) return <LoadingView />;

  return (
    <View style={AdminStyles.container}>
      {/* Filtros + búsqueda */}
      <View style={AdminStyles.section}>
        <View style={styles.filtersRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[styles.filterBtn, filterRole === 'ALL' && styles.filterBtnActive]}
              onPress={() => setFilterRole('ALL')}
            >
              <Text style={[styles.filterBtnText, filterRole === 'ALL' && styles.filterBtnTextActive]}>
                Todos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterBtn, filterRole === 'CLIENTE' && styles.filterBtnActive]}
              onPress={() => setFilterRole('CLIENTE')}
            >
              <Text style={[styles.filterBtnText, filterRole === 'CLIENTE' && styles.filterBtnTextActive]}>
                Cliente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterBtn, filterRole === 'TECNICO' && styles.filterBtnActive]}
              onPress={() => setFilterRole('TECNICO')}
            >
              <Text style={[styles.filterBtnText, filterRole === 'TECNICO' && styles.filterBtnTextActive]}>
                Técnico
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statusButtons}>
            <TouchableOpacity
              style={[styles.filterBtn, filterStatus === 'ALL' && styles.filterBtnActive]}
              onPress={() => setFilterStatus('ALL')}
            >
              <Text style={[styles.filterBtnText, filterStatus === 'ALL' && styles.filterBtnTextActive]}>
                Todos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterBtn, filterStatus === 'ACTIVE' && styles.filterBtnActive]}
              onPress={() => setFilterStatus('ACTIVE')}
            >
              <Text style={[styles.filterBtnText, filterStatus === 'ACTIVE' && styles.filterBtnTextActive]}>
                Activo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterBtn, filterStatus === 'INACTIVE' && styles.filterBtnActive]}
              onPress={() => setFilterStatus('INACTIVE')}
            >
              <Text style={[styles.filterBtnText, filterStatus === 'INACTIVE' && styles.filterBtnTextActive]}>
                Inactivo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Lista de usuarios */}
      <View style={AdminStyles.section}>
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={item => item.idUser.toString()}
          contentContainerStyle={AdminStyles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={AdminStyles.emptyContainer}>
              <Text style={AdminStyles.emptyText}>No se encontraron usuarios</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersRow: {
    gap: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    backgroundColor: '#fff',
  },
  filterBtnActive: {
    backgroundColor: '#3498DB',
    borderColor: '#3498DB',
  },
  filterBtnText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  filterBtnTextActive: {
    color: '#fff',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  userEmail: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  userBadges: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#27AE60',
  },
  statusInactive: {
    backgroundColor: '#E74C3C',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
  },
  menuText: {
    fontSize: 20,
    color: '#7F8C8D',
  },
});
