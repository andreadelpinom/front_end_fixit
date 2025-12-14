import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  homeService,
  Parroquia,
  RequestDetails,
  ServiceType,
} from '../../../services/home.service';
import { getTechnicianById } from '../../../services/technician.service';
import { ErrorUtils } from '../../../utils/error.utils';
import { formatCurrency } from '../../../utils/currency.utils';

export type ProposalListItem = {
  id: number;
  requestId: number;
  technicianId: number | null;
  technicianName: string;
  specialty: string | null;
  isVerified: boolean;
  ratingValue: number;
  ratingCount: number | null;
  priceLabel: string;
  rawPrice: number | null;
  estimatedTimeLabel: string | null;
  message: string | null;
  submittedAt: string | null;
  submittedLabel: string | null;
  arrivalLabel: string | null;
  status: string | null;
};

export type ProposalsRequestSummary = {
  title: string;
  serviceName: string | null;
  statusLabel: string;
  statusTone: 'waiting' | 'proposals' | 'assigned' | 'completed' | 'cancelled' | 'default';
  locationLabel: string | null;
  budgetLabel: string | null;
  publishedLabel: string | null;
  proposalsCount: number;
};

type RawProposal = Record<string, unknown> & {
  idSolTec?: number;
  idSolicitud?: number;
  idTecnico?: number;
  costoAcordado?: string | number | null;
  estadoAcuerdo?: string | null;
  fechaPropuesta?: string | null;
  fechaConfirmada?: string | null;
  notas?: string | null;
};

type TechnicianSnapshot = {
  nombres?: string | null;
  apellidos?: string | null;
  status?: string | null;
  promedioCalificaciones?: string | number | null;
  totalCalificaciones?: string | number | null;
  servicios?: Array<Record<string, unknown>> | null;
};

type UseProposalsListResult = {
  proposals: ProposalListItem[];
  summary: ProposalsRequestSummary | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  hasContent: boolean;
};

const DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  hour: 'numeric',
  minute: '2-digit',
});

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const pickString = (...candidates: Array<unknown>): string | null => {
  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }

  return null;
};

const normalizePrice = (value: string | number | null | undefined): { amount: number | null; label: string } => {
  const amount = toNumber(value);

  if (amount === null) {
    return { amount: null, label: 'Sin cotización' };
  }

  return { amount, label: `$ ${formatCurrency(amount)}` };
};

const formatDateLabel = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }

  try {
    return DATE_FORMATTER.format(new Date(value)).replace('.', '');
  } catch (error) {
    ErrorUtils.logError(error, 'useProposalsList.formatDateLabel');
    return null;
  }
};

const formatScheduleLabel = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startOfTarget.getTime() - startOfToday.getTime()) / 86400000);

  const timePart = TIME_FORMATTER.format(date);

  if (diffDays === 0) {
    return `Hoy, ${timePart}`;
  }

  if (diffDays === 1) {
    return `Mañana, ${timePart}`;
  }

  return `${DATE_FORMATTER.format(date).replace('.', '')}, ${timePart}`;
};

const normalizeNumber = (value: unknown): number | null => {
  if (value == null) {
    return null;
  }

  const parsed = typeof value === 'string' ? Number.parseFloat(value) : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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
    return `$ ${formatCurrency(minValue)} - $ ${formatCurrency(maxValue)}`;
  }

  if (estimated != null) {
    return `$ ${formatCurrency(estimated)}`;
  }

  if (promotion != null) {
    return `$ ${formatCurrency(promotion)}`;
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
): { label: string; tone: ProposalsRequestSummary['statusTone'] } => {
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
    return { label: 'Esperando propuestas', tone: 'waiting' };
  }

  if (normalized === 'COMPLETADA') {
    return { label: 'Completado', tone: 'completed' };
  }

  if (normalized === 'CANCELADA') {
    return { label: 'Cancelado', tone: 'cancelled' };
  }

  return { label: estado ?? 'Estado desconocido', tone: 'default' };
};

const extractTechnicianSnapshot = (payload: unknown): TechnicianSnapshot | undefined => {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  const record = payload as Record<string, unknown>;
  const usuario = record['usuario'];
  return {
    nombres: record['nombres'] as string | undefined,
    apellidos: record['apellidos'] as string | undefined,
    status: (record['status'] ?? record['estado']) as string | undefined,
    promedioCalificaciones: record['promedioCalificaciones'] as string | number | undefined,
    totalCalificaciones: record['totalCalificaciones'] as string | number | undefined,
    servicios: (record['servicios'] as Array<Record<string, unknown>> | undefined) ?? null,
    ...(usuario && typeof usuario === 'object' ? { usuario } : {}),
  };
};

