import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import {
  getTechnicianByUser,
  getTechnicianServices,
  getTechnicianZones,
  getTechnicianCertifications,
  addTechnicianService,
  removeTechnicianService,
  addTechnicianZone,
  removeTechnicianZone,
  TecnicoWithDetails,
  TecnicoServicio,
  TecnicoZona,
  TecnicoCertificacion,
} from '../../services/technician.service';

export default function TechnicianProfileScreen() {
  const { user, logout, switchRole, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [technician, setTechnician] = useState<TecnicoWithDetails | null>(null);
  const [switchingRole, setSwitchingRole] = useState(false);
  const [services, setServices] = useState<TecnicoServicio[]>([]);
  const [zones, setZones] = useState<TecnicoZona[]>([]);
  const [certifications, setCertifications] = useState<TecnicoCertificacion[]>([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [availableServices, setAvailableServices] = useState<any[]>([]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const data = await getTechnicianByUser(user.idUser);
      setTechnician(data);
      
      // Cargar datos adicionales en paralelo
      const [servicesData, zonesData, certsData] = await Promise.all([
        getTechnicianServices(data.idTecnico),
        getTechnicianZones(data.idTecnico),
        getTechnicianCertifications(data.idTecnico),
      ]);
      
      setServices(servicesData);
      setZones(zonesData);
      setCertifications(certsData);
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: logout,
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

  const handleAddService = async (serviceId: number) => {
    if (!technician) return;
    
    try {
      await addTechnicianService({
        idTecnico: technician.idTecnico,
        idTipoServicio: serviceId,
      });
      Alert.alert('Éxito', 'Servicio agregado correctamente');
      loadProfile();
      setShowServiceModal(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo agregar el servicio');
    }
  };

  const handleRemoveService = async (idTecnicoServicio: number) => {
    if (!technician) return;
    
    Alert.alert(
      'Eliminar Servicio',
      '¿Estás seguro que deseas eliminar este servicio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTechnicianService(idTecnicoServicio);
              Alert.alert('Éxito', 'Servicio eliminado');
              loadProfile();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'No se pudo eliminar el servicio');
            }
          },
        },
      ]
    );
  };

  const handleAddZone = async () => {
    if (!technician) return;
    
    Alert.prompt(
      'Agregar Zona de Servicio',
      'Ingresa el ID de zona:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Agregar',
          onPress: async (zoneId?: string) => {
            if (!zoneId || isNaN(Number(zoneId))) {
              Alert.alert('Error', 'ID de zona inválido (debe ser un número)');
              return;
            }
            
            try {
              await addTechnicianZone({
                idTecnico: technician.idTecnico,
                idZona: Number(zoneId),
              });
              Alert.alert('Éxito', 'Zona agregada correctamente');
              loadProfile();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'No se pudo agregar la zona');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleRemoveZone = async (idTecnicoZona: number) => {
    if (!technician) return;
    
    Alert.alert(
      'Eliminar Zona',
      '¿Estás seguro que deseas eliminar esta zona de servicio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTechnicianZone(idTecnicoZona);
              Alert.alert('Éxito', 'Zona eliminada');
              loadProfile();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'No se pudo eliminar la zona');
            }
          },
        },
      ]
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

      {/* Servicios que ofrece */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Servicios que Ofrezco</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowServiceModal(true)}
          >
            <Text style={styles.addButtonText}>+ Agregar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {services.length === 0 ? (
            <Text style={styles.emptyText}>No has agregado servicios todavía</Text>
          ) : (
            services.map((service, index) => (
              <View
                key={index}
                style={[
                  styles.listItem,
                  index === services.length - 1 && styles.listItemLast,
                ]}
              >
                <Text style={styles.listItemText}>
                  🔧 {service.tipoServicio?.nombre || `Servicio #${service.idTipoServicio}`}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveService(service.idTecnicoServicio)}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Zonas de servicio */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Zonas de Servicio</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddZone}
          >
            <Text style={styles.addButtonText}>+ Agregar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {zones.length === 0 ? (
            <Text style={styles.emptyText}>No has agregado zonas todavía</Text>
          ) : (
            zones.map((zone, index) => (
              <View
                key={index}
                style={[
                  styles.listItem,
                  index === zones.length - 1 && styles.listItemLast,
                ]}
              >
                <Text style={styles.listItemText}>
                  📍 {zone.zona?.nombre || `Zona #${zone.idZona}`}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveZone(zone.idTecnicoZona)}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Certificaciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certificaciones</Text>
        <View style={styles.card}>
          {certifications.length === 0 ? (
            <Text style={styles.emptyText}>No tienes certificaciones todavía</Text>
          ) : (
            certifications.map((cert, index) => (
              <View
                key={index}
                style={[
                  styles.listItem,
                  index === certifications.length - 1 && styles.listItemLast,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.listItemText}>
                    🏆 {cert.certificacion?.nombre || `Certificación #${cert.idCertificacion}`}
                  </Text>
                  <Text style={styles.certStatus}>
                    Estado: {cert.estado}
                  </Text>
                  {cert.fechaVencimiento && (
                    <Text style={styles.certDate}>
                      Vence: {new Date(cert.fechaVencimiento).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Horarios de trabajo (información estática por ahora) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horarios de Trabajo</Text>
        <View style={styles.card}>
          <InfoRow label="Lun - Vie" value="8:00 AM - 6:00 PM" />
          <InfoRow label="Sábado" value="9:00 AM - 2:00 PM" />
          <InfoRow label="Domingo" value="Cerrado" />
        </View>
      </View>

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

      {/* Modal para agregar servicios */}
      <Modal
        visible={showServiceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowServiceModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Servicio</Text>
            <FlatList
              data={availableServices.filter(
                s => !services.find(existing => existing.idTipoServicio === s.idTipoServicio)
              )}
              keyExtractor={(item) => item.idTipoServicio.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleAddService(item.idTipoServicio)}
                >
                  <Text style={styles.modalItemText}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Ya ofreces todos los servicios disponibles
                </Text>
              }
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowServiceModal(false)}
            >
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontWeight: '600',
  },
  switchRoleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  listItemText: {
    fontSize: 16,
    color: '#000000',
  },
  removeText: {
    color: '#FF3B30',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingVertical: 20,
  },
  certStatus: {
    fontSize: 12,
    color: '#FF9500',
    marginTop: 4,
  },
  certDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalItemText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalCloseButton: {
    backgroundColor: '#8E8E93',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
});