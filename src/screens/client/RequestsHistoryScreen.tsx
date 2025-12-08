import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { WIZARD_COLORS } from './request-wizard/WizardShared';
import { requestService, Solicitud } from '../../services/request.service';

type Props = NativeStackNavigationProp<any>;

interface RequestsHistoryScreenProps {
  navigation: Props;
}

const RequestsHistoryScreen: React.FC<RequestsHistoryScreenProps> = ({ navigation }) => {
  const { isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated) {
      Alert.alert(
        'Sesión Expirada',
        'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
      return;
    }

    fetchCompletedRequests();
  }, [isAuthenticated, page]);

  /**
   * Obtiene las solicitudes completadas del usuario
   */
  const fetchCompletedRequests = async () => {
    try {
      setError(null);
      const data = await requestService.getCompletedRequests(20, page);
      setRequests(data.solicitudes);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error('[RequestsHistoryScreen] Error fetching requests:', err);
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar las solicitudes';
      setError(errorMsg);
      setRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Manejador de Pull to Refresh
   */
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setLoading(false);
  };

  /**
   * Formatea una fecha ISO a formato español (DD de Mes de YYYY)
   */
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'No especificada';

    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      return date.toLocaleDateString('es-ES', options);
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  /**
   * Manejador de click en un item (próximamente)
   */
  const handleRequestPress = (request: Solicitud) => {
    Alert.alert(
      'Detalles de Solicitud',
      `ID: ${request.idSolicitud}\n\nProximamente podrás ver más detalles de esta solicitud.`,
      [{ text: 'OK' }]
    );
  };

  /**
   * Renderiza cada tarjeta de solicitud
   */
  const renderRequestCard = ({ item }: { item: Solicitud }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => handleRequestPress(item)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.tituloProblema}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>✓ COMPLETADA</Text>
        </View>
      </View>

      {/* Contenido */}
      <View style={styles.cardContent}>
        {/* Fecha de finalización */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Finalizado:</Text>
          <Text style={styles.infoValue}>{formatDate(item.fechaFinalizacion)}</Text>
        </View>

        {/* Costo estimado (si existe) */}
        {item.costoEstimado && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Costo:</Text>
            <Text style={styles.infoValue}>
              ${item.costoEstimado.toFixed(2)}
              {item.costoPromocion && (
                <Text style={styles.promoPrice}>
                  {' '}
                  (${item.costoPromocion.toFixed(2)})
                </Text>
              )}
            </Text>
          </View>
        )}

        {/* Duración estimada (si existe) */}
        {item.duracionEstimadaMin && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duración:</Text>
            <Text style={styles.infoValue}>{item.duracionEstimadaMin} min</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.descriptionPreview} numberOfLines={1}>
          {item.descripcionProblema}
        </Text>
      </View>
    </TouchableOpacity>
  );

  /**
   * Renderiza el mensaje de lista vacía
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📋</Text>
      <Text style={styles.emptyStateTitle}>Sin solicitudes finalizadas</Text>
      <Text style={styles.emptyStateDescription}>
        Aún no tienes solicitudes finalizadas. Una vez completes un servicio, aparecerá aquí.
      </Text>
    </View>
  );

  /**
   * Renderiza el estado de error
   */
  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorStateIcon}>⚠️</Text>
      <Text style={styles.errorStateTitle}>Error al cargar</Text>
      <Text style={styles.errorStateDescription}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => {
          setLoading(true);
          setError(null);
          fetchCompletedRequests();
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  // Estado de carga inicial
  if (loading && requests.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={WIZARD_COLORS.primary} />
          <Text style={styles.loadingText}>Cargando solicitudes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Estado de error
  if (error && requests.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial de Solicitudes</Text>
        <Text style={styles.headerSubtitle}>
          {requests.length} solicitud{requests.length !== 1 ? 'es' : ''} completada{requests.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Lista */}
      {requests.length > 0 ? (
        <FlatList
          data={requests}
          renderItem={renderRequestCard}
          keyExtractor={(item) => item.idSolicitud.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[WIZARD_COLORS.primary]}
              tintColor={WIZARD_COLORS.primary}
            />
          }
          ListEmptyComponent={renderEmptyState()}
          onEndReached={() => {
            // Implementar paginación si es necesario
            if (page < totalPages) {
              setPage(page + 1);
            }
          }}
          onEndReachedThreshold={0.1}
        />
      ) : (
        <FlatList
          data={[]}
          renderItem={() => null}
          ListEmptyComponent={renderEmptyState()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[WIZARD_COLORS.primary]}
              tintColor={WIZARD_COLORS.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WIZARD_COLORS.background,
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: WIZARD_COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: WIZARD_COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: WIZARD_COLORS.textSecondary,
  },

  // Content
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: WIZARD_COLORS.textSecondary,
  },

  // List
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  // Request Card
  requestCard: {
    backgroundColor: WIZARD_COLORS.white,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: WIZARD_COLORS.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: WIZARD_COLORS.border,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: WIZARD_COLORS.text,
    marginRight: 10,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#4CAF50',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E7D32',
  },

  // Card Content
  cardContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: WIZARD_COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: WIZARD_COLORS.text,
  },
  promoPrice: {
    color: WIZARD_COLORS.primary,
    fontWeight: '700',
  },

  // Card Footer
  cardFooter: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: WIZARD_COLORS.border,
    backgroundColor: WIZARD_COLORS.background,
  },
  descriptionPreview: {
    fontSize: 12,
    color: WIZARD_COLORS.textSecondary,
    fontStyle: 'italic',
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WIZARD_COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 14,
    color: WIZARD_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Error State
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 60,
  },
  errorStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WIZARD_COLORS.error || '#D32F2F',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorStateDescription: {
    fontSize: 14,
    color: WIZARD_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: WIZARD_COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  retryButtonText: {
    color: WIZARD_COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RequestsHistoryScreen;
