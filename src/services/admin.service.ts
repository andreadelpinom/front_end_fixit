import { apiClient } from './api-client.service';
import { getApiUrl } from '../config/api.config';

// ==================== TYPES ====================

export interface AdminStats {
  totalUsers: number;
  totalClients: number;
  totalTechnicians: number;
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  totalReviews: number;
  averageRating: number;
  totalServices?: number;
  pendingCertifications?: number;
}

export interface UserManagement {
  idUser: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  rol?: 'CLIENTE' | 'TECNICO' | 'ADMIN'; // Campo legacy
  roles?: string[]; // Nuevo formato del backend
  activo: boolean;
  createdAt: string;
}

export interface TechnicianApproval {
  idTecnico: number;
  idUser: number;
  nombres: string;
  apellidos: string;
  telefono?: string;
  direccion?: string;
  isActive: boolean;
  calificacionPromedio?: number;
  certificaciones?: TechnicianCertification[];
  servicios?: TechnicianService[];
  zonas?: TechnicianZone[];
  createdAt: string;
}

export interface TechnicianCertification {
  idTecnicoCert: number;
  nombreCertificacion: string;
  fechaObtencion?: string;
  aprobada: boolean;
}

export interface TechnicianService {
  idTecnicoServicio: number;
  nombreServicio: string;
  experienciaAnios?: number;
}

export interface TechnicianZone {
  idTecnicoZona: number;
  nombreParroquia: string;
}

export interface RequestManagement {
  idSolicitud: number;
  idUser: number;
  nombreCliente: string;
  tituloProblema: string;
  descripcionProblema: string;
  estadoSolicitud: string;
  idTipoServicio: number;
  nombreServicio: string;
  costoEstimado?: number;
  fechaProgramada?: string;
  fechaPublicacion: string;
  fechaInicio?: string;
  fechaFinalizacion?: string;
  codigoParroquia: string;
}

export interface ReviewManagement {
  idCalificacion: number;
  idTecnico: number;
  nombreTecnico: string;
  idUser: number;
  nombreCliente: string;
  calificacion: number;
  comentario?: string;
  fechaCalificacion: string;
  idSolicitud?: number;
}

export interface StatisticsFilter {
  startDate?: string;
  endDate?: string;
  serviceType?: number;
  zone?: string;
}

export interface PerformanceMetrics {
  totalServicesByType: { [key: string]: number };
  requestsByStatus: { [key: string]: number };
  topTechnicians: {
    idTecnico: number;
    nombres: string;
    totalServicios: number;
    calificacionPromedio: number;
  }[];
  topZones: { zona: string; totalSolicitudes: number }[];
  revenueEstimate: number;
}

export interface AuditLog {
  idLog: number;
  idAdmin: number;
  nombreAdmin: string;
  accion: string;
  detalles: string;
  timestamp: string;
}

// ==================== SERVICE CLASS ====================

class AdminService {
  // Método helper para extraer arrays de diferentes formatos de respuesta
  private unwrapArrayResponse<T>(resp: unknown): T[] {
    if (Array.isArray(resp)) return resp as T[];
    
    if (resp && typeof resp === 'object') {
      const anyResp = resp as any;
      if (Array.isArray(anyResp.data)) return anyResp.data;
      if (anyResp.data && Array.isArray(anyResp.data.items)) return anyResp.data.items;
    }
    
    return [];
  }

  // ==================== DASHBOARD ====================

