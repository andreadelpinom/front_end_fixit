// src/services/technician.service.ts
import { getApiUrl } from '../config/api.config';
import { apiClient } from './api-client.service';
import {
  Tecnico,
  TecnicoWithDetails,
  Solicitud,
  SolicitudTecnico,
  EstadoAceptacion,
  EstadoSolicitud,
} from '../types/api';

// ==================== PERFIL TÉCNICO ====================

// Crear perfil de técnico
export async function createTechnician(idUser: number): Promise<Tecnico> {
  const url = getApiUrl('/technician/tecnicos');
  const payload = { idUser, isActive: true };
  return apiClient.post<Tecnico>(url, payload);
}

// Obtener todos los técnicos
export async function getTechnicians(): Promise<TecnicoWithDetails[]> {
  const url = getApiUrl('/technician/tecnicos');
  return apiClient.get<TecnicoWithDetails[]>(url);
}

// Obtener técnico por user ID
export async function getTechnicianByUser(
  idUser: number,
): Promise<TecnicoWithDetails> {
  const url = getApiUrl(`/technician/tecnicos/user/${idUser}`);
  return apiClient.get<TecnicoWithDetails>(url);
}

// Obtener técnico por ID
export async function getTechnicianById(
  idTecnico: number,
): Promise<TecnicoWithDetails> {
  const url = getApiUrl(`/technician/tecnicos/${idTecnico}`);
  return apiClient.get<TecnicoWithDetails>(url);
}

// Eliminar técnico
export async function deleteTechnician(idTecnico: number): Promise<void> {
  const url = getApiUrl(`/technician/tecnicos/${idTecnico}`);
  return apiClient.delete(url);
}

// ==================== SOLICITUDES DISPONIBLES ====================

// Obtener solicitudes disponibles (PENDIENTES)
// ✅ ACTUALIZADO: Usa la ruta correcta del backend
export async function getAvailableRequests(): Promise<Solicitud[]> {
  try {
    const url = getApiUrl('/request/solicitudes');
    console.log('[technician.service] 🌐 Fetching from:', url);
    const resp = await apiClient.get<unknown>(url);
    console.log('[technician.service] 📦 Raw response type:', typeof resp);
    console.log('[technician.service] 📦 Raw response:', JSON.stringify(resp, null, 2));

    // Unwrap response structure (handles { solicitudes: [...], pagination: {...} })
    let allRequests: Solicitud[] = [];
    if (Array.isArray(resp)) {
      console.log('[technician.service] ✅ Response is array, length:', resp.length);
      allRequests = resp;
    } else if (resp && typeof resp === 'object') {
      const anyResp = resp as any;
      // PRIMERO: Verificar si tiene solicitudes directamente
      if (Array.isArray(anyResp.solicitudes)) {
        console.log('[technician.service] ✅ Found array at resp.solicitudes, length:', anyResp.solicitudes.length);
        allRequests = anyResp.solicitudes;
      } else if (Array.isArray(anyResp.data)) {
        console.log('[technician.service] ✅ Found array at resp.data, length:', anyResp.data.length);
        allRequests = anyResp.data;
      } else if (anyResp.data && typeof anyResp.data === 'object') {
        const dataObj = anyResp.data as any;
        if (Array.isArray(dataObj.solicitudes)) {
          console.log('[technician.service] ✅ Found array at resp.data.solicitudes, length:', dataObj.solicitudes.length);
          allRequests = dataObj.solicitudes;
        } else if (Array.isArray(dataObj.items)) {
          console.log('[technician.service] ✅ Found array at resp.data.items, length:', dataObj.items.length);
          allRequests = dataObj.items;
        } else if (Array.isArray(dataObj.data)) {
          console.log('[technician.service] ✅ Found array at resp.data.data, length:', dataObj.data.length);
          allRequests = dataObj.data;
        } else {
          console.warn('[technician.service] ⚠️ No array found in expected paths. Keys:', Object.keys(dataObj));
        }
      } else {
        console.warn('[technician.service] ⚠️ No array found. Keys:', Object.keys(anyResp));
      }
    }

    console.log('[technician.service] 📊 Total requests before filter:', allRequests.length);
    
    // Filtrar solo las PENDIENTES
    const pendingRequests = allRequests.filter(
      req => req.estadoSolicitud === EstadoSolicitud.PENDIENTE,
    );
    console.log('[technician.service] ✅ Pending requests after filter:', pendingRequests.length);
    
    return pendingRequests;
  } catch (error) {
    console.error('[technician.service] ❌ Error fetching available requests:', error);
    throw error;
  }
}

