import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    lead: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('../../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { processNinaMessage, autoCreateLeadFromConversation } from './ninaBot.js';

describe('Nina WhatsApp Bot Core Service — Wave 37 (W37-001, W37-007)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.lead.findFirst.mockResolvedValue(null);
    mockPrisma.lead.create.mockResolvedValue({ id: 'lead-101', phone: '+971501112233', name: 'Lead' });
    mockPrisma.lead.update.mockResolvedValue({ id: 'lead-101', phone: '+971501112233', score: 40 });
  });

  describe('processNinaMessage', () => {
    it('processes property inquiry message and returns bot reply', async () => {
      mockPrisma.lead.findFirst.mockResolvedValueOnce(null);
      mockPrisma.lead.create.mockResolvedValueOnce({ id: 'lead-101', phone: '+971501112233' });

      const res = await processNinaMessage({
        senderPhone: '+971501112233',
        senderName: 'Sultan Al Qasimi',
        messageText: 'I am looking for a 3 bedroom villa in Palm Jumeirah with AED 5000000 budget',
      });

      expect(res.intent).toBeDefined();
      expect(res.replyText).toBeDefined();
      expect(res.shouldEscalate).toBe(false);
    });

    it('detects explicit escalation keywords (agent, human, complaint)', async () => {
      mockPrisma.lead.findFirst.mockResolvedValueOnce(null);
      const res = await processNinaMessage({
        senderPhone: '+971501112233',
        messageText: 'I want to speak with a human agent manager right now',
      });

      expect(res.shouldEscalate).toBe(true);
      expect(res.escalationReason).toBe('customer_requested_human');
    });

    it('handles Arabic inquiry text cleanly', async () => {
      mockPrisma.lead.findFirst.mockResolvedValueOnce(null);
      const res = await processNinaMessage({
        senderPhone: '+971501112233',
        messageText: 'مرحبا، أريد الاستفسار عن فيلا للبيع في دبي',
      });

      expect(res.replyText).toContain('وايتكيفز');
    });
  });

  describe('autoCreateLeadFromConversation', () => {
    it('creates a new lead when none exists for phone number', async () => {
      mockPrisma.lead.findFirst.mockResolvedValueOnce(null);
      mockPrisma.lead.create.mockResolvedValueOnce({
        id: 'lead-101',
        phone: '+971501234567',
        name: 'Fatima',
        score: 35,
      });

      const leadId = await autoCreateLeadFromConversation({
        phone: '+971501234567',
        name: 'Fatima',
        source: 'WhatsApp Nina Bot',
        score: 35,
      });

      expect(leadId).toBe('lead-101');
      expect(mockPrisma.lead.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Fatima',
          phone: '+971501234567',
          score: 35,
        }),
      });
    });

    it('updates existing lead score if higher', async () => {
      mockPrisma.lead.findFirst.mockResolvedValueOnce({
        id: 'lead-101',
        score: 10,
        notes: 'Initial inquiry',
      });
      mockPrisma.lead.update.mockResolvedValueOnce({
        id: 'lead-101',
        score: 40,
      });

      const leadId = await autoCreateLeadFromConversation({
        phone: '+971501234567',
        name: 'Fatima',
        source: 'WhatsApp Nina Bot',
        score: 40,
      });

      expect(leadId).toBe('lead-101');
      expect(mockPrisma.lead.update).toHaveBeenCalledWith({
        where: { id: 'lead-101' },
        data: expect.objectContaining({
          score: 40,
        }),
      });
    });
  });
});
