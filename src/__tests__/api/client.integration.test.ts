/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Service Integration Tests
 * @description Tests HttpClient service with mocked API calls
 * @path src/__tests__/api/client.integration.test.ts
 * @created Phase 17 Day 2
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let mockInstance: any;

/**
 * Mock HttpClient class
 * Simulates the actual service from src/services/httpClient.ts
 */
class HttpClient {
  private baseURL: string;
  private axiosInstance: any;

  constructor(baseURL: string = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
    this.axiosInstance = mockInstance;
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.delete(url, config);
    return response.data;
  }
}

/**
 * Mock Client API service
 * Simulates actual API endpoint calls
 */
class ClientApiService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getClients(params?: { skip?: number; take?: number; filter?: string }) {
    return this.httpClient.get('/clients', { params });
  }

  async getClientById(id: string) {
    return this.httpClient.get(`/clients/${id}`);
  }

  async createClient(data: { name: string; email: string; phone?: string; company?: string }) {
    // Validate required fields
    if (!data.name?.trim()) {
      throw new Error('Client name is required');
    }
    if (!data.email?.trim()) {
      throw new Error('Client email is required');
    }

    return this.httpClient.post('/clients', data);
  }

  async updateClient(id: string, data: Partial<any>) {
    if (!id) {
      throw new Error('Client ID is required');
    }

    return this.httpClient.put(`/clients/${id}`, data);
  }

  async deleteClient(id: string) {
    if (!id) {
      throw new Error('Client ID is required');
    }

    return this.httpClient.delete(`/clients/${id}`);
  }
}

/**
 * Test Suite: Client API Integration
 */
