// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

interface VercelConfig {
  functions: Record<string, { maxDuration: number }>;
  rewrites: { source: string; destination: string }[];
  headers: { source: string; headers: { key: string; value: string }[] }[];
}

const root = new URL('../../', import.meta.url);
const config: VercelConfig = JSON.parse(readFileSync(new URL('vercel.json', root), 'utf8'));

describe('deployment bindings', () => {
  it('points API rewrites at an existing configured function', () => {
    const rewrite = config.rewrites.find(value => value.source === '/api/(.*)');
    expect(rewrite?.destination).toBe('/api/index.ts');
    expect(config.functions['api/index.ts'].maxDuration).toBe(30);
    expect(existsSync(fileURLToPath(new URL('api/index.ts', root)))).toBe(true);
    expect(existsSync(fileURLToPath(new URL('api/index.js', root)))).toBe(false);
  });

  it('allows the named API over HTTPS and WebSocket without trusting quick-tunnel wildcards', () => {
    const csp = config.headers
      .flatMap(rule => rule.headers)
      .find(header => header.key === 'Content-Security-Policy')?.value;
    expect(csp).toContain('https://api.whitecaves.com');
    expect(csp).toContain('wss://api.whitecaves.com');
    expect(csp).not.toContain('*.trycloudflare.com');
  });

  it('parses the verification-only workflow with least-privilege permissions', () => {
    const text = readFileSync(new URL('.github/workflows/cd.yml', root), 'utf8');
    const workflow: unknown = parse(text);
    expect(workflow).toMatchObject({
      name: 'Deployment Verification',
      on: { deployment_status: null },
      permissions: { contents: 'read' },
      jobs: { verify: { 'runs-on': 'ubuntu-latest' } },
    });
    expect(text).toContain('npm run verify:runtime');
    expect(text).toContain('npm run test:e2e:smoke');
    expect(text).not.toContain('vercel --prod');
  });

  it('requires authenticated health before exposing the local backend', () => {
    for (const script of ['scripts/start-tunnel.ps1', 'scripts/server-watchdog.ps1']) {
      const text = readFileSync(new URL(script, root), 'utf8');
      expect(text).toContain('$health.authenticationRequired -eq $true');
    }
    const supervisor = readFileSync(new URL('scripts/server-watchdog.ps1', root), 'utf8');
    expect(supervisor).toContain("$env:NODE_ENV = 'production'");
    expect(supervisor).toContain("$env:DEV_AUTH_BYPASS = 'false'");
  });
});
