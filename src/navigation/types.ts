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
  CreateRequestStack: any | undefined;
  MaestritoChat: undefined;
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
  ClientServices: any | undefined;
  ClientActivity: undefined;
  ClientProfile: any | undefined;
};

// Technician navigation types
export type TechnicianExploreStackParamList = {
  AvailableRequests: undefined;
  RequestDetail: { request: Solicitud };
};

export type TechnicianJobsStackParamList = {
  MyJobs: undefined;
  Notifications: undefined;
};

export type TechnicianProfileStackParamList = {
  TechnicianProfile: undefined;
  Notifications: undefined;
  Support: undefined;
};

export type TechnicianProposalsStackParamList = {
  TechnicianProposals: undefined;
};

export type TechnicianTabParamList = {
  TechnicianHome: undefined;
  TechnicianExplore: any | undefined;
  TechnicianJobs: any | undefined;
  TechnicianProfile: any | undefined;
  TechnicianProposals: any | undefined;
};
