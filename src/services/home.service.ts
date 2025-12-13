import { apiClient } from './api-client.service';
import { getApiUrl } from '../config/api.config';
import { ErrorUtils } from '../utils/error.utils';
import { extractArray, extractData } from './response-helpers';

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
  codigoParroquia?: string;
  idTipoServicio?: number;
  proposalCount?: number;
}

export interface RequestDetails {
  idSolicitud: number;
  idUser: number;
  idTipoServicio: number;
  codigoParroquia: string;
  tituloProblema: string;
  descripcionProblema: string;
  costoEstimado: number | null;
  costoPromocion: number | null;
  promocion: boolean;
  estadoSolicitud: 'PENDIENTE' | 'PUBLICADA' | 'ACEPTADA' | 'ASIGNADA' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA';
  fechaProgramada: string | null;
  fechaPublicacion: string;
  fechaInicio: string | null;
  fechaFinalizacion: string | null;
  duracionEstimadaMin: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
  updatedBy: number | null;
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
  cantonNombre?: string;
  provinciaNombre?: string;
}

// -----------------------------
// Mapping helpers
// -----------------------------
const mapServiceType = (item: any): ServiceType => ({
  idTipoServicio: Number(item.idTipoServicio ?? item.id ?? 0),
  nombre: item.nombreServicio ?? item.nombre ?? '',
  descripcion: item.descripcionServicio ?? item.descripcion,
  subServicio: item.subServicio,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const mapCategoryFromServiceType = (serviceType: ServiceType): Category => ({
  id: serviceType.idTipoServicio,
  name: serviceType.nombre,
  description: serviceType.descripcion,
});

const mapParroquia = (item: any): Parroquia => ({
  codigoParroquia: item.codigoParroquia,
  nombre: item.nombreParroquia ?? item.nombre,
  codigoCanton: item.codigoCanton ?? item.canton?.codigoCanton,
  codigoProvincia: item.codigoProvincia ?? item.canton?.codigoProvincia,
  cantonNombre: item.canton?.nombre ?? item.nombreCanton,
  provinciaNombre:
    item.canton?.provincia?.nombre ?? item.provincia?.nombre ?? item.nombreProvincia,
});

const mapTechPreview = (item: any): TechPreview => ({
  idTecnico: Number(item.idTecnico ?? item.id ?? 0),
  nombres: item.nombres ?? '',
  apellidos: item.apellidos,
  avatarUrl: item.avatarUrl,
  rating: item.rating,
  distanceKm: item.distanceKm,
});

const mapRequestPreview = (item: any): RequestPreview => ({
  idSolicitud: item.idSolicitud,
  titulo: item.tituloProblema ?? item.titulo,
  descripcion: item.descripcionProblema ?? item.descripcion,
  estado: item.estadoSolicitud ?? item.estado,
  createdAt: item.createdAt,
  ubicacion: item.codigoParroquia ?? item.ubicacion,
  codigoParroquia: item.codigoParroquia,
  idTipoServicio: item.idTipoServicio,
  proposalCount: item._count?.solicitudesTecnico ?? item.proposalCount ?? 0,
});

const mapRequestDetails = (item: any): RequestDetails => ({
  idSolicitud: item.idSolicitud,
  idUser: item.idUser,
  idTipoServicio: item.idTipoServicio,
  codigoParroquia: item.codigoParroquia,
  tituloProblema: item.tituloProblema,
  descripcionProblema: item.descripcionProblema,
  costoEstimado: item.costoEstimado ?? null,
  costoPromocion: item.costoPromocion ?? null,
  promocion: item.promocion ?? false,
  estadoSolicitud: item.estadoSolicitud,
  fechaProgramada: item.fechaProgramada ?? null,
  fechaPublicacion: item.fechaPublicacion,
  fechaInicio: item.fechaInicio ?? null,
  fechaFinalizacion: item.fechaFinalizacion ?? null,
  duracionEstimadaMin: item.duracionEstimadaMin ?? null,
  isActive: item.isActive,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  createdBy: item.createdBy ?? null,
  updatedBy: item.updatedBy ?? null,
});

// -----------------------------
// Home Service
// -----------------------------
class HomeService {
  async getCategories(): Promise<Category[]> {
    try {
      const serviceTypes = await this.getServiceTypes();
      return serviceTypes.map(mapCategoryFromServiceType);
    } catch (error) {
      console.error('HomeService.getCategories error', error);
      ErrorUtils.logError(error, 'HomeService.getCategories');
      return [];
    }
  }

  async getServiceTypes(): Promise<ServiceType[]> {
    try {
      const url = getApiUrl('/technician/tipos-servicios');
      const response = await apiClient.get<unknown>(url);
      const data = extractArray<any>(response, ['data', 'items', 'tiposServicios']);
      return data.map(mapServiceType);
    } catch (error) {
      console.error('HomeService.getServiceTypes error', error);
      ErrorUtils.logError(error, 'HomeService.getServiceTypes');
      return [];
    }
  }

  async getParroquias(codigoCanton?: string): Promise<Parroquia[]> {
    try {
      const url = getApiUrl('/geo/parroquias');
      const response = await apiClient.get<unknown>(url, {
        params:
          codigoCanton != null && codigoCanton !== ''
            ? { codigoCanton }
            : undefined,
      });

      const data = extractArray<any>(response, ['parroquias', 'data', 'items']);
      return data.map(mapParroquia);
    } catch (error) {
      console.error('[HomeService] Error fetching parroquias', error);
      ErrorUtils.logError(error, 'HomeService.getParroquias');
      return [];
    }
  }

  async getTopRatedTechs(limit = 10): Promise<TechPreview[]> {
    try {
      const url = getApiUrl('/technician/tecnicos/top-rated');
      const response = await apiClient.get<unknown>(url, {
        params: { limit },
      });

      const data = extractArray<any>(response);
      return data.map(mapTechPreview);
    } catch (error) {
      console.error('HomeService.getTopRatedTechs error', error);
      ErrorUtils.logError(error, 'HomeService.getTopRatedTechs');
      return [];
    }
  }

  async getRecentRequests(): Promise<RequestPreview[]> {
    try {
      const url = getApiUrl('/request/solicitudes');
      const response = await apiClient.get<unknown>(url);
      const data = extractArray<any>(response, ['solicitudes', 'data', 'items']);
      return data.map(mapRequestPreview);
    } catch (error) {
      console.error('HomeService.getRecentRequests error', error);
      ErrorUtils.logError(error, 'HomeService.getRecentRequests');
      return [];
    }
  }

  async getMySolicitudes(): Promise<RequestPreview[]> {
    try {
      const url = getApiUrl('/request/solicitudes/my/solicitudes');
      const response = await apiClient.get<unknown>(url);
      const data = extractArray<any>(response, ['solicitudes', 'data', 'items']);

      const mapped = data.map(mapRequestPreview);
      console.log('[HomeService] getMySolicitudes fetched', {
        count: mapped.length,
        proposalCounts: mapped.map(({ idSolicitud, proposalCount }) => ({
          id: idSolicitud,
          count: proposalCount,
        })),
      });

      return mapped;
    } catch (error) {
      console.error('HomeService.getMySolicitudes error', error);
      ErrorUtils.logError(error, 'HomeService.getMySolicitudes');
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

  async getRequestDetails(idSolicitud: number): Promise<RequestDetails> {
    try {
      const url = getApiUrl(`/request/solicitudes/${idSolicitud}`);
      const response = await apiClient.get<unknown>(url);
      const data = extractData<any>(response);
      return mapRequestDetails(data);
    } catch (error) {
      console.error('[HomeService] Error fetching request details:', error);
      ErrorUtils.logError(error, `HomeService.getRequestDetails(${idSolicitud})`);
      throw new Error('No se pudo cargar los detalles de la solicitud');
    }
  }

  async getPublishedRequests(
    estado: 'PENDIENTE' | 'PUBLICADA' | 'ACEPTADA' | 'ASIGNADA' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA' = 'PENDIENTE',
    limit: number = 20,
    page: number = 1,
  ): Promise<RequestDetails[]> {
    try {
      const url = getApiUrl('/request/solicitudes');
      const response = await apiClient.get<unknown>(url, {
        params: { estado, limit, page },
      });

      const data = extractArray<any>(response, ['solicitudes', 'data', 'items']);
      return data.map(mapRequestDetails);
    } catch (error) {
      console.error('[HomeService] Error fetching published requests:', error);
      ErrorUtils.logError(error, 'HomeService.getPublishedRequests');
      return [];
    }
  }

  async cancelRequest(idSolicitud: number): Promise<void> {
    try {
      const url = getApiUrl(`/request/solicitudes/${idSolicitud}/cancel`);
      await apiClient.put<void>(url, {});
    } catch (error) {
      console.error('[HomeService] Error cancelling request:', error);
      throw error;
    }
  }

  async getProposals(idSolicitud: number): Promise<any[]> {
    try {
      const url = getApiUrl(`/request/solicitudes-tecnicos/solicitud/${idSolicitud}`);
      const response = await apiClient.get<unknown>(url);
      return extractArray<any>(response, ['propuestas', 'data', 'items']);
    } catch (error) {
      console.error('[HomeService] Error fetching proposals:', error);
      throw error;
    }
  }

  async acceptProposal(idSolTec: number): Promise<any> {
    try {
      const url = getApiUrl(`/request/solicitudes-tecnicos/${idSolTec}/responder`);
      return await apiClient.put<any>(url, { estadoAcuerdo: 'ACEPTADO' });
    } catch (error) {
      console.error('[HomeService] Error accepting proposal:', error);
      throw error;
    }
  }

  async rejectProposal(idSolTec: number): Promise<any> {
    try {
      const url = getApiUrl(`/request/solicitudes-tecnicos/${idSolTec}/responder`);
      return await apiClient.put<any>(url, { estadoAcuerdo: 'RECHAZADO' });
    } catch (error) {
      console.error('[HomeService] Error rejecting proposal:', error);
      throw error;
    }
  }
}

export const homeService = new HomeService();