// ==================== MIS PROPUESTAS / TRABAJOS ====================

// Crear propuesta para una solicitud
// ✅ ACTUALIZADO: Usa /postularse y el backend resuelve idTecnico automáticamente
export interface CreateProposalDto {
  idSolicitud: number;
  costoAcordado?: number;
  notas?: string;
}

export async function createProposal(
  data: CreateProposalDto,
): Promise<SolicitudTecnico> {
  // ✅ CAMBIO: Usa /postularse en lugar de /solicitud-tecnico
  // El backend resuelve automáticamente idTecnico desde req.user.idUser
  const url = getApiUrl('/request/solicitudes-tecnicos/postularse');
  return apiClient.post<SolicitudTecnico>(url, data);
}

// Obtener mis propuestas como técnico
// ✅ ACTUALIZADO: Usa /my/propuestas
export async function getMyProposals(): Promise<SolicitudTecnico[]> {
  try {
    // ✅ CAMBIO: El backend automáticamente obtiene las propuestas del técnico autenticado
    const url = getApiUrl('/request/solicitudes-tecnicos/my/propuestas');
    console.log('[technician.service] 🌐 Fetching proposals from:', url);
    const resp = await apiClient.get<unknown>(url);
    console.log('[technician.service] 📦 Raw proposals response type:', typeof resp);
    console.log('[technician.service] 📦 Raw proposals response:', JSON.stringify(resp, null, 2));

    // Unwrap response structure (handles { data: {...} })
    let proposals: SolicitudTecnico[] = [];
    if (Array.isArray(resp)) {
      console.log('[technician.service] ✅ Proposals response is array, length:', resp.length);
      proposals = resp;
    } else if (resp && typeof resp === 'object') {
      const anyResp = resp as any;
      if (Array.isArray(anyResp.data)) {
        console.log('[technician.service] ✅ Found proposals array at resp.data, length:', anyResp.data.length);
        proposals = anyResp.data;
      } else if (anyResp.data && typeof anyResp.data === 'object') {
        const dataObj = anyResp.data as any;
        if (Array.isArray(dataObj.propuestas)) {
          console.log('[technician.service] ✅ Found proposals array at resp.data.propuestas, length:', dataObj.propuestas.length);
          proposals = dataObj.propuestas;
        } else if (Array.isArray(dataObj.items)) {
          console.log('[technician.service] ✅ Found proposals array at resp.data.items, length:', dataObj.items.length);
          proposals = dataObj.items;
        } else if (Array.isArray(dataObj.data)) {
          console.log('[technician.service] ✅ Found proposals array at resp.data.data, length:', dataObj.data.length);
          proposals = dataObj.data;
        } else {
          console.warn('[technician.service] ⚠️ No proposals array found in expected paths. Keys:', Object.keys(dataObj));
        }
      } else {
        console.warn('[technician.service] ⚠️ resp.data is not an object or array. Type:', typeof anyResp.data);
      }
    }

    console.log('[technician.service] ✅ Total proposals found:', proposals.length);
    return proposals;
  } catch (error) {
    console.error('[technician.service] ❌ Error fetching my proposals:', error);
    throw error;
  }
}

// Actualizar estado de propuesta
// ✅ ACTUALIZADO: Usa PUT en lugar de PATCH
export async function updateProposal(
  idSolTec: number,
  data: { costoAcordado?: number; notas?: string },
): Promise<SolicitudTecnico> {
  // ✅ CAMBIO: Usa PUT y la ruta correcta
  const url = getApiUrl(`/request/solicitudes-tecnicos/${idSolTec}`);
  return apiClient.put<SolicitudTecnico>(url, data);
}

// Cancelar propuesta
// ✅ NUEVO: Función para cancelar propuesta
export async function cancelProposal(idSolTec: number): Promise<void> {
  const url = getApiUrl(`/request/solicitudes-tecnicos/${idSolTec}`);
  return apiClient.delete(url);
}

// ==================== TIPOS DE SERVICIO ====================

export interface TipoServicio {
  idTipoServicio: number;
  nombre: string;
  descripcion?: string;
  iconUrl?: string;
  isActive: boolean;
}

export async function getServiceTypes(): Promise<TipoServicio[]> {
  try {
    const url = getApiUrl('/technician/tipos-servicios');
    return await apiClient.get<TipoServicio[]>(url);
  } catch (error) {
    console.error('Error fetching service types:', error);
    return [];
  }
}

// ==================== ESTADÍSTICAS DEL TÉCNICO ====================

export interface TechnicianStats {
  totalProposals: number;
  acceptedJobs: number;
  completedJobs: number;
  averageRating: number;
  totalEarnings: number;
}

