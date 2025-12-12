import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
  getTechnicianByUser,
  getTechnicianStats,
  TechnicianStats,
} from '../../services/technician.service';
import { technician as technicianService } from '../../services/technician.service';
import { TecnicoWithDetails } from '../../types/api';

interface PendingOffer {
  idSolTec: number;
  tituloProblema: string;
  costoAcordado: number;
  fechaPropuesta: string;
}

interface ActiveJob {
  idSolicitud: number;
  tituloProblema: string;
  direccion: string;
  fechaProgramada?: string;
}

export default function TechnicianHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [technician, setTechnician] = useState<TecnicoWithDetails | null>(null);
  const [stats, setStats] = useState<TechnicianStats | null>(null);
  const [pendingOffer, setPendingOffer] = useState<PendingOffer | null>(null);
  const [activeJob, setActiveJob] = useState<ActiveJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [user])
  );

  const loadData = async () => {
    if (!user) return;

    try {
      setError(null);
      // Load technician data
      const techData = await getTechnicianByUser(user.idUser);
      setTechnician(techData);

      // Load stats
      const statsData = await getTechnicianStats();
      setStats(statsData);

      // Try to load pending offer (first proposal in PROPUESTO state)
      try {
        const proposals = await technicianService.getMyProposals();
        const pending = proposals.find(
          (p: any) => p.estadoAceptacion === 'PROPUESTO'
        );
        setPendingOffer(pending || null);
      } catch {
        setPendingOffer(null);
      }

      // Try to load active job
      try {
        const jobs = await technicianService.getMyJobs();
        const active = jobs.find(
          (j: any) => j.estadoSolicitud === 'ACEPTADA'
        );
        setActiveJob(active || null);
      } catch {
        setActiveJob(null);
      }
    } catch (err: any) {
      console.error('Error loading technician data:', err);
      setError(err?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getMainStatusContent = () => {
    // Priority 1: Active job
    if (activeJob) {
      return {
        title: activeJob.tituloProblema,
        status: '✅ TRABAJO ACTIVO',
        statusColor: '#4CAF50',
        details: activeJob.direccion,
        cta: {
          text: 'Ir al trabajo',
          action: () =>
            navigation.navigate('MyJobs', {
              screen: 'JobDetails',
              params: { idSolicitud: activeJob.idSolicitud },
            }),
        },
      };
    }

    // Priority 2: Pending offer
    if (pendingOffer) {
      return {
        title: pendingOffer.tituloProblema,
        status: '⏳ PROPUESTA ENVIADA',
        statusColor: '#FF9800',
        details: `Propuesta de $${pendingOffer.costoAcordado}`,
        cta: {
          text: 'Ver mis propuestas',
          action: () => navigation.navigate('MyJobs'),
        },
      };
    }

    // Default: no active work
    return {
      title: 'Sin trabajos activos',
      status: null,
      statusColor: null,
      details: 'Explora solicitudes disponibles',
      cta: {
        text: 'Explorar solicitudes',
        action: () => navigation.navigate('AvailableRequests'),
      },
    };
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const mainStatus = getMainStatusContent();
  const isNotVerified = technician && technician.status !== 'VERIFICADO';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Verification Banner */}
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

      {/* Main Status Card */}
      <View style={styles.statusCard}>
        {mainStatus.status && (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: mainStatus.statusColor },
            ]}
          >
            <Text style={styles.statusBadgeText}>{mainStatus.status}</Text>
          </View>
        )}
        <Text style={styles.mainTitle}>{mainStatus.title}</Text>
        <Text style={styles.statusDetails}>{mainStatus.details}</Text>
      </View>

      {/* Primary CTA */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={mainStatus.cta.action}
      >
        <Text style={styles.ctaButtonText}>{mainStatus.cta.text}</Text>
      </TouchableOpacity>

      {/* Stats Row */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.totalWorksCompleted}</Text>
            <Text style={styles.statLabel}>Trabajos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {stats.averageRating?.toFixed(1) || '—'}
            </Text>
            <Text style={styles.statLabel}>Calificación</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.totalEarnings || '$0'}</Text>
            <Text style={styles.statLabel}>Ganancias</Text>
          </View>
        </View>
      )}

      {/* Profile Completion Banner */}
      {technician && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📋 Completa tu Perfil</Text>
          <Text style={styles.infoText}>
            Los clientes ven mejor tu perfil cuando está 100% completo
          </Text>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.infoButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#757575',
  },
  errorText: {
    fontSize: 16,
    color: '#C62828',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  warningBanner: {
    backgroundColor: '#FFF3E0',
    borderLeftColor: '#FF9800',
    borderLeftWidth: 4,
    padding: 12,
    margin: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
  },
  warningText: {
    fontSize: 12,
    color: '#BF360C',
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  statusDetails: {
    fontSize: 14,
    color: '#757575',
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 12,
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#0D47A1',
    lineHeight: 18,
    marginBottom: 12,
  },
  infoButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  infoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});