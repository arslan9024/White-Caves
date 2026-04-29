/**
 * HTTP Status Code Constants and Helper Functions
 * For consistent error handling and testing
 */

export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  RATE_LIMITED: 429,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Standardized API Response Format
 */
export class ApiResponse {
  constructor(status, message, data = null, errors = null) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }

  static success(message, data = null) {
    return new ApiResponse(HTTP_STATUS.OK, message, data);
  }

  static created(message, data) {
    return new ApiResponse(HTTP_STATUS.CREATED, message, data);
  }

  static error(status, message, errors = null) {
    return new ApiResponse(status, message, null, errors);
  }

  static badRequest(message, errors) {
    return new ApiResponse(HTTP_STATUS.BAD_REQUEST, message, null, errors);
  }

  static unauthorized(message = 'Unauthorized access') {
    return new ApiResponse(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(message = 'Access denied') {
    return new ApiResponse(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiResponse(HTTP_STATUS.NOT_FOUND, message);
  }

  static serverError(message = 'Internal server error', errors = null) {
    return new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, null, errors);
  }
}

/**
 * API Testing Utilities
 */
export class ApiTestHelper {
  static createMockRequest(method = 'GET', url = '/', body = null, headers = {}) {
    return {
      method,
      url,
      body,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      query: {},
      params: {},
    };
  }

  static createMockResponse() {
    const response = {
      status: jest.fn(() => response),
      json: jest.fn(() => response),
      send: jest.fn(() => response),
      statusCode: 200,
      _getData: jest.fn(() => '{}'),
    };
    return response;
  }

  static expectJsonResponse(response, expectedStatus, expectedData = null) {
    expect(response.status).toHaveBeenCalledWith(expectedStatus);
    if (expectedData) {
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining(expectedData)
      );
    }
  }

  static expectErrorResponse(response, expectedStatus, expectedMessage) {
    expect(response.status).toHaveBeenCalledWith(expectedStatus);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expectedMessage,
      })
    );
  }

  static expectSuccessResponse(response, expectedMessage, expectedData = null) {
    expect(response.status).toHaveBeenCalledWith(200);
    const expectedPayload = {
      success: true,
      message: expectedMessage,
    };
    if (expectedData) {
      expectedPayload.data = expectedData;
    }
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining(expectedPayload)
    );
  }
}

/**
 * Database Testing Utilities
 */
export class DatabaseTestHelper {
  static async cleanDatabase(models) {
    for (const model of models) {
      await model.deleteMany({});
    }
  }

  static async seedDatabase(model, data) {
    return await model.insertMany(data);
  }

  static async findDocumentById(model, id) {
    return await model.findById(id);
  }

  static async countDocuments(model, query = {}) {
    return await model.countDocuments(query);
  }
}

/**
 * Authentication Testing Utilities
 */
export class AuthTestHelper {
  static generateMockToken(userId, role = 'user') {
    // In real scenario, use jwt.sign()
    // This is a mock for testing purposes
    return `mock.jwt.token.${userId}.${role}`;
  }

  static createAuthHeader(token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static createBasicAuthHeader(username, password) {
    const encoded = Buffer.from(`${username}:${password}`).toString('base64');
    return {
      Authorization: `Basic ${encoded}`,
    };
  }
}

/**
 * File Upload Testing Utilities
 */
export class FileUploadTestHelper {
  static createMockMultipartForm(file, fieldName = 'file') {
    const form = new FormData();
    form.append(fieldName, file);
    return form;
  }

  static createMockExcelFile(data, fileName = 'test.xlsx') {
    // Mock Excel file content
    const content = JSON.stringify(data);
    return new File([content], fileName, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  }

  static createMockCsvFile(headers, rows, fileName = 'test.csv') {
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => Object.values(row).join(',')),
    ].join('\n');
    return new File([csvContent], fileName, { type: 'text/csv' });
  }