// ✅ ACTUALIZADO: Usa el endpoint /my/stats del backend
export async function getTechnicianStats(): Promise<TechnicianStats> {
  try {
    // ✅ CAMBIO: El backend tiene un endpoint específico para esto
    const url = getApiUrl('/request/solicitudes-tecnicos/my/stats');
    const backendStats = await apiClient.get<any>(url);

    // Mapear la respuesta del backend al formato que espera el frontend
    return {
      totalProposals: backendStats.totalPropuestas || 0,
      acceptedJobs: backendStats.propuestasAceptadas || 0,
      completedJobs: backendStats.trabajosCompletados || 0,
      averageRating: backendStats.promedioCalificacion || 0,
      totalEarnings: backendStats.gananciasTotales || 0,
    };
  } catch (error) {
    console.error('Error fetching technician stats:', error);
    // Fallback: calcular localmente si el endpoint falla
    return await getTechnicianStatsLocal();
  }
}

// Función auxiliar: calcular estadísticas localmente (fallback)
async function getTechnicianStatsLocal(): Promise<TechnicianStats> {
  try {
    const proposals = await getMyProposals();

    const acceptedJobs = proposals.filter(
      p => p.estadoAcuerdo === EstadoAceptacion.ACEPTADO,
    ).length;

    const completedJobs = proposals.filter(
      p => p.estadoAcuerdo === 'COMPLETADO',
    ).length;

    const totalEarnings = proposals
      .filter(
        p =>
          p.estadoAcuerdo === EstadoAceptacion.ACEPTADO ||
          p.estadoAcuerdo === 'COMPLETADO',
      )
      .reduce((sum, p) => {
        const cost =
          typeof p.costoAcordado === 'string'
            ? parseFloat(p.costoAcordado)
            : p.costoAcordado || 0;
        return sum + cost;
      }, 0);

    return {
      totalProposals: proposals.length,
      acceptedJobs,
      completedJobs,
      averageRating: 0,
      totalEarnings,
    };
  } catch (error) {
    console.error('Error calculating local stats:', error);
    return {
      totalProposals: 0,
      acceptedJobs: 0,
      completedJobs: 0,
      averageRating: 0,
      totalEarnings: 0,
    };
  }
}

// ==================== GESTIÓN DE SERVICIOS DEL TÉCNICO ====================

export interface TecnicoServicio {
  idTecnicoServicio: number;
  idTecnico: number;
  idTipoServicio: number;
  precioReferencia?: number;
  tiempoEstimado?: string;
  descripcion?: string;
  tipoServicio?: TipoServicio;
}

// Obtener servicios del técnico
export async function getTechnicianServices(idTecnico: number): Promise<TecnicoServicio[]> {
  try {
    const url = getApiUrl(`/technician/tecnicos/${idTecnico}/servicios`);
    return await apiClient.get<TecnicoServicio[]>(url);
  } catch (error) {
    console.error('Error fetching technician services:', error);
    return [];
  }
}

// Agregar servicio al técnico
export async function addTechnicianService(data: {
  idTecnico: number;
  idTipoServicio: number;
  precioReferencia?: number;
  tiempoEstimado?: string;
  descripcion?: string;
}): Promise<TecnicoServicio> {
  const url = getApiUrl('/technician/tecnico-servicios');
  return apiClient.post<TecnicoServicio>(url, data);
}

// Eliminar servicio del técnico
export async function removeTechnicianService(idTecnicoServicio: number): Promise<void> {
  const url = getApiUrl(`/technician/tecnico-servicios/${idTecnicoServicio}`);
  return apiClient.delete(url);
}

// ==================== CERTIFICACIONES ====================

export interface Certificacion {
  idCertificacion: number;
  nombre: string;
  descripcion?: string;
  institucion?: string;
  nivelRequerido?: string;
  isActive: boolean;
}

export interface TecnicoCertificacion {
  idTecnicoCertificacion: number;
  idTecnico: number;
  idCertificacion: number;
  fechaObtencion?: Date;
  fechaVencimiento?: Date;
  numeroCredencial?: string;
  estado: string;
  certificacion?: Certificacion;
}

// Obtener certificaciones disponibles
export async function getAvailableCertifications(): Promise<Certificacion[]> {
  try {
    const url = getApiUrl('/technician/certificaciones');
    return await apiClient.get<Certificacion[]>(url);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return [];
  }
}

// Obtener certificaciones del técnico
export async function getTechnicianCertifications(idTecnico: number): Promise<TecnicoCertificacion[]> {
  try {
    const url = getApiUrl(`/technician/tecnicos/${idTecnico}/certificaciones`);
    return await apiClient.get<TecnicoCertificacion[]>(url);
  } catch (error) {
    console.error('Error fetching technician certifications:', error);
    return [];
  }
}

