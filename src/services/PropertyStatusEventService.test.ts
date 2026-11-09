import { describe, it, expect, vi, beforeEach } from 'vitest';
import PropertyStatusEventService from './PropertyStatusEventService';

describe('PropertyStatusEventService', () => {
  let eventService: any;

  beforeEach(() => {
    eventService = new PropertyStatusEventService();
  });

  it('subscribes to events and dispatches payloads correctly', async () => {
    const callback = vi.fn();
    eventService.subscribeTo('lease_signed', callback);

    const payload = { propertyId: 'prop_001', tenant: 'John Doe', rentAed: 120000 };
    const event = await eventService.publishEvent('lease_signed', payload, 'daisy');

    expect(event).toBeDefined();
    expect(event.type).toBe('lease_signed');
    expect(event.source).toBe('daisy');
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ payload }));
  });

  it('maintains bounded event history up to maxHistorySize', async () => {
    eventService.maxHistorySize = 5;

    for (let i = 0; i < 10; i++) {
      await eventService.publishEvent('status_change', { step: i }, 'mary');
    }

    expect(eventService.eventHistory.length).toBe(5);
    expect(eventService.eventHistory[4].payload.step).toBe(9);
  });

  it('captures subscriber errors gracefully without halting event processing', async () => {
    const failingSubscriber = vi.fn().mockRejectedValue(new Error('Database connection dropped'));
    const succeedingSubscriber = vi.fn().mockResolvedValue(true);

    eventService.subscribeTo('property_listed', failingSubscriber);
    eventService.subscribeTo('property_listed', succeedingSubscriber);

    const event = await eventService.publishEvent(
      'property_listed',
      { propertyId: 'prop_002', title: 'Villa in Dubai Hills' },
      'clara'
    );

    expect(succeedingSubscriber).toHaveBeenCalled();
    expect(event.errors.length).toBe(1);
    expect(event.errors[0].error).toBe('Database connection dropped');
  });

  it('computes event statistics aggregated by type and source', async () => {
    await eventService.publishEvent('property_created', { id: 1 }, 'mary');
    await eventService.publishEvent('property_created', { id: 2 }, 'mary');
    await eventService.publishEvent('lease_signed', { id: 3 }, 'daisy');

    const stats = eventService.getEventStatistics();
    expect(stats.totalEvents).toBe(3);
    expect(stats.eventsByType['property_created']).toBe(2);
    expect(stats.eventsByType['lease_signed']).toBe(1);
    expect(stats.eventsBySource['mary']).toBe(2);
    expect(stats.eventsBySource['daisy']).toBe(1);
  });
});
