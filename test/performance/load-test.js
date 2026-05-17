import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp-up
    { duration: '1m30s', target: 50 }, // Stay at 50 users
    { duration: '20s', target: 0 },    // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99th percentile response time < 1.5s
    http_req_failed: ['<0.1'],         // Error rate < 10%
  },
};

const API_URL = __ENV.API_URL || 'http://localhost:5000';

export default function () {
  // Test 1: Fetch properties list
  let res = http.get(`${API_URL}/api/property-inventory/properties?page=1&limit=20`);
  check(res, {
    'properties list status 200': (r) => r.status === 200,
    'properties list response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);

  // Test 2: Create a property
  const payload = JSON.stringify({
    location: 'Dubai Marina',
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    price: 1500000,
    currency: 'AED',
    owner: 'test-owner-' + Math.random(),
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${__ENV.AUTH_TOKEN || 'test-token'}`,
    },
  };

  res = http.post(
    `${API_URL}/api/property-inventory/properties`,
    payload,
    params
  );
  check(res, {
    'create property status 201': (r) => r.status === 201,
    'create property response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  sleep(1);

  // Test 3: Validate Excel file for import
  const fileContent = 'location,propertyType,bedrooms,bathrooms,area,price';
  const formData = {
    field: 'fileField',
    file: http.file(fileContent, 'test.csv', 'text/csv'),
  };

  res = http.post(
    `${API_URL}/api/smartImport/validate-file`,
    formData,
    params
  );
  check(res, {
    'validate file status 200': (r) => r.status === 200,
    'validate file response time < 2000ms': (r) => r.timings.duration < 2000,
  });
  sleep(1);

  // Test 4: Get import history
  res = http.get(
    `${API_URL}/api/importHistory/sessions?page=1&limit=10`,
    params
  );
  check(res, {
    'import history status 200': (r) => r.status === 200,
    'import history response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);

  // Test 5: Get admin statistics
  res = http.get(
    `${API_URL}/api/admin/statistics`,
    params
  );
  check(res, {
    'admin stats status 200': (r) => r.status === 200,
    'admin stats response time < 800ms': (r) => r.timings.duration < 800,
  });
  sleep(1);
}