const resolveTechnicianName = (proposal: RawProposal, snapshot: TechnicianSnapshot | undefined): string => {
  const nameFromProposal = pickString(
    proposal['tecnicoNombre'],
    proposal['nombreTecnico'],
    proposal['nombreTecnicoCompleto'],
    proposal['technicianName'],
    proposal['nombre'],
  );

  if (nameFromProposal) {
    return nameFromProposal;
  }

  const nombres = pickString(snapshot?.nombres, snapshot?.['usuario'] && (snapshot['usuario'] as Record<string, unknown>)?.['nombres']);
  const apellidos = pickString(snapshot?.apellidos, snapshot?.['usuario'] && (snapshot['usuario'] as Record<string, unknown>)?.['apellidos']);

  const composed = [nombres, apellidos].filter(Boolean).join(' ').trim();

  if (composed.length > 0) {
    return composed;
  }

  const technicianId = proposal.idTecnico ?? snapshot?.['idTecnico'];
  return technicianId ? `Técnico #${technicianId}` : 'Técnico sin nombre';
};

const resolveSpecialty = (proposal: RawProposal, snapshot: TechnicianSnapshot | undefined): string | null => {
  const specialty = pickString(
    proposal['especialidad'],
    proposal['especialidadTecnico'],
    proposal['serviceName'],
  );

  if (specialty) {
    return specialty;
  }

  const servicios = (snapshot?.servicios ?? []) as Array<Record<string, unknown>>;

  for (const servicio of servicios) {
    const nombre = pickString(servicio['nombreServicio'], servicio['nombre'], servicio['descripcion']);
    if (nombre) {
      return nombre;
    }
  }

  return null;
};

const resolveVerification = (proposal: RawProposal, snapshot: TechnicianSnapshot | undefined): boolean => {
  const proposalFlag = proposal['tecnicoVerificado'];
  if (typeof proposalFlag === 'boolean') {
    return proposalFlag;
  }

  if (typeof proposalFlag === 'string') {
    const normalized = proposalFlag.trim().toUpperCase();
    if (normalized === 'SI' || normalized === 'VERIFICADO' || normalized === 'TRUE') {
      return true;
    }
    if (normalized === 'NO' || normalized === 'FALSE') {
      return false;
    }
  }

  const status = pickString(snapshot?.status, snapshot?.['estado']);
  return status?.toUpperCase() === 'VERIFICADO';
};

const resolveRating = (proposal: RawProposal, snapshot: TechnicianSnapshot | undefined): { value: number; count: number | null } => {
  const proposalRating = toNumber(proposal['rating'] ?? proposal['calificacion']);
  const technicianRating = toNumber(snapshot?.promedioCalificaciones);
  const value = proposalRating ?? technicianRating ?? 0;

  const proposalCount = toNumber(proposal['totalResenas'] ?? proposal['reviews'] ?? proposal['ratingCount']);
  const technicianCount = toNumber(snapshot?.totalCalificaciones);
  const count = proposalCount ?? technicianCount ?? null;

  return { value, count };
};

const resolveEstimatedTime = (proposal: RawProposal): string | null => {
  const textual = pickString(
    proposal['tiempoEstimado'],
    proposal['tiempoEstimadoLabel'],
    proposal['tiempoEstimadoTexto'],
    proposal['tiempoEstimadoHumanizado'],
  );

  if (textual) {
    return textual;
  }

  const minValue = toNumber(proposal['tiempoEstimadoMin'] ?? proposal['duracionEstimadaMin']);
  const maxValue = toNumber(proposal['tiempoEstimadoMax'] ?? proposal['duracionEstimadaMax']);

  if (minValue !== null && maxValue !== null) {
    return `${minValue} - ${maxValue} min`;
  }

  if (minValue !== null) {
    return `${minValue} min`;
  }

  return null;
};

const createServiceTypeMap = (serviceTypes: ServiceType[]): Map<number, string> => {
  return serviceTypes.reduce<Map<number, string>>((acc, item) => {
    acc.set(item.idTipoServicio, item.nombre);
    return acc;
  }, new Map());
};

