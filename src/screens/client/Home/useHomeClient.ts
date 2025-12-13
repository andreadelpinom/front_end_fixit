import { useCallback, useMemo, useState } from 'react';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import { homeService, Parroquia, RequestPreview, ServiceType, TechPreview } from '../../../services/home.service';
import { ClientTabParamList } from '../../../navigation/types';

export type ServiceCardVariant = 'EMPTY' | 'PROPOSALS' | 'IN_PROGRESS' | 'WAITING';

type ServiceCardBadgeTone = 'info' | 'success' | 'warning';

type ServiceStateModel = {
  variant: ServiceCardVariant;
  title: string;
  description: string;
  badgeLabel?: string;
  badgeTone?: ServiceCardBadgeTone;
  requestTitle?: string;
  requestSubtitle?: string;
  requestId?: number;
};

export type LocationInfo = {
  parroquia?: string;
  canton?: string;
};

type HomeClientState = {
  greetingName: string;
  location: LocationInfo | null;
  serviceState: ServiceStateModel;
  categories: ServiceType[];
  technicians: TechPreview[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
  onPrimaryAction: () => void;
};

const TECH_LIMIT = 6;
const CATEGORY_LIMIT = 6;

const LIVE_STATES = ['ACEPTADA', 'EN_PROCESO', 'EN_CURSO', 'IN_PROGRESS'];

const sortByPublishedDate = (a?: string, b?: string): number => {
  const dateA = a ? new Date(a).getTime() : 0;
  const dateB = b ? new Date(b).getTime() : 0;
  return dateB - dateA;
};

const selectFeaturedRequest = (requests: RequestPreview[]) => {
  const sorted = [...requests].sort((a, b) => sortByPublishedDate(a.createdAt, b.createdAt));

  const live = sorted.find(item =>
    item.estado ? LIVE_STATES.includes(item.estado.toUpperCase()) : false,
  );
  if (live) return { variant: 'IN_PROGRESS' as ServiceCardVariant, request: live };

  const withProposals = sorted.find(
    item => item.estado?.toUpperCase() === 'PENDIENTE' && (item.proposalCount ?? 0) > 0,
  );
  if (withProposals) {
    return { variant: 'PROPOSALS' as ServiceCardVariant, request: withProposals };
  }

  const waiting = sorted.find(item => item.estado?.toUpperCase() === 'PENDIENTE');
  if (waiting) {
    return { variant: 'WAITING' as ServiceCardVariant, request: waiting };
  }

  return { variant: 'EMPTY' as ServiceCardVariant, request: null };
};

const buildServiceState = (
  result: ReturnType<typeof selectFeaturedRequest>,
  parroquiaLookup: Map<string, Parroquia>,
): { state: ServiceStateModel; location: LocationInfo | null } => {
  if (!result.request) {
    return {
      state: {
        variant: 'EMPTY',
        title: 'Sin servicios activos',
        description: 'Crea una solicitud para recibir propuestas de técnicos calificados.',
      },
      location: null,
    };
  }

  const { request, variant } = result;
  const requestLabel = request.titulo ?? request.tituloProblema ?? '';
  const parroquia = request.codigoParroquia
    ? parroquiaLookup.get(request.codigoParroquia)
    : undefined;

  const location: LocationInfo | null = parroquia
    ? {
        parroquia: parroquia.nombre,
        canton: parroquia.cantonNombre,
      }
    : null;

  if (variant === 'IN_PROGRESS') {
    return {
      state: {
        variant,
        title: 'Servicio en curso',
        description: 'Tu técnico está trabajando en esta solicitud.',
        badgeLabel: 'En vivo',
        badgeTone: 'success',
        requestTitle: requestLabel,
        requestSubtitle: request.estado ?? 'En progreso',
        requestId: request.idSolicitud,
      },
      location,
    };
  }

  if (variant === 'PROPOSALS') {
    const proposals = request.proposalCount ?? 0;
    return {
      state: {
        variant,
        title: `${proposals} ${proposals === 1 ? 'propuesta recibida' : 'propuestas recibidas'}`,
        description: 'Revisa las propuestas y acepta la mejor opción para tu servicio.',
        badgeLabel: 'Nuevas',
        badgeTone: 'info',
        requestTitle: requestLabel,
        requestSubtitle: 'Pendiente de selección',
        requestId: request.idSolicitud,
      },
      location,
    };
  }

  return {
    state: {
      variant: 'WAITING',
      title: 'Solicitud publicada',
      description: 'Estamos buscando técnicos disponibles. Te avisaremos cuando tengamos propuestas.',
      badgeLabel: 'En espera',
      badgeTone: 'warning',
      requestTitle: requestLabel,
      requestSubtitle: 'Esperando propuestas',
      requestId: request.idSolicitud,
    },
    location,
  };
};

async function resolveParroquias(): Promise<Map<string, Parroquia>> {
  try {
    const parroquias = await homeService.getParroquias();
    return new Map(parroquias.map(item => [item.codigoParroquia, item]));
  } catch (error) {
    console.warn('[useHomeClient] Error loading parroquias', error);
    return new Map();
  }
}

export function useHomeClient(
  navigation: NavigationProp<ClientTabParamList>,
): HomeClientState {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ServiceType[]>([]);
  const [technicians, setTechnicians] = useState<TechPreview[]>([]);
  const [serviceState, setServiceState] = useState<ServiceStateModel>({
    variant: 'EMPTY',
    title: 'Sin servicios activos',
    description: 'Crea una solicitud para recibir propuestas de técnicos calificados.',
  });
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrimaryAction = useCallback(() => {
    navigation.navigate('ClientServices', {
      screen: 'ClientServicesScreen',
    });

    if (serviceState.variant === 'EMPTY') {
      navigation.navigate('ClientServices', {
        screen: 'CreateRequestStack',
        params: {
          screen: 'RequestStepService',
        },
      });
      return;
    }

    if (serviceState.requestId) {
      navigation.navigate('ClientServices', {
        screen: 'RequestDetails',
        params: { idSolicitud: serviceState.requestId },
      });
    }
  }, [navigation, serviceState]);

  const loadHomeData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const [solicitudes, serviceTypes, techs, parroquiaMap] = await Promise.all([
        homeService.getMySolicitudes(),
        homeService.getServiceTypes(),
        homeService.getTopRatedTechs(TECH_LIMIT),
        resolveParroquias(),
      ]);

      const selection = selectFeaturedRequest(solicitudes ?? []);
      const { state, location: resolvedLocation } = buildServiceState(selection, parroquiaMap);

      setServiceState(state);
      setLocation(resolvedLocation);
      setCategories(serviceTypes.slice(0, CATEGORY_LIMIT));
      setTechnicians(techs.slice(0, TECH_LIMIT));
    } catch (err) {
      console.error('[useHomeClient] Error loading home data', err);
      setError('No se pudo cargar la información. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadHomeData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => undefined;
    }, [loadHomeData]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  }, [loadHomeData]);

  const greetingName = useMemo(() => {
    if (!user?.nombres) return 'Bienvenido';
    const [first] = user.nombres.split(' ');
    return first ? `Hola, ${first}` : 'Hola';
  }, [user?.nombres]);

  return {
    greetingName,
    location,
    serviceState,
    categories,
    technicians,
    loading,
    refreshing,
    error,
    onRefresh,
    onPrimaryAction: handlePrimaryAction,
  };
}
