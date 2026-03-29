import { getErrorMessage, ERROR_MESSAGES } from './errorMessages';

const API_BASE_URL = '/api';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  /** Request timeout in milliseconds. Default: 30000 (30s). Set to 0 to disable. */
  timeout?: number;
}

class HttpError extends Error {
  readonly status: number;
  readonly data: unknown;
  readonly response: { status: number; data: unknown };

  constructor(message: string, status = 500, data: unknown = null) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
    this.response = {
      status,
      data,
    };
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
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

    const { signal: _ignoredSignal, ...restOptions } = options;
    const config: RequestInit = {
      ...restOptions,
      signal: controller.signal,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

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

        throw new HttpError(errorMessage, response.status, data);
      }

      return data;
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        throw error;
      }

      if ((error instanceof DOMException && error.name === 'AbortError') || (error instanceof Error && error.name === 'AbortError')) {
        const wasCancelled = externalSignal?.aborted;
        throw new HttpError(
          wasCancelled
            ? `Request to ${endpoint} was cancelled`
            : `Request to ${endpoint} timed out after ${timeout}ms`,
          wasCancelled ? 499 : 408,
          { endpoint, timeout, cancelled: !!wasCancelled }
        );
      }
      
      throw new HttpError(
        ERROR_MESSAGES.NETWORK_ERROR,
        0,
        { originalError: error instanceof Error ? error.message : String(error) }
      );
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
}

export const apiClient = new ApiClient();
export { HttpError, getErrorMessage };
