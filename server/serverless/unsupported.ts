import type { Express } from 'express';
import { notImplemented } from './responses.js';
export function mountUnsupported(app: Express): void {
  app.post('/api/ai/orchestrate', notImplemented('AI orchestration', '/api/orchestrator'));
  app.post('/api/ai/route-task', notImplemented('AI task routing', '/api/orchestrator'));
  app.get('/api/ai/routing-analytics', notImplemented('AI routing analytics', '/api/orchestrator'));
  app.post(
    '/api/conversations/:conversationId/context',
    notImplemented('Conversation context', '/api/assistants')
  );
  app.post(
    '/api/conversations/:conversationId/message',
    notImplemented('Conversation messaging', '/api/assistants')
  );
  app.post(
    '/api/conversations/:conversationId/switch-assistant',
    notImplemented('Assistant handoff', '/api/assistants')
  );
  app.get(
    '/api/conversations/:conversationId/context',
    notImplemented('Conversation context', '/api/assistants')
  );
  app.get(
    '/api/improvements/dashboard',
    notImplemented('Deployment analytics', '/api/orchestrator')
  );
  app.get('/api/landlord/properties', notImplemented('Landlord properties', '/api/landlord'));
  app.get('/api/landlord/maintenance', notImplemented('Landlord maintenance', '/api/landlord'));
  app.get('/api/landlord/finances', notImplemented('Landlord finances', '/api/landlord'));
  app.get('/api/landlord/stats', notImplemented('Landlord stats', '/api/landlord'));
  app.get('/api/whatsapp/session', notImplemented('WhatsApp session', '/api/whatsapp'));
  app.post('/api/whatsapp/connect', notImplemented('WhatsApp connect', '/api/whatsapp'));
  app.post('/api/whatsapp/disconnect', notImplemented('WhatsApp disconnect', '/api/whatsapp'));
  app.get('/api/whatsapp/qr/refresh', notImplemented('WhatsApp QR refresh', '/api/whatsapp'));
  app.get('/api/whatsapp/contacts', notImplemented('WhatsApp contacts', '/api/whatsapp'));
  app.get(
    '/api/whatsapp/messages/:contactId',
    notImplemented('WhatsApp messages', '/api/whatsapp')
  );
  app.post('/api/whatsapp/send-message', notImplemented('WhatsApp send message', '/api/whatsapp'));
  app.get('/api/whatsapp/stats', notImplemented('WhatsApp stats', '/api/whatsapp'));
  app.get('/api/bots', notImplemented('Bot registry', '/api/whatsapp-engine'));
  app.get('/api/flows', notImplemented('Bot flows', '/api/whatsapp-engine'));
  app.get('/api/sessions', notImplemented('Bot sessions', '/api/whatsapp-engine'));
  app.get('/api/sourcing/opportunities', notImplemented('Property sourcing', '/api/sourcing'));
  app.post(
    '/api/sourcing/analyze-conversation',
    notImplemented('Property sourcing', '/api/sourcing')
  );
  app.put(
    '/api/sourcing/opportunities/:id/verify',
    notImplemented('Property sourcing', '/api/sourcing')
  );
  app.post(
    '/api/sourcing/opportunities/:id/add-to-inventory',
    notImplemented('Property sourcing', '/api/sourcing')
  );
  app.get('/api/sourcing/statistics', notImplemented('Property sourcing', '/api/sourcing'));
  app.get('/api/owners', notImplemented('Property owners', '/api/sourcing'));
  app.get('/api/owners/:id', notImplemented('Property owners', '/api/sourcing'));
}
