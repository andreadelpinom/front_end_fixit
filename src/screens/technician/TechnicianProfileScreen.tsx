import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getTechnicianByUser, TecnicoWithDetails } from '../../services/technician.service';

export default function TechnicianProfileScreen() {
  const { user, logout, switchRole, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [technician, setTechnician] = useState<TecnicoWithDetails | null>(null);
  const [switchingRole, setSwitchingRole] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const data = await getTechnicianByUser(user.idUser);
      setTechnician(data);
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleSwitchToClient = async () => {
    Alert.alert(
      '¿Ver Vista de Cliente?',
      'Cambiarás a tu perfil de cliente. Podrás volver a la vista de técnico en cualquier momento desde tu perfil de cliente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, ver vista cliente',
          style: 'default',
          onPress: async () => {
            try {
              setSwitchingRole(true);
              await switchRole('CLIENTE'); // Cambiar activeRole a CLIENTE
            } catch (error) {
              Alert.alert(
                'Error',
                'No se pudo cambiar la vista. Intenta de nuevo.',
              );
              setSwitchingRole(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Información personal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        <View style={styles.card}>
          <InfoRow label="Nombre" value={`${user?.nombres} ${user?.apellidos}`} />
          <InfoRow label="Email" value={user?.email || 'N/A'} />
          <InfoRow label="Cédula" value={user?.cedula || 'N/A'} />
          <InfoRow label="Rol" value={user?.rol || 'N/A'} />
        </View>
      </View>

      {/* Información de técnico */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perfil Técnico</Text>
        <View style={styles.card}>
          <InfoRow label="ID Técnico" value={`#${technician?.idTecnico}`} />
          <InfoRow
            label="Total Calificaciones"
            value={`${technician?.totalCalificaciones || 0}`}
          />
          <InfoRow
            label="Promedio"
            value={`${technician?.promedioCalificaciones?.toFixed(1) || 'N/A'} ⭐`}
          />
          <InfoRow
            label="Estado"
            value={technician?.isActive ? '✅ Activo' : '❌ Inactivo'}
          />
          <InfoRow
            label="Miembro desde"
            value={technician?.createdAt 
              ? new Date(technician.createdAt).toLocaleDateString()
              : 'N/A'}
          />
        </View>
      </View>

      {/* Contadores si están disponibles */}
      {technician?._count && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.card}>
            <InfoRow 
              label="Trabajos Realizados" 
              value={`${technician._count.solicitudesTecnico || 0}`} 
            />
            <InfoRow 
              label="Calificaciones Recibidas" 
              value={`${technician._count.calificaciones || 0}`} 
            />
          </View>
        </View>
      )}

      {/* Botones de acción */}
      <View style={styles.section}>
        {/* Cambiar a Cliente */}
        <View style={styles.switchRoleCard}>
          <Text style={styles.switchRoleTitle}>
            👤 Ver Perfil de Cliente
          </Text>
          <Text style={styles.switchRoleDescription}>
            Cambia a tu vista de cliente para solicitar servicios, ver tu historial y gestionar tus solicitudes.
          </Text>
          <TouchableOpacity
            style={[
              styles.switchRoleButton,
              switchingRole && styles.switchRoleButtonDisabled,
            ]}
            onPress={handleSwitchToClient}
            disabled={switchingRole || isLoading}
            activeOpacity={0.7}
          >
            {switchingRole ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.switchRoleButtonText}>
                Cambiar a Vista de Cliente
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Cerrar sesión */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  infoLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchRoleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  switchRoleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  switchRoleDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  switchRoleButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRoleButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  switchRoleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});