import { describe, it, expect, vi } from 'vitest';
import { NinaEngine } from '../ninaEngine.js';

describe('W24-008 NinaEngine - Context Injection', () => {
  it('injects property details context correctly', async () => {
    const context = { type: 'property', id: 'prop-123' };
    const systemMsg = await NinaEngine.buildContext('nina-1', context);

    expect(systemMsg.role).toBe('system');
    expect(systemMsg.content).toContain('You are assisting on a Property page');
    expect(systemMsg.content).toContain('Property ID: prop-123');
  });

  it('injects lead context correctly', async () => {
    const context = { type: 'lead', name: 'John Doe', status: 'hot' };
    const systemMsg = await NinaEngine.buildContext('nina-1', context);

    expect(systemMsg.role).toBe('system');
    expect(systemMsg.content).toContain('You are assisting a Lead');
    expect(systemMsg.content).toContain('Lead Name: John Doe');
    expect(systemMsg.content).toContain('Status: hot');
  });

  it('injects tenant context correctly', async () => {
    const context = { type: 'tenant', leaseId: 'lease-999' };
    const systemMsg = await NinaEngine.buildContext('nina-1', context);

    expect(systemMsg.role).toBe('system');
    expect(systemMsg.content).toContain('You are assisting a Tenant');
    expect(systemMsg.content).toContain('Active Lease: lease-999');
  });

  it('provides default context when no entity context is provided', async () => {
    const systemMsg = await NinaEngine.buildContext('nina-1');

    expect(systemMsg.role).toBe('system');
    expect(systemMsg.content).toBe('You are Nina, a helpful AI assistant.');
  });
});
