export type InternalModuleMountMode = 'native' | 'iframe' | 'api';

export interface InternalModuleMountConfig {
  assistantId: string;
  displayName: string;
  mountMode: InternalModuleMountMode;
  enabled: boolean;
  moduleUrl?: string;
  healthUrl?: string;
  description: string;
  architectureId?: 'linda-whatsapp-core' | 'henry-records-core';
  orchestrationOwner?: string;
}

const getEnv = (
  key:
    | 'VITE_LINDA_MODULE_URL'
    | 'VITE_LINDA_API_URL'
    | 'VITE_HENRY_MODULE_URL'
    | 'VITE_HENRY_API_URL'
): string | undefined => {
  const env = (
    import.meta as ImportMeta & {
      env?: {
        VITE_LINDA_MODULE_URL?: string;
        VITE_LINDA_API_URL?: string;
        VITE_HENRY_MODULE_URL?: string;
        VITE_HENRY_API_URL?: string;
      };
    }
  ).env;

  let value: string | undefined;
  switch (key) {
    case 'VITE_LINDA_MODULE_URL':
      value = env?.VITE_LINDA_MODULE_URL;
      break;
    case 'VITE_LINDA_API_URL':
      value = env?.VITE_LINDA_API_URL;
      break;
    case 'VITE_HENRY_MODULE_URL':
      value = env?.VITE_HENRY_MODULE_URL;
      break;
    case 'VITE_HENRY_API_URL':
      value = env?.VITE_HENRY_API_URL;
      break;
    default:
      value = undefined;
  }

  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
};

const lindaModuleUrl = getEnv('VITE_LINDA_MODULE_URL');
const lindaApiUrl = getEnv('VITE_LINDA_API_URL');
const henryModuleUrl = getEnv('VITE_HENRY_MODULE_URL');
const henryApiUrl = getEnv('VITE_HENRY_API_URL');

export const INTERNAL_MODULE_MOUNTS: Record<string, InternalModuleMountConfig> = {
  linda: {
    assistantId: 'linda',
    displayName: 'Linda WhatsApp Orchestration',
    mountMode: lindaModuleUrl ? 'iframe' : 'native',
    enabled: true,
    moduleUrl: lindaModuleUrl,
    healthUrl: lindaApiUrl ? `${lindaApiUrl.replace(/\/$/, '')}/health` : undefined,
    architectureId: 'linda-whatsapp-core',
    orchestrationOwner: 'linda',
    description:
      'WhatsApp orchestration module. Runs native by default and can be remote-mounted through VITE_LINDA_MODULE_URL.',
  },
  henry: {
    assistantId: 'henry',
    displayName: 'Henry Records & Compliance',
    mountMode: henryModuleUrl ? 'iframe' : 'native',
    enabled: true,
    moduleUrl: henryModuleUrl,
    healthUrl: henryApiUrl ? `${henryApiUrl.replace(/\/$/, '')}/health` : undefined,
    architectureId: 'henry-records-core',
    orchestrationOwner: 'henry',
    description:
      'Record keeper module. Remote mount supported via VITE_HENRY_MODULE_URL with native fallback.',
  },
};

export const getInternalModuleMountConfig = (
  assistantId: string
): InternalModuleMountConfig | null => {
  switch (assistantId) {
    case 'linda':
      return INTERNAL_MODULE_MOUNTS.linda;
    case 'henry':
      return INTERNAL_MODULE_MOUNTS.henry;
    default:
      return null;
  }
};
