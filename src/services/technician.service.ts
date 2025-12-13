// src/services/technician.service.ts
import { getApiUrl } from '../config/api.config';
import { apiClient } from './api-client.service';
import technicianProfileService from './technician-profile.service';
import {
  Tecnico,
  TecnicoWithDetails,
  Solicitud,
  SolicitudTecnico,
  EstadoAceptacion,
} from '../types/api';
import { extractCollection, extractData } from './response-helpers';

const SOLICITUD_KEYS = ['solicitudes', 'items', 'data', 'rows'];
const PROPUESTA_KEYS = ['propuestas', 'items', 'data', 'rows'];

// ==================== PERFIL TÉCNICO ====================

/**
 * Crear perfil de técnico de forma segura
 * Si ya existe, no intenta crear de nuevo
 * @param idUser ID del usuario
 * @returns Perfil técnico creado o existente
 */
export async function createTechnician(idUser: number): Promise<Tecnico> {
  try {
    const result = await technicianProfileService.createTechnicianProfileSafely(
      idUser.toString(),
    );
    return result as Tecnico;
  } catch (error) {
    // Si el servicio falla, lanzar el error
    throw error;
  }
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

/**
 * 🔑 NUEVO: Obtiene solicitudes disponibles para técnicos
 * 
 * MVP DEFINITION:
 * Una solicitud es visible si: estadoSolicitud = PENDIENTE AND idTecnicoAsignado IS NULL
 * 
 * Basado en modelo Uber/InDriver
 * @returns Array de solicitudes sin técnico asignado
 */
export async function getAvailableRequests(filterDto?: any): Promise<Solicitud[]> {
  try {
    // 🔑 NUEVO ENDPOINT: Diseñado específicamente para técnicos
    const url = getApiUrl('/request/solicitudes/available/technicians');
    console.log('[TechnicianService] Fetching from:', url);
    
    const resp = await apiClient.get<unknown>(url, {
      params: filterDto || {},
    });

    const allRequests = extractCollection<Solicitud>(resp, SOLICITUD_KEYS);
    console.log('[TechnicianService] Available requests loaded:', allRequests.length);
    return allRequests;
  } catch (error) {
    console.error('[TechnicianService] Error fetching available requests:', error);
    return [];
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
    const resp = await apiClient.get<unknown>(url);

    return extractCollection<SolicitudTecnico>(resp, PROPUESTA_KEYS);
  } catch (error) {
    console.error('Error fetching my proposals:', error);
    return [];
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

// ==================== ESTADÍSTICAS DEL TÉCNICO ====================

export interface TechnicianStats {
  totalProposals: number;
  acceptedJobs: number;
  completedJobs: number;
  averageRating: number;
  totalEarnings: number;
}

// ✅ ACTUALIZADO: Usa el endpoint /my/stats del backend
const toNumber = (value: unknown, fallback = 0): number => {
  if (value === null || value === undefined) {
    return fallback;
  }

  const numeric = typeof value === 'string' ? parseFloat(value) : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

export async function getTechnicianStats(): Promise<TechnicianStats> {
  try {
    // ✅ CAMBIO: El backend tiene un endpoint específico para esto
    const url = getApiUrl('/request/solicitudes-tecnicos/my/stats');
    const backendStats = extractData<Record<string, unknown>>(
      await apiClient.get<unknown>(url),
    );

    const stats = backendStats ?? {};

    // Mapear la respuesta del backend al formato que espera el frontend
    return {
      totalProposals: toNumber(stats['totalPropuestas'] ?? stats['totalProposals']),
      acceptedJobs: toNumber(stats['propuestasAceptadas'] ?? stats['acceptedJobs']),
      completedJobs: toNumber(stats['trabajosCompletados'] ?? stats['completedJobs']),
      averageRating: toNumber(stats['promedioCalificacion'] ?? stats['averageRating']),
      totalEarnings: toNumber(stats['gananciasTotales'] ?? stats['totalEarnings']),
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

// Exportar tipos para usar en componentes
export type { TecnicoWithDetails, Tecnico, SolicitudTecnico, Solicitud };
