import request from 'supertest';
import express from 'express';
import app from '../../api/index';

describe('Aurora Monitoring Endpoints', () => {
  describe('GET /api/aurora/monitoring/health', () => {
    test('should return system health overview', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('overallStatus');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('activeAlerts');
      expect(res.body).toHaveProperty('services');
    });

    test('should have valid health status values', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/health')
        .expect(200);

      expect(['healthy', 'degraded']).toContain(res.body.overallStatus);
      expect(res.body.uptime).toMatch(/\d+\.\d+%/);
    });

    test('should return service health counts', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/health')
        .expect(200);

      expect(res.body.services).toHaveProperty('healthy');
      expect(res.body.services).toHaveProperty('total');
      expect(res.body.services.healthy).toBeLessThanOrEqual(res.body.services.total);
    });
  });

  describe('GET /api/aurora/monitoring/vercel', () => {
    test('should return Vercel deployment metrics', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/vercel')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('deployment');
      expect(res.body.deployment).toHaveProperty('status');
      expect(res.body.deployment).toHaveProperty('buildTime');
      expect(res.body.deployment).toHaveProperty('bundleSize');
      expect(res.body.deployment).toHaveProperty('deploymentSuccess');
    });

    test('should have valid deployment status', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/vercel')
        .expect(200);

      expect(res.body.deployment.status).toBe('live');
      expect(res.body.deployment.buildTime).toBeGreaterThan(0);
      expect(res.body.deployment.bundleSize).toBeGreaterThan(0);
      expect(res.body.deployment.deploymentSuccess).toBeGreaterThanOrEqual(0);
      expect(res.body.deployment.deploymentSuccess).toBeLessThanOrEqual(100);
    });

    test('should include performance metrics', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/vercel')
        .expect(200);

      expect(res.body.deployment).toHaveProperty('performance');
      expect(res.body.deployment.performance).toHaveProperty('fcp');
      expect(res.body.deployment.performance).toHaveProperty('lcp');
      expect(res.body.deployment.performance).toHaveProperty('cls');
    });
  });

  describe('GET /api/aurora/monitoring/mongodb', () => {
    test('should return MongoDB Atlas metrics', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/mongodb')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('database');
      expect(res.body.database).toHaveProperty('status');
      expect(res.body.database).toHaveProperty('queryLatency');
      expect(res.body.database).toHaveProperty('connectionPool');
    });

    test('should have valid database connection status', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/mongodb')
        .expect(200);

      expect(res.body.database.status).toBe('connected');
      expect(res.body.database.queryLatency).toHaveProperty('avg');
      expect(res.body.database.queryLatency).toHaveProperty('p95');
      expect(res.body.database.queryLatency).toHaveProperty('p99');
    });

    test('should include collection statistics', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/mongodb')
        .expect(200);

      expect(res.body.database).toHaveProperty('collections');
      expect(res.body.database.collections).toHaveProperty('User');
      expect(res.body.database.collections).toHaveProperty('Property');
      expect(res.body.database.collections).toHaveProperty('Lead');
      expect(res.body.database.collections).toHaveProperty('Viewing');
      expect(res.body.database.collections).toHaveProperty('Negotiation');
      expect(res.body.database.collections).toHaveProperty('Document');
    });

    test('should track replication lag', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/mongodb')
        .expect(200);

      expect(res.body.database).toHaveProperty('replicationLag');
      expect(res.body.database.replicationLag).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /api/aurora/monitoring/services', () => {
    test('should return services health status', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/services')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('services');
      expect(res.body).toHaveProperty('summary');
    });

    test('should include all 11 services', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/services')
        .expect(200);

      expect(Object.keys(res.body.services).length).toBeGreaterThanOrEqual(11);
    });

    test('should have summary statistics', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/services')
        .expect(200);

      expect(res.body.summary).toHaveProperty('healthyCount');
      expect(res.body.summary).toHaveProperty('totalServices');
      expect(res.body.summary).toHaveProperty('avgLatency');
      expect(res.body.summary.healthyCount).toBeGreaterThan(0);
    });

    test('services should have status and latency', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/services')
        .expect(200);

      for (const [name, service] of Object.entries(res.body.services)) {
        expect(service).toHaveProperty('status');
        expect(service).toHaveProperty('latency');
        expect(['healthy', 'degraded']).toContain(service.status);
        expect(service.latency).toBeGreaterThan(0);
      }
    });
  });

  describe('GET /api/aurora/monitoring/apis', () => {
    test('should return API endpoint performance', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/apis')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('endpoints');
      expect(res.body).toHaveProperty('summary');
    });

    test('should include 10 monitored endpoints', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/apis')
        .expect(200);

      expect(Object.keys(res.body.endpoints).length).toBeGreaterThanOrEqual(10);
    });

    test('endpoints should have performance metrics', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/apis')
        .expect(200);

      for (const [endpoint, metrics] of Object.entries(res.body.endpoints)) {
        expect(metrics).toHaveProperty('p50');
        expect(metrics).toHaveProperty('p95');
        expect(metrics).toHaveProperty('p99');
        expect(metrics).toHaveProperty('errorRate');
      }
    });

    test('should report APIs exceeding latency threshold', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/apis')
        .expect(200);

      expect(res.body).toHaveProperty('alertsTriggered');
      expect(Array.isArray(res.body.alertsTriggered)).toBe(true);
    });

    test('should have summary statistics', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/apis')
        .expect(200);

      expect(res.body.summary).toHaveProperty('totalEndpoints');
      expect(res.body.summary).toHaveProperty('avgP95');
      expect(res.body.summary).toHaveProperty('avgErrorRate');
    });
  });

  describe('GET /api/aurora/monitoring/metrics', () => {
    test('should return historical metrics', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/metrics')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('metrics');
      expect(res.body).toHaveProperty('trend');
      expect(res.body).toHaveProperty('collectedAt');
    });

    test('should include multiple metric types', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/metrics')
        .expect(200);

      expect(res.body.metrics).toHaveProperty('apiLatency');
      expect(res.body.metrics).toHaveProperty('dbLatency');
      expect(res.body.metrics).toHaveProperty('errorRate');
      expect(res.body.metrics).toHaveProperty('concurrentUsers');
    });

    test('metrics should be arrays with data points', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/metrics')
        .expect(200);

      expect(Array.isArray(res.body.metrics.apiLatency)).toBe(true);
      expect(Array.isArray(res.body.metrics.dbLatency)).toBe(true);
      expect(res.body.metrics.apiLatency.length).toBeGreaterThan(0);
    });

    test('should identify trend direction', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/metrics')
        .expect(200);

      expect(['improving', 'degrading', 'stable']).toContain(res.body.trend);
    });
  });

  describe('GET /api/aurora/monitoring/alerts', () => {
    test('should return alerts', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/alerts')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('activeAlerts');
      expect(res.body).toHaveProperty('alertHistory');
      expect(res.body).toHaveProperty('summary');
    });

    test('should track active vs resolved alerts', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/alerts')
        .expect(200);

      expect(res.body.summary).toHaveProperty('total');
      expect(res.body.summary).toHaveProperty('active');
      expect(res.body.summary).toHaveProperty('resolved');
      expect(res.body.summary).toHaveProperty('critical');
    });

    test('active alerts should be arrays', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/alerts')
        .expect(200);

      expect(Array.isArray(res.body.activeAlerts)).toBe(true);
      expect(Array.isArray(res.body.alertHistory)).toBe(true);
    });
  });

  describe('POST /api/aurora/monitoring/alert-config', () => {
    test('should accept alert threshold configuration', async () => {
      const config = {
        apiLatency: 500,
        dbLatency: 100,
        errorRate: 0.5,
        uptime: 99.9,
        concurrentUsers: 80
      };

      const res = await request(app)
        .post('/api/aurora/monitoring/alert-config')
        .send(config)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('thresholds');
    });

    test('should update thresholds', async () => {
      const config = {
        apiLatency: 400,
        errorRate: 0.3
      };

      const res = await request(app)
        .post('/api/aurora/monitoring/alert-config')
        .send(config)
        .expect(200);

      expect(res.body.thresholds.apiLatency).toBe(400);
      expect(res.body.thresholds.errorRate).toBe(0.3);
    });

    test('should preserve existing thresholds', async () => {
      const config = {
        apiLatency: 600
      };

      const res = await request(app)
        .post('/api/aurora/monitoring/alert-config')
        .send(config)
        .expect(200);

      expect(res.body.thresholds).toHaveProperty('apiLatency', 600);
      expect(res.body.thresholds).toHaveProperty('dbLatency');
    });
  });

  describe('GET /api/wednesday/plan', () => {
    test('should return Wednesday plan status', async () => {
      const res = await request(app)
        .get('/api/wednesday/plan')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('plan');
      expect(res.body.plan).toHaveProperty('date');
      expect(res.body.plan).toHaveProperty('status');
      expect(res.body.plan).toHaveProperty('duration');
    });

    test('should include plan phases', async () => {
      const res = await request(app)
        .get('/api/wednesday/plan')
        .expect(200);

      expect(res.body.plan).toHaveProperty('phases');
      expect(res.body.plan.phases).toHaveProperty('biometricTesting');
      expect(res.body.plan.phases).toHaveProperty('userJourney1_2');
      expect(res.body.plan.phases).toHaveProperty('lunch');
      expect(res.body.plan.phases).toHaveProperty('userJourney3_4');
    });

    test('should include team information', async () => {
      const res = await request(app)
        .get('/api/wednesday/plan')
        .expect(200);

      expect(res.body.plan).toHaveProperty('teams');
      expect(res.body.plan.teams).toHaveProperty('zoe');
      expect(res.body.plan.teams).toHaveProperty('aurora');
      expect(res.body.plan.teams).toHaveProperty('hazel');
      expect(res.body.plan.teams).toHaveProperty('willow');
    });

    test('should include success metrics', async () => {
      const res = await request(app)
        .get('/api/wednesday/plan')
        .expect(200);

      expect(res.body.plan).toHaveProperty('metrics');
      expect(res.body.plan.metrics).toHaveProperty('biometricSuccessTarget');
      expect(res.body.plan.metrics).toHaveProperty('apiLatencyTarget');
      expect(res.body.plan.metrics).toHaveProperty('dbLatencyTarget');
      expect(res.body.plan.metrics).toHaveProperty('errorRateTarget');
      expect(res.body.plan.metrics).toHaveProperty('uptimeTarget');
    });

    test('should have correct target values', async () => {
      const res = await request(app)
        .get('/api/wednesday/plan')
        .expect(200);

      expect(res.body.plan.metrics.biometricSuccessTarget).toBe(95);
      expect(res.body.plan.metrics.apiLatencyTarget).toBe(500);
      expect(res.body.plan.metrics.dbLatencyTarget).toBe(100);
      expect(res.body.plan.metrics.errorRateTarget).toBe(0.5);
      expect(res.body.plan.metrics.uptimeTarget).toBe(99.9);
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for undefined endpoints', async () => {
      const res = await request(app)
        .get('/api/undefined-endpoint')
        .expect(404);

      expect(res.body).toHaveProperty('error');
    });

    test('should handle malformed JSON gracefully', async () => {
      const res = await request(app)
        .post('/api/aurora/monitoring/alert-config')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Response Format', () => {
    test('all responses should be valid JSON', async () => {
      const endpoints = [
        '/api/aurora/monitoring/health',
        '/api/aurora/monitoring/vercel',
        '/api/aurora/monitoring/mongodb',
        '/api/aurora/monitoring/services',
        '/api/aurora/monitoring/apis',
        '/api/wednesday/plan'
      ];

      for (const endpoint of endpoints) {
        const res = await request(app)
          .get(endpoint)
          .expect('Content-Type', /json/);

        expect(typeof res.body).toBe('object');
      }
    });

    test('responses should include timestamps where appropriate', async () => {
      const res = await request(app)
        .get('/api/aurora/monitoring/health')
        .expect(200);

      expect(res.body).toHaveProperty('timestamp');
      expect(new Date(res.body.timestamp).getTime()).toBeGreaterThan(0);
    });
  });
});