  static validateFileExtension(fileName, allowedExtensions) {
    const ext = fileName.split('.').pop().toLowerCase();
    return allowedExtensions.includes(ext);
  }

  static validateFileSize(file, maxSizeMB) {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxBytes;
  }
}

/**
 * Assertion Helpers
 */
export class AssertionHelper {
  static expectValidPropertyObject(property) {
    expect(property).toHaveProperty('_id');
    expect(property).toHaveProperty('location');
    expect(property).toHaveProperty('propertyType');
    expect(property).toHaveProperty('bedrooms');
    expect(property).toHaveProperty('bathrooms');
    expect(property).toHaveProperty('area');
    expect(property).toHaveProperty('price');
    expect(property).toHaveProperty('status');
    expect(property).toHaveProperty('owner');
    expect(property).toHaveProperty('createdAt');
  }

  static expectValidOwnerObject(owner) {
    expect(owner).toHaveProperty('_id');
    expect(owner).toHaveProperty('name');
    expect(owner).toHaveProperty('email');
    expect(owner).toHaveProperty('phone');
    expect(owner).toHaveProperty('createdAt');
  }

  static expectValidImportSession(session) {
    expect(session).toHaveProperty('_id');
    expect(session).toHaveProperty('fileName');
    expect(session).toHaveProperty('status');
    expect(session).toHaveProperty('importedCount');
    expect(session).toHaveProperty('failedCount');
    expect(session).toHaveProperty('createdAt');
  }

  static expectArrayOfValidProperties(properties) {
    expect(Array.isArray(properties)).toBe(true);
    properties.forEach((property) => {
      this.expectValidPropertyObject(property);
    });
  }

  static expectPaginatedResponse(response) {
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('pagination');
    expect(response.pagination).toHaveProperty('page');
    expect(response.pagination).toHaveProperty('limit');
    expect(response.pagination).toHaveProperty('total');
    expect(response.pagination).toHaveProperty('pages');
  }
}

/**
 * Mock Data Generators
 */
export class MockDataGenerator {
  static generateProperty(overrides = {}) {
    return {
      location: 'Dubai Marina',
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: 1500,
      price: 1500000,
      currency: 'AED',
      status: 'Available',
      owner: 'Owner ID',
      description: 'Stunning apartment in Dubai Marina',
      amenities: ['Pool', 'Gym', 'Security'],
      ...overrides,
    };
  }

  static generateOwner(overrides = {}) {
    return {
      name: 'Ahmed Al Mansouri',
      email: 'ahmed@example.com',
      phone: '+971501234567',
      address: 'Dubai, UAE',
      ...overrides,
    };
  }

  static generateImportSession(overrides = {}) {
    return {
      fileName: 'properties.xlsx',
      status: 'completed',
      importedCount: 100,
      failedCount: 0,
      totalRowsProcessed: 100,
      mappingData: {},
      errors: [],
      ...overrides,
    };
  }

  static generateMultipleProperties(count = 5, overrides = {}) {
    return Array.from({ length: count }, (_, i) =>
      this.generateProperty({
        location: `Location ${i + 1}`,
        ...overrides,
      })
    );
  }
}

/**
 * Time Testing Utilities
 */
export class TimeTestHelper {
  static mockDateNow() {
    const now = new Date('2024-01-15T12:00:00Z');
    jest.spyOn(Date, 'now').mockReturnValue(now.getTime());
    return now;
  }

  static restoreDateNow() {
    jest.restoreAllMocks();
  }

  static getRandomFutureDate(daysFromNow = 7) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
  }

  static getRandomPastDate(daysAgo = 7) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  }
}

export default {
  HTTP_STATUS,
  ApiResponse,
  ApiTestHelper,
  DatabaseTestHelper,
  AuthTestHelper,
  FileUploadTestHelper,
  AssertionHelper,
  MockDataGenerator,
  TimeTestHelper,
};
