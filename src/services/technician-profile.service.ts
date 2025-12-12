import { apiClient } from './api-client.service';
import { ErrorUtils } from '../utils/error.utils';

/**
 * Servicio para gestionar verificaciones de perfil de técnico
 * Evita duplicados y maneja 409 como estado válido (perfil ya existe)
 */
class TechnicianProfileService {
  private TAG = '[TechnicianProfileService]';

  /**
   * Extrae el statusCode de un error
   */
  private getStatusCode(error: any): number | null {
    if (error && typeof error === 'object') {
      // Buscar statusCode en diferentes locales
      if ('statusCode' in error) return error.statusCode;
      if ('status' in error) return error.status;
      if ('response' in error && 'status' in error.response) {
        return error.response.status;
      }
    }
    return null;
  }

  /**
   * Verifica si un usuario ya tiene perfil de técnico
   * @param idUser ID del usuario a verificar
   * @returns true si el perfil existe, false si no
   */
  async checkTechnicianProfileExists(idUser: string): Promise<boolean> {
    try {
      await apiClient.get(`/api/v1/technician/tecnicos/user/${idUser}`);

      // Si llegamos aquí sin error 404, el perfil existe
      console.log(
        `${this.TAG} Perfil de técnico encontrado para usuario: ${idUser}`
      );
      return true;
    } catch (error) {
      const statusCode = this.getStatusCode(error);

      // 404 es esperado cuando el perfil no existe
      if (statusCode === 404) {
        console.log(
          `${this.TAG} No existe perfil de técnico para usuario: ${idUser}`
        );
        return false;
      }

      // Cualquier otro error, lo re-lanzamos
      ErrorUtils.logError(error, `${this.TAG} Error al verificar perfil`);
      throw error;
    }
  }

  /**
   * Crea un perfil de técnico, pero solo si no existe
   * Maneja 409 (Conflict) como caso válido (perfil ya existe)
   * @param idUser ID del usuario
   * @returns Objeto del técnico creado o existente
   */
  async createTechnicianProfileSafely(idUser: string) {
    try {
      // Primero verificar si ya existe
      const exists = await this.checkTechnicianProfileExists(idUser);

      if (exists) {
        console.log(
          `${this.TAG} Perfil de técnico ya existe, saltando creación`
        );
        // Traer el perfil existente
        return await apiClient.get(`/api/v1/technician/tecnicos/user/${idUser}`);
      }

      // Si no existe, crear nuevo
      console.log(`${this.TAG} Creando nuevo perfil de técnico para: ${idUser}`);
      const response = await apiClient.post('/api/v1/technician/tecnicos', {
        idUser: parseInt(idUser, 10),
      });

      return response;
    } catch (error) {
      const statusCode = this.getStatusCode(error);

      // Si recibimos 409, es porque el perfil ya fue creado (race condition)
      // Esto es válido, no es un error
      if (statusCode === 409) {
        console.log(
          `${this.TAG} Perfil de técnico ya existe (409 Conflict), continuando...`
        );
        // Traer el perfil existente
        try {
          return await apiClient.get(`/api/v1/technician/tecnicos/user/${idUser}`);
        } catch (fetchError) {
          console.log(
            `${this.TAG} No se pudo recuperar perfil existente, retornando error original`
          );
          throw error;
        }
      }

      ErrorUtils.logError(
        error,
        `${this.TAG} Error al crear perfil de técnico`
      );
      throw error;
    }
  }
}

export default new TechnicianProfileService();