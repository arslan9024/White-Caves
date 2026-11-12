// @vitest-environment node
import { createServer } from 'node:http';
import { afterEach, describe, expect, it } from 'vitest';
import { listenWithPortFallback, parsePort } from './listener.js';

const ownedServers: ReturnType<typeof createServer>[] = [];
afterEach(async () => {
  await Promise.all(
    ownedServers
      .splice(0)
      .filter(server => server.listening)
      .map(
        server =>
          new Promise<void>((resolve, reject) => {
            server.close(error => (error ? reject(error) : resolve()));
          })
      )
  );
});

describe('backend listener policy', () => {
  it.each(['invalid', '0', '-1', '65536', '5001.5', 'Infinity'])(
    'rejects invalid explicit port %s rather than selecting another service',
    value => expect(() => parsePort(value)).toThrow(RangeError)
  );
  it('accepts valid explicit ports', () => {
    expect(parsePort('5001')).toBe(5001);
    expect(parsePort(65535)).toBe(65535);
  });
  it('rejects an occupied explicit port without stopping its owner', async () => {
    const existing = createServer();
    const candidate = createServer();
    ownedServers.push(existing, candidate);
    await new Promise<void>(resolve => existing.listen(0, resolve));
    const address = existing.address();
    if (!address || typeof address === 'string') throw new Error('Expected TCP address');
    await expect(
      listenWithPortFallback(candidate, address.port, { enableFallback: false })
    ).rejects.toMatchObject({ code: 'EADDRINUSE' });
    expect(existing.listening).toBe(true);
    expect(candidate.listening).toBe(false);
  });
});
