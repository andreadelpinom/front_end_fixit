import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemedText, ThemedView } from '../../ui';
import { formatCurrency } from '../../utils/currency.utils';
import SubmitProposalModal from '../../components/SubmitProposalModal';
import { createProposal } from '../../services/technician.service';

export default function RequestDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { request } = route.params as { request: any };

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitProposal = async (cost: number, estimatedTime?: number, notes?: string) => {
    setLoading(true);
    try {
      await createProposal({
        idSolicitud: request.idSolicitud,
        costoAcordado: cost,
        notas: notes || 'Propuesta enviada desde la app',
      });
      // Navigate back to available requests
      navigation.goBack();
    } catch (err: any) {
      console.error('Error submitting proposal:', err);
      throw new Error('No se pudo enviar la propuesta');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    // For now, accepting means creating a proposal that will be auto-accepted
    // In a real implementation, this would call a different API
    setLoading(true);
    try {
      await createProposal({
        idSolicitud: request.idSolicitud,
        costoAcordado: request.costoEstimado || 0,
        notas: 'Solicitud aceptada directamente por el técnico',
      });
      // Navigate back to available requests
      navigation.goBack();
    } catch (err: any) {
      console.error('Error accepting request:', err);
      throw new Error('No se pudo aceptar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    // For now, rejecting means not sending a proposal
    // In a real implementation, this would call a reject API
    setModalVisible(false);
    // Navigate back to available requests
    navigation.goBack();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getServiceTypeName = (idTipoServicio: number) => {
    const serviceTypes: { [key: number]: string } = {
      1: 'Plomería',
      2: 'Electricidad',
      3: 'Carpintería',
      4: 'Pintura',
      5: 'Jardinería',
      6: 'Limpieza',
      7: 'Reparaciones',
    };
    return serviceTypes[idTipoServicio] || 'Servicio desconocido';
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView variant="surface" style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <ThemedText variant="h2" style={styles.title}>
          Detalle de Solicitud
        </ThemedText>
      </ThemedView>

      <ThemedView variant="surface" style={styles.card}>
        <ThemedText variant="h3" style={styles.sectionTitle}>
          Información General
        </ThemedText>

        <View style={styles.infoRow}>
          <ThemedText variant="body" color="muted" style={styles.label}>
            Título:
          </ThemedText>
          <ThemedText variant="body" style={styles.value}>
            {request.tituloProblema}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText variant="body" color="muted" style={styles.label}>
            Descripción:
          </ThemedText>
          <ThemedText variant="body" style={styles.value}>
            {request.descripcionProblema}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText variant="body" color="muted" style={styles.label}>
            Tipo de Servicio:
          </ThemedText>
          <ThemedText variant="body" style={styles.value}>
            {getServiceTypeName(request.idTipoServicio)}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText variant="body" color="muted" style={styles.label}>
            Costo Estimado:
          </ThemedText>
          <ThemedText variant="body" style={styles.value}>
            {formatCurrency(request.costoEstimado)}
          </ThemedText>
        </View>

        {request.promocion && (
          <View style={styles.infoRow}>
            <ThemedText variant="body" color="muted" style={styles.label}>
              Costo Promoción:
            </ThemedText>
            <ThemedText variant="body" style={styles.value}>
              {formatCurrency(request.costoPromocion)}
            </ThemedText>
          </View>
        )}
      </ThemedView>

      <ThemedView variant="surface" style={styles.card}>
        <ThemedText variant="h3" style={styles.sectionTitle}>
          Ubicación y Fechas
        </ThemedText>

        <View style={styles.infoRow}>
          <ThemedText variant="body" color="muted" style={styles.label}>
            Código Parroquia:
          </ThemedText>
          <ThemedText variant="body" style={styles.value}>
            {request.codigoParroquia}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText variant="body" color="muted" style={styles.label}>
            Fecha de Publicación:
          </ThemedText>
          <ThemedText variant="body" style={styles.value}>
            {formatDate(request.fechaPublicacion)}
          </ThemedText>
        </View>

        {request.fechaProgramada && (
          <View style={styles.infoRow}>
            <ThemedText variant="body" color="muted" style={styles.label}>
              Fecha Programada:
            </ThemedText>
            <ThemedText variant="body" style={styles.value}>
              {formatDate(request.fechaProgramada)}
            </ThemedText>
          </View>
        )}

        {request.fechaInicio && (
          <View style={styles.infoRow}>
            <ThemedText variant="body" color="muted" style={styles.label}>
              Fecha de Inicio:
            </ThemedText>
            <ThemedText variant="body" style={styles.value}>
              {formatDate(request.fechaInicio)}
            </ThemedText>
          </View>
        )}

        {request.fechaFinalizacion && (
          <View style={styles.infoRow}>
            <ThemedText variant="body" color="muted" style={styles.label}>
              Fecha de Finalización:
            </ThemedText>
            <ThemedText variant="body" style={styles.value}>
              {formatDate(request.fechaFinalizacion)}
            </ThemedText>
          </View>
        )}

        {request.duracionEstimadaMin && (
          <View style={styles.infoRow}>
            <ThemedText variant="body" color="muted" style={styles.label}>
              Duración Estimada:
            </ThemedText>
            <ThemedText variant="body" style={styles.value}>
              {request.duracionEstimadaMin} minutos
            </ThemedText>
          </View>
        )}
      </ThemedView>

      <ThemedView variant="surface" style={styles.card}>
        <ThemedText variant="h3" style={styles.sectionTitle}>
          Estado
        </ThemedText>

        <View style={styles.infoRow}>
          <ThemedText variant="body" color="muted" style={styles.label}>
            Estado de Solicitud:
          </ThemedText>
          <ThemedText variant="body" style={styles.value}>
            {request.estadoSolicitud}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText variant="body" color="muted" style={styles.label}>
            Activa:
          </ThemedText>
          <ThemedText variant="body" style={styles.value}>
            {request.isActive ? 'Sí' : 'No'}
          </ThemedText>
        </View>
      </ThemedView>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={() => setModalVisible(true)}>
          <ThemedText variant="button" style={styles.submitButtonText}>
            Gestionar Solicitud
          </ThemedText>
        </TouchableOpacity>
      </View>

      <SubmitProposalModal
        visible={modalVisible}
        requestTitle={request.tituloProblema}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitProposal}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
        isLoading={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    textAlign: 'center',
  },
  card: {
    margin: 12,
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    flex: 1,
  },
  value: {
    flex: 2,
    textAlign: 'right',
  },
  actionContainer: {
    padding: 16,
  },
  submitButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});