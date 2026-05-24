import { getErrorMessage, ERROR_MESSAGES } from '@/constants';

const API_BASE_URL = '/api';
const REQUEST_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay (exponential backoff)

class HttpError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
    this.response = {
      status,
      data,
    };
    Error.captureStackTrace(this, this.constructor);
  }
}

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Create abort controller with timeout
  createTimeoutController(timeout = REQUEST_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    return { controller, timeoutId };
  }

  // Retry logic with exponential backoff
  async retryRequest(requestFn, maxRetries = MAX_RETRIES) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        // Don't retry for client errors (4xx) except 408/429
        if (error instanceof HttpError) {
          if (error.status >= 400 && error.status < 500) {
            if (error.status !== 408 && error.status !== 429) {
              throw error;
            }
          }
        }
        
        // Last attempt failed
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait with exponential backoff: 1s, 2s, 4s
        const delay = RETRY_DELAY * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const { retries = true, timeout = REQUEST_TIMEOUT, ...fetchOptions } = options;
    
    const config = {
      ...fetchOptions,
      headers: {
        ...this.defaultHeaders,
        ...fetchOptions.headers,
      },
    };

    const makeRequest = async () => {
      const { controller, timeoutId } = this.createTimeoutController(timeout);
      
      try {
        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        const data = isJson ? await response.json() : await response.text();

        if (!response.ok) {
          const errorMessage = typeof data === 'object' 
            ? (data.message || data.error || 'Request failed')
            : data;
          throw new HttpError(errorMessage, response.status, data);
        }

        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          throw new HttpError(
            'Request timeout. Please check your connection and try again.',
            408,
            { originalError: 'timeout' }
          );
        }
        
        if (error instanceof HttpError) {
          throw error;
        }
        
        throw new HttpError(
          ERROR_MESSAGES.NETWORK_ERROR,
          0,
          { originalError: error.message }
        );
      }
    };

    // Use retry logic if enabled
    if (retries && (config.method === 'GET' || config.method === undefined)) {
      return this.retryRequest(makeRequest);
    }

    return makeRequest();
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  setAuthToken(token) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }
}

export const apiClient = new ApiClient();
export { getErrorMessage };
