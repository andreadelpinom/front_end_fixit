import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { homeService, RequestDetails } from '../../../services/home.service';
import { ErrorUtils } from '../../../utils/error.utils';
import { ProposalListItem } from './useProposalsList';

type UseProposalDetailResult = {
  proposal: ProposalListItem;
  accepting: boolean;
  isAccepted: boolean;
  error: string | null;
  acceptProposal: () => Promise<AcceptProposalResult>;
};

type AcceptProposalResult = {
  success: boolean;
  details: RequestDetails | null;
  proposalsCount: number;
};

export function useProposalDetail(
  initialProposal: ProposalListItem,
  requestId: number,
): UseProposalDetailResult {
  const [proposal, setProposal] = useState<ProposalListItem>(initialProposal);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptProposal = useCallback(async (): Promise<AcceptProposalResult> => {
    if (!proposal?.id) {
      return { success: false, details: null, proposalsCount: 0 };
    }

    try {
      setAccepting(true);
      setError(null);
      await homeService.acceptProposal(proposal.id);
      setProposal(prev => ({ ...prev, status: 'ACEPTADO' }));
      let details: RequestDetails | null = null;
      let proposalsCount = 0;

      try {
        const [fetchedDetails, fetchedProposals] = await Promise.all([
          homeService.getRequestDetails(requestId),
          homeService.getProposals(requestId),
        ]);
        details = fetchedDetails ?? null;
        proposalsCount = Array.isArray(fetchedProposals) ? fetchedProposals.length : 0;
      } catch (refreshError) {
        ErrorUtils.logError(refreshError, 'useProposalDetail.acceptProposal.refetch');
      }

      return { success: true, details, proposalsCount };
    } catch (acceptError) {
      ErrorUtils.logError(acceptError, 'useProposalDetail.acceptProposal');
      const message = ErrorUtils.getErrorMessage(acceptError) ?? 'No pudimos aceptar la propuesta. Intenta nuevamente.';
      setError(message);
      Alert.alert('No se pudo aceptar', message);
      return { success: false, details: null, proposalsCount: 0 };
    } finally {
      setAccepting(false);
    }
  }, [proposal?.id, requestId]);

  const isAccepted = (proposal.status ?? '').toUpperCase() === 'ACEPTADO';

  return {
    proposal,
    accepting,
    isAccepted,
    error,
    acceptProposal,
  };
}
