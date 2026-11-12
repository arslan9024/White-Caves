// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { isSupportedNodeVersion } from '../../.agents/orchestrator/check-node-version.js';

describe('supported Node runtime', () => {
  it.each(['20.19.0', '22.13.0', '22.18.9', '22.19.0-rc.1', 'invalid'])('rejects %s', version =>
    expect(isSupportedNodeVersion(version)).toBe(false)
  );
  it.each(['22.19.0', '22.20.0', '24.0.0', '24.22.1'])('accepts %s', version =>
    expect(isSupportedNodeVersion(version)).toBe(true)
  );
});
