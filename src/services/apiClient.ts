/**
 * API Client
 * Handles HTTP requests with interceptors, authentication, retries, and error handling
 */

import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import {
  API_CONFIG,
  API_HEADERS,
  HTTP_STATUS,
  API_ERRORS,
  ApiResponse,
} from '../config/apiConfig';

/**
 * API Client Class
 * Manages all HTTP requests with built-in error handling, retries, and auth
 */
class APIClient {
  private client: AxiosInstance;
  private retryCount: Map<string, number> = new Map();
  private requestIdMap: Map<string, string> = new Map();

  constructor() {
    // Create axios instance
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_HEADERS,
    });

    // Setup interceptors
    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => this.onRequest(config),
      (error) => this.onError(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => this.onResponse(response),
      (error) => this.onError(error)
    );
  }

  /**
   * Request interceptor - Add auth token and tracking info
   */
  private onRequest(config: any) {
    // Add authorization token if available
    const token = this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Generate and store request ID for tracking
    const requestId = this.generateRequestID();
    config.headers['X-Request-ID'] = requestId;
    this.requestIdMap.set(`${config.method}-${config.url}`, requestId);

    // Log request if debug mode enabled
    if (API_CONFIG.FEATURES.logRequests) {
      console.log(`[API ${requestId}] ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log(`[API ${requestId}] Body:`, config.data);
      }
    }

    return config;
  }

  /**
   * Response interceptor - Handle success responses
   */
  private onResponse(response: AxiosResponse) {
    const requestId = response.config.headers['X-Request-ID'];

    if (API_CONFIG.FEATURES.logRequests) {
      console.log(
        `[API ${requestId}] Response: ${response.status} ${response.statusText}`
      );
    }

    // Clear retry count on success
    const key = `${response.config.method}-${response.config.url}`;
    this.retryCount.delete(key);
    this.requestIdMap.delete(key);

    return response;
  }

  /**
   * Error interceptor - Handle all types of errors
   */
  private async onError(error: AxiosError<any>): Promise<any> {
    const config = error.config as any;
    const requestId = config?.headers?.['X-Request-ID'] || 'UNKNOWN';

    console.error(`[API ${requestId}] Error:`, error.message);

    // Handle 401 - Unauthorized
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      return this.handleUnauthorized(error);
    }

    // Handle 403 - Forbidden
    if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
      console.error(`[API ${requestId}] Forbidden - insufficient permissions`);
      return Promise.reject(this.createErrorResponse(API_ERRORS.FORBIDDEN));
    }

    // Handle 404 - Not Found
    if (error.response?.status === HTTP_STATUS.NOT_FOUND) {
      console.error(`[API ${requestId}] Resource not found`);
      return Promise.reject(this.createErrorResponse(API_ERRORS.NOT_FOUND));
    }

    // Handle 4xx client errors (except handled ones above)
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      const errorMsg =
        error.response.data?.message ||
        error.response.data?.error ||
        API_ERRORS.UNKNOWN_ERROR;
      return Promise.reject(this.createErrorResponse(errorMsg));
    }

    // Handle 5xx server errors with retry
    if (error.response?.status && error.response.status >= 500) {
      return this.handleServerError(error);
    }

    // Handle network errors with retry
    if (!error.response) {
      return this.handleNetworkError(error);
    }

    return Promise.reject(this.createErrorResponse(API_ERRORS.UNKNOWN_ERROR));
  }

  /**
   * Handle 401 Unauthorized - Try to refresh token
   */
  private async handleUnauthorized(error: AxiosError): Promise<any> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        if (API_CONFIG.FEATURES.logRequests) {
          console.log('[API] Attempting to refresh authentication token...');
        }

        // Attempt token refresh
        const response = await this.client.post(
          '/auth/refresh',
          { refreshToken },
          { skipInterceptors: true } as any
        );

        if (response.data.token) {
          this.setAuthToken(response.data.token);
          if (response.data.refreshToken) {
            this.setRefreshToken(response.data.refreshToken);
          }

          if (API_CONFIG.FEATURES.logRequests) {
            console.log('[API] Token refreshed successfully, retrying original request');
          }

          // Retry original request with new token
          const originalConfig = error.config as any;
          originalConfig.headers.Authorization = `Bearer ${response.data.token}`;
          return this.client(originalConfig);
        }
      }

      // No refresh token or refresh failed - redirect to login
      this.handleTokenExpired();
      return Promise.reject(this.createErrorResponse(API_ERRORS.UNAUTHORIZED));
    } catch (refreshError) {
      console.error('[API] Token refresh failed:', refreshError);
      this.handleTokenExpired();
      return Promise.reject(this.createErrorResponse(API_ERRORS.UNAUTHORIZED));
    }
  }

  /**
   * Handle server errors - Retry with exponential backoff
   */
  private async handleServerError(error: AxiosError): Promise<any> {
    const config = error.config as any;
    const key = `${config.method}-${config.url}`;
    const attempts = (this.retryCount.get(key) || 0) + 1;

    if (attempts <= API_CONFIG.RETRY.maxAttempts) {
      this.retryCount.set(key, attempts);

      // Calculate backoff delay using exponential backoff
      const delay =
        API_CONFIG.RETRY.delayMs *
        Math.pow(API_CONFIG.RETRY.backoffMultiplier, attempts - 1);

      if (API_CONFIG.FEATURES.logRequests) {
        console.log(
          `[API] Server error (${error.response?.status}) - Retrying (attempt ${attempts}/${API_CONFIG.RETRY.maxAttempts}) after ${delay}ms`
        );
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.client(config);
    }

    console.error(
      `[API] Server error - Max retries exceeded (${attempts} attempts)`
    );
    return Promise.reject(
      this.createErrorResponse(
        API_ERRORS.SERVER_ERROR,
        error.response?.status
      )
    );
  }

  /**
   * Handle network errors - Retry with exponential backoff
   */
  private async handleNetworkError(error: AxiosError): Promise<any> {
    const config = error.config as any;
    const key = `${config.method}-${config.url}`;
    const attempts = (this.retryCount.get(key) || 0) + 1;

    if (attempts <= API_CONFIG.RETRY.maxAttempts) {
      this.retryCount.set(key, attempts);

      const delay =
        API_CONFIG.RETRY.delayMs *
        Math.pow(API_CONFIG.RETRY.backoffMultiplier, attempts - 1);

      if (API_CONFIG.FEATURES.logRequests) {
        console.log(
          `[API] Network error - Retrying (attempt ${attempts}/${API_CONFIG.RETRY.maxAttempts}) after ${delay}ms`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.client(config);
    }

    console.error('[API] Network error - Max retries exceeded');
    return Promise.reject(this.createErrorResponse(API_ERRORS.NETWORK_ERROR));
  }

  /**
   * Public GET method
   */
  public async get<T = any>(
    url: string,
    config?: any
  ): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Public POST method
   */
  public async post<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Public PUT method
   */
  public async put<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Public PATCH method
   */
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Public DELETE method
   */
  public async delete<T = any>(
    url: string,
    config?: any
  ): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Get file download (returns Blob)
   */
  public async download(url: string, config?: any): Promise<Blob> {
    const response = await this.client.get(url, {
      ...config,
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error('[API] Error reading auth token:', error);
      return null;
    }
  }

  /**
   * Get refresh token from storage
   */
  private getRefreshToken(): string | null {
    try {
      return localStorage.getItem('refreshToken');
    } catch (error) {
      console.error('[API] Error reading refresh token:', error);
      return null;
    }
  }

  /**
   * Set authentication token in storage
   */
  private setAuthToken(token: string): void {
    try {
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error('[API] Error setting auth token:', error);
    }
  }

  /**
   * Set refresh token in storage
   */
  private setRefreshToken(token: string): void {
    try {
      localStorage.setItem('refreshToken', token);
    } catch (error) {
      console.error('[API] Error setting refresh token:', error);
    }
  }

  /**
   * Clear authentication tokens
   */
  public clearAuthTokens(): void {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('[API] Error clearing tokens:', error);
    }
  }

  /**
   * Handle token expiration - redirect to login
   */
  private handleTokenExpired(): void {
    this.clearAuthTokens();
    // Dispatch event or use callback to notify app
    window.dispatchEvent(new CustomEvent('tokenExpired'));
    // Redirect to login if not already there
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  /**
   * Create error response object
   */
  private createErrorResponse(message: string, code?: number): ApiResponse {
    return {
      success: false,
      error: message,
      code: code?.toString(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate unique request ID
   */
  private generateRequestID(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get request ID for a specific request
   */
  public getRequestId(method: string, url: string): string | undefined {
    return this.requestIdMap.get(`${method}-${url}`);
  }

  /**
   * Get axios instance for advanced usage
   */
  public getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export class for testing
export { APIClient };
