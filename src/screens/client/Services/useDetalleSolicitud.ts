import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { requestService } from '../../../services/request.service';
import { homeService, Parroquia, RequestDetails } from '../../../services/home.service';
import { ErrorUtils } from '../../../utils/error.utils';
import { formatCurrency } from '../../../utils/currency.utils';

export type DetalleSolicitudStatusTone =
  | 'waiting'
  | 'proposals'
  | 'assigned'
  | 'completed'
  | 'cancelled'
  | 'default';

export type DetalleSolicitudStatusInfo = {
  label: string;
  tone: DetalleSolicitudStatusTone;
};

type LoadOptions = {
  showLoader?: boolean;
};

const DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const normalizeNumber = (value: unknown): number | null => {
  if (value == null) {
    return null;
  }

  const parsed = typeof value === 'string' ? Number.parseFloat(value) : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatDateLabel = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }

  try {
    const formatted = DATE_FORMATTER.format(new Date(value));
    return formatted.replace('.', '');
  } catch (error) {
    ErrorUtils.logError(error, 'useDetalleSolicitud.formatDateLabel');
    return null;
  }
};

const resolveBudgetLabel = (details: RequestDetails | null): string | null => {
  if (!details) {
    return null;
  }

  const estimated = normalizeNumber(details.costoEstimado);
  const promotion = normalizeNumber(details.costoPromocion);

  if (estimated != null && promotion != null && promotion !== estimated) {
    const minValue = Math.min(estimated, promotion);
    const maxValue = Math.max(estimated, promotion);
    return `${formatCurrency(minValue)} - ${formatCurrency(maxValue)}`;
  }

  if (estimated != null) {
    return formatCurrency(estimated);
  }

  if (promotion != null) {
    return formatCurrency(promotion);
  }

  return null;
};

const buildLocationLabel = (
  codigoParroquia: string | undefined,
  parroquias: Map<string, Parroquia>,
): string | null => {
  if (!codigoParroquia) {
    return null;
  }

  const match = parroquias.get(codigoParroquia);
  if (match) {
    const parts = [match.nombre, match.cantonNombre].filter(Boolean);
    if (parts.length > 0) {
      return parts.join(', ');
    }
  }

  return codigoParroquia || null;
};

const resolveStatusInfo = (
  estado?: string,
  proposalsCount: number = 0,
): DetalleSolicitudStatusInfo => {
  const normalized = (estado ?? '').toUpperCase();

  if (normalized === 'ACEPTADA' || normalized === 'ASIGNADA') {
    return { label: 'Asignada', tone: 'assigned' };
  }

  if (normalized === 'EN_PROCESO') {
    return { label: 'En proceso', tone: 'assigned' };
  }

  if (normalized === 'PENDIENTE' || normalized === 'PUBLICADA') {
    if (proposalsCount > 0) {
      return { label: 'Con propuestas', tone: 'proposals' };
    }
    return { label: 'Esperando', tone: 'waiting' };
  }

  if (normalized === 'COMPLETADA') {
    return { label: 'Completado', tone: 'completed' };
  }

  if (normalized === 'CANCELADA') {
    return { label: 'Cancelado', tone: 'cancelled' };
  }

  return { label: estado ?? 'Estado desconocido', tone: 'default' };
};

export function useDetalleSolicitud(idSolicitud: number) {
  const [details, setDetails] = useState<RequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposalsCount, setProposalsCount] = useState(0);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const parroquiaMapRef = useRef<Map<string, Parroquia>>(new Map());

  const ensureParroquias = useCallback(async () => {
    if (parroquiaMapRef.current.size > 0) {
      return;
    }

    try {
      const parroquias = await homeService.getParroquias();
      parroquiaMapRef.current = new Map(parroquias.map(item => [item.codigoParroquia, item]));
    } catch (parroquiaError) {
      ErrorUtils.logError(parroquiaError, 'useDetalleSolicitud.ensureParroquias');
    }
  }, []);

  const loadDetails = useCallback(
    async ({ showLoader = false }: LoadOptions = {}) => {
      if (showLoader) {
        setLoading(true);
      }

      try {
        setError(null);
        const fetchedDetails = await requestService.getRequestDetails(idSolicitud);

        let proposals = 0;
        try {
          const proposalsResponse = await homeService.getProposals(idSolicitud);
          proposals = Array.isArray(proposalsResponse) ? proposalsResponse.length : 0;
        } catch (proposalError) {
          ErrorUtils.logError(proposalError, 'useDetalleSolicitud.loadDetails.proposals');
        }

        await ensureParroquias();
        const location = buildLocationLabel(fetchedDetails.codigoParroquia, parroquiaMapRef.current);

        setDetails(fetchedDetails);
        setProposalsCount(proposals);
        setLocationLabel(location);
      } catch (loadError) {
        ErrorUtils.logError(loadError, 'useDetalleSolicitud.loadDetails');
        setError('No se pudieron cargar los detalles de la solicitud. Intenta nuevamente.');
        setDetails(null);
        setProposalsCount(0);
        setLocationLabel(null);
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [ensureParroquias, idSolicitud],
  );

  useFocusEffect(
    useCallback(() => {
      loadDetails({ showLoader: true });
      return () => undefined;
    }, [loadDetails]),
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadDetails();
    setRefreshing(false);
  }, [loadDetails]);

  const cancelRequest = useCallback(async () => {
    if (!details) {
      return false;
    }

    setCanceling(true);
    try {
      await homeService.cancelRequest(details.idSolicitud);
      await loadDetails({ showLoader: true });
      return true;
    } catch (cancelError) {
      ErrorUtils.logError(cancelError, 'useDetalleSolicitud.cancelRequest');
      setError(ErrorUtils.getErrorMessage(cancelError));
      return false;
    } finally {
      setCanceling(false);
    }
  }, [details, loadDetails]);

  const statusInfo = useMemo(() => resolveStatusInfo(details?.estadoSolicitud, proposalsCount), [details?.estadoSolicitud, proposalsCount]);

  const publishedAtLabel = useMemo(() => formatDateLabel(details?.fechaPublicacion ?? details?.createdAt), [details?.fechaPublicacion, details?.createdAt]);

  const budgetLabel = useMemo(() => resolveBudgetLabel(details), [details]);

  return {
    details,
    loading,
    refreshing,
    canceling,
    error,
    statusInfo,
    proposalsCount,
    locationLabel,
    publishedAtLabel,
    budgetLabel,
    isWaiting: statusInfo.tone === 'waiting',
    refresh,
    cancelRequest,
  };
}
