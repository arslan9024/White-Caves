/**
 * Test Data Factory
 * Provides reusable factory functions for creating test data
 * Integrates with @faker-js/faker for randomization
 */

import { faker } from '@faker-js/faker';

/**
 * Create test user with optional overrides
 */
export function createTestUser(overrides = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    role: 'user',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}

/**
 * Create admin user
 */
export function createTestAdmin(overrides = {}) {
  return createTestUser({
    role: 'admin',
    ...overrides,
  });
}

/**
 * Create test client with optional overrides
 */
export function createTestClient(overrides = {}) {
  return {
    id: faker.string.uuid(),
    agentId: faker.string.uuid(),
    name: faker.company.name(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    notes: faker.lorem.paragraph(),
    status: 'active',
    totalProjects: faker.number.int({ min: 0, max: 100 }),
    totalSpent: faker.number.float({ min: 0, max: 500000 }),
    createdAt: faker.date.past(),
    ...overrides,
  };
}

/**
 * Create test commission with optional overrides
 */
export function createTestCommission(overrides = {}) {
  return {
    id: faker.string.uuid(),
    agentId: faker.string.uuid(),
    clientId: faker.string.uuid(),
    projectId: faker.string.uuid(),
    amount: faker.number.float({ min: 100, max: 50000, fractionDigits: 2 }),
    percentage: faker.number.int({ min: 5, max: 30 }),
    status: 'pending',
    dueDate: faker.date.future(),
    paidDate: null,
    notes: faker.lorem.sentence(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}

/**
 * Create test project with optional overrides
 */
export function createTestProject(overrides = {}) {
  return {
    id: faker.string.uuid(),
    agentId: faker.string.uuid(),
    clientId: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    budget: faker.number.float({ min: 1000, max: 100000, fractionDigits: 2 }),
    status: 'in_progress',
    startDate: faker.date.past(),
    dueDate: faker.date.future(),
    completedDate: null,
    tags: faker.helpers.multiple(() => faker.word.words(1), { count: 3 }),
    attachments: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}

/**
 * Create test authentication token
 */
export function createTestAuthToken(overrides = {}) {
  return {
    accessToken: faker.string.alphanumeric(256),
    refreshToken: faker.string.alphanumeric(256),
    expiresIn: 3600,
    tokenType: 'Bearer',
    ...overrides,
  };
}

/**
 * Create test API response wrapper
 */
export function createTestResponse(data = {}, overrides = {}) {
  return {
    success: true,
    statusCode: 200,
    message: 'Success',
    data,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create test error response
 */
export function createTestErrorResponse(message = 'Error', overrides = {}) {
  return {
    success: false,
    statusCode: 400,
    message,
    error: {
      code: 'REQUEST_ERROR',
      details: faker.lorem.sentence(),
    },
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create multiple test users
 */
export function createTestUsers(count = 5, overrides = {}) {
  return Array.from({ length: count }, () => createTestUser(overrides));
}

/**
 * Create multiple test clients
 */
export function createTestClients(count = 5, overrides = {}) {
  return Array.from({ length: count }, () => createTestClient(overrides));
}

/**
 * Create multiple test commissions
 */
export function createTestCommissions(count = 5, overrides = {}) {
  return Array.from({ length: count }, () => createTestCommission(overrides));
}
