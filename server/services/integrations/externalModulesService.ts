import { AppError } from '../../middleware/errorHandler.js';

interface GatewayRequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  timeoutMs?: number;
}

interface HealthResult {
  ok: boolean;
  status: number;
  endpoint: string;
  payload: unknown;
}

const DEFAULT_TIMEOUT_MS = 10_000;

function trimSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function ensureUrl(value: string, label: string): string {
  try {
    const parsed = new URL(value);
    if (!/^https?:$/.test(parsed.protocol)) {
      throw new Error('Unsupported protocol');
    }
    return trimSlash(parsed.toString());
  } catch {
    throw new AppError(`${label} is not a valid HTTP/HTTPS URL`, 500);
  }
}

async function requestJson(baseUrl: string, endpoint: string, options: GatewayRequestOptions = {}) {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const method = options.method ?? 'GET';
  const url = `${trimSlash(baseUrl)}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    let payload: unknown = null;
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      payload = await response.json().catch(() => null);
    } else {
      payload = await response.text().catch(() => null);
    }

    if (!response.ok) {
      throw new AppError(
        `Upstream service error (${response.status}) on ${endpoint}`,
        response.status >= 500 ? 502 : response.status
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new AppError(`Upstream timeout on ${endpoint} after ${timeoutMs}ms`, 504);
    }
    throw new AppError(
      `Failed to reach upstream service for ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      502
    );
  } finally {
    clearTimeout(timeout);
  }
}

function getLindaBaseUrl(): string {
  return ensureUrl(
    process.env.LINDA_MODULE_BASE_URL || 'http://127.0.0.1:3200',
    'LINDA_MODULE_BASE_URL'
  );
}

function getHenryBaseUrl(): string {
  return ensureUrl(
    process.env.HENRY_MODULE_BASE_URL || 'http://127.0.0.1:5100',
    'HENRY_MODULE_BASE_URL'
  );
}

async function probeHealth(baseUrl: string, endpoints: string[]): Promise<HealthResult> {
  for (const endpoint of endpoints) {
    try {
      const payload = await requestJson(baseUrl, endpoint);
      return { ok: true, status: 200, endpoint, payload };
    } catch (error) {
      if (endpoint === endpoints[endpoints.length - 1]) {
        throw error;
      }
    }
  }

  return { ok: false, status: 503, endpoint: 'unknown', payload: null };
}

export const externalModulesService = {
  getConfig() {
    return {
      lindaBaseUrl: getLindaBaseUrl(),
      henryBaseUrl: getHenryBaseUrl(),
    };
  },

  async getLindaHealth() {
    return probeHealth(getLindaBaseUrl(), ['/health', '/info']);
  },

  async getHenryHealth() {
    return probeHealth(getHenryBaseUrl(), ['/api/records/archive', '/health']);
  },

  async getHenryArchive() {
    return requestJson(getHenryBaseUrl(), '/api/records/archive');
  },

  async saveHenryArchive(entries: unknown[]) {
    return requestJson(getHenryBaseUrl(), '/api/records/archive', {
      method: 'POST',
      body: entries,
    });
  },

  async getLindaModuleStatus() {
    return requestJson(getLindaBaseUrl(), '/api/linda/status');
  },
};
