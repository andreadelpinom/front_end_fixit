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
  codigoParroquia?: string;
}

export interface RequestDetails {
  idSolicitud: number;
  tituloProblema: string;
  descripcionProblema: string;
  estadoSolicitud: string;
  idTipoServicio: number;
  codigoParroquia: string;
  fechaProgramada?: string;
  createdAt?: string;
  idUser?: number;
}

export interface ServiceType {
  idTipoServicio: number;
  nombre: string;
}

export interface Parroquia {
  codigoParroquia: string;
  nombre: string;
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
        if (anyResp.success === true && Array.isArray(anyResp.data)) {
          return anyResp.data as T[];
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

  async getTopRatedTechs(limit = 10): Promise<TechPreview[]> {
    try {
      // Ensure limit is a valid positive integer (1-100 per DTO validation)
      const validLimit = Math.max(1, Math.min(100, Math.floor(Number(limit) || 10)));
      const url = `${getApiUrl('/technician/tecnicos/top-rated')}?limit=${validLimit}`;
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
      // API returns envelope with data possibly containing { solicitudes: [], pagination }
      if (resp && typeof resp === 'object') {
        const anyResp = resp as any;
        if (anyResp.success === true && anyResp.data) {
          // If data is array directly
          if (Array.isArray(anyResp.data)) return anyResp.data as RequestPreview[];
          // If data has solicitudes
          if (Array.isArray(anyResp.data.solicitudes)) return anyResp.data.solicitudes as RequestPreview[];
        }
      }
      return [];
    } catch (err) {
      console.error('HomeService.getRecentRequests error', err);
      ErrorUtils.logError(err, 'HomeService.getRecentRequests');
      return [];
    }
  }

  // Fetch service types from catalog
  async getServiceTypes(): Promise<ServiceType[]> {
    // Return internal mock list to be used by the client Create Request wizard.
    // This intentionally avoids calling backend endpoints so the flow works offline
    // and consistently with the expected DTO shape.
    const mocks: ServiceType[] = [
      { idTipoServicio: 1, nombre: 'Electricidad' },
      { idTipoServicio: 2, nombre: 'Plomería' },
      { idTipoServicio: 3, nombre: 'Cerrajería' },
      { idTipoServicio: 4, nombre: 'Aire acondicionado' },
      { idTipoServicio: 5, nombre: 'Carpintería' },
      { idTipoServicio: 6, nombre: 'Pintura' },
    ];

    return Promise.resolve(mocks);
  }

  // Fetch parroquias from catalog
  async getParroquias(): Promise<Parroquia[]> {
    // Internal mock parroquias to be used by the client Create Request wizard.
    const mocks: Parroquia[] = [
      { codigoParroquia: 'TAR', nombre: 'Tarqui' },
      { codigoParroquia: 'XIM', nombre: 'Ximena' },
      { codigoParroquia: 'PAS', nombre: 'Pascuales' },
      { codigoParroquia: 'FEC', nombre: 'Febres Cordero' },
      { codigoParroquia: 'LET', nombre: 'Letamendi' },
      { codigoParroquia: 'ROC', nombre: 'Rocafuerte' },
      { codigoParroquia: 'URD', nombre: 'Urdaneta' },
      { codigoParroquia: 'OLM', nombre: 'Olmedo' },
    ];

    return Promise.resolve(mocks);
  }

  // Fetch solicitudes of current user
  async getMySolicitudes(): Promise<RequestPreview[]> {
    try {
      const url = getApiUrl('/request/solicitudes/my/solicitudes');
      const resp = await apiClient.get<unknown>(url);
      
      // Debug: Print complete response structure
      console.log('[getMySolicitudes] Complete response:', JSON.stringify(resp, null, 2));
      
      // Inspect possible structures
      const respAny = resp as any;
      console.log('[getMySolicitudes] resp.data type:', typeof respAny?.data);
      console.log('[getMySolicitudes] resp.data.solicitudes exists:', !!respAny?.data?.solicitudes);
      console.log('[getMySolicitudes] resp.data.data exists:', !!respAny?.data?.data);
      
      // Extract array: Support multiple response structures
      const solicitudes =
        respAny?.solicitudes ||
        respAny?.data?.solicitudes ||
        respAny?.data?.data?.solicitudes ||
        [];
      
      if (Array.isArray(solicitudes) && solicitudes.length > 0) {
        if (respAny?.solicitudes) {
          console.log('[getMySolicitudes] Found solicitudes at: resp.solicitudes');
        } else if (respAny?.data?.solicitudes) {
          console.log('[getMySolicitudes] Found solicitudes at: resp.data.solicitudes');
        } else if (respAny?.data?.data?.solicitudes) {
          console.log('[getMySolicitudes] Found solicitudes at: resp.data.data.solicitudes');
        }
      }
      
      console.log(`[getMySolicitudes] Raw count: ${solicitudes.length}`);
      if (solicitudes.length > 0) {
        console.log('[getMySolicitudes] Sample:', JSON.stringify(solicitudes[0], null, 2));
      }
      
      // Map backend fields to frontend structure
      const mapped: RequestPreview[] = solicitudes.map((sol: any) => {
        const mapped = {
          idSolicitud: sol.idSolicitud,
          titulo: sol.tituloProblema || sol.titulo || `Solicitud #${sol.idSolicitud}`,
          descripcion: sol.descripcionProblema || sol.descripcion || 'Sin descripción',
          estado: sol.estadoSolicitud || sol.estado || 'Publicada',
          codigoParroquia: sol.codigoParroquia,
          createdAt: sol.createdAt || new Date().toISOString(),
          idTipoServicio: sol.idTipoServicio,
        };
        console.log(`[getMySolicitudes] Mapped record ${sol.idSolicitud}:`, JSON.stringify(mapped, null, 2));
        return mapped;
      });
      
      console.log(`[getMySolicitudes] Final mapped count: ${mapped.length}`);
      return mapped;
    } catch (err) {
      console.error('[getMySolicitudes] Error:', err);
      ErrorUtils.logError(err, 'HomeService.getMySolicitudes');
      return [];
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

  // Get request details by ID
  async getRequestDetails(idSolicitud: number): Promise<RequestDetails> {
    try {
      const url = getApiUrl(`/request/solicitudes/${idSolicitud}`);
      const resp = await apiClient.get<unknown>(url);

      // Extract details from response
      const respAny = resp as any;
      const details =
        respAny?.solicitud ||
        respAny?.data?.solicitud ||
        respAny?.data ||
        respAny;

      if (details && details.idSolicitud) {
        const mapped: RequestDetails = {
          idSolicitud: details.idSolicitud,
          tituloProblema: details.tituloProblema || details.titulo || '',
          descripcionProblema: details.descripcionProblema || details.descripcion || '',
          estadoSolicitud: details.estadoSolicitud || details.estado || 'PENDIENTE',
          idTipoServicio: details.idTipoServicio || 0,
          codigoParroquia: details.codigoParroquia || '',
          fechaProgramada: details.fechaProgramada,
          createdAt: details.createdAt,
          idUser: details.idUser,
        };
        console.log('[getRequestDetails] Mapped:', JSON.stringify(mapped, null, 2));
        return mapped;
      }

      throw new Error('Invalid request details structure');
    } catch (err) {
      console.error('[getRequestDetails] Error:', err);
      ErrorUtils.logError(err, 'HomeService.getRequestDetails');
      throw err;
    }
  }

  // Cancel a request (PUT to mark as CANCELADA, not DELETE)
  async cancelRequest(idSolicitud: number): Promise<void> {
    try {
      const url = getApiUrl(`/request/solicitudes/${idSolicitud}`);
      await apiClient.put(url, { estadoSolicitud: 'CANCELADA' });
      console.log('[cancelRequest] Success:', idSolicitud);
    } catch (err) {
      console.error('[cancelRequest] Error:', err);
      ErrorUtils.logError(err, 'HomeService.cancelRequest');
      throw err;
    }
  }
}

export const homeService = new HomeService();