export function useProposalsList(idSolicitud: number): UseProposalsListResult {
  const [proposals, setProposals] = useState<ProposalListItem[]>([]);
  const [summary, setSummary] = useState<ProposalsRequestSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const parroquiaMapRef = useRef<Map<string, Parroquia>>(new Map());
  const serviceTypeMapRef = useRef<Map<number, string>>(new Map());
  const requestDetailsRef = useRef<RequestDetails | null>(null);

  const ensureServiceTypes = useCallback(async () => {
    if (serviceTypeMapRef.current.size > 0) {
      return;
    }

    try {
      const serviceTypes = await homeService.getServiceTypes();
      serviceTypeMapRef.current = createServiceTypeMap(serviceTypes);
    } catch (serviceError) {
      ErrorUtils.logError(serviceError, 'useProposalsList.ensureServiceTypes');
    }
  }, []);

  const ensureParroquias = useCallback(async () => {
    if (parroquiaMapRef.current.size > 0) {
      return;
    }

    try {
      const parroquias = await homeService.getParroquias();
      parroquiaMapRef.current = new Map(parroquias.map(item => [item.codigoParroquia, item]));
    } catch (parroquiaError) {
      ErrorUtils.logError(parroquiaError, 'useProposalsList.ensureParroquias');
    }
  }, []);

  const fetchProposals = useCallback(
    async (showLoader: boolean = false) => {
      if (showLoader) {
        setLoading(true);
      }

      try {
        setError(null);

        const [response, details] = await Promise.all([
          homeService.getProposals(idSolicitud),
          homeService.getRequestDetails(idSolicitud),
        ]);

        requestDetailsRef.current = details;

        await Promise.all([ensureServiceTypes(), ensureParroquias()]);

        const rawProposals: RawProposal[] = Array.isArray(response) ? response : [];
        const technicianSnapshots = new Map<number, TechnicianSnapshot>();

        rawProposals.forEach(proposal => {
          const nested = proposal['tecnico'] ?? proposal['technician'];
          if (nested) {
            const idCandidate = toNumber((nested as Record<string, unknown>)['idTecnico']);
            if (idCandidate !== null && !technicianSnapshots.has(idCandidate)) {
              technicianSnapshots.set(idCandidate, extractTechnicianSnapshot(nested));
            }
          }
        });

        const technicianIds = Array.from(
          new Set(
            rawProposals
              .map(item => toNumber(item.idTecnico))
              .filter((value): value is number => value !== null && !Number.isNaN(value)),
          ),
        ).filter(id => !technicianSnapshots.has(id));

        if (technicianIds.length > 0) {
          await Promise.all(
            technicianIds.map(async id => {
              try {
                const technician = await getTechnicianById(id);
                technicianSnapshots.set(id, {
                  nombres: technician?.usuario?.nombres ?? (technician as any)?.nombres,
                  apellidos: technician?.usuario?.apellidos ?? (technician as any)?.apellidos,
                  status: technician?.status,
                  promedioCalificaciones: technician?.promedioCalificaciones,
                  totalCalificaciones: technician?.totalCalificaciones,
                  servicios: (technician as any)?.servicios ?? null,
                  ...(technician?.usuario ? { usuario: technician.usuario } : {}),
                });
              } catch (snapshotError) {
                ErrorUtils.logError(snapshotError, `useProposalsList.getTechnicianById(${id})`);
              }
            }),
          );
        }

        const normalized: ProposalListItem[] = rawProposals
          .filter(item => typeof item.idSolTec === 'number')
          .map(item => {
            const technicianId = toNumber(item.idTecnico);
            const snapshot = technicianId !== null ? technicianSnapshots.get(technicianId) : undefined;

            const { amount, label } = normalizePrice(item.costoAcordado);
            const { value: ratingValue, count: ratingCount } = resolveRating(item, snapshot);
            const fechaPropuesta = pickString(item.fechaPropuesta, item.fechaConfirmada);

            return {
              id: item.idSolTec as number,
              requestId: idSolicitud,
              technicianId: technicianId ?? null,
              technicianName: resolveTechnicianName(item, snapshot),
              specialty: resolveSpecialty(item, snapshot),
              isVerified: resolveVerification(item, snapshot),
              ratingValue,
              ratingCount,
              priceLabel: label,
              rawPrice: amount,
              estimatedTimeLabel: resolveEstimatedTime(item),
              message: pickString(item.notas, item['mensajeTecnico'], item['mensaje']),
              submittedAt: fechaPropuesta,
              submittedLabel: formatDateLabel(fechaPropuesta),
              arrivalLabel: formatScheduleLabel(fechaPropuesta),
              status: pickString(item.estadoAcuerdo),
            };
          });

        setProposals(normalized);

        const locationLabel = buildLocationLabel(details.codigoParroquia, parroquiaMapRef.current);
        const { label: statusLabel, tone: statusTone } = resolveStatusInfo(details.estadoSolicitud, normalized.length);
        const budgetLabel = resolveBudgetLabel(details);
        const publishedLabel = formatDateLabel(details.fechaPublicacion ?? details.createdAt);
        const serviceName = serviceTypeMapRef.current.get(details.idTipoServicio) ?? null;

        setSummary({
          title: details.tituloProblema?.trim() || 'Solicitud sin título',
          serviceName,
          statusLabel,
          statusTone,
          locationLabel,
          budgetLabel,
          publishedLabel,
          proposalsCount: normalized.length,
        });
      } catch (fetchError) {
        ErrorUtils.logError(fetchError, 'useProposalsList.fetchProposals');
        setError(ErrorUtils.getErrorMessage(fetchError));
        setProposals([]);

        if (!requestDetailsRef.current) {
          setSummary(null);
        }
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [ensureParroquias, ensureServiceTypes, idSolicitud],
  );

  useFocusEffect(
    useCallback(() => {
      fetchProposals(true);
      return () => undefined;
    }, [fetchProposals]),
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProposals(false);
    setRefreshing(false);
  }, [fetchProposals]);

  const hasContent = useMemo(() => proposals.length > 0, [proposals]);

  return {
    proposals,
    summary,
    loading,
    refreshing,
    error,
    refresh,
    hasContent,
  };
}
