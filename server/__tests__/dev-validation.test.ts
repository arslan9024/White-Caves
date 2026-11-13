// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createServer as createViteServer, loadConfigFromFile } from 'vite';

const root = process.cwd();
const audit = resolve(root, '.agents/orchestrator/check-five-way-and-file-limits.js');
const launcher = resolve(root, '.agents/scripts/start-dev-server-safe.ps1');
const fixtures: string[] = [];

afterEach(() => {
  vi.unstubAllEnvs();
  for (const directory of fixtures.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('honest file-limit CLI', () => {
  it.each([false, true])('accepts 350 lines and rejects 351 (terminal newline: %s)', trailing => {
    const directory = mkdtempSync(join(tmpdir(), 'white-caves-limits-'));
    fixtures.push(directory);
    mkdirSync(join(directory, 'src'));
    const file = join(directory, 'src', 'boundary.ts');
    const check = () => spawnSync(process.execPath, [audit], { cwd: directory, encoding: 'utf8' });
    writeFileSync(file, Array(350).fill('// fixture').join('\n') + (trailing ? '\n' : ''));
    expect(check().status).toBe(0);
    writeFileSync(file, Array(351).fill('// fixture').join('\n') + (trailing ? '\n' : ''));
    const failed = check();
    expect(failed.status).toBe(1);
    expect(failed.stdout).toContain('351 lines');
    expect(failed.stdout).toContain('not semantic compliance');
  });

  it('does not execute the audit on import', () => {
    const imported = spawnSync(
      process.execPath,
      ['--input-type=module', '-e', `await import(${JSON.stringify(pathToFileURL(audit).href)})`],
      {
        cwd: root,
        encoding: 'utf8',
      }
    );
    expect(imported.status).toBe(0);
    expect(imported.stdout).toBe('');
  });
});

async function devConfig() {
  const result = await loadConfigFromFile(
    { command: 'serve', mode: 'development' },
    resolve(root, 'vite.config.js')
  );
  if (!result) throw new Error('Expected Vite configuration to load');
  return result.config;
}

describe('shared API port', () => {
  it.each([
    ['', '5001'],
    ['51437', '51437'],
  ])('uses API_PORT=%s for both proxy targets', async (value, expected) => {
    vi.stubEnv('API_PORT', value);
    const config = await devConfig();
    expect(config.server?.proxy?.['/api']).toMatchObject({
      target: `http://127.0.0.1:${expected}`,
    });
    expect(config.server?.proxy?.['/socket.io']).toMatchObject({
      target: `http://127.0.0.1:${expected}`,
      ws: true,
    });
  });

  it.each(['0', '65536', '12oops', '1.5'])('rejects invalid Vite port %s', async value => {
    vi.stubEnv('API_PORT', value);
    await expect(devConfig()).rejects.toThrow('API_PORT must be an integer');
  });

  it('actually proxies an HTTP request to the selected backend', async () => {
    const backend = createServer((request, response) => response.end(`fixture:${request.url}`));
    backend.listen(0, '127.0.0.1');
    await once(backend, 'listening');
    try {
      const address = backend.address();
      if (!address || typeof address === 'string') throw new Error('Expected TCP address');
      vi.stubEnv('API_PORT', String(address.port));
      const config = await devConfig();
      const directory = mkdtempSync(join(tmpdir(), 'white-caves-proxy-'));
      fixtures.push(directory);
      const vite = await createViteServer({
        configFile: false,
        root: directory,
        server: { host: '127.0.0.1', port: 0, proxy: config.server?.proxy },
      });
      try {
        await vite.listen();
        const url = vite.resolvedUrls?.local[0];
        if (!url) throw new Error('Expected listening Vite URL');
        const response = await fetch(`${url}api/__port_probe`);
        expect(response.status).toBe(200);
        expect(await response.text()).toBe('fixture:/api/__port_probe');
      } finally {
        await vite.close();
      }
    } finally {
      await new Promise<void>((resolveClose, reject) =>
        backend.close(error => (error ? reject(error) : resolveClose()))
      );
    }
  });
});

describe.skipIf(process.platform !== 'win32')('safe PowerShell launcher', () => {
  function launch(port: string) {
    return spawnSync(
      'powershell.exe',
      [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-Command',
        `
      function npx { Write-Host "START_PORT=$env:API_PORT"; $global:LASTEXITCODE = 0 }
      & '${launcher.replaceAll("'", "''")}'
    `,
      ],
      { env: { ...process.env, API_PORT: port }, encoding: 'utf8', timeout: 15000 }
    );
  }

  it.each([
    ['', '5001'],
    ['51437', '51437'],
  ])('checks and starts the same port for API_PORT=%s', (value, expected) => {
    const result = launch(value);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain(`START_PORT=${expected}`);
  });

  it.each(['0', '65536', '12oops', '1.5'])(
    'rejects invalid backend port %s before probing or starting',
    value => {
      const result = launch(value);
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('API_PORT must be an integer');
      expect(result.stdout).not.toContain('START_PORT');
    }
  );

  it('leaves a real occupied-port owner responsive', async () => {
    const owner = createServer((_request, response) => response.end('still running'));
    owner.listen(0, '127.0.0.1');
    await once(owner, 'listening');
    try {
      const address = owner.address();
      if (!address || typeof address === 'string') throw new Error('Expected TCP address');
      const result = launch(String(address.port));
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('No processes were stopped');
      expect(result.stdout).not.toContain('START_PORT');
      expect(await (await fetch(`http://127.0.0.1:${address.port}`)).text()).toBe('still running');
    } finally {
      await new Promise<void>((resolveClose, reject) =>
        owner.close(error => (error ? reject(error) : resolveClose()))
      );
    }
  });
});
