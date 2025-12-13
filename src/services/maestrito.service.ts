import { apiClient } from './api-client.service';
import { getApiUrl } from '../config/api.config';
import { ChatMessage, MaestritoResponse } from '../types/maestrito';
import { ErrorUtils } from '../utils/error.utils';

type StartSessionResult = {
  sessionId: string;
};

type HistoryResult = {
  messages: ChatMessage[];
  messageCount: number;
};

class MaestritoService {
  async startSession(): Promise<StartSessionResult> {
    const url = getApiUrl('/request/maestrito/start');

    try {
      return await apiClient.post<StartSessionResult>(url);
    } catch (error) {
      ErrorUtils.logError(error, 'MaestritoService.startSession');
      throw error;
    }
  }

  async sendMessage(sessionId: string, message: string): Promise<MaestritoResponse> {
    const url = getApiUrl(`/request/maestrito/${sessionId}/message`);

    try {
      return await apiClient.post<MaestritoResponse>(url, { message }, { timeout: 35000 });
    } catch (error) {
      ErrorUtils.logError(error, 'MaestritoService.sendMessage');
      throw error;
    }
  }

  async getHistory(sessionId: string): Promise<HistoryResult> {
    const url = getApiUrl(`/request/maestrito/${sessionId}/history`);

    try {
      return await apiClient.get<HistoryResult>(url);
    } catch (error) {
      ErrorUtils.logError(error, 'MaestritoService.getHistory');
      throw error;
    }
  }

  async endSession(sessionId: string): Promise<void> {
    const url = getApiUrl(`/request/maestrito/${sessionId}`);

    try {
      await apiClient.delete<void>(url);
    } catch (error) {
      ErrorUtils.logError(error, 'MaestritoService.endSession');
      throw error;
    }
  }
}

export const maestritoService = new MaestritoService();
