/**
 * Agent Contact API Integration Tests
 * ────────────────────────────────────
 * Tests client contact requests to agents, viewing scheduling links, and response dispatches.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockContactRequest } = vi.hoisted(() => {
  const contactReq: any = {
    _id: 'contact-req-001',
    agentId: 'agent-101',
    propertyId: 'prop-001',
    userId: 'user-001',
    contactMethod: 'whatsapp',
    message: 'I would like to arrange a private viewing this Saturday afternoon.',
    preferredDate: '2026-08-25',
    preferredTime: '15:00',
    status: 'pending',
  };
  contactReq.save = vi.fn().mockResolvedValue(contactReq);

  return { mockContactRequest: contactReq };
});

const createPopulateChain = (result: any) => ({
  populate: vi.fn().mockImplementation(() => createPopulateChain(result)),
  sort: vi.fn().mockImplementation(() => createPopulateChain(result)),
  limit: vi.fn().mockImplementation(() => createPopulateChain(result)),
  skip: vi.fn().mockImplementation(() => createPopulateChain(result)),
  then: (resolve: any) => resolve(result),
  exec: vi.fn().mockResolvedValue(result),
});

vi.mock('../models/AgentContact.js', () => {
  const MockModel: any = function (data: any) {
    return {
      ...mockContactRequest,
      ...data,
      save: vi.fn().mockResolvedValue({ _id: 'contact-req-002', ...data }),
    };
  };

  MockModel.find = vi.fn().mockImplementation(() => createPopulateChain([mockContactRequest]));
  MockModel.findById = vi.fn().mockImplementation((id: string) => {
    if (id === 'contact-req-001') {
      return createPopulateChain(mockContactRequest);
    }
    return createPopulateChain(null);
  });
  MockModel.findByIdAndUpdate = vi.fn().mockImplementation((id: string, update: any) => {
    if (id === 'contact-req-001') {
      return Promise.resolve({ ...mockContactRequest, ...update });
    }
    return Promise.resolve(null);
  });
  MockModel.findByIdAndDelete = vi.fn().mockImplementation((id: string) => {
    if (id === 'contact-req-001') {
      return Promise.resolve(mockContactRequest);
    }
    return Promise.resolve(null);
  });
  MockModel.countDocuments = vi.fn().mockResolvedValue(1);

  return { default: MockModel };
});

vi.mock('../models/Viewing.js', () => {
  const MockModel: any = function (data: any) {
    return {
      _id: 'viewing-001',
      ...data,
      save: vi.fn().mockResolvedValue({ _id: 'viewing-001', ...data }),
    };
  };
  MockModel.findByIdAndUpdate = vi.fn().mockResolvedValue({ _id: 'viewing-001', status: 'confirmed' });

  return { default: MockModel };
});

vi.mock('../models/WhatsAppLead.js', () => ({
  default: {
    findOne: vi.fn().mockResolvedValue({ _id: 'wa-lead-001', status: 'contacted', save: vi.fn().mockResolvedValue(true) }),
  },
}));

vi.mock('../services/eventService.js', () => ({
  default: {
    emit: vi.fn(),
  },
}));

vi.mock('../models/Property.js', () => ({
  default: {
    findById: vi.fn().mockResolvedValue({ _id: 'prop-001', title: 'DAMAC Hills 2 Villa' }),
  },
}));

vi.mock('../services/WhatsAppBotService.js', () => ({
  default: {
    sendMessage: vi.fn().mockResolvedValue({ success: true }),
  },
}));

import agentContactRouter from './agent-contact.js';

describe('Agent Contact API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/agent-contact', agentContactRouter);
  });

  describe('POST /api/agent-contact', () => {
    it('creates agent contact request and schedules viewing when date/time provided', async () => {
      const payload = {
        agentId: 'agent-101',
        propertyId: 'prop-001',
        contactMethod: 'whatsapp',
        message: 'Interested in floor plans',
        preferredDate: '2026-08-25',
        preferredTime: '15:00',
        userId: 'user-001',
      };

      const res = await request(app)
        .post('/api/agent-contact')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.contactRequest).toBeDefined();
    });

    it('rejects contact request when agentId or propertyId is missing with 400', async () => {
      const res = await request(app)
        .post('/api/agent-contact')
        .send({ message: 'Missing IDs' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Agent ID and Property ID are required');
    });
  });

  describe('GET /api/agent-contact', () => {
    it('lists contact requests with filters and pagination', async () => {
      const res = await request(app).get('/api/agent-contact?agentId=agent-101&status=pending');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.requests)).toBe(true);
      expect(res.body.total).toBe(1);
    });
  });

  describe('GET /api/agent-contact/:id', () => {
    it('returns contact request detail for valid ID', async () => {
      const res = await request(app).get('/api/agent-contact/contact-req-001');

      expect(res.status).toBe(200);
      expect(res.body._id).toBe('contact-req-001');
    });

    it('returns 404 when request is not found', async () => {
      const res = await request(app).get('/api/agent-contact/non-existent-id');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Contact request not found');
    });
  });

  describe('PUT /api/agent-contact/:id', () => {
    it('updates request status and confirms viewing', async () => {
      const payload = {
        status: 'confirmed',
        viewingConfirmedDate: '2026-08-25',
        viewingConfirmedTime: '15:00',
      };

      const res = await request(app)
        .put('/api/agent-contact/contact-req-001')
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('confirmed');
    });
  });

  describe('DELETE /api/agent-contact/:id', () => {
    it('deletes contact request and cancels associated viewing', async () => {
      const res = await request(app).delete('/api/agent-contact/contact-req-001');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
