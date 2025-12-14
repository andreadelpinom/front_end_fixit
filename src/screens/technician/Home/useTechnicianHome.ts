import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import {
  getTechnicianByUser,
  getTechnicianStats,
  TechnicianStats,
  getMyProposals,
} from '../../../services/technician.service';
import { TecnicoWithDetails, SolicitudTecnico } from '../../../types/api';
import { formatCurrency } from '../../../utils/currency.utils';

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

export interface TechnicianHomeData {
  technician: TecnicoWithDetails | null;
  stats: TechnicianStats | null;
  pendingOffer: PendingOffer | null;
  activeJob: ActiveJob | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

export const useTechnicianHome = (navigation: any) => {
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
        const proposals = await getMyProposals();
        const pending = proposals.find(
          (p: any) => p.estadoAcuerdo === 'PROPUESTO'
        ) as any;
        setPendingOffer(pending || null);
      } catch {
        setPendingOffer(null);
      }

      // Try to load active job
      try {
        const jobs = await getMyProposals();
        const active = jobs.find(
          (j: any) => j.estadoAcuerdo === 'ACEPTADO'
        ) as any;
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
        details: `Propuesta de $${formatCurrency(pendingOffer.costoAcordado)}`,
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

  const mainStatus = getMainStatusContent();
  const isNotVerified = technician && technician.status !== 'VERIFICADO';

  return {
    technician,
    stats,
    pendingOffer,
    activeJob,
    loading,
    refreshing,
    error,
    mainStatus,
    isNotVerified,
    onRefresh,
    loadData,
  };
};