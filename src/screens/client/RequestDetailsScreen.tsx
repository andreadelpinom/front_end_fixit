import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { homeService, RequestDetails } from '../../services/home.service';
import { WIZARD_COLORS } from './request-wizard/WizardShared';

type Props = NativeStackScreenProps<any, 'RequestDetails'>;

const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${mins}`;
  } catch {
    return '-';
  }
};

const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'PENDIENTE':
      return '#FFF3CD';
    case 'ACEPTADA':
      return '#D1ECF1';
    case 'COMPLETADA':
      return '#D4EDDA';
    case 'CANCELADA':
      return '#F8D7DA';
    default:
      return '#f0f0f0';
  }
};

const getServiceName = (idTipoServicio: number): string => {
  const services: { [key: number]: string } = {
    1: 'Electricidad',
    2: 'Plomería',
    3: 'Cerrajería',
    4: 'Aire acondicionado',
    5: 'Carpintería',
    6: 'Pintura',
  };
  return services[idTipoServicio] || `Servicio #${idTipoServicio}`;
};

const getParroquiaName = (codigoParroquia: string): string => {
  const parroquias: { [key: string]: string } = {
    TAR: 'Tarqui',
    XIM: 'Ximena',
    PAS: 'Pascuales',
    FEC: 'Febres Cordero',
    LET: 'Letamendi',
    ROC: 'Rocafuerte',
    URD: 'Urdaneta',
    OLM: 'Olmedo',
  };
  return parroquias[codigoParroquia] || codigoParroquia;
};

export default function RequestDetailsScreen({ navigation, route }: Props) {
  const { idSolicitud } = route.params as { idSolicitud: number };
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [details, setDetails] = useState<RequestDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await homeService.getRequestDetails(idSolicitud);
      setDetails(data);
    } catch (err) {
      console.error('[RequestDetailsScreen] Load error:', err);
      setError('No se pudo cargar los detalles de la solicitud');
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDetails();
    }, [idSolicitud])
  );

  const handleEdit = () => {
    if (!details) return;
    // Navigate to CreateRequestStack and pass draft data
    navigation.navigate('CreateRequestStack', {
      screen: 'RequestStepService',
      params: {
        editingDraft: {
          idSolicitud: details.idSolicitud,
          idTipoServicio: details.idTipoServicio,
          codigoParroquia: details.codigoParroquia,
          tituloProblema: details.tituloProblema,
          descripcionProblema: details.descripcionProblema,
          fechaProgramada: details.fechaProgramada,
        },
      },
    });
  };

  const handleCancel = () => {
    if (!details) return;

    // Validar que solo se puedan cancelar solicitudes PENDIENTE
    if (details.estadoSolicitud !== 'PENDIENTE') {
      Alert.alert(
        'No se puede cancelar',
        'Solo puedes cancelar solicitudes que aún no han sido aceptadas por un técnico.',
        [{ text: 'OK', onPress: () => {}, style: 'cancel' }]
      );
      return;
    }

    Alert.alert(
      'Cancelar solicitud',
      '¿Estás seguro de que deseas cancelar esta solicitud? Esta acción no se puede deshacer.',
      [
        { text: 'No, mantener', onPress: () => {}, style: 'cancel' },
        {
          text: 'Sí, cancelar',
          onPress: async () => {
            setCanceling(true);
            try {
              await homeService.cancelRequest(details.idSolicitud);
              Alert.alert('Éxito', 'Solicitud cancelada correctamente', [
                {
                  text: 'OK',
                  onPress: () => {
                    // Pop back to ClientRequests which will refresh the list
                    navigation.navigate('ClientRequests');
                  },
                },
              ]);
            } catch (err) {
              console.error('[RequestDetailsScreen] Cancel error:', err);
              const errorMsg = err instanceof Error ? err.message : 'No se pudo cancelar la solicitud';
              Alert.alert('Error', errorMsg);
              setCanceling(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={WIZARD_COLORS.primary} />
          <Text style={styles.loadingText}>Cargando detalles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !details) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver a mis solicitudes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isPendiente = details.estadoSolicitud === 'PENDIENTE';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with title and status */}
        <View style={styles.header}>
          <Text style={styles.title}>{details.tituloProblema}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBadgeColor(details.estadoSolicitud) },
            ]}
          >
            <Text style={styles.statusText}>{details.estadoSolicitud}</Text>
          </View>
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Descripción</Text>
          <Text style={styles.cardText}>{details.descripcionProblema}</Text>
        </View>

        {/* Service Type Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tipo de Servicio</Text>
          <Text style={styles.cardText}>
            {getServiceName(details.idTipoServicio)}
          </Text>
        </View>

        {/* Location Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ubicación</Text>
          <Text style={styles.cardText}>
            {getParroquiaName(details.codigoParroquia)}
          </Text>
        </View>

        {/* Scheduled Date Card (if available) */}
        {details.fechaProgramada && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Fecha y Hora Programada</Text>
            <Text style={styles.cardText}>
              {formatDate(details.fechaProgramada)}
            </Text>
          </View>
        )}

        {/* Creation Date Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fecha de Publicación</Text>
          <Text style={styles.cardText}>{formatDate(details.createdAt)}</Text>
        </View>

        {/* Actions Section */}
        {isPendiente && (
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEdit}
              disabled={canceling}
            >
              <Text style={styles.editButtonText}>✏️ Editar solicitud</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, canceling && styles.cancelButtonDisabled]}
              onPress={handleCancel}
              disabled={canceling}
            >
              <Text style={styles.cancelButtonText}>
                {canceling ? 'Cancelando...' : '🗑️ Cancelar solicitud'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewProposalsButton}
              onPress={() => navigation.navigate('Proposals', { idSolicitud: details.idSolicitud })}
              disabled={canceling}
            >
              <Text style={styles.viewProposalsButtonText}>👀 Ver propuestas</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backToListButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToListButtonText}>← Volver a mis solicitudes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
    lineHeight: 28,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: WIZARD_COLORS.primary,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
    lineHeight: 22,
  },
  actionsSection: {
    marginVertical: 20,
    gap: 12,
  },
  editButton: {
    backgroundColor: WIZARD_COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  viewProposalsButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewProposalsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  backToListButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#666',
    alignItems: 'center',
    marginTop: 20,
  },
  backToListButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  backButton: {
    backgroundColor: WIZARD_COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
