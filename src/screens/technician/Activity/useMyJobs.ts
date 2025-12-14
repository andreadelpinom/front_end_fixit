import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { getMyProposals, SolicitudTecnico } from '../../../services/technician.service';
import { homeService } from '../../../services/home.service';
import { SolicitudTecnicoConCalificacion, Calificacion } from '../../../types/api';

export type JobTab = 'EN_CURSO' | 'HISTORIAL';

export interface MyJobsData {
  proposals: SolicitudTecnico[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

export const useMyJobs = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<SolicitudTecnicoConCalificacion[]>([]);
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
      const data = await getMyProposals();
      // Add simulated ratings for completed jobs
      const proposalsWithRatings = addSimulatedRatings(data);
      setProposals(proposalsWithRatings);
    } catch (err: any) {
      console.error('Error loading proposals:', err);
      setError(err?.message || 'Error al cargar trabajos');
      setProposals([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Simulate ratings for completed jobs (in real app, this would come from API)
  const addSimulatedRatings = (proposals: SolicitudTecnico[]): SolicitudTecnicoConCalificacion[] => {
    return proposals.map((proposal, index) => {
      // Only add ratings to completed jobs (accepted with confirmation date)
      const isCompleted = proposal.estadoAcuerdo === 'ACEPTADO' && proposal.fechaConfirmada;

      if (isCompleted) {
        // Simulate different ratings for demo purposes
        const ratings = [5, 4, 3, 5, 4, 5, 3, 4, 5, 2];
        const comments = [
          'Excelente trabajo, muy profesional y puntual.',
          'Buen servicio, recomendado.',
          'Trabajo aceptable, pero podría mejorar la comunicación.',
          '¡Fantástico! Superó mis expectativas.',
          'Buena atención al cliente.',
          'Trabajo impecable, volveré a contratar.',
          'Servicio correcto, precio justo.',
          'Muy satisfecho con el resultado.',
          'Profesional y eficiente.',
          'El trabajo estuvo bien, pero tardó más de lo esperado.'
        ];

        const simulatedRating: Calificacion = {
          idCalificacion: 1000 + index,
          idSolicitud: proposal.idSolicitud,
          idTecnico: proposal.idTecnico,
          idCliente: 100 + index, // Simulated client ID
          calificacion: ratings[index % ratings.length],
          comentario: comments[index % comments.length],
          fechaCalificacion: proposal.fechaConfirmada || proposal.fechaPropuesta,
          createdAt: proposal.fechaConfirmada || proposal.fechaPropuesta,
          updatedAt: proposal.fechaConfirmada || proposal.fechaPropuesta,
        };

        return {
          ...proposal,
          calificacion: simulatedRating,
        };
      }

      return proposal;
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getFilteredProposals = (tab: JobTab): SolicitudTecnicoConCalificacion[] => {
    return proposals.filter((p) => {
      if (tab === 'EN_CURSO') {
        // Only show ACCEPTED jobs
        return p.estadoAcuerdo === 'ACEPTADO';
      } else {
        // Show REJECTED or completed
        return p.estadoAcuerdo === 'RECHAZADO' || (p.estadoAcuerdo === 'ACEPTADO' && p.fechaConfirmada);
      }
    });
  };

  // Cancel job with reason - technician initiated cancellation
  const cancelJob = async (idSolTec: number, reason: string) => {
    try {
      // Find the proposal to get the solicitud ID
      const proposal = proposals.find(p => p.idSolTec === idSolTec);
      if (!proposal) {
        throw new Error('Propuesta no encontrada');
      }

      // Cancel the request (this will change status to CANCELADA and make it PENDIENTE again)
      await homeService.cancelRequest(proposal.idSolicitud);

      // Note: Notification to client is handled by the backend when status changes
      // The backend should send a notification with the cancellation reason

      // Refresh data to reflect changes
      await loadData();

      // Show success message
      Alert.alert(
        'Servicio Cancelado',
        'El servicio ha sido cancelado exitosamente. El cliente ha sido notificado y la solicitud volverá a estar disponible.',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Error cancelling job:', error);
      throw new Error('No se pudo cancelar el servicio. Inténtalo de nuevo.');
    }
  };

  const completeJob = async (id: number) => {
    // TODO: Implement complete logic
    console.log('Complete job:', id);
  };

  return {
    proposals,
    loading,
    refreshing,
    error,
    onRefresh,
    loadData,
    getFilteredProposals,
    cancelJob,
    completeJob,
  };
};