// Solicitar certificación
export async function addTechnicianCertification(data: {
  idTecnico: number;
  idCertificacion: number;
  numeroCredencial?: string;
}): Promise<TecnicoCertificacion> {
  const url = getApiUrl('/technician/tecnico-certificaciones');
  return apiClient.post<TecnicoCertificacion>(url, data);
}

// Eliminar certificación
export async function removeTechnicianCertification(idTecnicoCertificacion: number): Promise<void> {
  const url = getApiUrl(`/technician/tecnico-certificaciones/${idTecnicoCertificacion}`);
  return apiClient.delete(url);
}

// ==================== ZONAS DE SERVICIO ====================

export interface Zona {
  idZona: number;
  nombre: string;
  descripcion?: string;
  coordenadas?: string;
  isActive: boolean;
}

export interface TecnicoZona {
  idTecnicoZona: number;
  idTecnico: number;
  idZona: number;
  tarifaAdicional?: number;
  zona?: Zona;
}

// Obtener zonas del técnico
export async function getTechnicianZones(idTecnico: number): Promise<TecnicoZona[]> {
  try {
    const url = getApiUrl(`/technician/tecnicos/${idTecnico}/zonas`);
    return await apiClient.get<TecnicoZona[]>(url);
  } catch (error) {
    console.error('Error fetching technician zones:', error);
    return [];
  }
}

// Agregar zona al técnico
export async function addTechnicianZone(data: {
  idTecnico: number;
  idZona: number;
  tarifaAdicional?: number;
}): Promise<TecnicoZona> {
  const url = getApiUrl('/technician/tecnico-zonas');
  return apiClient.post<TecnicoZona>(url, data);
}

// Eliminar zona del técnico
export async function removeTechnicianZone(idTecnicoZona: number): Promise<void> {
  const url = getApiUrl(`/technician/tecnico-zonas/${idTecnicoZona}`);
  return apiClient.delete(url);
}

// ==================== CALIFICACIONES ====================

export interface CalificacionTecnico {
  idCalificacion: number;
  idSolicitud: number;
  idTecnico: number;
  idCliente: number;
  puntuacion: number;
  comentario?: string;
  fechaCalificacion: Date;
  solicitud?: {
    idSolicitud: number;
    descripcionProblema: string;
    tipoServicio?: {
      nombre: string;
    };
  };
  cliente?: {
    idUser: number;
    nombre: string;
    apellido: string;
  };
}

// Obtener calificaciones del técnico
export async function getTechnicianRatings(idTecnico: number): Promise<CalificacionTecnico[]> {
  try {
    const url = getApiUrl(`/technician/tecnicos/${idTecnico}/calificaciones`);
    return await apiClient.get<CalificacionTecnico[]>(url);
  } catch (error) {
    console.error('Error fetching technician ratings:', error);
    return [];
  }
}

// ==================== GESTIÓN DE ESTADO DEL SERVICIO ====================

// Iniciar servicio (cambiar estado a ACEPTADA con fechaInicio)
// ✅ ACTUALIZADO: Usa PUT según documentación del backend
export async function startService(idSolicitud: number): Promise<Solicitud> {
  const url = getApiUrl(`/request/solicitudes/${idSolicitud}`);
  return apiClient.put<Solicitud>(url, { 
    estadoSolicitud: EstadoSolicitud.ACEPTADA,
    fechaInicio: new Date().toISOString()
  });
}

// Completar servicio (cambiar estado a COMPLETADO)
// ✅ ACTUALIZADO: Usa PUT según documentación del backend
export async function completeService(idSolicitud: number): Promise<Solicitud> {
  const url = getApiUrl(`/request/solicitudes/${idSolicitud}`);
  return apiClient.put<Solicitud>(url, { 
    estadoSolicitud: EstadoSolicitud.COMPLETADA,
    fechaFinalizacion: new Date().toISOString()
  });
}

// Cancelar servicio (cambiar estado a CANCELADO)
// ✅ ACTUALIZADO: Usa PUT según documentación del backend
export async function cancelService(idSolicitud: number): Promise<Solicitud> {
  const url = getApiUrl(`/request/solicitudes/${idSolicitud}`);
  return apiClient.put<Solicitud>(url, { estadoSolicitud: EstadoSolicitud.CANCELADA });
}

// Exportar tipos para usar en componentes
export type { TecnicoWithDetails, Tecnico, SolicitudTecnico, Solicitud };
