import { describe, it, expect } from 'vitest';
import robots from './robots';

describe('Search Engine Robots Generator', () => {
  it('returns valid MetadataRoute.Robots rules disallowing /crm/ and /api/', () => {
    const result = robots();

    expect(result.rules).toBeDefined();
    expect(result.sitemap).toBe('https://whitecaves.ae/sitemap.xml');

    const rulesArr = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(rulesArr[0].disallow).toContain('/crm/');
    expect(rulesArr[0].disallow).toContain('/api/');
  });
});
