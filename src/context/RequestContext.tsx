import React, { createContext, useContext, useState } from 'react';

export interface SolicitudDraft {
  idTipoServicio?: number;
  codigoParroquia?: string;
  tituloProblema?: string;
  descripcionProblema?: string;
  fechaProgramada?: string;
  duracionEstimadaMin?: number;
}

type RequestContextValue = {
  draft: SolicitudDraft;
  updateDraft: (patch: Partial<SolicitudDraft>) => void;
  resetDraft: () => void;
};

const RequestContext = createContext<RequestContextValue | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draft, setDraft] = useState<SolicitudDraft>({});

  const updateDraft = (patch: Partial<SolicitudDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const resetDraft = () => setDraft({});

  return (
    <RequestContext.Provider value={{ draft, updateDraft, resetDraft }}>
      {children}
    </RequestContext.Provider>
  );
};

export function useRequestDraft(): RequestContextValue {
  const ctx = useContext(RequestContext);
  if (!ctx) throw new Error('useRequestDraft must be used within a RequestProvider');
  return ctx;
}

export default RequestContext;
