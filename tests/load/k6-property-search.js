import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 500 }, // Ramp up to 500 virtual users over 30s
    { duration: '1m', target: 500 },  // Hold at 500 users for 1 minute
    { duration: '30s', target: 0 },   // Ramp down to 0 users over 30s
  ],
  thresholds: {
    // 99% of requests must complete below 250ms
    http_req_duration: ['p(99)<250'],
    // 0 dropped requests / 100% success rate
    http_req_failed: ['rate==0.00'],
  },
};

export default function () {
  // Simulate searching for properties
  const url = 'http://localhost:3000/api/properties/search?query=dubai';
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const res = http.get(url, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has data': (r) => r.body.length > 0,
  });

  // Wait 1 second between iterations to simulate real user thinking time
  sleep(1);
}
