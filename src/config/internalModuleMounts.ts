export type InternalModuleMountMode = 'native' | 'iframe' | 'api';

export interface InternalModuleMountConfig {
  assistantId: string;
  displayName: string;
  mountMode: InternalModuleMountMode;
  enabled: boolean;
  moduleUrl?: string;
  healthUrl?: string;
  description: string;
}

const getEnv = (key: string): string | undefined => {
  const value = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.[key];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
};

const lindaModuleUrl = getEnv('VITE_LINDA_MODULE_URL');
const lindaApiUrl = getEnv('VITE_LINDA_API_URL');
const henryModuleUrl = getEnv('VITE_HENRY_MODULE_URL');

export const INTERNAL_MODULE_MOUNTS: Record<string, InternalModuleMountConfig> = {
  linda: {
    assistantId: 'linda',
    displayName: 'Linda WhatsApp Orchestration',
    mountMode: lindaModuleUrl ? 'iframe' : 'native',
    enabled: true,
    moduleUrl: lindaModuleUrl,
    healthUrl: lindaApiUrl ? `${lindaApiUrl.replace(/\/$/, '')}/health` : undefined,
    description:
      'WhatsApp orchestration module. Runs native by default and can be remote-mounted through VITE_LINDA_MODULE_URL.',
  },
  henry: {
    assistantId: 'henry',
    displayName: 'Henry Records & Compliance',
    mountMode: henryModuleUrl ? 'iframe' : 'native',
    enabled: true,
    moduleUrl: henryModuleUrl,
    description:
      'Record keeper module. Remote mount supported via VITE_HENRY_MODULE_URL with native fallback.',
  },
};

export const getInternalModuleMountConfig = (assistantId: string): InternalModuleMountConfig | null => {
  return INTERNAL_MODULE_MOUNTS[assistantId] ?? null;
};
