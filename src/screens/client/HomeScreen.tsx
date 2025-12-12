import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { requestService } from '../../services/request.service';
import { WIZARD_COLORS } from './request-wizard/WizardShared';

interface ActiveRequest {
  idSolicitud: number;
  tituloProblema: string;
  estadoSolicitud: 'PENDIENTE' | 'ACEPTADA' | 'CANCELADA' | 'COMPLETADA';
  idTecnicoAsignado?: number | null;
  proposalCount?: number;
}

export default function HomeScreen({ navigation }: any): React.ReactElement {
  const { user } = useAuth();
  const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadActiveRequest();
    }, [user])
  );

  const loadActiveRequest = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await requestService.getClientRequests();
      // Filter for active/pending request
      const active = response.find(
        (r: any) =>
          r.estadoSolicitud === 'PENDIENTE' || r.estadoSolicitud === 'ACEPTADA'
      );
      setActiveRequest(active || null);
      setError(null);
    } catch (err: any) {
      console.error('Error loading active request:', err);
      setError(err?.message || 'Error al cargar solicitud');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (): string => {
    if (!activeRequest) return 'Sin solicitudes activas';

    switch (activeRequest.estadoSolicitud) {
      case 'PENDIENTE':
        if (activeRequest.idTecnicoAsignado) {
          return 'Técnico asignado';
        }
        return `${activeRequest.proposalCount || 0} propuestas recibidas`;
      case 'ACEPTADA':
        return 'Trabajo aceptado';
      case 'COMPLETADA':
        return 'Trabajo completado';
      case 'CANCELADA':
        return 'Solicitud cancelada';
      default:
        return 'Estado desconocido';
    }
  };

  const getStatusColor = (): string => {
    if (!activeRequest) return '#9E9E9E';

    switch (activeRequest.estadoSolicitud) {
      case 'PENDIENTE':
        return activeRequest.idTecnicoAsignado ? '#4CAF50' : '#FF9800';
      case 'ACEPTADA':
        return '#4CAF50';
      case 'COMPLETADA':
        return '#2196F3';
      case 'CANCELADA':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getPrimaryCTA = (): { text: string; action: () => void } => {
    if (!activeRequest) {
      return {
        text: 'Crear solicitud',
        action: () => navigation.navigate('RequestsTab', { screen: 'CreateRequestStack' }),
      };
    }

    switch (activeRequest.estadoSolicitud) {
      case 'PENDIENTE':
        if (activeRequest.proposalCount && activeRequest.proposalCount > 0) {
          return {
            text: `Ver ${activeRequest.proposalCount} propuestas`,
            action: () =>
              navigation.navigate('RequestsTab', {
                screen: 'Proposals',
                params: { idSolicitud: activeRequest.idSolicitud },
              }),
          };
        }
        return {
          text: 'Esperando propuestas...',
          action: () => {},
        };
      case 'ACEPTADA':
        return {
          text: 'Ir al trabajo',
          action: () => {
            // Navigate to active job or details
            navigation.navigate('RequestsTab', {
              screen: 'RequestDetails',
              params: { idSolicitud: activeRequest.idSolicitud },
            });
          },
        };
      default:
        return {
          text: 'Ver detalles',
          action: () =>
            navigation.navigate('RequestsTab', {
              screen: 'RequestDetails',
              params: { idSolicitud: activeRequest.idSolicitud },
            }),
        };
    }
  };

  const cta = getPrimaryCTA();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Estado de tu solicitud</Text>

          {activeRequest ? (
            <>
              <Text style={styles.requestTitle}>{activeRequest.tituloProblema}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor() },
                ]}
              >
                <Text style={styles.statusBadgeText}>{getStatusText()}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.noRequestText}>No hay solicitudes activas</Text>
          )}
        </View>

        {/* Primary CTA */}
        {cta && (
          <TouchableOpacity
            style={[
              styles.ctaButton,
              {
                backgroundColor:
                  cta.text === 'Esperando propuestas...' ? '#BDBDBD' : '#007AFF',
              },
            ]}
            onPress={cta.action}
            disabled={cta.text === 'Esperando propuestas...'}
          >
            <Text style={styles.ctaButtonText}>{cta.text}</Text>
          </TouchableOpacity>
        )}

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Additional Info */}
        {!activeRequest && (
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>¿Necesitas un servicio?</Text>
            <Text style={styles.infoText}>
              Crea una solicitud y recibe propuestas de técnicos calificados
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WIZARD_COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
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
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusLabel: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  noRequestText: {
    fontSize: 16,
    color: '#9E9E9E',
    fontStyle: 'italic',
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: '#F44336',
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
  infoSection: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 20,
  },
});
