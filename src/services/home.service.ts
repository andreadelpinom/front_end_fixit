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
