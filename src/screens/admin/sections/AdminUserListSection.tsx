import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../ui';
import { theme } from '../../../theme';

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

interface AdminUserListSectionProps {
  users: User[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export const AdminUserListSection: React.FC<AdminUserListSectionProps> = ({
  users,
  loading,
  refreshing,
  onRefresh,
}) => {
  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.userCard}>
      <View style={styles.userHeader}>
        <ThemedText variant="h3" style={styles.userName}>
          {item.nombres} {item.apellidos}
        </ThemedText>
        <View style={[styles.statusBadge, item.estado === 'ACTIVO' ? styles.activeBadge : styles.inactiveBadge]}>
          <ThemedText variant="caption" style={styles.statusText}>
            {item.estado}
          </ThemedText>
        </View>
      </View>
      <ThemedText variant="body" style={styles.userEmail}>
        {item.email}
      </ThemedText>
      <View style={styles.userDetails}>
        <ThemedText variant="caption" color="muted">
          Teléfono: {item.telefono || 'No registrado'}
        </ThemedText>
        <ThemedText variant="caption" color="muted">
          Roles: {item.roles.join(', ')}
        </ThemedText>
      </View>
      <ThemedText variant="caption" color="muted">
        Registrado: {new Date(item.createdAt).toLocaleDateString()}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView variant="surface" style={styles.section}>
      <ThemedText variant="h3" style={styles.sectionTitle}>
        Lista de Usuarios ({users.length})
      </ThemedText>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.idUser.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText variant="body" color="muted">
              {loading ? 'Cargando usuarios...' : 'No hay usuarios registrados'}
            </ThemedText>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 0,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
  },
  inactiveBadge: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userEmail: {
    marginBottom: 8,
    color: theme.colors.primary,
  },
  userDetails: {
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
});