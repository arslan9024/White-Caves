import { afterEach, describe, expect, it, vi } from 'vitest';
import { assistantOrchestrator } from './AssistantOrchestrator.js';

describe('AssistantOrchestrator Zoe oversight', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers Zoe once as a read-only observer of supported integration events', () => {
    const initialStatus = assistantOrchestrator.getStatus();
    const initialEventHandlers = initialStatus.handlerCount['linda:message_received'] ?? 0;
    const logSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);

    assistantOrchestrator.registerZoeHandlers();
    assistantOrchestrator.registerZoeHandlers();
    assistantOrchestrator.emitEvent('linda:message_received', {
      from: 'test',
      message: 'test event',
      timestamp: new Date().toISOString(),
    });

    const status = assistantOrchestrator.getStatus();
    expect(status.registeredAssistants).toContain('zoe');
    expect(status.handlerCount['linda:message_received']).toBe(initialEventHandlers + 1);
    expect(logSpy).toHaveBeenCalledWith(
      '[Orchestrator→Zoe] Observed "linda:message_received" for executive oversight.'
    );
  });
});
