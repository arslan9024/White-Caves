import { beforeEach, describe, expect, it, vi } from 'vitest';
import express, { type Express } from 'express';
import request from 'supertest';

// Hoisted mocks for import-time interception
const { mockEmailService, mockEmailTriggers, mockRbac } = vi.hoisted(() => {
  const mockEmailService = {
    sendEmailTracked: vi.fn(),
    EMAIL_TEMPLATES: {
      welcome: vi.fn(),
      propertyAlert: vi.fn(),
      viewingConfirmation: vi.fn(),
      viewingCancelled: vi.fn(),
      documentReady: vi.fn(),
      paymentReminder: vi.fn(),
      reraExpiry: vi.fn(),
      leadAssigned: vi.fn(),
      contractSigned: vi.fn(),
    },
    getEmailStats: vi.fn(),
    wrapInBrandedTemplate: vi.fn((html: string) => `<html><body>${html}</body></html>`),
  };

  const mockEmailTriggers = {
    getEmailTriggerRegistry: vi.fn(),
    sendTriggeredEmail: vi.fn(),
  };

  const mockRbac = {
    requirePermission: (permission: string) => (req: any, res: any, next: any) => {
      // No user = deny access
      if (!req.user) {
        return res.status(403).json({ success: false, error: `Permission '${permission}' denied` });
      }

      const permissions: Record<string, string[]> = {
        owner: ['manage_leads', 'view_leads', 'view_analytics'],
        manager: ['manage_leads', 'view_leads', 'view_analytics'],
        agent: ['view_leads'],
      };
      const userPerms = permissions[req.user.role] || [];
      if (!userPerms.includes(permission)) {
        return res.status(403).json({ success: false, error: `Permission '${permission}' denied` });
      }
      next();
    },
  };

  return { mockEmailService, mockEmailTriggers, mockRbac };
});

vi.mock('../services/emailService.js', () => ({
  sendEmailTracked: mockEmailService.sendEmailTracked,
  EMAIL_TEMPLATES: mockEmailService.EMAIL_TEMPLATES,
  getEmailStats: mockEmailService.getEmailStats,
  wrapInBrandedTemplate: mockEmailService.wrapInBrandedTemplate,
}));

vi.mock('../services/emailTriggers.js', () => ({
  getEmailTriggerRegistry: mockEmailTriggers.getEmailTriggerRegistry,
  sendTriggeredEmail: mockEmailTriggers.sendTriggeredEmail,
}));

vi.mock('../middleware/errorHandler.js', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));

vi.mock('../middleware/rbac.js', () => ({
  requirePermission: mockRbac.requirePermission,
}));

import emailRouter from '../routes/email.js';

