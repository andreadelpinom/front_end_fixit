import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { requestService } from '../../../services/request.service';
import { homeService, Parroquia } from '../../../services/home.service';
import { Solicitud } from '../../../types/api';
import { ErrorUtils } from '../../../utils/error.utils';

export type ClientActivityItem = {
  idSolicitud: number;
  title: string;
  description?: string;
  locationLabel: string;
  completedAtLabel: string;
  completedAt?: string;
  solicitud: Solicitud;
};

type LoadOptions = {
  showLoading?: boolean;
};

const DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const formatDateLabel = (value?: string): string => {
  if (!value) {
    return 'Fecha pendiente';
  }

  try {
    const formatted = DATE_FORMATTER.format(new Date(value));
    return formatted.replace('.', '');
  } catch (error) {
    ErrorUtils.logError(error, 'useClientActivity.formatDateLabel');
    return 'Fecha pendiente';
  }
};

const toTimestamp = (value?: string): number => {
  if (!value) {
    return 0;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const buildLocationLabel = (solicitud: Solicitud, map: Map<string, Parroquia>): string => {
  if (solicitud.codigoParroquia && map.has(solicitud.codigoParroquia)) {
    const parroquia = map.get(solicitud.codigoParroquia);
    if (parroquia) {
      const parts = [parroquia.nombre, parroquia.cantonNombre].filter(Boolean);
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
  }

  if (solicitud.codigoParroquia && solicitud.codigoParroquia.trim().length > 0) {
    return solicitud.codigoParroquia;
  }

  return 'Ubicación pendiente';
};

export function useClientActivity() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<Solicitud[]>([]);
  const parroquiaMapRef = useRef<Map<string, Parroquia>>(new Map());
  const [parroquiaVersion, setParroquiaVersion] = useState(0);

  const ensureParroquias = useCallback(async () => {
    if (parroquiaMapRef.current.size > 0) {
      return;
    }

    try {
      const parroquias = await homeService.getParroquias();
      parroquiaMapRef.current = new Map(parroquias.map(item => [item.codigoParroquia, item]));
      setParroquiaVersion(prev => prev + 1);
    } catch (parroquiaError) {
      ErrorUtils.logError(parroquiaError, 'useClientActivity.ensureParroquias');
    }
  }, []);

  const loadActivity = useCallback(
    async ({ showLoading = false }: LoadOptions = {}): Promise<void> => {
      if (showLoading) {
        setLoading(true);
      }

      try {
        setError(null);
        await ensureParroquias();
        const response = await requestService.getCompletedRequests(50, 1);
        const solicitudes = Array.isArray(response.solicitudes) ? response.solicitudes : [];

        const filtered = solicitudes.filter(item => item.estadoSolicitud?.toUpperCase() === 'COMPLETADA');

        setRequests(filtered);
      } catch (err) {
        ErrorUtils.logError(err, 'useClientActivity.loadActivity');
        setError('No se pudieron cargar tus servicios completados.');
        setRequests([]);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
        setRefreshing(false);
      }
    },
    [ensureParroquias],
  );

  useFocusEffect(
    useCallback(() => {
      loadActivity({ showLoading: true });
      return () => undefined;
    }, [loadActivity]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadActivity();
  }, [loadActivity]);

  const services = useMemo<ClientActivityItem[]>(() => {
    const map = parroquiaMapRef.current;

    return [...requests]
      .sort((a, b) => {
        const dateA = toTimestamp(a.fechaFinalizacion ?? a.updatedAt ?? a.createdAt);
        const dateB = toTimestamp(b.fechaFinalizacion ?? b.updatedAt ?? b.createdAt);
        return dateB - dateA;
      })
      .map(item => {
        const completedAt = item.fechaFinalizacion ?? item.updatedAt ?? item.createdAt;

        return {
          idSolicitud: item.idSolicitud,
          title: item.tituloProblema ?? 'Solicitud de servicio',
          description: item.descripcionProblema,
          locationLabel: buildLocationLabel(item, map),
          completedAtLabel: formatDateLabel(completedAt),
          completedAt,
          solicitud: item,
        };
      });
  }, [requests, parroquiaVersion]);

  return {
    services,
    loading,
    refreshing,
    error,
    onRefresh,
  };
}
