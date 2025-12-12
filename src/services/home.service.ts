import { apiClient } from './api-client.service';
import { getApiUrl } from '../config/api.config';
import { ErrorUtils } from '../utils/error.utils';

// -----------------------------
// Types / Interfaces
// -----------------------------
export interface Category {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
}

export interface TechPreview {
  idTecnico: number;
  nombres: string;
  apellidos?: string;
  avatarUrl?: string;
  rating?: number;
  distanceKm?: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
  active?: boolean;
}

export interface RequestPreview {
  idSolicitud: number;
  titulo?: string;
  descripcion?: string;
  estado?: string;
  createdAt?: string;
  ubicacion?: string;
  idTipoServicio?: number;
}

export interface RequestDetails {
  idSolicitud: number;
  idUser: number;
  idTipoServicio: number;
  codigoParroquia: string;
  tituloProblema: string;
  descripcionProblema: string;
  costoEstimado: number | null;
  estadoSolicitud: string;
  fechaProgramada: string | null;
  fechaPublicacion: string;
  fechaInicio: string | null;
  fechaFinalizacion: string | null;
  createdAt: string;
  propuestas?: ProposalDetails[];
}

export interface ProposalDetails {
  idSolTec: number;
  idTecnico: number;
  idSolicitud: number;
  costoAcordado: number;
  notas: string | null;
  estadoAcuerdo: 'PROPUESTO' | 'ACEPTADO' | 'RECHAZADO';
  fechaPropuesta: string;
  tecnico?: {
    nombres: string;
    apellidos: string;
    telefono?: string;
    calificacionPromedio?: number;
  };
}

export interface ServiceType {
  idTipoServicio: number;
  nombre: string;
  descripcion?: string;
  subServicio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Parroquia {
  codigoParroquia: string;
  nombre: string;
  codigoCanton?: string;
  codigoProvincia?: string;
}

// -----------------------------
// Home Service
// -----------------------------
class HomeService {
  private unwrapArrayResponse<T>(resp: unknown): T[] {
    try {
      // If backend already unwrapped, return array directly
      if (Array.isArray(resp)) return resp as T[];

      // If response is an envelope { success, data }
      if (resp && typeof resp === 'object') {
        const anyResp = resp as any;

        // Handle { success, data: [...] }
        if (anyResp.success === true && Array.isArray(anyResp.data)) {
          return anyResp.data as T[];
        }

        // Handle { success, data: { solicitudes: [...] } }
        if (
          anyResp.success === true &&
          anyResp.data &&
          typeof anyResp.data === 'object'
        ) {
          const dataObj = anyResp.data as any;
          // Try common property names for arrays
          if (Array.isArray(dataObj.solicitudes))
            return dataObj.solicitudes as T[];
          if (Array.isArray(dataObj.items)) return dataObj.items as T[];
          if (Array.isArray(dataObj.data)) return dataObj.data as T[];
        }

        // Handle direct response from microservices: { solicitudes: [...], pagination: {...} }
        if (Array.isArray(anyResp.solicitudes)) {
          return anyResp.solicitudes as T[];
        }

        // success is false or data missing
        return [];
      }

      return [];
    } catch (e) {
      // Defensive fallback
      console.error('HomeService.unwrapArrayResponse error', e);
      return [];
    }
  }
  // Real backend calls
  async getCategories(): Promise<Category[]> {
    try {
      const url = getApiUrl('/technician/tipos-servicios');
      const resp = await apiClient.get<unknown>(url);
      const data = this.unwrapArrayResponse<Category>(resp);
      return data;
    } catch (err) {
      console.error('HomeService.getCategories error', err);
      ErrorUtils.logError(err, 'HomeService.getCategories');
      return [];
    }
  }

