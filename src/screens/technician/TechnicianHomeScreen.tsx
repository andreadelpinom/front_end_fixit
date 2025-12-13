import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { LoadingView, ErrorView } from '../../components/common';
import { StatCard, CertificationCard, ActionButton } from '../../components/technician';
import { useAuth } from '../../context/AuthContext';
import {
  getTechnicianByUser,
  getTechnicianStats,
  getAvailableCertifications,
  getTechnicianCertifications,
  addTechnicianCertification,
  TechnicianStats,
  Certificacion,
  TecnicoCertificacion,
  TecnicoWithDetails,
} from '../../services/technician.service';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotifications,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
} from '../../services/notification.service';

export default function TechnicianHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [technician, setTechnician] = useState<TecnicoWithDetails | null>(null);
  const [stats, setStats] = useState<TechnicianStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableCerts, setAvailableCerts] = useState<Certificacion[]>([]);
  const [myCerts, setMyCerts] = useState<TecnicoCertificacion[]>([]);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const loadData = async () => {
    if (!user) return;

    try {
      setError(null);
      const techData = await getTechnicianByUser(user.idUser);
      setTechnician(techData);

      // Cargar datos en paralelo
      const [statsData, certsData, myCertsData] = await Promise.all([
        getTechnicianStats(),
        getAvailableCertifications(),
        getTechnicianCertifications(techData.idTecnico),
      ]);
      
      setStats(statsData);
      setAvailableCerts(certsData);
      setMyCerts(myCertsData);
    } catch (err: any) {
      console.error('Error loading technician data:', err);
      setError(err?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApplyCertification = async (cert: Certificacion) => {
    if (!technician) return;
    
    // Verificar si ya tiene esta certificación
    const hasCert = myCerts.some(c => c.idCertificacion === cert.idCertificacion);
    if (hasCert) {
      Alert.alert('Info', 'Ya tienes esta certificación');
      return;
    }
    
    Alert.alert(
      'Solicitar Certificación',
      `¿Deseas solicitar la certificación "${cert.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Solicitar',
          onPress: async () => {
            try {
              await addTechnicianCertification({
                idTecnico: technician.idTecnico,
                idCertificacion: cert.idCertificacion,
              });
              Alert.alert('Éxito', '✅ Solicitud de certificación enviada');
              loadData();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'No se pudo solicitar la certificación');
            }
          },
        },
      ]
    );
  };

  const setupNotifications = async () => {
    try {
      if (!user) return;

      // Solicitar permisos y obtener token para TECNICO
      const token = await registerForPushNotifications(user.idUser, 'TECNICO');
      
      if (token) {
        console.log('✅ Notificaciones configuradas para técnico');
      }

      // Listener para notificaciones recibidas mientras la app está abierta
      const receivedSubscription = addNotificationReceivedListener((notification) => {
        console.log('[TechnicianHome] 📩 Notificación recibida:', notification);
        // Recargar datos cuando llega notificación
        loadData();
      });
      notificationListener.current = receivedSubscription;

      // Listener para cuando el usuario toca una notificación
      const responseSubscription = addNotificationResponseReceivedListener((response) => {
        console.log('[TechnicianHome] 👆 Notificación tocada:', response);
        const data = response.notification.request.content.data;
        
        // Recargar datos
        if (data) {
          loadData();
        }
      });
      responseListener.current = responseSubscription;
    } catch (err) {
      console.error('Error setting up notifications:', err);
    }
  };

  useEffect(() => {
    loadData();
    setupNotifications();

    return () => {
      // Cleanup listeners
      if (notificationListener.current) {
        try {
          notificationListener.current.remove();
          notificationListener.current = null;
        } catch (e) {
          console.log('[TechnicianHome] Cleanup listener error:', e);
        }
      }
      if (responseListener.current) {
        try {
          responseListener.current.remove();
          responseListener.current = null;
        } catch (e) {
          console.log('[TechnicianHome] Cleanup response listener error:', e);
        }
      }
    };
  }, [user?.idUser]); // Solo depende del ID del usuario

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  // Verificar si el técnico no está verificado
  const isNotVerified = technician && technician.status !== 'VERIFICADO';

  // Filtrar certificaciones disponibles (las que no tiene)
  const availableForMe = availableCerts.filter(
    (cert) => !myCerts.find((mc) => mc.idCertificacion === cert.idCertificacion)
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header con bienvenida */}
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Hola, {user?.nombres}!</Text>
        <Text style={styles.subtitle}>Bienvenido a tu panel de técnico</Text>
      </View>

      {/* Banner de no verificado - CRÍTICO PRIMERO */}
      {isNotVerified && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Cuenta no verificada</Text>
            <Text style={styles.warningText}>
              Completa tu verificación para mejorar tu visibilidad
            </Text>
          </View>
        </View>
      )}

      {/* Estadísticas principales - INFORMACIÓN CLAVE */}
      {stats && (
        <View style={styles.statsContainer}>
          <StatCard number={stats.totalProposals} label="Propuestas" />
          <StatCard number={stats.acceptedJobs} label="Aceptados" color="#28A745" />
          <StatCard number={stats.completedJobs} label="Completados" color="#FFC107" />
        </View>
      )}

      {/* Acciones rápidas - ACCIONES PRINCIPALES VISIBLES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <ActionButton 
          label="📋 Ver Solicitudes Disponibles"
          onPress={() => navigation.navigate('AvailableRequests')}
        />
        <ActionButton 
          label="💼 Mis Trabajos Activos"
          onPress={() => navigation.navigate('MyJobs')}
          variant="success"
        />
        <ActionButton 
          label="⚙️ Configurar Servicios"
          onPress={() => navigation.navigate('TechnicianProfile')}
          variant="secondary"
        />
      </View>

      {/* Mis certificaciones - CREDENCIALES ACTIVAS */}
      {myCerts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis Certificaciones</Text>
          {myCerts.map((cert) => (
            <CertificationCard
              key={cert.idCertificacion}
              name={cert.certificacion?.nombre || 'Certificación'}
              status="ACTIVE"
              expirationDate={cert.fechaVencimiento}
            />
          ))}
        </View>
      )}

      {/* Certificaciones disponibles - OPCIONALES AL FINAL */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certificaciones Disponibles</Text>
        {availableForMe.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.emptyText}>
              ✅ Ya tienes todas las certificaciones disponibles o no hay certificaciones nuevas
            </Text>
          </View>
        ) : (
          availableForMe.map((cert) => (
            <CertificationCard
              key={cert.idCertificacion}
              name={cert.nombre}
              description={cert.descripcion}
              status="AVAILABLE"
              onApply={() => handleApplyCertification(cert)}
            />
          ))
        )}
      </View>
    </ScrollView>
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
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginHorizontal: 32,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
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
    paddingVertical: 8,
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
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  warningBanner: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
  },
  certCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  certInfo: {
    flex: 1,
    marginRight: 12,
  },
  certName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  certDescription: {
    fontSize: 13,
    color: '#8E8E93',
  },
  certButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  certButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  myCertCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  certStatus: {
    fontSize: 13,
    color: '#2E7D32',
    marginTop: 4,
    fontWeight: '600',
  },
  certDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingVertical: 20,
  },
});