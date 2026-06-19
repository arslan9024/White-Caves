import { ERROR_MESSAGES } from '@/constants';
import { HttpError } from './HttpError';

const API_BASE_URL = '/api';
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const REFRESH_ENDPOINT = '/auth/refresh';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  /** Request timeout in milliseconds. Default: 30000 (30s). Set to 0 to disable. */
  timeout?: number;
  skipRefresh?: boolean;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private refreshInFlight: Promise<boolean> | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.refreshInFlight = null;
  }

  private getCookieValue(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie ? document.cookie.split(';') : [];
    for (const cookie of cookies) {
      const [key, ...valueParts] = cookie.trim().split('=');
      if (key === name) {
        return decodeURIComponent(valueParts.join('='));
      }
    }

    return null;
  }

  private isMutationMethod(method?: string): boolean {
    const normalized = (method || 'GET').toUpperCase();
    return !['GET', 'HEAD', 'OPTIONS'].includes(normalized);
  }

  private shouldAttachCsrf(endpoint: string, method?: string): boolean {
    return endpoint.startsWith('/auth/') && this.isMutationMethod(method);
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshInFlight) {
      this.refreshInFlight = (async () => {
        const csrfToken = this.getCookieValue(CSRF_COOKIE_NAME);
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (csrfToken) {
          headers[CSRF_HEADER_NAME] = csrfToken;
        }

        try {
          const response = await fetch(`${this.baseURL}${REFRESH_ENDPOINT}`, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify({}),
          });

          if (!response.ok) {
            return false;
          }

          const payload = (await response.json()) as {
            success?: boolean;
            data?: { token?: string };
          };
          const rotatedToken = payload?.data?.token;
          if (!rotatedToken) {
            return false;
          }

          this.setAuthToken(rotatedToken);
          return true;
        } catch {
          return false;
        } finally {
          this.refreshInFlight = null;
        }
      })();
    }

    return this.refreshInFlight;
  }

  async request(endpoint: string, options: RequestOptions = {}): Promise<unknown> {
    const url = `${this.baseURL}${endpoint}`;
    const timeout = options.timeout ?? 30000;

    const controller = new AbortController();
    const timeoutId = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;

    // If caller provided an external signal, forward its abort to our controller
    // so both timeout and external cancellation are respected
    const externalSignal = options.signal;
    let externalAbortHandler: (() => void) | null = null;
    if (externalSignal) {
      if (externalSignal.aborted) {
        controller.abort();
      } else {
        externalAbortHandler = () => controller.abort();
        externalSignal.addEventListener('abort', externalAbortHandler);
      }
    }

    const restOptions: RequestOptions = { ...options };
    delete restOptions.signal;
    const config: RequestInit = {
      ...restOptions,
      signal: controller.signal,
      credentials: options.credentials ?? 'include',
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    if (this.shouldAttachCsrf(endpoint, config.method)) {
      const csrfToken = this.getCookieValue(CSRF_COOKIE_NAME);
      if (csrfToken && config.headers) {
        (config.headers as Record<string, string>)[CSRF_HEADER_NAME] = csrfToken;
      }
    }

    try {
      const response = await fetch(url, config);

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      let data: unknown;

      try {
        data = isJson ? await response.json() : await response.text();
      } catch {
        data = `Non-parseable response (status ${response.status})`;
      }

      if (!response.ok) {
        if (response.status === 401 && !options.skipRefresh && endpoint !== REFRESH_ENDPOINT) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            return this.request(endpoint, { ...options, skipRefresh: true });
          }
          this.handleTokenExpired();
        }

        let errorMessage = 'Request failed';

        if (typeof data === 'object' && data !== null) {
          const errObj = data as Record<string, unknown>;
          if (typeof errObj.message === 'string') {
            errorMessage = errObj.message;
          } else if (typeof errObj.error === 'string') {
            errorMessage = errObj.error;
          }
        } else if (typeof data === 'string') {
          errorMessage = data;
        }

        throw new HttpError(errorMessage, response.status, response.statusText ?? '', data);
      }

      return data;
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        throw error;
      }

      if (
        (error instanceof DOMException && error.name === 'AbortError') ||
        (error instanceof Error && error.name === 'AbortError')
      ) {
        const wasCancelled = externalSignal?.aborted;
        throw new HttpError(
          wasCancelled
            ? `Request to ${endpoint} was cancelled`
            : `Request to ${endpoint} timed out after ${timeout}ms`,
          wasCancelled ? 499 : 408,
          '',
          { endpoint, timeout, cancelled: !!wasCancelled }
        );
      }

      throw new HttpError(ERROR_MESSAGES.NETWORK_ERROR, 0, '', {
        originalError: error instanceof Error ? error.message : String(error),
      });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      if (externalSignal && externalAbortHandler) {
        externalSignal.removeEventListener('abort', externalAbortHandler);
      }
    }
  }

  async get(endpoint: string, options: RequestOptions = {}): Promise<unknown> {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  private serializeBody(data: unknown): string {
    try {
      return JSON.stringify(data);
    } catch (e) {
      throw new HttpError(
        `Failed to serialize request body: ${e instanceof Error ? e.message : 'Unknown error'}`,
        400
      );
    }
  }

  async post(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<unknown> {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: this.serializeBody(data),
    });
  }

  async put(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<unknown> {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: this.serializeBody(data),
    });
  }

  async patch(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<unknown> {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: this.serializeBody(data),
    });
  }

  async delete(endpoint: string, options: RequestOptions = {}): Promise<unknown> {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  setAuthToken(token: string | null): void {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  private handleTokenExpired(): void {
    this.setAuthToken(null);

    if (typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(new CustomEvent('tokenExpired'));
  }
}

export const apiClient = new ApiClient();
export { HttpError };