  async getServiceTypes(): Promise<ServiceType[]> {
    try {
      const url = getApiUrl('/technician/tipos-servicios');
      const resp = await apiClient.get<unknown>(url);
      const data = this.unwrapArrayResponse<any>(resp);
      
      // Normalize backend field names to match frontend expectations
      return data.map(item => ({
        idTipoServicio: item.idTipoServicio,
        nombre: item.nombreServicio,
        descripcion: item.descripcionServicio,
        subServicio: item.subServicio,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    } catch (err) {
      console.error('HomeService.getServiceTypes error', err);
      ErrorUtils.logError(err, 'HomeService.getServiceTypes');
      return [];
    }
  }

  async getParroquias(codigoCanton?: string): Promise<Parroquia[]> {
    try {
      const baseUrl = getApiUrl('/geo/parroquias');
      const url =
        codigoCanton != null && codigoCanton !== ''
          ? `${baseUrl}?codigoCanton=${encodeURIComponent(codigoCanton)}`
          : baseUrl;

      const response = await apiClient.get<unknown>(url);
      const data = this.unwrapArrayResponse<any>(response);

      // Normalize backend field names to match frontend expectations
      const mappedParroquias = data.map(item => ({
        codigoParroquia: item.codigoParroquia,
        nombre: item.nombreParroquia,
        codigoCanton: item.codigoCanton,
        codigoProvincia: item.canton?.codigoProvincia,
      }));

      console.log('[HomeService] Parroquias fetched', {
        count: mappedParroquias.length,
        hasFilter: !!codigoCanton,
      });

      return mappedParroquias;
    } catch (error) {
      console.error('[HomeService] Error fetching parroquias', error);
      ErrorUtils.logError(error, 'HomeService.getParroquias');
      return [];
    }
  }

  async getTopRatedTechs(limit = 10): Promise<TechPreview[]> {
    try {
      const q = encodeURIComponent(String(limit));
      const url = `${getApiUrl('/technician/tecnicos/top-rated')}?limit=${q}`;
      const resp = await apiClient.get<unknown>(url);
      const data = this.unwrapArrayResponse<TechPreview>(resp);
      return data;
    } catch (err) {
      console.error('HomeService.getTopRatedTechs error', err);
      ErrorUtils.logError(err, 'HomeService.getTopRatedTechs');
      return [];
    }
  }

  async getRecentRequests(): Promise<RequestPreview[]> {
    try {
      const url = getApiUrl('/request/solicitudes');
      const resp = await apiClient.get<unknown>(url);
      const data = this.unwrapArrayResponse<RequestPreview>(resp);
      return data;
    } catch (err) {
      console.error('HomeService.getRecentRequests error', err);
      ErrorUtils.logError(err, 'HomeService.getRecentRequests');
      return [];
    }
  }

  // Obtener las solicitudes del usuario (mis solicitudes)
  async getMySolicitudes(): Promise<RequestPreview[]> {
    try {
      const url = getApiUrl('/request/solicitudes/my/solicitudes');
      const resp = await apiClient.get<unknown>(url);
      const data = this.unwrapArrayResponse<any>(resp);

      // Normalize backend field names to match frontend expectations
      const mappedSolicitudes = data.map(item => ({
        idSolicitud: item.idSolicitud,
        titulo: item.tituloProblema,
        descripcion: item.descripcionProblema,
        estado: item.estadoSolicitud,
        createdAt: item.createdAt,
        ubicacion: item.codigoParroquia,
        idTipoServicio: item.idTipoServicio,
      }));

      console.log('[HomeService] Mis solicitudes fetched', {
        count: mappedSolicitudes.length,
      });

      return mappedSolicitudes;
    } catch (err) {
      console.error('HomeService.getMySolicitudes error', err);
      ErrorUtils.logError(err, 'HomeService.getMySolicitudes');
      return [];
    }
  }

  // Obtener detalles de una solicitud con propuestas
  async getRequestDetails(idSolicitud: number): Promise<RequestDetails> {
    try {
      // Obtener solicitud (crítico)
      const solicitudResp = await apiClient.get<unknown>(getApiUrl(`/request/solicitudes/${idSolicitud}`));
      
      // Procesar solicitud
      let solicitud: any;
      if (solicitudResp && typeof solicitudResp === 'object') {
        const anyResp = solicitudResp as any;
        solicitud = anyResp.data || anyResp;
      } else {
        solicitud = solicitudResp;
      }

      // Intentar obtener propuestas (no crítico - puede fallar)
      let propuestas: any[] = [];
      try {
        const propuestasResp = await apiClient.get<unknown>(
          getApiUrl(`/request/solicitudes-tecnicos/solicitud/${idSolicitud}`)
        );
        
        if (Array.isArray(propuestasResp)) {
          propuestas = propuestasResp;
        } else if (propuestasResp && typeof propuestasResp === 'object') {
          const anyResp = propuestasResp as any;
          if (Array.isArray(anyResp.data)) {
            propuestas = anyResp.data;
          } else if (anyResp.data && Array.isArray(anyResp.data.propuestas)) {
            propuestas = anyResp.data.propuestas;
          }
        }
      } catch (propErr) {
        // Si falla obtener propuestas, continuar sin ellas
        console.warn('[HomeService] No se pudieron cargar propuestas:', propErr);
        propuestas = [];
      }

      // Combinar solicitud con propuestas
      const result = {
        ...solicitud,
        propuestas: propuestas,
      };

      console.log('[HomeService] Request details fetched', {
        idSolicitud,
        hasProposals: propuestas.length,
      });

      return result as RequestDetails;
    } catch (err) {
      console.error('HomeService.getRequestDetails error', err);
      ErrorUtils.logError(err, 'HomeService.getRequestDetails');
      throw err;
    }
  }

  // Cancelar una solicitud
  async cancelRequest(idSolicitud: number): Promise<void> {
    try {
      const url = getApiUrl(`/request/solicitudes/${idSolicitud}/cancel`);
      await apiClient.put(url, {});
      console.log('[HomeService] Request cancelled', { idSolicitud });
    } catch (err) {
      console.error('HomeService.cancelRequest error', err);
      ErrorUtils.logError(err, 'HomeService.cancelRequest');
      throw err;
    }
  }

  // Aceptar una propuesta de técnico
  async acceptProposal(idSolTec: number): Promise<void> {
    try {
      const url = getApiUrl(`/request/solicitudes-tecnicos/${idSolTec}/responder`);
      await apiClient.put(url, {
        estadoAcuerdo: 'ACEPTADO'
      });
      console.log('[HomeService] Proposal accepted', { idSolTec });
    } catch (err) {
      console.error('HomeService.acceptProposal error', err);
      ErrorUtils.logError(err, 'HomeService.acceptProposal');
      throw err;
    }
  }

  // Rechazar una propuesta de técnico
  async rejectProposal(idSolTec: number): Promise<void> {
    try {
      const url = getApiUrl(`/request/solicitudes-tecnicos/${idSolTec}/responder`);
      await apiClient.put(url, {
        estadoAcuerdo: 'RECHAZADO'
      });
      console.log('[HomeService] Proposal rejected', { idSolTec });
    } catch (err) {
      console.error('HomeService.rejectProposal error', err);
      ErrorUtils.logError(err, 'HomeService.rejectProposal');
      throw err;
    }
  }

  // Mocked data (backend not available)
  async getHomeBanners(): Promise<Banner[]> {
    // Simple static mocks; adjust images/links for your UI
    const mocks: Banner[] = [
      {
        id: 'b1',
        title: 'Bienvenido a FixIt',
        subtitle: 'Encuentra técnicos confiables cerca de ti',
        imageUrl: 'https://placehold.co/800x300?text=Banner+1',
        link: undefined,
        active: true,
      },
      {
        id: 'b2',
        title: 'Promoción: 20% dto.',
        subtitle: 'Descuento en servicios seleccionados',
        imageUrl: 'https://placehold.co/800x300?text=Banner+2',
        link: undefined,
        active: true,
      },
    ];

    return Promise.resolve(mocks);
  }

  async getUrgentServices(): Promise<TechPreview[]> {
    // Mock urgent service suggestions (no endpoint implemented yet)
    const mocks: TechPreview[] = [
      {
        idTecnico: 101,
        nombres: 'Carlos',
        apellidos: 'González',
        avatarUrl: 'https://placehold.co/100x100?text=C',
        rating: 4.9,
        distanceKm: 0.8,
      },
      {
        idTecnico: 102,
        nombres: 'María',
        apellidos: 'Pérez',
        avatarUrl: 'https://placehold.co/100x100?text=M',
        rating: 4.8,
        distanceKm: 1.2,
      },
    ];

    return Promise.resolve(mocks);
  }
}

export const homeService = new HomeService();
