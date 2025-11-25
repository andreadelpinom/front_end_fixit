import { getApiUrl } from '../config/api.config';
import { apiClient } from './api-client.service';

export async function createTechnician(idUser: number) {
  const url = getApiUrl('/technician/tecnicos');
  const payload = {
    idUser,
    isActive: true,
  };

  return apiClient.post(url, payload);
}
