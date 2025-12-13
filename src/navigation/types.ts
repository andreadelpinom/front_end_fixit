import { NavigatorScreenParams } from '@react-navigation/native';
import { ProposalListItem, ProposalsRequestSummary } from '../screens/client/Proposals/useProposalsList';

export type RequestWizardStackParamList = {
  RequestStepService: undefined;
  RequestStepProblem: undefined;
  RequestStepSchedule: undefined;
  RequestStepPhotos: undefined;
  RequestStepAddress: undefined;
  RequestStepReview: undefined;
};

export type ClientServicesStackParamList = {
  ClientServicesScreen: undefined;
  ClientRequests: undefined;
  RequestDetails: { idSolicitud: number };
  ProposalsList: { idSolicitud: number };
  ProposalDetail: {
    idSolicitud: number;
    proposal: ProposalListItem;
    summary?: ProposalsRequestSummary | null;
  };
  CreateRequestStack: NavigatorScreenParams<RequestWizardStackParamList> | undefined;
};

export type ClientProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  RequestsHistory: undefined;
  ActiveServices: undefined;
  Notifications: undefined;
  Support: undefined;
  BecomeTechnician: undefined;
};

export type ClientTabParamList = {
  ClientHome: undefined;
  ClientServices: NavigatorScreenParams<ClientServicesStackParamList> | undefined;
  ClientActivity: undefined;
  ClientProfile: NavigatorScreenParams<ClientProfileStackParamList> | undefined;
};
