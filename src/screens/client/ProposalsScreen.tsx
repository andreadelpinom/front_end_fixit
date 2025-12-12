import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { homeService } from '../../services/home.service';
import { WIZARD_COLORS } from './request-wizard/WizardShared';

type Props = NativeStackScreenProps<any, 'Proposals'>;

interface Proposal {
  idSolTec: number;
  idSolicitud: number;
  idTecnico: number;
  costoAcordado?: number;
  estadoAcuerdo: string;
  fechaPropuesta: string;
  fechaConfirmada?: string;
  notas?: string;
}

export default function ProposalsScreen({ navigation, route }: Props) {
  const { idSolicitud } = route.params as { idSolicitud: number };
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<number | null>(null);

  const loadProposals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await homeService.getProposals(idSolicitud);
      setProposals(data);
    } catch (err) {
      console.error('Error loading proposals:', err);
      setError('No se pudieron cargar las propuestas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, [idSolicitud]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProposals();
  };

  const handleAcceptProposal = (proposal: Proposal) => {
    Alert.alert(
      '✅ Aceptar Propuesta',
      `¿Aceptar esta propuesta de $${proposal.costoAcordado?.toFixed(2) || '0.00'}?\n\nEsta acción:\n• Asignará el técnico a tu solicitud\n• Rechazará automáticamente las otras propuestas`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: async () => {
            setAccepting(proposal.idSolTec);
            try {
              await homeService.acceptProposal(proposal.idSolTec);
              Alert.alert('✅ Éxito', 'Propuesta aceptada. El técnico ha sido asignado.', [
                {
                  text: 'OK',
                  onPress: () => {
                    loadProposals();
                    navigation.goBack();
                  },
                },
              ]);
            } catch (err) {
              console.error('Error accepting proposal:', err);
              const errorMsg = err instanceof Error ? err.message : 'No se pudo aceptar la propuesta';
              Alert.alert('Error', errorMsg);
            } finally {
              setAccepting(null);
            }
          },
          style: 'default',
        },
      ]
    );
  };

  const handleRejectProposal = (proposal: Proposal) => {
    Alert.alert(
      '❌ Rechazar Propuesta',
      `¿Rechazar la propuesta de $${proposal.costoAcordado?.toFixed(2) || '0.00'}?\n\nLa solicitud seguirá abierta para otras propuestas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          onPress: async () => {
            setAccepting(proposal.idSolTec);
            try {
              await homeService.rejectProposal(proposal.idSolTec);
              Alert.alert('✅ Propuesta rechazada');
              loadProposals();
            } catch (err) {
              console.error('Error rejecting proposal:', err);
              const errorMsg = err instanceof Error ? err.message : 'No se pudo rechazar la propuesta';
              Alert.alert('Error', errorMsg);
            } finally {
              setAccepting(null);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderProposal = ({ item }: { item: Proposal }) => {
    const isAccepted = item.estadoAcuerdo === 'ACEPTADO';
    const isRejected = item.estadoAcuerdo === 'RECHAZADO';
    const isPending = item.estadoAcuerdo === 'PROPUESTO';

    return (
      <View style={[styles.card, isAccepted && styles.cardAccepted]}>
        <View style={styles.proposalHeader}>
          <Text style={styles.technicianLabel}>
            👨‍🔧 Técnico #{item.idTecnico}
          </Text>
          <View
            style={[
              styles.statusBadge,
              isAccepted && styles.statusAccepted,
              isRejected && styles.statusRejected,
            ]}
          >
            <Text style={styles.statusText}>
              {isAccepted ? '✅ Aceptada' : isRejected ? '❌ Rechazada' : '⏳ Propuesta'}
            </Text>
          </View>
        </View>

        <View style={styles.proposalBody}>
          <Text style={styles.priceLabel}>Costo Propuesto</Text>
          <Text style={styles.price}>
            ${item.costoAcordado?.toFixed(2) || '0.00'}
          </Text>

          {item.notas && (
            <>
              <Text style={[styles.priceLabel, { marginTop: 12 }]}>Notas</Text>
              <Text style={styles.notes}>{item.notas}</Text>
            </>
          )}

          <Text style={[styles.priceLabel, { marginTop: 12 }]}>Fecha de Propuesta</Text>
          <Text style={styles.date}>
            {new Date(item.fechaPropuesta).toLocaleDateString()} a las{' '}
            {new Date(item.fechaPropuesta).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {isPending && (
          <View style={styles.proposalActions}>
            <TouchableOpacity
              style={[styles.acceptButton, accepting === item.idSolTec && styles.buttonDisabled]}
              onPress={() => handleAcceptProposal(item)}
              disabled={accepting !== null}
            >
              <Text style={styles.acceptButtonText}>
                {accepting === item.idSolTec ? 'Procesando...' : '✓ Aceptar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.rejectButton, accepting === item.idSolTec && styles.buttonDisabled]}
              onPress={() => handleRejectProposal(item)}
              disabled={accepting !== null}
            >
              <Text style={styles.rejectButtonText}>
                {accepting === item.idSolTec ? '⏳' : '✕ Rechazar'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={WIZARD_COLORS.primary} />
          <Text style={styles.loadingText}>Cargando propuestas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Propuestas Recibidas</Text>
        <Text style={styles.subtitle}>{proposals.length} propuesta(s)</Text>
      </View>

      <FlatList
        data={proposals}
        renderItem={renderProposal}
        keyExtractor={(item) => item.idSolTec.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              📭 Aún no hay propuestas de técnicos.{'\n'}Espera a que técnicos se postulen.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: WIZARD_COLORS.primary,
    overflow: 'hidden',
  },
  cardAccepted: {
    borderLeftColor: '#4caf50',
    backgroundColor: '#f1f8f6',
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0,
  },
  technicianLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: WIZARD_COLORS.primary,
  },
  statusBadge: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusAccepted: {
    backgroundColor: '#d4edda',
  },
  statusRejected: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  proposalBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: WIZARD_COLORS.primary,
    marginTop: 4,
  },
  notes: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  proposalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
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
  backButton: {
    marginTop: 20,
    backgroundColor: WIZARD_COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});
