import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import { getMyProposals, SolicitudTecnico } from '../../../services/technician.service';

export interface TechnicianProposalsData {
  proposals: SolicitudTecnico[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

export const useTechnicianProposals = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<SolicitudTecnico[]>([]);
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
      setProposals(data);
    } catch (err: any) {
      console.error('Error loading proposals:', err);
      setError(err?.message || 'Error al cargar propuestas');
      setProposals([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Placeholder for future request detail
  const viewRequestDetail = (idSolicitud: number) => {
    // TODO: Navigate to request detail
    console.log('View request detail:', idSolicitud);
  };

  return {
    proposals,
    loading,
    refreshing,
    error,
    onRefresh,
    loadData,
    viewRequestDetail,
  };
};