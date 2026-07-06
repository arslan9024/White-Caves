/**
 * Email Routes — /api/email
 * Phase 3B: Email Automation
 *
 * Endpoints:
 * - POST /api/email/send         — Send an email
 * - POST /api/email/template     — Send a predefined template email
 * - GET  /api/email/templates    — List available templates
 * - GET  /api/email/stats        — Email sending statistics
 */

import { Router, Request, Response } from 'express';
import { requirePermission } from '../middleware/rbac.js';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import {
  sendEmailTracked,
  EMAIL_TEMPLATES,
  getEmailStats,
  wrapInBrandedTemplate,
} from '../services/emailService.js';
import { getEmailTriggerRegistry, sendTriggeredEmail } from '../services/emailTriggers.js';

const router = Router();

/**
 * POST /api/email/send
 * Send a custom email
 * Body: { to, subject, text?, html?, replyTo? }
 */
router.post(
  '/send',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { to, subject, text, html, replyTo } = req.body;

    if (!to || !subject) {
      throw new AppError('Missing required fields: to, subject', 400);
    }

    const result = await sendEmailTracked({
      to,
      subject,
      text,
      html: html || (text ? wrapInBrandedTemplate(`<p>${text}</p>`) : undefined),
      replyTo,
    });

    res.json({ success: result.success, data: result });
  })
);

/**
 * POST /api/email/template
 * Send a predefined template email
 * Body: { template, to, params }
 */
router.post(
  '/template',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { template, to, params } = req.body;

    if (!template || !to || !params) {
      throw new AppError('Missing required fields: template, to, params', 400);
    }

    // Get template function
    const templateFn = EMAIL_TEMPLATES[template as keyof typeof EMAIL_TEMPLATES];
    if (!templateFn) {
      throw new AppError(
        `Unknown template: ${template}. Available: ${Object.keys(EMAIL_TEMPLATES).join(', ')}`,
        400
      );
    }

    // Build email from template
    let emailData;
    switch (template) {
      case 'welcome':
        emailData = EMAIL_TEMPLATES.welcome(params.name || 'Valued Client');
        break;
      case 'propertyAlert':
        emailData = EMAIL_TEMPLATES.propertyAlert(
          params.name || 'Valued Client',
          params.propertyTitle || 'New Property',
          params.area || 'Dubai',
          params.price || 'Price on request'
        );
        break;
      case 'viewingConfirmation':
        emailData = EMAIL_TEMPLATES.viewingConfirmation(
          params.name || 'Valued Client',
          params.propertyTitle || 'Property',
          params.dateTime || 'TBD',
          params.agentName || 'White Caves Agent'
        );
        break;
      case 'documentReady':
        emailData = EMAIL_TEMPLATES.documentReady(
          params.name || 'Valued Client',
          params.documentType || 'Document',
          params.documentTitle || 'Untitled Document'
        );
        break;
      case 'paymentReminder':
        emailData = EMAIL_TEMPLATES.paymentReminder(
          params.name || 'Valued Client',
          params.amount || 'Amount TBD',
          params.description || 'Payment',
          params.dueDate || 'TBD'
        );
        break;
      case 'reraExpiry':
        emailData = EMAIL_TEMPLATES.reraExpiry(
          params.name || 'Agent',
          params.brnNumber || 'BRN-XXX',
          params.expiryDate || 'TBD',
          params.daysRemaining || '30'
        );
        break;
      case 'leadAssigned':
        emailData = EMAIL_TEMPLATES.leadAssigned(
          params.agentName || 'Agent',
          params.leadName || 'New Lead',
          params.leadEmail || '',
          params.source || 'direct'
        );
        break;
      case 'contractSigned':
        emailData = EMAIL_TEMPLATES.contractSigned(
          params.clientName || 'Valued Client',
          params.propertyTitle || 'Property',
          params.contractRef || 'REF-XXX',
          params.startDate || 'TBD'
        );
        break;
      case 'viewingCancelled':
        emailData = EMAIL_TEMPLATES.viewingCancelled(
          params.clientName || params.name || 'Valued Client',
          params.propertyTitle || 'Property',
          params.dateTime || 'TBD',
          params.agentName || 'Your Agent'
        );
        break;
      default:
        throw new AppError(`No handler for template: ${template}`, 400);
    }

    const result = await sendEmailTracked({
      to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
      tags: [{ name: 'template', value: template }],
    });

    res.json({ success: result.success, data: { ...result, template } });
  })
);

/**
 * GET /api/email/templates
 * List available email templates
 */
router.get('/templates', requirePermission('view_leads'), (_req: Request, res: Response) => {
  const templates = Object.keys(EMAIL_TEMPLATES).map(key => ({
    name: key,
    description: getTemplateDescription(key),
  }));

  res.json({ success: true, data: templates });
});

/**
 * GET /api/email/stats
 * Email sending statistics
 */
router.get('/stats', requirePermission('view_analytics'), (_req: Request, res: Response) => {
  res.json({ success: true, data: getEmailStats() });
});

router.get('/triggers', requirePermission('view_leads'), (_req: Request, res: Response) => {
  res.json({ success: true, data: getEmailTriggerRegistry() });
});

router.post('/trigger', requirePermission('manage_leads'), async (req: Request, res: Response) => {
  try {
    const { event, to, variables = {} } = req.body ?? {};
    if (!event || !to) {
      res.status(400).json({ success: false, error: 'Missing required fields: event, to' });
      return;
    }
    const triggerRegistry = getEmailTriggerRegistry();
    if (!(event in triggerRegistry)) {
      res.status(400).json({
        success: false,
        error: `Unknown trigger event: ${event}`,
      });
      return;
    }

    const result = await sendTriggeredEmail({
      event: event as keyof typeof triggerRegistry,
      to,
      variables,
    });
    res.json({ success: result.success, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send triggered email',
    });
  }
});

function getTemplateDescription(key: string): string {
  const descriptions: Record<string, string> = {
    welcome: 'Welcome email for new clients/leads',
    propertyAlert: 'New property matching notification',
    viewingConfirmation: 'Viewing appointment confirmation',
    viewingCancelled: 'Viewing cancellation notification',
    documentReady: 'Document ready for review notification',
    paymentReminder: 'Payment due reminder',
    reraExpiry: 'RERA BRN license expiry warning',
    leadAssigned: 'New lead assignment notification for agents',
    contractSigned: 'Tenancy contract fully signed confirmation',
  };
  // eslint-disable-next-line security/detect-object-injection
  return descriptions[key] || key;
}

export default router;
