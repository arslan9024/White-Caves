import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/health', () => {
  it('returns healthy or degraded status with valid response schema', async () => {
    const res = await GET();
    const json = await res.json();

    expect([200, 206]).toContain(res.status);
    expect(json.status).toMatch(/healthy|degraded/);
    expect(json.version).toBe(process.env.npm_package_version ?? '1.0.0');
    expect(json.environment).toBeDefined();
    expect(json.timestamp).toBeDefined();
  });
});
