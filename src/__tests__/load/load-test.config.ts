/**
 * Load Testing Configuration
 * Defines scenarios, thresholds, and metrics for production load testing
 */

export interface LoadTestScenario {
  name: string;
  description: string;
  duration: number; // seconds
  rampUp: number; // seconds
  virtualUsers: number;
  thinkTime: number; // milliseconds
  endpoints: LoadTestEndpoint[];
  successCriteria: SuccessCriteria;
}

export interface LoadTestEndpoint {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  weight: number; // percentage of traffic
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  expectedStatus: number;
}

export interface SuccessCriteria {
  maxResponseTime: number; // ms
  p95ResponseTime: number; // ms
  p99ResponseTime: number; // ms
  errorRate: number; // percentage
  throughput: number; // requests per second
}

export interface LoadTestResults {
  scenario: string;
  timestamp: string;
  duration: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: number;
  throughput: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  p50ResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errors: Record<string, number>;
}

// Baseline scenarios - graduated load testing
export const LOAD_TEST_SCENARIOS: LoadTestScenario[] = [
  {
    name: 'smoke-test',
    description: 'Basic smoke test - minimal load to verify basic functionality',
    duration: 60,
    rampUp: 10,
    virtualUsers: 10,
    thinkTime: 100,
    endpoints: [
      {
        name: 'Health Check',
        method: 'GET',
        path: '/health',
        weight: 20,
        expectedStatus: 200,
      },
      {
        name: 'Get Departments',
        method: 'GET',
        path: '/api/departments',
        weight: 30,
        expectedStatus: 200,
      },
      {
        name: 'Get Services',
        method: 'GET',
        path: '/api/services',
        weight: 30,
        expectedStatus: 200,
      },
      {
        name: 'Get Users',
        method: 'GET',
        path: '/api/users',
        weight: 20,
        expectedStatus: 200,
      },
    ],
    successCriteria: {
      maxResponseTime: 5000,
      p95ResponseTime: 1000,
      p99ResponseTime: 2000,
      errorRate: 0.1,
      throughput: 1,
    },
  },

  {
    name: 'normal-load',
    description: 'Normal production load - typical user behavior',
    duration: 300,
    rampUp: 30,
    virtualUsers: 100,
    thinkTime: 500,
    endpoints: [
      {
        name: 'Health Check',
        method: 'GET',
        path: '/health',
        weight: 5,
        expectedStatus: 200,
      },
      {
        name: 'Get Departments',
        method: 'GET',
        path: '/api/departments',
        weight: 15,
        expectedStatus: 200,
      },
      {
        name: 'Get Services',
        method: 'GET',
        path: '/api/services',
        weight: 15,
        expectedStatus: 200,
      },
      {
        name: 'Get Users',
        method: 'GET',
        path: '/api/users',
        weight: 15,
        expectedStatus: 200,
      },
      {
        name: 'Create Ticket',
        method: 'POST',
        path: '/api/tickets',
        weight: 20,
        expectedStatus: 201,
        body: {
          title: 'Test Ticket',
          description: 'This is a test ticket',
          priority: 'medium',
          departmentId: '1',
        },
      },
      {
        name: 'Update Ticket',
        method: 'PUT',
        path: '/api/tickets/1',
        weight: 15,
        expectedStatus: 200,
        body: {
          status: 'in-progress',
        },
      },
      {
        name: 'Get Messages',
        method: 'GET',
        path: '/api/messages',
        weight: 15,
        expectedStatus: 200,
      },
    ],
    successCriteria: {
      maxResponseTime: 3000,
      p95ResponseTime: 800,
      p99ResponseTime: 1500,
      errorRate: 0.5,
      throughput: 5,
    },
  },

  {
    name: 'spike-test',
    description: 'Sudden traffic spike - unexpected surge in users',
    duration: 600,
    rampUp: 10,
    virtualUsers: 500,
    thinkTime: 200,
    endpoints: [
      {
        name: 'Get Departments',
        method: 'GET',
        path: '/api/departments',
        weight: 25,
        expectedStatus: 200,
      },
      {
        name: 'Get Services',
        method: 'GET',
        path: '/api/services',
        weight: 25,
        expectedStatus: 200,
      },
      {
        name: 'Create Ticket',
        method: 'POST',
        path: '/api/tickets',
        weight: 30,
        expectedStatus: 201,
        body: {
          title: 'Urgent Ticket',
          description: 'Urgent support needed',
          priority: 'high',
          departmentId: '1',
        },
      },
      {
        name: 'Get Messages',
        method: 'GET',
        path: '/api/messages',
        weight: 20,
        expectedStatus: 200,
      },
    ],
    successCriteria: {
      maxResponseTime: 5000,
      p95ResponseTime: 2000,
      p99ResponseTime: 3500,
      errorRate: 2,
      throughput: 20,
    },
  },

  {
    name: 'stress-test',
    description: 'Stress test - push to breaking point to find limits',
    duration: 900,
    rampUp: 60,
    virtualUsers: 1000,
    thinkTime: 100,
    endpoints: [
      {
        name: 'Health Check',
        method: 'GET',
        path: '/health',
        weight: 10,
        expectedStatus: 200,
      },
      {
        name: 'Get Departments',
        method: 'GET',
        path: '/api/departments',
        weight: 20,
        expectedStatus: 200,
      },
      {
        name: 'Create Ticket',
        method: 'POST',
        path: '/api/tickets',
        weight: 40,
        expectedStatus: 201,
        body: {
          title: 'Bulk Ticket',
          description: 'Bulk upload ticket',
          priority: 'medium',
          departmentId: '1',
        },
      },
      {
        name: 'Get Messages',
        method: 'GET',
        path: '/api/messages',
        weight: 30,
        expectedStatus: 200,
      },
    ],
    successCriteria: {
      maxResponseTime: 10000,
      p95ResponseTime: 3000,
      p99ResponseTime: 5000,
      errorRate: 5,
      throughput: 50,
    },
  },

  {
    name: 'endurance-test',
    description: 'Endurance test - sustained load over long period',
    duration: 1800,
    rampUp: 120,
    virtualUsers: 200,
    thinkTime: 1000,
    endpoints: [
      {
        name: 'Health Check',
        method: 'GET',
        path: '/health',
        weight: 10,
        expectedStatus: 200,
      },
      {
        name: 'Get Departments',
        method: 'GET',
        path: '/api/departments',
        weight: 15,
        expectedStatus: 200,
      },
      {
        name: 'Get Services',
        method: 'GET',
        path: '/api/services',
        weight: 15,
        expectedStatus: 200,
      },
      {
        name: 'Create Ticket',
        method: 'POST',
        path: '/api/tickets',
        weight: 25,
        expectedStatus: 201,
        body: {
          title: 'Endurance Ticket',
          description: 'Long-running test ticket',
          priority: 'low',
          departmentId: '1',
        },
      },
      {
        name: 'Get Tickets',
        method: 'GET',
        path: '/api/tickets',
        weight: 20,
        expectedStatus: 200,
      },
      {
        name: 'Get Messages',
        method: 'GET',
        path: '/api/messages',
        weight: 15,
        expectedStatus: 200,
      },
    ],
    successCriteria: {
      maxResponseTime: 4000,
      p95ResponseTime: 1000,
      p99ResponseTime: 2000,
      errorRate: 0.5,
      throughput: 5,
    },
  },
];

// Performance baselines
export const PERFORMANCE_BASELINES = {
  healthCheck: {
    maxTime: 100,
    avgTime: 50,
  },
  apiGet: {
    maxTime: 1000,
    avgTime: 300,
  },
  apiPost: {
    maxTime: 2000,
    avgTime: 800,
  },
  database: {
    maxTime: 500,
    avgTime: 100,
  },
  cache: {
    maxTime: 50,
    avgTime: 10,
  },
};

// Resource limits
export const RESOURCE_LIMITS = {
  maxMemory: 2048, // MB
  maxCPU: 80, // percentage
  maxConnections: 500,
  maxDatabaseConnections: 100,
};
