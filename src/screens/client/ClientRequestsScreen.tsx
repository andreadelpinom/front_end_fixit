import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Pressable, RefreshControl, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { homeService, RequestPreview } from '../../services/home.service';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<any>;

type TabState = 'PENDIENTE' | 'ACEPTADA' | 'COMPLETADA';

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '-';
  }
};

export default function ClientRequestsScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [allRequests, setAllRequests] = useState<RequestPreview[]>([]);
  const [activeTab, setActiveTab] = useState<TabState>('PENDIENTE');
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const solicitudes = await homeService.getMySolicitudes();
      console.log('[ClientRequestsScreen] Loaded:', solicitudes.length);
      setAllRequests(solicitudes);
    } catch (e: any) {
      console.error('[ClientRequestsScreen] Error:', e);
      const errorMsg = e?.error || e?.message || 'Error al cargar solicitudes';
      const statusCode = e?.statusCode;
      
      if (statusCode === 401) {
        setError('Sesión expirada. Por favor, inicia sesión de nuevo.');
      } else {
        setError(errorMsg);
      }
      setAllRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const solicitudes = await homeService.getMySolicitudes();
      setAllRequests(solicitudes);
    } catch (e: any) {
      console.error('[ClientRequestsScreen] Refresh error:', e);
      const errorMsg = e?.error || e?.message || 'Error al actualizar';
      const statusCode = e?.statusCode;
      
      if (statusCode === 401) {
        setError('Sesión expirada. Por favor, inicia sesión de nuevo.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => {
    load();
  }, []));

  // Sort by creation date DESC and filter by active tab
  const filteredRequests = allRequests
    .filter((req) => {
      // CANCELADA should not appear in PENDIENTE or ACEPTADA tabs
      if ((activeTab === 'PENDIENTE' || activeTab === 'ACEPTADA') && req.estado === 'CANCELADA') {
        return false;
      }
      return req.estado === activeTab;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

  const renderRequestCard = (item: RequestPreview) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => {
        navigation.navigate('RequestDetails', { idSolicitud: item.idSolicitud });
      }}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.titulo}
          </Text>
          {item.estado === 'PENDIENTE' && (item.proposalCount ?? 0) > 0 && (
            <TouchableOpacity
              style={styles.proposalBadge}
              onPress={() => {
                navigation.navigate('Proposals', { idSolicitud: item.idSolicitud });
              }}
            >
              <Text style={styles.proposalBadgeText}>
                {item.proposalCount} {item.proposalCount === 1 ? 'propuesta' : 'propuestas'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={[
            styles.cardStatusBadge,
            activeTab === 'PENDIENTE' && styles.badgePendiente,
            activeTab === 'ACEPTADA' && styles.badgeAceptada,
            activeTab === 'COMPLETADA' && styles.badgeCompletada,
          ]}
        >
          <Text style={styles.badgeText}>{item.estado}</Text>
        </View>
      </View>

      <Text style={styles.cardService}>
        Servicio ID: {item.idTipoServicio || '-'}
      </Text>

      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.descripcion}
      </Text>

      <Text style={styles.cardLocation}>
        Ubicación: {item.codigoParroquia || '-'}
      </Text>

      <Text style={styles.cardDate}>
        {formatDate(item.createdAt || '')}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <View style={styles.headerContent}>
        <Text style={styles.title}>Mis Solicitudes</Text>
        <Pressable
          style={styles.ctaButton}
          onPress={() => navigation.navigate('CreateRequestStack')}
        >
          <Text style={styles.ctaButtonText}>+ Crear nueva solicitud</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'PENDIENTE' && styles.tabActive,
          ]}
          onPress={() => setActiveTab('PENDIENTE')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'PENDIENTE' && styles.tabLabelActive,
            ]}
          >
            Publicadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'ACEPTADA' && styles.tabActive,
          ]}
          onPress={() => setActiveTab('ACEPTADA')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'ACEPTADA' && styles.tabLabelActive,
            ]}
          >
            En progreso
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'COMPLETADA' && styles.tabActive,
          ]}
          onPress={() => setActiveTab('COMPLETADA')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'COMPLETADA' && styles.tabLabelActive,
            ]}
          >
            Completadas
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={load}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (filteredRequests.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {activeTab === 'PENDIENTE'
              ? 'No tienes solicitudes publicadas'
              : activeTab === 'ACEPTADA'
              ? 'No tienes solicitudes en progreso'
              : 'No tienes solicitudes completadas'}
          </Text>
          <Text style={styles.emptySubText}>
            Crea una nueva solicitud para comenzar
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={filteredRequests}
        keyExtractor={(i) => String(i.idSolicitud)}
        renderItem={({ item }) => renderRequestCard(item)}
        scrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  tabsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#007AFF',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  tabLabelActive: {
    color: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  proposalBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  proposalBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#856404',
  },
  cardStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  badgePendiente: {
    backgroundColor: '#FFF3CD',
  },
  badgeAceptada: {
    backgroundColor: '#D1ECF1',
  },
  badgeCompletada: {
    backgroundColor: '#D4EDDA',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  cardService: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
  cardLocation: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
