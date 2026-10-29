/**
 * nadiaIntegrationController.ts
 * Handlers for system health, cross-assistant orchestrations (Mary Search, Henry Alerts, Cross-Status),
 * WABA feature enhancements, and Meta policy knowledge.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';

export async function getNadiaHealth(_req: Request, res: Response): Promise<void> {
  const conversationCount = await prisma.nadiaConversation.count();
  const messageCount = await prisma.nadiaMessage.count();
  const queueCount = await prisma.nadiaConversationQueue.count();

  res.status(200).json({
    success: true,
    status: 'operational',
    data: {
      conversationCount,
      messageCount,
      queueCount,
      timestamp: new Date().toISOString(),
    },
  });
}

export async function searchMaryInventory(req: Request, res: Response): Promise<void> {
  const { intent, entities, conversationId } = req.body as {
    intent?: unknown;
    entities?: unknown;
    conversationId?: unknown;
  };

  if (!intent || typeof intent !== 'string') {
    throw new AppError('intent is required', 400);
  }
  if (!Array.isArray(entities)) {
    throw new AppError('entities must be an array', 400);
  }

  let locationFilter: string | undefined;
  let bedroomsFilter: number | undefined;
  let propertyTypeFilter: string | undefined;

  for (const entity of entities as unknown[]) {
    if (typeof entity !== 'string') continue;
    if (entity.startsWith('location:')) {
      locationFilter = entity.replace('location:', '').trim();
    } else if (entity.startsWith('bedrooms:')) {
      const parsed = parseInt(entity.replace('bedrooms:', ''), 10);
      if (!isNaN(parsed)) bedroomsFilter = parsed;
    } else if (entity.startsWith('property_type:')) {
      propertyTypeFilter = entity.replace('property_type:', '').trim().toLowerCase();
    }
  }

  const MOCK_PROPERTIES = [
    {
      id: 'prop-1',
      unit: 'VH-A-101',
      cluster: 'Veneto',
      type: 'villa',
      bedrooms: 4,
      size: 3500,
      price: 2800000,
      status: 'available',
      location: 'dubai hills',
    },
    {
      id: 'prop-3',
      unit: 'CL-C-312',
      cluster: 'Cleopatra',
      type: 'villa',
      bedrooms: 5,
      size: 4200,
      price: 3500000,
      status: 'available',
      location: 'palm jumeirah',
    },
    {
      id: 'prop-5',
      unit: 'OL-E-520',
      cluster: 'Olympus',
      type: 'villa',
      bedrooms: 6,
      size: 5500,
      price: 4800000,
      status: 'available',
      location: 'emirates hills',
    },
    {
      id: 'prop-6',
      unit: 'MA-F-614',
      cluster: 'Marbella',
      type: 'apartment',
      bedrooms: 2,
      size: 1200,
      price: 950000,
      status: 'available',
      location: 'downtown dubai',
    },
    {
      id: 'prop-7',
      unit: 'SA-G-710',
      cluster: 'Sahara',
      type: 'townhouse',
      bedrooms: 3,
      size: 1800,
      price: 1400000,
      status: 'available',
      location: 'dubai marina',
    },
    {
      id: 'prop-8',
      unit: 'MO-H-815',
      cluster: 'Morocco',
      type: 'townhouse',
      bedrooms: 3,
      size: 2000,
      price: 1550000,
      status: 'available',
      location: 'dubai hills',
    },
  ] as const;

  type MockProperty = (typeof MOCK_PROPERTIES)[number];

  let results: MockProperty[] = [...MOCK_PROPERTIES].filter(p => p.status === 'available');

  if (bedroomsFilter !== undefined) {
    results = results.filter(p => p.bedrooms === bedroomsFilter);
  }
  if (propertyTypeFilter) {
    results = results.filter(p => p.type === propertyTypeFilter);
  }
  if (locationFilter) {
    results = results.filter(p => p.location.includes(locationFilter as string));
  }

  const top3 = results.slice(0, 3);

  res.status(200).json({
    success: true,
    data: {
      intent,
      entities,
      conversationId: typeof conversationId === 'string' ? conversationId : null,
      properties: top3,
      totalFound: results.length,
      searchedAt: new Date().toISOString(),
    },
  });
}

export async function alertHenry(req: Request, res: Response): Promise<void> {
  const { conversationId, templateKey, alertType } = req.body as {
    conversationId?: unknown;
    templateKey?: unknown;
    alertType?: unknown;
  };

  if (!templateKey || typeof templateKey !== 'string') {
    throw new AppError('templateKey is required', 400);
  }
  const VALID_ALERT_TYPES = ['compliance_failed', 'document_generated'] as const;
  type AlertType = (typeof VALID_ALERT_TYPES)[number];
  if (!alertType || !VALID_ALERT_TYPES.includes(alertType as AlertType)) {
    throw new AppError(`alertType must be one of: ${VALID_ALERT_TYPES.join(', ')}`, 400);
  }

  const convId = typeof conversationId === 'string' ? conversationId : undefined;

  const { assistantOrchestrator } = await import(
    '../../services/orchestrator/AssistantOrchestrator.js'
  );

  if ((alertType as AlertType) === 'compliance_failed') {
    assistantOrchestrator.emitEvent('henry:compliance_failed', {
      conversationId: convId,
      templateKey,
      violations: [`Compliance check required for template: ${templateKey}`],
      severity: 'warning',
    });
  } else {
    assistantOrchestrator.emitEvent('henry:document_generated', {
      documentId: `nadia-doc-${Date.now().toString(36)}`,
      templateKey,
      conversationId: convId,
      fileName: `${templateKey}_${Date.now()}.pdf`,
    });
  }

  res.status(200).json({
    success: true,
    data: {
      alerted: true,
      alertType,
      templateKey,
      conversationId: convId ?? null,
    },
  });
}

export async function getCrossStatus(_req: Request, res: Response): Promise<void> {
  const { getOrchestratorStatus } = await import(
    '../../services/orchestrator/AssistantOrchestrator.js'
  );
  const orchStatus = getOrchestratorStatus();

  res.status(200).json({
    success: true,
    data: {
      lindaConnected: orchStatus.registeredAssistants.includes('linda'),
      ninaActive: orchStatus.registeredAssistants.includes('nina'),
      maryReachable: orchStatus.registeredAssistants.includes('mary'),
      henryReachable: orchStatus.registeredAssistants.includes('henry'),
      orchestratorEvents: orchStatus.totalEventsEmitted,
      checkedAt: new Date().toISOString(),
    },
  });
}

export async function getWabaEnhancements(_req: Request, res: Response): Promise<void> {
  res.status(200).json({
    success: true,
    data: {
      platform: 'Nadia Official WABA',
      features: [
        { key: 'broadcast_campaigns', title: 'Broadcast Campaigns', status: 'enabled' },
        { key: 'shared_team_inbox', title: 'Shared Team Inbox', status: 'enabled' },
        { key: 'conversation_tags', title: 'Conversation Tags', status: 'enabled' },
        { key: 'automation_flows', title: 'Automation Flows', status: 'enabled' },
        { key: 'agent_assignment', title: 'Agent Assignment', status: 'enabled' },
        { key: 'conversation_analytics', title: 'Conversation Analytics', status: 'enabled' },
        { key: 'template_management', title: 'Template Management', status: 'enabled' },
        { key: 'escalation_workflows', title: 'Escalation Workflows', status: 'enabled' },
      ],
      generatedAt: new Date().toISOString(),
    },
  });
}

export async function getWabaMatrix(_req: Request, res: Response): Promise<void> {
  res.status(200).json({
    success: true,
    data: {
      partnersBenchmarked: ['WATI', 'ConnectYourBot', 'Meta BSP ecosystem'],
      capabilities: [
        { capability: 'Broadcast Scheduling', nadia: 'available', benchmark: 'common' },
        { capability: 'Conversation Assignment', nadia: 'available', benchmark: 'common' },
        { capability: 'Template Personalization', nadia: 'available', benchmark: 'common' },
        { capability: 'Auto-Reply + Escalation', nadia: 'available', benchmark: 'common' },
        { capability: 'Funnel Analytics', nadia: 'available', benchmark: 'common' },
        { capability: 'Queue Prioritization', nadia: 'available', benchmark: 'common' },
      ],
      note: 'Capabilities are implemented in Nadia-specific workflows and should respect Meta and local compliance rules.',
    },
  });
}

export async function getMetaPolicies(_req: Request, res: Response): Promise<void> {
  res.status(200).json({
    success: true,
    data: {
      title: 'Meta WhatsApp Policy Knowledge',
      sections: [
        {
          key: 'opt_in',
          heading: 'User Opt-In',
          summary: 'Messages must be sent only to users with valid opt-in consent.',
        },
        {
          key: 'template_quality',
          heading: 'Template Quality and Approval',
          summary:
            'Outbound templates should follow Meta template approval and quality constraints.',
        },
        {
          key: 'session_window',
          heading: '24-Hour Customer Service Window',
          summary:
            'Free-form messaging is limited to active service windows; otherwise approved templates are required.',
        },
        {
          key: 'prohibited_content',
          heading: 'Prohibited Content',
          summary: 'Do not use prohibited content categories or spam-like messaging patterns.',
        },
        {
          key: 'data_privacy',
          heading: 'Data Privacy',
          summary:
            'Use least-privilege access and process personal data with transparent consent and retention controls.',
        },
      ],
      lastReviewedAt: new Date().toISOString(),
    },
  });
}