function createApp(role = 'owner', userId = 'user-1'): Express {
  const app = express();
  app.use(express.json());

  // Auth middleware
  app.use((req: any, res: any, next: any) => {
    req.user = { id: userId, email: 'test@whitecaves.ae', role };
    next();
  });

  app.use('/api/email', emailRouter);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('Email Routes — /api/email', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default returns for template functions
    mockEmailService.EMAIL_TEMPLATES.welcome.mockReturnValue({
      subject: 'Welcome to White Caves',
      text: 'Welcome!',
      html: '<p>Welcome!</p>',
    });
    mockEmailService.EMAIL_TEMPLATES.propertyAlert.mockReturnValue({
      subject: 'New Property Alert',
      text: 'New property',
      html: '<p>New property</p>',
    });
  });

  describe('POST /send', () => {
    it('sends custom email with to and subject', async () => {
      mockEmailService.sendEmailTracked.mockResolvedValueOnce({
        success: true,
        messageId: 'msg-1',
        to: 'client@example.ae',
        subject: 'Test Email',
        sentAt: new Date().toISOString(),
      });

      const res = await request(createApp()).post('/api/email/send').send({
        to: 'client@example.ae',
        subject: 'Test Email',
        text: 'This is a test',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.messageId).toBe('msg-1');
      expect(mockEmailService.sendEmailTracked).toHaveBeenCalled();
    });

    it('rejects missing to field', async () => {
      const res = await request(createApp()).post('/api/email/send').send({
        subject: 'Test Email',
        text: 'This is a test',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Missing required fields/i);
    });

    it('rejects missing subject field', async () => {
      const res = await request(createApp()).post('/api/email/send').send({
        to: 'client@example.ae',
        text: 'This is a test',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Missing required fields/i);
    });

    it('sends HTML email when html provided', async () => {
      mockEmailService.sendEmailTracked.mockResolvedValueOnce({
        success: true,
        messageId: 'msg-2',
      });

      const html = '<p>Custom HTML</p>';
      await request(createApp()).post('/api/email/send').send({
        to: 'client@example.ae',
        subject: 'HTML Email',
        html,
      });

      expect(mockEmailService.sendEmailTracked).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'client@example.ae',
          html,
        })
      );
    });

    it('wraps text email in branded template', async () => {
      mockEmailService.sendEmailTracked.mockResolvedValueOnce({
        success: true,
        messageId: 'msg-3',
      });

      await request(createApp()).post('/api/email/send').send({
        to: 'client@example.ae',
        subject: 'Text Email',
        text: 'Plain text message',
      });

      expect(mockEmailService.sendEmailTracked).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining('Plain text message'),
        })
      );
    });

    it('sends email with replyTo field', async () => {
      mockEmailService.sendEmailTracked.mockResolvedValueOnce({
        success: true,
        messageId: 'msg-4',
      });

      await request(createApp()).post('/api/email/send').send({
        to: 'client@example.ae',
        subject: 'Email with Reply-To',
        text: 'Message',
        replyTo: 'support@whitecaves.ae',
      });

      expect(mockEmailService.sendEmailTracked).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: 'support@whitecaves.ae',
        })
      );
    });

    it('denies email send to agents', async () => {
      const res = await request(createApp('agent')).post('/api/email/send').send({
        to: 'client@example.ae',
        subject: 'Test',
        text: 'Message',
      });

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/Permission.*denied/i);
    });
  });

  describe('POST /template', () => {
    it('sends template email with valid template', async () => {
      mockEmailService.sendEmailTracked.mockResolvedValueOnce({
        success: true,
        messageId: 'msg-5',
        template: 'welcome',
      });

      const res = await request(createApp())
        .post('/api/email/template')
        .send({
          template: 'welcome',
          to: 'client@example.ae',
          params: { name: 'Ahmed Al Mansouri' },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.template).toBe('welcome');
      expect(mockEmailService.EMAIL_TEMPLATES.welcome).toHaveBeenCalledWith('Ahmed Al Mansouri');
    });

    it('rejects missing template field', async () => {
      const res = await request(createApp())
        .post('/api/email/template')
        .send({
          to: 'client@example.ae',
          params: { name: 'Client' },
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Missing required fields/i);
    });

    it('rejects missing to field', async () => {
      const res = await request(createApp())
        .post('/api/email/template')
        .send({
          template: 'welcome',
          params: { name: 'Client' },
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Missing required fields/i);
    });

    it('rejects missing params field', async () => {
      const res = await request(createApp()).post('/api/email/template').send({
        template: 'welcome',
        to: 'client@example.ae',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Missing required fields/i);
    });

    it('rejects unknown template', async () => {
      const res = await request(createApp())
        .post('/api/email/template')
        .send({
          template: 'nonexistent',
          to: 'client@example.ae',
          params: { name: 'Client' },
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Unknown template/i);
    });

    it('handles propertyAlert template with area and price', async () => {
      mockEmailService.sendEmailTracked.mockResolvedValueOnce({
        success: true,
        messageId: 'msg-6',
        template: 'propertyAlert',
      });

      await request(createApp())
        .post('/api/email/template')
        .send({
          template: 'propertyAlert',
          to: 'client@example.ae',
          params: {
            name: 'Fatima',
            propertyTitle: 'Villa in Palm Jumeirah',
            area: 'Palm Jumeirah',
            price: 'AED 5,000,000',
          },
        });

      expect(mockEmailService.EMAIL_TEMPLATES.propertyAlert).toHaveBeenCalledWith(
        'Fatima',
        'Villa in Palm Jumeirah',
        'Palm Jumeirah',
        'AED 5,000,000'
      );
    });

    it('handles viewingConfirmation template', async () => {
      mockEmailService.sendEmailTracked.mockResolvedValueOnce({
        success: true,
        messageId: 'msg-7',
        template: 'viewingConfirmation',
      });

      await request(createApp())
        .post('/api/email/template')
        .send({
          template: 'viewingConfirmation',
          to: 'client@example.ae',
          params: {
            name: 'Mohammed',
            propertyTitle: 'Apartment in Downtown Dubai',
            dateTime: '2026-04-15 14:00',
            agentName: 'Samir Abu',
          },
        });

      expect(mockEmailService.EMAIL_TEMPLATES.viewingConfirmation).toHaveBeenCalledWith(
        'Mohammed',
        'Apartment in Downtown Dubai',
        '2026-04-15 14:00',
        'Samir Abu'
      );
    });

    it('handles reraExpiry template', async () => {
      mockEmailService.EMAIL_TEMPLATES.reraExpiry = vi.fn(() => ({
        subject: 'RERA License Expiry',
        text: 'Your license expires',
        html: '<p>Expires</p>',
      }));

      mockEmailService.sendEmailTracked.mockResolvedValueOnce({
        success: true,
        messageId: 'msg-8',
        template: 'reraExpiry',
      });

      await request(createApp())
        .post('/api/email/template')
        .send({
          template: 'reraExpiry',
          to: 'agent@whitecaves.ae',
          params: {
            name: 'Samir Abu',
            brnNumber: 'BRN-2024-12345',
            expiryDate: '2026-06-30',
            daysRemaining: '45',
          },
        });

      expect(mockEmailService.EMAIL_TEMPLATES.reraExpiry).toHaveBeenCalledWith(
        'Samir Abu',
        'BRN-2024-12345',
        '2026-06-30',
        '45'
      );
    });

    it('denies template send to agents', async () => {
      const res = await request(createApp('agent'))
        .post('/api/email/template')
        .send({
          template: 'welcome',
          to: 'client@example.ae',
          params: { name: 'Client' },
        });

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/Permission.*denied/i);
    });
  });

  describe('GET /templates', () => {
    it('returns list of available templates', async () => {
      const res = await request(createApp()).get('/api/email/templates');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('description');
    });

    it('includes all standard templates', async () => {
      const res = await request(createApp()).get('/api/email/templates');

      expect(res.status).toBe(200);
      const names = res.body.data.map((t: any) => t.name);
      expect(names).toContain('welcome');
      expect(names).toContain('propertyAlert');
      expect(names).toContain('viewingConfirmation');
      expect(names).toContain('reraExpiry');
      expect(names).toContain('leadAssigned');
    });

    it('includes template descriptions', async () => {
      const res = await request(createApp()).get('/api/email/templates');

      expect(res.status).toBe(200);
      const welcome = res.body.data.find((t: any) => t.name === 'welcome');
      expect(welcome.description).toMatch(/welcome|Welcome/i);
    });

    it('denies template list to unauthenticated', async () => {
      const appNoAuth = express();
      appNoAuth.use(express.json());
      // No auth middleware - req.user will be undefined
      appNoAuth.use('/api/email', emailRouter);
      appNoAuth.use((err: any, _req: any, res: any, _next: any) => {
        res.status(err.statusCode || 500).json({ success: false, error: err.message });
      });

      const res = await request(appNoAuth).get('/api/email/templates');

      expect(res.status).toBe(403);
    });
  });

  describe('GET /stats', () => {
    it('returns email statistics', async () => {
      mockEmailService.getEmailStats.mockReturnValueOnce({
        totalSent: 1523,
        totalDelivered: 1512,
        totalFailed: 8,
        totalBounced: 3,
        deliveryRate: 99.28,
        openRate: 45.2,
        clickRate: 12.8,
        period: 'last-30-days',
      });

      const res = await request(createApp()).get('/api/email/stats');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalSent).toBe(1523);
      expect(res.body.data.deliveryRate).toBe(99.28);
    });

    it('denies stats to agents', async () => {
      const res = await request(createApp('agent')).get('/api/email/stats');

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/Permission.*denied/i);
    });
  });

  describe('GET /triggers', () => {
    it('returns trigger event registry', async () => {
      mockEmailTriggers.getEmailTriggerRegistry.mockReturnValueOnce({
        lead_created: {
          name: 'Lead Created',
          template: 'leadAssigned',
          variables: ['agentName', 'leadName', 'leadEmail', 'source'],
        },
        viewing_confirmed: {
          name: 'Viewing Confirmed',
          template: 'viewingConfirmation',
          variables: ['name', 'propertyTitle', 'dateTime', 'agentName'],
        },
        rera_expiry_30d: {
          name: 'RERA License Expiry (30 days)',
          template: 'reraExpiry',
          variables: ['name', 'brnNumber', 'expiryDate', 'daysRemaining'],
        },
      });

      const res = await request(createApp()).get('/api/email/triggers');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data['lead_created']).toBeDefined();
      expect(res.body.data['lead_created'].template).toBe('leadAssigned');
    });

    it('denies trigger list to unauthenticated', async () => {
      const appNoAuth = express();
      appNoAuth.use(express.json());
      // No auth middleware - req.user will be undefined
      appNoAuth.use('/api/email', emailRouter);
      appNoAuth.use((err: any, _req: any, res: any, _next: any) => {
        res.status(err.statusCode || 500).json({ success: false, error: err.message });
      });

      const res = await request(appNoAuth).get('/api/email/triggers');

      expect(res.status).toBe(403);
    });
  });

  describe('POST /trigger', () => {
    beforeEach(() => {
      // Setup trigger registry for trigger tests
      mockEmailTriggers.getEmailTriggerRegistry.mockReturnValue({
        lead_created: {
          name: 'Lead Created',
          template: 'leadAssigned',
          variables: ['agentName', 'leadName', 'leadEmail', 'source'],
        },
        viewing_confirmed: {
          name: 'Viewing Confirmed',
          template: 'viewingConfirmation',
          variables: ['name', 'propertyTitle', 'dateTime', 'agentName'],
        },
        rera_expiry_30d: {
          name: 'RERA License Expiry (30 days)',
          template: 'reraExpiry',
          variables: ['name', 'brnNumber', 'expiryDate', 'daysRemaining'],
        },
      });
    });

    it('sends triggered email with valid event', async () => {
      mockEmailTriggers.sendTriggeredEmail.mockResolvedValueOnce({
        success: true,
        messageId: 'msg-9',
        event: 'lead_created',
      });

      const res = await request(createApp())
        .post('/api/email/trigger')
        .send({
          event: 'lead_created',
          to: 'agent@whitecaves.ae',
          variables: {
            agentName: 'Samir',
            leadName: 'Ahmed',
            leadEmail: 'ahmed@example.ae',
            source: 'website',
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockEmailTriggers.sendTriggeredEmail).toHaveBeenCalled();
    });

    it('rejects missing event field', async () => {
      const res = await request(createApp())
        .post('/api/email/trigger')
        .send({
          to: 'agent@whitecaves.ae',
          variables: { agentName: 'Samir' },
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Missing required fields/i);
    });

    it('rejects missing to field', async () => {
      const res = await request(createApp())
        .post('/api/email/trigger')
        .send({
          event: 'lead_created',
          variables: { agentName: 'Samir' },
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Missing required fields/i);
    });

    it('rejects unknown trigger event', async () => {
      const res = await request(createApp()).post('/api/email/trigger').send({
        event: 'nonexistent_event',
        to: 'agent@whitecaves.ae',
        variables: {},
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Unknown trigger event/i);
    });

    it('defaults variables to empty object', async () => {
      mockEmailTriggers.sendTriggeredEmail.mockResolvedValueOnce({
        success: true,
        messageId: 'msg-10',
        event: 'lead_created',
      });

      await request(createApp()).post('/api/email/trigger').send({
        event: 'lead_created',
        to: 'agent@whitecaves.ae',
      });

      expect(mockEmailTriggers.sendTriggeredEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'lead_created',
          variables: {},
        })
      );
    });

    it('denies trigger send to agents', async () => {
      const res = await request(createApp('agent')).post('/api/email/trigger').send({
        event: 'lead_created',
        to: 'agent@whitecaves.ae',
        variables: {},
      });

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/Permission.*denied/i);
    });
  });
});
