import { apiClient } from '../utils/apiClient';

export interface ExternalModuleHealth {
  ok: boolean;
  status: number;
  endpoint: string;
  payload: unknown;
}

export interface IntegrationsStatusResponse {
  success: boolean;
  data: {
    config: {
      lindaBaseUrl: string;
      henryBaseUrl: string;
    };
    linda: ExternalModuleHealth | { ok: false; error: string };
    henry: ExternalModuleHealth | { ok: false; error: string };
  };
}

const BASE = '/integrations';

export const externalModulesService = {
  async getStatus() {
    return (await apiClient.get(`${BASE}/status`)) as IntegrationsStatusResponse;
  },

  async getLindaHealth() {
    return (await apiClient.get(`${BASE}/linda/health`)) as {
      success: boolean;
      data: ExternalModuleHealth;
    };
  },

  async getLindaStatus() {
    return (await apiClient.get(`${BASE}/linda/status`)) as {
      success: boolean;
      data: unknown;
    };
  },

  async getHenryHealth() {
    return (await apiClient.get(`${BASE}/henry/health`)) as {
      success: boolean;
      data: ExternalModuleHealth;
    };
  },

  async getHenryArchive() {
    return (await apiClient.get(`${BASE}/henry/archive`)) as {
      success: boolean;
      data: unknown;
    };
  },

  async saveHenryArchive(entries: unknown[]) {
    return (await apiClient.post(`${BASE}/henry/archive`, entries)) as {
      success: boolean;
      data: unknown;
    };
  },
};
