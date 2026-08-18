/**
 * WhatsApp Engine API Integration Tests
 * ──────────────────────────────────────
 * Tests WhatsApp client status, QR rendering, phone pairing codes, and message sending.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockEngine } = vi.hoisted(() => ({
  mockEngine: {
    getStats: vi.fn().mockReturnValue({
      agentId: 'nina-md-primary',
      status: 'connected',
      messagesSent: 120,
      messagesReceived: 45,
      uptimeSeconds: 86400,
    }),
    getQRCode: vi.fn().mockReturnValue('mock-qr-code-raw-string'),
    isConnected: vi.fn().mockReturnValue(true),
    getStatus: vi.fn().mockReturnValue('connected'),
    requestPairingCode: vi.fn().mockResolvedValue('ABC1-DEF2'),
    sendMessage: vi.fn().mockResolvedValue({ id: 'msg-wa-001', success: true }),
  },
}));

vi.mock('../services/whatsapp/WhatsAppEngine.js', () => ({
  getWhatsAppEngine: vi.fn().mockReturnValue(mockEngine),
  WhatsAppEngineStatus: {
    INITIALIZING: 'initializing',
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
  },
}));

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mockwaqrcode'),
  },
}));

vi.mock('../services/NinaService.js', () => ({
  NinaService: {
    processIncomingMessage: vi.fn().mockResolvedValue({
      reply: 'Hello, welcome to White Caves Real Estate!',
      leadCaptured: true,
    }),
  },
}));

import whatsappRouter from './whatsapp.ts';

describe('WhatsApp Engine API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/whatsapp-engine', whatsappRouter);
  });

  describe('GET /api/whatsapp-engine/:agentId/status', () => {
    it('returns engine status and statistics', async () => {
      const res = await request(app).get('/api/whatsapp-engine/nina-md-primary/status');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('connected');
      expect(res.body.data.qrAvailable).toBe(true);
    });
  });

  describe('GET /api/whatsapp-engine/:agentId/qr', () => {
    it('returns QR code data URL for pairing', async () => {
      const res = await request(app).get('/api/whatsapp-engine/nina-md-primary/qr');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.qrCode).toContain('data:image/png;base64');
    });
  });

  describe('POST /api/whatsapp-engine/:agentId/pair-code', () => {
    it('generates an 8-character pairing code for a UAE phone number', async () => {
      const res = await request(app)
        .post('/api/whatsapp-engine/nina-md-primary/pair-code')
        .send({ phoneNumber: '+971501234567' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.pairingCode).toBe('ABC1-DEF2');
    });

    it('rejects pairing request when phone number is missing with 400', async () => {
      const res = await request(app)
        .post('/api/whatsapp-engine/nina-md-primary/pair-code')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/whatsapp-engine/:agentId/send', () => {
    it('sends an outbound message to a recipient', async () => {
      const res = await request(app)
        .post('/api/whatsapp-engine/nina-md-primary/send')
        .send({ to: '+971501234567', message: 'Your viewing is confirmed for 3:00 PM.' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('rejects sending when message or recipient is missing with 400', async () => {
      const res = await request(app)
        .post('/api/whatsapp-engine/nina-md-primary/send')
        .send({ to: '+971501234567' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
