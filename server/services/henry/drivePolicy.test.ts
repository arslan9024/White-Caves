import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Henry private Drive/vault PWA boundary', () => {
  it('matches private GET/POST network-only routes before the broad API cache/replay rules', () => {
    const config = readFileSync('vite.config.js', 'utf8');
    const privateRules = config.slice(config.indexOf('runtimeCaching:'), config.indexOf("name: 'crm-writes-queue'"));
    expect(privateRules).toContain("method: 'GET',\n                handler: 'NetworkOnly'");
    expect(privateRules).toContain("method: 'POST',\n                handler: 'NetworkOnly'");
    expect(privateRules).toContain("method: 'PATCH',\n                handler: 'NetworkOnly'");
    expect(privateRules).toContain("method: 'DELETE',\n                handler: 'NetworkOnly'");
    const pattern = /^https?:\/\/[^/]+\/api\/henry\/(?:drive|documents)(?:\/|$)/;
    for (const path of ['drive/status', 'drive/finish', 'drive/sources/id/original', 'documents/save', 'documents/id/download'])
      expect(pattern.test(`https://app.example/api/henry/${path}`)).toBe(true);
    expect(pattern.test('https://app.example/api/henry/records')).toBe(false);
    const beforeBroadPost = privateRules.slice(0, privateRules.indexOf("urlPattern: /^https?:\\/\\/[^/]+\\/api\\/.*$/"));
    expect(beforeBroadPost).not.toContain('backgroundSync');
    expect(beforeBroadPost.match(/\(\?:drive\|documents\)/g)).toHaveLength(4);
  });
});
