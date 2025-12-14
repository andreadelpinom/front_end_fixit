import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { homeService, RequestPreview } from '../../../services/home.service';
import { ErrorUtils } from '../../../utils/error.utils';

export type ClientServicesTab = 'ACTIVE' | 'PUBLISHED' | 'COMPLETED';

type GroupedRequests = Record<ClientServicesTab, RequestPreview[]>;

type UseClientServicesResult = {
  activeTab: ClientServicesTab;
  onSelectTab: (tab: ClientServicesTab) => void;
  groupedRequests: GroupedRequests;
  currentRequests: RequestPreview[];
  counts: Record<ClientServicesTab, number>;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRetry: () => Promise<void>;
  onRefresh: () => Promise<void>;
};

const TAB_STATUS_MAP: Record<ClientServicesTab, string[]> = {
  ACTIVE: ['ACEPTADA', 'EN_PROCESO', 'ASIGNADA'],
  PUBLISHED: ['PENDIENTE', 'PUBLICADA'],
  COMPLETED: ['COMPLETADA'],
};

const normalizeStatus = (status?: string): string => (status ?? '').trim().toUpperCase();

export const useClientServices = (): UseClientServicesResult => {
  const [activeTab, setActiveTab] = useState<ClientServicesTab>('ACTIVE');
  const [requests, setRequests] = useState<RequestPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await homeService.getMySolicitudes();
      setRequests(response);
    } catch (err) {
      ErrorUtils.logError(err, 'useClientServices.fetchRequests');
      setError(ErrorUtils.getErrorMessage(err));
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRequests = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const response = await homeService.getMySolicitudes();
      setRequests(response);
    } catch (err) {
      ErrorUtils.logError(err, 'useClientServices.refreshRequests');
      setError(ErrorUtils.getErrorMessage(err));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [fetchRequests]),
  );

  const groupedRequests = useMemo<GroupedRequests>(() => {
    const initialGroups: GroupedRequests = {
      ACTIVE: [],
      PUBLISHED: [],
      COMPLETED: [],
    };

    const grouped = requests.reduce((acc, request) => {
      const status = normalizeStatus(request.estado);

      if (status === 'CANCELADA' || status === '') {
        return acc;
      }

      (Object.keys(TAB_STATUS_MAP) as ClientServicesTab[]).forEach(tab => {
        if (TAB_STATUS_MAP[tab].includes(status)) {
          acc[tab].push(request);
        }
      });

      return acc;
    }, initialGroups);

    (Object.keys(grouped) as ClientServicesTab[]).forEach(tab => {
      grouped[tab].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    });

    return grouped;
  }, [requests]);

  const counts = useMemo<Record<ClientServicesTab, number>>(
    () => ({
      ACTIVE: groupedRequests.ACTIVE.length,
      PUBLISHED: groupedRequests.PUBLISHED.length,
      COMPLETED: groupedRequests.COMPLETED.length,
    }),
    [groupedRequests],
  );

  const currentRequests = groupedRequests[activeTab];

  return {
    activeTab,
    onSelectTab: setActiveTab,
    groupedRequests,
    currentRequests,
    counts,
    loading,
    refreshing,
    error,
    onRetry: fetchRequests,
    onRefresh: refreshRequests,
  };
};
