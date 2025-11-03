import { getErrorMessage, ERROR_MESSAGES } from './errorMessages';

const API_BASE_URL = '/api';

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

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
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
      if (error instanceof HttpError) {
        throw error;
      }
      
      throw new HttpError(
        ERROR_MESSAGES.NETWORK_ERROR,
        0,
        { originalError: error.message }
      );
    }
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
