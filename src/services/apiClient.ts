/**
 * API Client
 * Fetch-based client with authentication, retries, and consistent error responses.
 */

import { API_CONFIG, API_HEADERS, HTTP_STATUS, API_ERRORS, ApiResponse } from '../config/apiConfig';

type RequestConfig = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined | null>;
  timeout?: number;
  skipInterceptors?: boolean;
};

class APIClient {
  private retryCount: Map<string, number> = new Map();
  private requestIdMap: Map<string, string> = new Map();

  private buildUrl(url: string, params?: RequestConfig['params']): string {
    const base = API_CONFIG.BASE_URL || '';
    const final = url.startsWith('http') ? url : `${base}${url}`;
    if (!params) return final;

    const parsed = new URL(final, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        parsed.searchParams.set(key, String(value));
      }
    });

    return parsed.toString().replace(window.location.origin, '');
  }

  private buildHeaders(inputHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      ...API_HEADERS,
      ...inputHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async parseResponse(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json().catch(() => ({}));
    }
    return response.text().catch(() => '');
  }

  private createRequestKey(method: string, url: string): string {
    return `${method.toUpperCase()}-${url}`;
  }

  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
    config: RequestConfig = {},
    attempt = 1
  ): Promise<T> {
    const fullUrl = this.buildUrl(url, config.params);
    const requestId = this.generateRequestID();
    const key = this.createRequestKey(method, fullUrl);

    this.requestIdMap.set(key, requestId);

    const timeoutMs = config.timeout ?? API_CONFIG.TIMEOUT;
    const controller = new AbortController();
    const timeoutId =
      timeoutMs > 0 ? window.setTimeout(() => controller.abort(), timeoutMs) : undefined;

    const headers = this.buildHeaders(config.headers);
    headers['X-Request-ID'] = requestId;

    if (API_CONFIG.FEATURES.logRequests) {
      console.warn(`[API ${requestId}] ${method.toUpperCase()} ${fullUrl}`);
      if (data) console.warn(`[API ${requestId}] Body:`, data);
    }

    try {
      const response = await fetch(fullUrl, {
        method,
        headers,
        body:
          data === undefined ? undefined : data instanceof FormData ? data : JSON.stringify(data),
        signal: controller.signal,
      });

      const payload = await this.parseResponse(response);

      if (API_CONFIG.FEATURES.logRequests) {
        console.warn(`[API ${requestId}] Response: ${response.status} ${response.statusText}`);
      }

      if (response.ok) {
        this.retryCount.delete(key);
        this.requestIdMap.delete(key);
        return payload as T;
      }

      if (response.status === HTTP_STATUS.UNAUTHORIZED && !config.skipInterceptors) {
        return this.handleUnauthorized<T>(method, url, data, config, attempt);
      }

      if (response.status >= 500 && attempt <= API_CONFIG.RETRY.maxAttempts) {
        const delay =
          API_CONFIG.RETRY.delayMs * Math.pow(API_CONFIG.RETRY.backoffMultiplier, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(method, url, data, config, attempt + 1);
      }

      const errorMessage =
        (typeof payload === 'object' &&
          payload !== null &&
          ((payload as Record<string, unknown>).message as string)) ||
        (typeof payload === 'object' &&
          payload !== null &&
          ((payload as Record<string, unknown>).error as string)) ||
        (response.status === HTTP_STATUS.FORBIDDEN
          ? API_ERRORS.FORBIDDEN
          : response.status === HTTP_STATUS.NOT_FOUND
            ? API_ERRORS.NOT_FOUND
            : API_ERRORS.UNKNOWN_ERROR);

      throw this.createErrorResponse(errorMessage, response.status);
    } catch (error) {
      if ((error as { success?: boolean })?.success === false) {
        throw error;
      }

      const isAbortError = error instanceof DOMException && error.name === 'AbortError';
      if (isAbortError) {
        throw this.createErrorResponse(API_ERRORS.NETWORK_ERROR, 408);
      }

      if (attempt <= API_CONFIG.RETRY.maxAttempts) {
        const delay =
          API_CONFIG.RETRY.delayMs * Math.pow(API_CONFIG.RETRY.backoffMultiplier, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(method, url, data, config, attempt + 1);
      }

      throw this.createErrorResponse(API_ERRORS.NETWORK_ERROR);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  private async handleUnauthorized<T>(
    method: string,
    url: string,
    data?: unknown,
    config: RequestConfig = {},
    attempt = 1
  ): Promise<T> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.handleTokenExpired();
        throw this.createErrorResponse(API_ERRORS.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
      }

      const refresh = await this.request<{ token?: string; refreshToken?: string }>(
        'POST',
        '/auth/refresh',
        { refreshToken },
        { skipInterceptors: true },
        attempt
      );

      if (!refresh?.token) {
        this.handleTokenExpired();
        throw this.createErrorResponse(API_ERRORS.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
      }

      this.setAuthToken(refresh.token);
      if (refresh.refreshToken) {
        this.setRefreshToken(refresh.refreshToken);
      }

      return this.request<T>(method, url, data, config, attempt + 1);
    } catch {
      this.handleTokenExpired();
      throw this.createErrorResponse(API_ERRORS.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  public async get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', url, undefined, config);
  }

  public async post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('POST', url, data, config);
  }

  public async put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('PUT', url, data, config);
  }

  public async patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('PATCH', url, data, config);
  }

  public async delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  public async download(url: string, config: RequestConfig = {}): Promise<Blob> {
    const fullUrl = this.buildUrl(url, config.params);
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: this.buildHeaders(config.headers),
    });

    if (!response.ok) {
      throw this.createErrorResponse(API_ERRORS.UNKNOWN_ERROR, response.status);
    }

    return response.blob();
  }

  private getAuthToken(): string | null {
    try {
      return localStorage.getItem('authToken');
    } catch {
      return null;
    }
  }

  private getRefreshToken(): string | null {
    try {
      return localStorage.getItem('refreshToken');
    } catch {
      return null;
    }
  }

  private setAuthToken(token: string): void {
    try {
      localStorage.setItem('authToken', token);
    } catch {
      // ignore storage errors
    }
  }

  private setRefreshToken(token: string): void {
    try {
      localStorage.setItem('refreshToken', token);
    } catch {
      // ignore storage errors
    }
  }

  public clearAuthTokens(): void {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    } catch {
      // ignore storage errors
    }
  }

  private handleTokenExpired(): void {
    this.clearAuthTokens();
    window.dispatchEvent(new CustomEvent('tokenExpired'));
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  private createErrorResponse(message: string, code?: number): ApiResponse {
    return {
      success: false,
      error: message,
      code: code?.toString(),
      timestamp: new Date().toISOString(),
    };
  }

  private generateRequestID(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  public getRequestId(method: string, url: string): string | undefined {
    return this.requestIdMap.get(this.createRequestKey(method, url));
  }

  // Backward compatibility hook; axios instance is no longer used.
  public getAxiosInstance(): null {
    return null;
  }
}

export const apiClient = new APIClient();
export { APIClient };
