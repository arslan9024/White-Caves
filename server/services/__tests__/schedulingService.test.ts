/**
 * Scheduling Service Unit Tests — Phase 3C
 * ─────────────────────────────────────────
 * Tests for: slot computation, conflict detection, ICS generation,
 * agent availability, and helper functions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock prisma
vi.mock('../../database.js', () => ({
  prisma: {
    agentAvailability: {
      findMany: vi.fn(),
      upsert: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    viewing: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('../../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import {
  getAgentAvailability,
  setAgentAvailability,
  getAvailableSlots,
  detectConflicts,
  generateICSContent,
  generateIcsToken,
} from '../schedulingService';
import { prisma } from '../../database.js';

const mockPrisma = prisma as unknown as {
  agentAvailability: {
    findMany: ReturnType<typeof vi.fn>;
    upsert: ReturnType<typeof vi.fn>;
  };
  viewing: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };
};

describe('schedulingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── generateIcsToken ──────────────────────────────────────────────

  describe('generateIcsToken', () => {
    it('should generate a 48-character hex string', () => {
      const token = generateIcsToken();
      expect(token).toHaveLength(48);
      expect(token).toMatch(/^[a-f0-9]{48}$/);
    });

    it('should generate unique tokens', () => {
      const token1 = generateIcsToken();
      const token2 = generateIcsToken();
      expect(token1).not.toBe(token2);
    });
  });

  // ─── getAgentAvailability ──────────────────────────────────────────

  describe('getAgentAvailability', () => {
    it('should return default schedule when no stored schedule exists', async () => {
      mockPrisma.agentAvailability.findMany.mockResolvedValue([]);
      const result = await getAgentAvailability('agent-123');
      expect(result).toHaveLength(7);
      // Sunday should be active (Dubai work week)
      expect(result[0]).toMatchObject({ dayOfWeek: 0, isActive: true, startTime: '09:00' });
      // Friday should be inactive
      expect(result[5]).toMatchObject({ dayOfWeek: 5, isActive: false });
    });

    it('should return stored schedule when available', async () => {
      mockPrisma.agentAvailability.findMany.mockResolvedValue([
        { dayOfWeek: 0, startTime: '08:00', endTime: '17:00', isActive: true, slotDuration: 45, breakStart: '12:00', breakEnd: '13:00' },
      ]);
      const result = await getAgentAvailability('agent-123');
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ dayOfWeek: 0, startTime: '08:00', endTime: '17:00', slotDuration: 45 });
    });
  });

  // ─── setAgentAvailability ──────────────────────────────────────────

  describe('setAgentAvailability', () => {
    it('should validate dayOfWeek range', async () => {
      await expect(
        setAgentAvailability('agent-123', { dayOfWeek: 7, startTime: '09:00', endTime: '18:00', isActive: true, slotDuration: 30 }),
      ).rejects.toThrow('dayOfWeek must be 0-6');
    });

    it('should validate startTime before endTime', async () => {
      await expect(
        setAgentAvailability('agent-123', { dayOfWeek: 0, startTime: '18:00', endTime: '09:00', isActive: true, slotDuration: 30 }),
      ).rejects.toThrow('startTime must be before endTime');
    });

    it('should validate break within working hours', async () => {
      await expect(
        setAgentAvailability('agent-123', {
          dayOfWeek: 0, startTime: '09:00', endTime: '18:00', isActive: true, slotDuration: 30,
          breakStart: '08:00', breakEnd: '09:30',
        }),
      ).rejects.toThrow('break must be within working hours');
    });

    it('should upsert availability successfully', async () => {
      mockPrisma.agentAvailability.upsert.mockResolvedValue({
        dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true, slotDuration: 30,
        breakStart: '12:00', breakEnd: '13:00',
      });

      const result = await setAgentAvailability('agent-123', {
        dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true, slotDuration: 30,
        breakStart: '12:00', breakEnd: '13:00',
      });

      expect(result.dayOfWeek).toBe(1);
      expect(result.startTime).toBe('09:00');
      expect(mockPrisma.agentAvailability.upsert).toHaveBeenCalledOnce();
    });
  });

  // ─── getAvailableSlots ─────────────────────────────────────────────

  describe('getAvailableSlots', () => {
    it('should return empty array for inactive day', async () => {
      mockPrisma.agentAvailability.findMany.mockResolvedValue([
        { dayOfWeek: 5, startTime: '10:00', endTime: '14:00', isActive: false, slotDuration: 30, breakStart: null, breakEnd: null },
      ]);

      // Friday = dayOfWeek 5
      const friday = new Date('2026-05-01T00:00:00.000Z'); // This is a Friday
      const slots = await getAvailableSlots('agent-123', friday);
      expect(slots).toHaveLength(0);
    });

    it('should generate correct number of slots for a working day', async () => {
      // 9:00-12:00 = 6 slots of 30 min
      mockPrisma.agentAvailability.findMany.mockResolvedValue([
        { dayOfWeek: 0, startTime: '09:00', endTime: '12:00', isActive: true, slotDuration: 30, breakStart: null, breakEnd: null },
      ]);
      mockPrisma.viewing.findMany.mockResolvedValue([]);

      const sunday = new Date('2026-05-03T00:00:00.000Z'); // Sunday
      const slots = await getAvailableSlots('agent-123', sunday);
      expect(slots).toHaveLength(6); // 9:00, 9:30, 10:00, 10:30, 11:00, 11:30
    });

    it('should mark booked slots as unavailable', async () => {
      mockPrisma.agentAvailability.findMany.mockResolvedValue([
        { dayOfWeek: 0, startTime: '09:00', endTime: '11:00', isActive: true, slotDuration: 30, breakStart: null, breakEnd: null },
      ]);

      // One viewing booked at 9:00-9:30 UTC (13:00-13:30 GST) — but we need to match the actual slot times
      // With GST offset: slots are at 05:00 UTC, 05:30 UTC, 06:00 UTC, 06:30 UTC
      mockPrisma.viewing.findMany.mockResolvedValue([
        { scheduledAt: new Date('2026-05-03T05:00:00.000Z'), duration: 30 },
      ]);

      const sunday = new Date('2026-05-03T00:00:00.000Z');
      const slots = await getAvailableSlots('agent-123', sunday);
      const bookedSlots = slots.filter((s) => s.reason === 'booked');
      expect(bookedSlots.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── detectConflicts ───────────────────────────────────────────────

  describe('detectConflicts', () => {
    it('should detect no conflict when calendar is empty', async () => {
      mockPrisma.viewing.findMany.mockResolvedValue([]);

      const result = await detectConflicts(
        'agent-123',
        'user-456',
        new Date('2026-05-03T10:00:00.000Z'),
        30,
      );

      expect(result.hasConflict).toBe(false);
      expect(result.conflictingViewings).toHaveLength(0);
    });

    it('should detect conflict when times overlap', async () => {
      mockPrisma.viewing.findMany.mockResolvedValue([
        {
          id: 'existing-1',
          scheduledAt: new Date('2026-05-03T10:00:00.000Z'),
          duration: 60, // 10:00-11:00
          propertyId: 'prop-1',
          status: 'confirmed',
        },
      ]);

      const result = await detectConflicts(
        'agent-123',
        'user-456',
        new Date('2026-05-03T10:30:00.000Z'), // 10:30 overlaps with 10:00-11:00
        30,
      );

      expect(result.hasConflict).toBe(true);
      expect(result.conflictingViewings).toHaveLength(1);
      expect(result.message).toContain('Conflict detected');
    });

    it('should not detect conflict for non-overlapping times', async () => {
      mockPrisma.viewing.findMany.mockResolvedValue([
        {
          id: 'existing-1',
          scheduledAt: new Date('2026-05-03T10:00:00.000Z'),
          duration: 30, // 10:00-10:30
          propertyId: 'prop-1',
          status: 'confirmed',
        },
      ]);

      const result = await detectConflicts(
        'agent-123',
        'user-456',
        new Date('2026-05-03T11:00:00.000Z'), // 11:00 - well after 10:30
        30,
      );

      expect(result.hasConflict).toBe(false);
    });

    it('should exclude a specific viewing ID from conflict check', async () => {
      mockPrisma.viewing.findMany.mockResolvedValue([]); // Nothing returned because excluded

      const result = await detectConflicts(
        'agent-123',
        'user-456',
        new Date('2026-05-03T10:00:00.000Z'),
        30,
        'viewing-to-exclude',
      );

      expect(result.hasConflict).toBe(false);
      // Verify the NOT clause was passed
      expect(mockPrisma.viewing.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            NOT: { id: 'viewing-to-exclude' },
          }),
        }),
      );
    });
  });

  // ─── generateICSContent ────────────────────────────────────────────

  describe('generateICSContent', () => {
    const sampleEvent = {
      title: 'Property Viewing: Luxury Villa',
      description: 'Viewing a luxury villa in Dubai Marina',
      location: 'Dubai Marina, Tower 5, Unit 3204',
      startTime: new Date('2026-05-03T10:00:00.000Z'),
      endTime: new Date('2026-05-03T10:30:00.000Z'),
      uid: 'viewing-abc123@whitecaves.ae',
      organizer: { name: 'John Agent', email: 'john@whitecaves.ae' },
      attendees: [
        { name: 'Jane Client', email: 'jane@example.com' },
      ],
    };

    it('should generate valid iCalendar format', () => {
      const ics = generateICSContent(sampleEvent);
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('END:VCALENDAR');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('END:VEVENT');
      expect(ics).toContain('VERSION:2.0');
    });

    it('should include event details', () => {
      const ics = generateICSContent(sampleEvent);
      expect(ics).toContain('SUMMARY:Property Viewing: Luxury Villa');
      expect(ics).toContain('UID:viewing-abc123@whitecaves.ae');
      expect(ics).toContain('LOCATION:Dubai Marina');
    });

    it('should include organizer and attendees', () => {
      const ics = generateICSContent(sampleEvent);
      expect(ics).toContain('ORGANIZER;CN=John Agent:mailto:john@whitecaves.ae');
      expect(ics).toContain('ATTENDEE;ROLE=REQ-PARTICIPANT;CN=Jane Client:mailto:jane@example.com');
    });

    it('should include reminder alarms', () => {
      const ics = generateICSContent(sampleEvent);
      expect(ics).toContain('BEGIN:VALARM');
      expect(ics).toContain('TRIGGER:-PT1H');
      expect(ics).toContain('TRIGGER:-PT15M');
    });

    it('should include White Caves product identifier', () => {
      const ics = generateICSContent(sampleEvent);
      expect(ics).toContain('PRODID:-//White Caves//Viewing Scheduler//EN');
    });

    it('should use CRLF line endings per RFC 5545', () => {
      const ics = generateICSContent(sampleEvent);
      expect(ics).toContain('\r\n');
    });

    it('should escape special characters in text fields', () => {
      const eventWithSpecialChars = {
        ...sampleEvent,
        title: 'Viewing; with, special chars',
        description: 'Description with\nnewlines',
      };
      const ics = generateICSContent(eventWithSpecialChars);
      expect(ics).toContain('Viewing\\; with\\, special chars');
      expect(ics).toContain('Description with\\nnewlines');
    });
  });
});