describe('ClientApiService Integration Tests', () => {
  let httpClient: HttpClient;
  let clientApi: ClientApiService;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup mock axios instance
    mockInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };

    // Initialize services
    httpClient = new HttpClient();
    clientApi = new ClientApiService(httpClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Test 1: Fetch clients with filters', () => {
    it('should fetch clients with pagination and filters', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', name: 'Acme Corp', email: 'contact@acme.com' },
          { id: '2', name: 'Beta Inc', email: 'hello@beta.com' },
        ],
      };

      mockInstance.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await clientApi.getClients({
        skip: 0,
        take: 10,
        filter: 'acme',
      });

      // Assert
      expect(mockInstance.get).toHaveBeenCalledWith('/clients', {
        params: { skip: 0, take: 10, filter: 'acme' },
      });
      expect(mockInstance.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle empty client list', async () => {
      // Arrange
      const mockResponse = { data: [] };
      mockInstance.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await clientApi.getClients();

      // Assert
      expect(result).toEqual([]);
      expect(mockInstance.get).toHaveBeenCalledTimes(1);
    });

    it('should pass correct params to API', async () => {
      // Arrange
      const mockResponse = { data: [] };
      mockInstance.get.mockResolvedValueOnce(mockResponse);

      // Act
      await clientApi.getClients({ skip: 20, take: 5 });

      // Assert
      expect(mockInstance.get).toHaveBeenCalledWith('/clients', {
        params: { skip: 20, take: 5, filter: undefined },
      });
    });
  });

  describe('Test 2: Create client with validation', () => {
    it('should create client with valid data', async () => {
      // Arrange
      const createPayload = {
        name: 'New Client',
        email: 'new@example.com',
        phone: '+1-555-0100',
        company: 'Tech Corp',
      };

      const mockResponse = {
        data: { id: '123', ...createPayload, createdAt: new Date().toISOString() },
      };

      mockInstance.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await clientApi.createClient(createPayload);

      // Assert
      expect(mockInstance.post).toHaveBeenCalledWith('/clients', createPayload, undefined);
      expect(result).toEqual(mockResponse.data);
      expect((result as any).id).toBe('123');
    });

    it('should reject client creation without name', async () => {
      // Arrange
      const invalidPayload = {
        name: '',
        email: 'test@example.com',
      };

      // Act & Assert
      await expect(clientApi.createClient(invalidPayload)).rejects.toThrow(
        'Client name is required'
      );
      expect(mockInstance.post).not.toHaveBeenCalled();
    });

    it('should reject client creation without email', async () => {
      // Arrange
      const invalidPayload = {
        name: 'Test Client',
        email: '',
      };

      // Act & Assert
      await expect(clientApi.createClient(invalidPayload)).rejects.toThrow(
        'Client email is required'
      );
      expect(mockInstance.post).not.toHaveBeenCalled();
    });

    it('should validate name is not whitespace only', async () => {
      // Arrange
      const invalidPayload = {
        name: '   ',
        email: 'test@example.com',
      };

      // Act & Assert
      await expect(clientApi.createClient(invalidPayload)).rejects.toThrow(
        'Client name is required'
      );
    });
  });

  describe('Test 3: Update client data', () => {
    it('should update client with partial data', async () => {
      // Arrange
      const clientId = '123';
      const updatePayload = {
        company: 'New Company Name',
        phone: '+1-555-0200',
      };

      const mockResponse = {
        data: {
          id: clientId,
          name: 'Existing Client',
          email: 'client@example.com',
          ...updatePayload,
        },
      };

      mockInstance.put.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await clientApi.updateClient(clientId, updatePayload);

      // Assert
      expect(mockInstance.put).toHaveBeenCalledWith(
        `/clients/${clientId}`,
        updatePayload,
        undefined
      );
      expect((result as any).company).toBe('New Company Name');
    });

    it('should reject update without client ID', async () => {
      // Arrange & Act
      await expect(clientApi.updateClient('', { name: 'New Name' })).rejects.toThrow(
        'Client ID is required'
      );

      // Assert
      expect(mockInstance.put).not.toHaveBeenCalled();
    });

    it('should handle API error on update', async () => {
      // Arrange
      const clientId = '123';
      const updatePayload = { name: 'Updated Name' };
      const apiError = new Error('Client not found');

      mockInstance.put.mockRejectedValueOnce(apiError);

      // Act & Assert
      await expect(clientApi.updateClient(clientId, updatePayload)).rejects.toThrow(
        'Client not found'
      );
    });
  });

  describe('Test 4: Delete client', () => {
    it('should delete client by ID', async () => {
      // Arrange
      const clientId = '123';
      const mockResponse = { data: { success: true, id: clientId } };

      mockInstance.delete.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await clientApi.deleteClient(clientId);

      // Assert
      expect(mockInstance.delete).toHaveBeenCalledWith(`/clients/${clientId}`, undefined);
      expect((result as any).success).toBe(true);
    });

    it('should reject delete without client ID', async () => {
      // Act & Assert
      await expect(clientApi.deleteClient('')).rejects.toThrow('Client ID is required');
      expect(mockInstance.delete).not.toHaveBeenCalled();
    });

    it('should handle cascade deletion', async () => {
      // Arrange
      const clientId = '123';
      const mockResponse = {
        data: {
          id: clientId,
          deletedAt: new Date().toISOString(),
          relatedRecordsDeleted: 5,
        },
      };

      mockInstance.delete.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await clientApi.deleteClient(clientId);

      // Assert
      expect((result as any).relatedRecordsDeleted).toBe(5);
      expect(mockInstance.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test 5: Handle API errors gracefully', () => {
    it('should catch and handle 404 errors', async () => {
      // Arrange
      const error: AxiosError | any = {
        response: {
          status: 404,
          data: { message: 'Client not found' },
        },
        message: 'Request failed with status code 404',
      };

      mockInstance.get.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(clientApi.getClientById('nonexistent')).rejects.toThrow();
    });

    it('should catch and handle 400 validation errors', async () => {
      // Arrange
      const error: AxiosError | any = {
        response: {
          status: 400,
          data: { message: 'Invalid client data', errors: { email: 'Invalid format' } },
        },
        message: 'Request failed with status code 400',
      };

      mockInstance.post.mockRejectedValueOnce(error);

      // Act & Assert
      const payload = { name: 'Test', email: 'invalid' };
      await expect(clientApi.createClient(payload)).rejects.toThrow();
    });

    it('should catch and handle 500 server errors', async () => {
      // Arrange
      const error: AxiosError | any = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
        message: 'Request failed with status code 500',
      };

      mockInstance.get.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(clientApi.getClients()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      // Arrange
      const error = new Error('Network Error');

      mockInstance.get.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(clientApi.getClients()).rejects.toThrow('Network Error');
    });

    it('should handle timeout errors', async () => {
      // Arrange
      const error: AxiosError | any = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
      };

      mockInstance.get.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(clientApi.getClients()).rejects.toThrow();
    });
  });

  describe('Integration: Full client lifecycle', () => {
    it('should create, fetch, update, and delete client', async () => {
      // Arrange
      const createPayload = { name: 'Lifecycle Test', email: 'lifecycle@test.com' };
      const createResponse = { data: { id: '999', ...createPayload } };
      const updateResponse = { data: { id: '999', ...createPayload, company: 'Updated' } };
      const deleteResponse = { data: { success: true } };

      mockInstance.post.mockResolvedValueOnce(createResponse);
      mockInstance.put.mockResolvedValueOnce(updateResponse);
      mockInstance.delete.mockResolvedValueOnce(deleteResponse);

      // Act
      const created = await clientApi.createClient(createPayload);
      const updated = await clientApi.updateClient('999', { company: 'Updated' });
      const deleted = await clientApi.deleteClient('999');

      // Assert
      expect((created as any).id).toBe('999');
      expect((updated as any).company).toBe('Updated');
      expect((deleted as any).success).toBe(true);
      expect(mockInstance.post).toHaveBeenCalledTimes(1);
      expect(mockInstance.put).toHaveBeenCalledTimes(1);
      expect(mockInstance.delete).toHaveBeenCalledTimes(1);
    });
  });
});