  async getDashboardStats(): Promise<AdminStats> {
    try {
      // Obtener datos reales y calcular estadísticas
      const [users, technicians, requests, reviews] = await Promise.all([
        this.getAllUsers().catch(() => []),
        this.getAllTechnicians().catch(() => []),
        this.getAllRequests().catch(() => []),
        this.getAllReviews().catch(() => []),
      ]);

      console.log('[Dashboard Stats] Raw data:', { users, technicians, requests, reviews });
      
      // Debug roles
      users.forEach((user, index) => {
        console.log(`User ${index}:`, { email: user.email, rol: user.rol, roles: user.roles });
      });

      // Calcular estadísticas
      const totalUsers = users.length;
      const totalClients = users.filter(u => 
        (u.rol === 'CLIENTE' || u.rol === 'CLIENT') || 
        (u.roles && Array.isArray(u.roles) && (u.roles.includes('CLIENTE') || u.roles.includes('CLIENT')))
      ).length;
      const totalTechnicians = users.filter(u => 
        (u.rol === 'TECNICO' || u.rol === 'TECHNICIAN') || 
        (u.roles && Array.isArray(u.roles) && (u.roles.includes('TECNICO') || u.roles.includes('TECHNICIAN')))
      ).length;
      const totalRequests = requests.length;
      const activeRequests = requests.filter(r => 
        r.estadoSolicitud === 'ACEPTADA' || 
        r.estadoSolicitud === 'EN_PROCESO' ||
        r.estadoSolicitud === 'ACCEPTED'
      ).length;
      const completedRequests = requests.filter(r => 
        r.estadoSolicitud === 'COMPLETADA' || 
        r.estadoSolicitud === 'COMPLETED'
      ).length;
      const totalReviews = reviews.length;
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.calificacion, 0) / reviews.length 
        : 0;

      const stats: AdminStats = {
        totalUsers,
        totalClients,
        totalTechnicians,
        totalRequests,
        activeRequests,
        completedRequests,
        totalReviews,
        averageRating,
      };

      console.log('[Dashboard Stats] Calculated:', stats);
      return stats;
    } catch (error) {
      console.error('[AdminService] Error fetching dashboard stats:', error);
      // Retornar estadísticas vacías en caso de error
      return {
        totalUsers: 0,
        totalClients: 0,
        totalTechnicians: 0,
        totalRequests: 0,
        activeRequests: 0,
        completedRequests: 0,
        totalReviews: 0,
        averageRating: 0,
      };
    }
  }

  // ==================== USER MANAGEMENT ====================

  async getAllUsers(): Promise<UserManagement[]> {
    try {
      // ✅ Backend: GET /usuarios
      const url = getApiUrl('/usuarios');
      const resp = await apiClient.get<unknown>(url);
      return this.unwrapArrayResponse<UserManagement>(resp);
    } catch (error) {
      console.error('[AdminService] Error fetching users:', error);
      throw error;
    }
  }

  async updateUserStatus(idUser: number, activo: boolean): Promise<void> {
    try {
      // ✅ Backend: PUT /usuarios/:id/deactivate (para desactivar)
      // Para activar, usar PUT /usuarios/:id con activo: true
      if (!activo) {
        const url = getApiUrl(`/usuarios/${idUser}/deactivate`);
        await apiClient.put(url, {});
      } else {
        const url = getApiUrl(`/usuarios/${idUser}`);
        await apiClient.put(url, { activo: true });
      }
    } catch (error) {
      console.error('[AdminService] Error updating user status:', error);
      throw error;
    }
  }

  async updateUserRole(idUser: number, newRole: string): Promise<void> {
    try {
      // ✅ Backend: POST /usuarios/switch-role
      const url = getApiUrl('/usuarios/switch-role');
      await apiClient.post(url, { idUser, newRole });
    } catch (error) {
      console.error('[AdminService] Error updating user role:', error);
      throw error;
    }
  }

  async getPendingTechnicians(): Promise<TechnicianApproval[]> {
    try {
      // ✅ Backend: GET /technician/tecnicos (filtrar por estado en frontend)
      // El backend podría tener estados: REGISTRADO | VERIFICACION_PENDIENTE | VERIFICADO | BLOQUEADO
      const url = getApiUrl('/technician/tecnicos');
      const resp = await apiClient.get<unknown>(url);
      const allTechs = this.unwrapArrayResponse<TechnicianApproval>(resp);
      // Filtrar por técnicos no activos o en verificación pendiente
      return allTechs.filter(t => !t.isActive);
    } catch (error) {
      console.error('[AdminService] Error fetching pending technicians:', error);
      throw error;
    }
  }

  async getPendingCertifications(): Promise<TechnicianCertification[]> {
    try {
      // ✅ Backend: GET /technician/tecnico-certificaciones/pending
      const url = getApiUrl('/technician/tecnico-certificaciones/pending');
      const resp = await apiClient.get<unknown>(url);
      return this.unwrapArrayResponse<TechnicianCertification>(resp);
    } catch (error) {
      console.error('[AdminService] Error fetching pending certifications:', error);
      throw error;
    }
  }

  async getAllTechnicians(): Promise<TechnicianApproval[]> {
    try {
      // ✅ Backend: GET /technician/tecnicos (usa el del technician.service)
      const url = getApiUrl('/technician/tecnicos');
      const resp = await apiClient.get<unknown>(url);
      return this.unwrapArrayResponse<TechnicianApproval>(resp);
    } catch (error) {
      console.error('[AdminService] Error fetching all technicians:', error);
      throw error;
    }
  }

  async approveTechnician(idTecnico: number): Promise<void> {
    try {
      // ✅ Backend: PATCH /technician/tecnicos/:id/status (NUEVO endpoint)
      const url = getApiUrl(`/technician/tecnicos/${idTecnico}/status`);
      await apiClient.patch(url, { status: 'VERIFICADO' });
    } catch (error) {
      console.error('[AdminService] Error approving technician:', error);
      throw error;
    }
  }

  async blockTechnician(idTecnico: number, reason?: string): Promise<void> {
    try {
      // ✅ Backend: PATCH /technician/tecnicos/:id/status
      const url = getApiUrl(`/technician/tecnicos/${idTecnico}/status`);
      await apiClient.patch(url, { status: 'BLOQUEADO', reason });
    } catch (error) {
      console.error('[AdminService] Error blocking technician:', error);
      throw error;
    }
  }

  async rejectTechnician(idTecnico: number, reason?: string): Promise<void> {
    try {
      // ✅ Backend: DELETE /technician/tecnicos/:id (desactivar)
      const url = getApiUrl(`/technician/tecnicos/${idTecnico}`);
      await apiClient.delete(url, { data: { reason } });
    } catch (error) {
      console.error('[AdminService] Error rejecting technician:', error);
      throw error;
    }
  }

  async approveCertification(idTecnicoCert: number): Promise<void> {
    try {
      // ✅ Backend: PATCH /technician/tecnico-certificaciones/:id/verify
      const url = getApiUrl(`/technician/tecnico-certificaciones/${idTecnicoCert}/verify`);
      await apiClient.patch(url, {});
    } catch (error) {
      console.error('[AdminService] Error approving certification:', error);
      throw error;
    }
  }

  async rejectCertification(idTecnicoCert: number): Promise<void> {
    try {
      // ✅ Backend: PATCH /technician/tecnico-certificaciones/:id/reject
      const url = getApiUrl(`/technician/tecnico-certificaciones/${idTecnicoCert}/reject`);
      await apiClient.patch(url, {});
    } catch (error) {
      console.error('[AdminService] Error rejecting certification:', error);
      throw error;
    }
  }

  // ==================== REQUEST MANAGEMENT ====================

  async getAllRequests(): Promise<RequestManagement[]> {
    try {
      // Usar el mismo endpoint que technician.service pero sin filtrar por estado
      console.log('[AdminService] Trying technician-style endpoint...');
      const url = getApiUrl('/request/solicitudes');
      const resp = await apiClient.get<unknown>(url);
      console.log('[AdminService] Raw response type:', typeof resp);
      console.log('[AdminService] Raw response:', JSON.stringify(resp, null, 2));

      // Unwrap response structure (igual que technician.service)
      let allRequests: RequestManagement[] = [];
      if (Array.isArray(resp)) {
        console.log('[AdminService] Response is array, length:', resp.length);
        allRequests = resp;
      } else if (resp && typeof resp === 'object') {
        const anyResp = resp as any;
        if (Array.isArray(anyResp.solicitudes)) {
          console.log('[AdminService] Found array at resp.solicitudes, length:', anyResp.solicitudes.length);
          allRequests = anyResp.solicitudes;
        } else if (Array.isArray(anyResp.data)) {
          console.log('[AdminService] Found array at resp.data, length:', anyResp.data.length);
          allRequests = anyResp.data;
        } else if (anyResp.data && typeof anyResp.data === 'object') {
          const dataObj = anyResp.data as any;
          if (Array.isArray(dataObj.solicitudes)) {
            console.log('[AdminService] Found array at resp.data.solicitudes, length:', dataObj.solicitudes.length);
            allRequests = dataObj.solicitudes;
          } else if (Array.isArray(dataObj.items)) {
            console.log('[AdminService] Found array at resp.data.items, length:', dataObj.items.length);
            allRequests = dataObj.items;
          } else if (Array.isArray(dataObj.data)) {
            console.log('[AdminService] Found array at resp.data.data, length:', dataObj.data.length);
            allRequests = dataObj.data;
          }
        }
      }

      console.log(`[AdminService] ✅ Got ${allRequests.length} total requests from /request/solicitudes`);
      return allRequests;
    } catch (error) {
      console.error('[AdminService] Error fetching requests with technician method:', error);
      return []; // Retornar array vacío en lugar de throw
    }
  }

  async cancelRequest(idSolicitud: number, reason: string): Promise<void> {
    try {
      // ✅ Backend: PUT /request/solicitudes/:id/cancel
      const url = getApiUrl(`/request/solicitudes/${idSolicitud}/cancel`);
      await apiClient.put(url, { reason });
    } catch (error) {
      console.error('[AdminService] Error canceling request:', error);
      throw error;
    }
  }

  async deleteRequest(idSolicitud: number): Promise<void> {
    try {
      // ✅ Backend: DELETE /request/solicitudes/:id (eliminar permanentemente)
      const url = getApiUrl(`/request/solicitudes/${idSolicitud}`);
      await apiClient.delete(url);
    } catch (error) {
      console.error('[AdminService] Error deleting request:', error);
      throw error;
    }
  }

  // ==================== REVIEW MANAGEMENT ====================

  async getAllReviews(): Promise<ReviewManagement[]> {
    try {
      // ✅ Backend: GET /technician/calificaciones (NUEVO endpoint agregado hoy)
      const url = getApiUrl('/technician/calificaciones');
      const resp = await apiClient.get<unknown>(url);
      return this.unwrapArrayResponse<ReviewManagement>(resp);
    } catch (error) {
      console.error('[AdminService] Error fetching reviews:', error);
      throw error;
    }
  }

  async deleteReview(idCalificacion: number, reason?: string): Promise<void> {
    try {
      // ✅ Backend: DELETE /technician/calificaciones/:id (NUEVO endpoint agregado hoy)
      const url = getApiUrl(`/technician/calificaciones/${idCalificacion}`);
      await apiClient.delete(url, { data: { reason } });
    } catch (error) {
      console.error('[AdminService] Error deleting review:', error);
      throw error;
    }
  }

  // ==================== STATISTICS ====================

  async getStatistics(_filter?: StatisticsFilter): Promise<PerformanceMetrics> {
    try {
      // ✅ Backend tiene stats distribuidos, combinar resultados
      const [techStats, serviceStats, requestStats] = await Promise.all([
        apiClient.get<any>(getApiUrl('/technician/tecnicos/stats')),
        apiClient.get<any>(getApiUrl('/technician/tipos-servicios/stats')),
        apiClient.get<any>(getApiUrl('/request/solicitudes/stats/general')),
      ]);

      // Construir PerformanceMetrics combinando respuestas
      const metrics: PerformanceMetrics = {
        totalServicesByType: serviceStats.serviciosPorTipo || {},
        requestsByStatus: requestStats.solicitudesPorEstado || {},
        topTechnicians: techStats.topTecnicos || [],
        topZones: requestStats.zonasMasDemandadas || [],
        revenueEstimate: requestStats.ingresosEstimados || 0,
      };

      return metrics;
    } catch (error) {
      console.error('[AdminService] Error fetching statistics:', error);
      throw error;
    }
  }

  // ==================== AUDIT LOGS ====================

  async getAuditLogs(_limit: number = 50): Promise<AuditLog[]> {
    try {
      // ⚠️ Backend no tiene sistema de audit logs implementado
      console.warn('[AdminService] ⚠️ Backend necesita implementar audit logs');
      return [];
    } catch (error) {
      console.error('[AdminService] Error fetching audit logs:', error);
      throw error;
    }
  }

  async logAdminAction(accion: string, detalles: string): Promise<void> {
    try {
      // ⚠️ Backend no tiene sistema de audit logs
      // Por ahora solo logear en consola
      console.log(`[AUDIT LOG] ${accion} - ${detalles}`);
      // TODO: Backend debe implementar POST /admin/audit-logs
    } catch (error) {
      console.error('[AdminService] Error logging admin action:', error);
      // No fallar si no se puede registrar el log
    }
  }

  // ==================== ADDITIONAL ADMIN ENDPOINTS ====================

  // TIPOS DE SERVICIOS
  async getAllServiceTypes(): Promise<any[]> {
    try {
      // ✅ Backend: GET /technician/tipos-servicios
      const url = getApiUrl('/technician/tipos-servicios');
      const resp = await apiClient.get<unknown>(url);
      return this.unwrapArrayResponse<any>(resp);
    } catch (error) {
      console.error('[AdminService] Error fetching service types:', error);
      throw error;
    }
  }

  async createServiceType(data: { nombreServicio: string; descripcion?: string }): Promise<void> {
    try {
      // ✅ Backend: POST /technician/tipos-servicios
      const url = getApiUrl('/technician/tipos-servicios');
      await apiClient.post(url, data);
    } catch (error) {
      console.error('[AdminService] Error creating service type:', error);
      throw error;
    }
  }

  async deleteServiceType(idTipoServicio: number): Promise<void> {
    try {
      // ✅ Backend: DELETE /technician/tipos-servicios/:id
      const url = getApiUrl(`/technician/tipos-servicios/${idTipoServicio}`);
      await apiClient.delete(url);
    } catch (error) {
      console.error('[AdminService] Error deleting service type:', error);
      throw error;
    }
  }

  // CERTIFICACIONES
  async getAllCertifications(): Promise<any[]> {
    try {
      // ✅ Backend: GET /technician/certificaciones
      const url = getApiUrl('/technician/certificaciones');
      const resp = await apiClient.get<unknown>(url);
      return this.unwrapArrayResponse<any>(resp);
    } catch (error) {
      console.error('[AdminService] Error fetching certifications:', error);
      throw error;
    }
  }

  async createCertification(data: { nombreCertificacion: string; descripcion?: string }): Promise<void> {
    try {
      // ✅ Backend: POST /technician/certificaciones
      const url = getApiUrl('/technician/certificaciones');
      await apiClient.post(url, data);
    } catch (error) {
      console.error('[AdminService] Error creating certification:', error);
      throw error;
    }
  }

  async deleteCertification(idCertificacion: number): Promise<void> {
    try {
      // ✅ Backend: DELETE /technician/certificaciones/:id
      const url = getApiUrl(`/technician/certificaciones/${idCertificacion}`);
      await apiClient.delete(url);
    } catch (error) {
      console.error('[AdminService] Error deleting certification:', error);
      throw error;
    }
  }

  // PROPUESTAS DE TÉCNICOS
  async getAllProposals(): Promise<any[]> {
    try {
      // ✅ Backend: GET /request/solicitudes-tecnicos
      const url = getApiUrl('/request/solicitudes-tecnicos');
      const resp = await apiClient.get<unknown>(url);
      return this.unwrapArrayResponse<any>(resp);
    } catch (error) {
      console.error('[AdminService] Error fetching proposals:', error);
      throw error;
    }
  }

  // GEO - PARROQUIAS
  async getAllParroquias(): Promise<any[]> {
    try {
      // ✅ Backend: GET /geo/parroquias
      const url = getApiUrl('/geo/parroquias');
      const resp = await apiClient.get<unknown>(url);
      return this.unwrapArrayResponse<any>(resp);
    } catch (error) {
      console.error('[AdminService] Error fetching parroquias:', error);
      throw error;
    }
  }

}

export const adminService = new AdminService();
