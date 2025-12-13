import { apiClient } from './api-client.service';
import { getApiUrl } from '../config/api.config';
import { ErrorUtils } from '../utils/error.utils';
import { extractData } from './response-helpers';
import { User } from '../types/auth.types';

class ClientProfileService {
  private readonly TAG = '[ClientProfileService]';

  async fetchProfile(idUser: number): Promise<User> {
    const url = getApiUrl(`/usuarios/${idUser}`);

    try {
      const response = await apiClient.get<unknown>(url);
      return extractData<User>(response);
    } catch (error) {
      ErrorUtils.logError(error, `${this.TAG} fetchProfile`);
      throw error;
    }
  }

  async updateProfile(
    idUser: number,
    payload: Partial<Pick<User, 'nombres' | 'apellidos'>>,
  ): Promise<User> {
    const url = getApiUrl(`/usuarios/${idUser}`);

    try {
      const response = await apiClient.put<unknown>(url, payload);
      return extractData<User>(response);
    } catch (error) {
      ErrorUtils.logError(error, `${this.TAG} updateProfile`);
      throw error;
    }
  }
}

export const clientProfileService = new ClientProfileService();
