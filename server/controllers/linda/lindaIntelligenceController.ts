import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { OFFER_KEYS, VIEWING_KEYS } from './lindaCommon.js';

export const nlpRoute = async (req: Request, res: Response) => {
  try {
    const { message, phone } = req.body as { message?: unknown; phone?: unknown };

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'message is required' });
    }
    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ success: false, error: 'phone is required' });
    }

    const { detectIntent, extractEntities } = await import(
      '../../services/nadia/messageProcessor.js'
    );
    const intent = detectIntent(message);
    const entities = extractEntities(message);

    const ACTION_MAP: Record<string, string> = {
      property_search: 'route_to_mary_inventory',
      schedule_tour: 'route_to_agent_calendar',
      information_request: 'send_property_details',
      make_offer: 'escalate_to_sales_manager',
      financing: 'route_to_finance_team',
      legal_enquiry: 'route_to_henry_compliance',
      complaint: 'escalate_to_manager',
      general_inquiry: 'route_to_nadia_queue',
    };
    const recommendedAction = ACTION_MAP[intent] ?? 'route_to_nadia_queue';

    const { assistantOrchestrator } = await import(
      '../../services/orchestrator/AssistantOrchestrator.js'
    );
    assistantOrchestrator.emitEvent('linda:message_received', {
      from: phone,
      message,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, data: { intent, entities, recommendedAction } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const henryTrigger = async (req: Request, res: Response) => {
  try {
    const { templateKey, documentData, conversationId } = req.body as {
      templateKey?: unknown;
      documentData?: unknown;
      conversationId?: unknown;
    };

    if (!templateKey || typeof templateKey !== 'string') {
      return res.status(400).json({ success: false, error: 'templateKey is required' });
    }
    if (!documentData || typeof documentData !== 'object' || Array.isArray(documentData)) {
      return res
        .status(400)
        .json({ success: false, error: 'documentData must be a non-null object' });
    }

    const data = documentData as Record<string, unknown>;
    const convId = typeof conversationId === 'string' ? conversationId : undefined;

    const { assistantOrchestrator } = await import(
      '../../services/orchestrator/AssistantOrchestrator.js'
    );

    if (VIEWING_KEYS.includes(templateKey)) {
      assistantOrchestrator.emitEvent('cross:viewing_booked', {
        propertyId: String(data.propertyId ?? data.unit ?? 'unknown'),
        contactPhone: String(data.tenantPhone ?? data.contactPhone ?? ''),
        scheduledAt: String(data.scheduledAt ?? new Date().toISOString()),
        documentData: data,
        conversationId: convId,
      });
    } else if (OFFER_KEYS.includes(templateKey)) {
      assistantOrchestrator.emitEvent('cross:offer_accepted', {
        propertyId: String(data.propertyId ?? data.unit ?? 'unknown'),
        buyerPhone: String(data.buyerPhone ?? data.tenantPhone ?? ''),
        agentPhone: typeof data.agentPhone === 'string' ? data.agentPhone : undefined,
        offerAmount: Number(data.offerAmount ?? data.annualRent ?? 0),
        documentData: data,
        conversationId: convId,
      });
    } else {
      return res.status(400).json({
        success: false,
        error:
          `templateKey "${templateKey}" does not map to a cross-assistant event. ` +
          `Viewing keys: ${VIEWING_KEYS.join(', ')}. ` +
          `Offer keys: ${OFFER_KEYS.join(', ')}.`,
      });
    }

    res.json({ success: true, data: { triggered: true } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const transcribeAudio = async (req: Request, res: Response) => {
  try {
    const { transcribeVoiceMessage } = await import(
      '../../services/linda/voiceTranscription.js'
    );
    const {
      audioBase64,
      format = 'ogg',
      languageHint,
      contextPrompt,
    } = req.body as {
      audioBase64?: string;
      format?: string;
      languageHint?: string;
      contextPrompt?: string;
    };

    if (!audioBase64) {
      return res.status(400).json({ success: false, error: 'audioBase64 is required' });
    }

    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const result = await transcribeVoiceMessage({
      audioBuffer,
      format: format as 'ogg' | 'mp3' | 'm4a' | 'wav' | 'webm',
      languageHint,
      contextPrompt,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const getSentimentAlerts = async (req: Request, res: Response) => {
  try {
    const { getAlerts, getAlertSummary } = await import(
      '../../services/linda/sentimentAlertService.js'
    );
    const onlyUnacked = req.query['unacknowledged'] === 'true';
    const limit = parseInt(String(req.query['limit'] ?? '50'), 10);
    const alerts = getAlerts(onlyUnacked, limit);
    const summary = getAlertSummary();
    res.json({ success: true, data: { alerts, summary, count: alerts.length } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const acknowledgeSentimentAlert = async (req: AuthRequest, res: Response) => {
  try {
    const { acknowledgeAlert } = await import(
      '../../services/linda/sentimentAlertService.js'
    );
    const { alertId } = req.params as { alertId: string };
    const agentId = req.user?.id ?? 'unknown';
    const ok = acknowledgeAlert(alertId, agentId);
    if (!ok) return res.status(404).json({ success: false, error: `Alert ${alertId} not found` });
    res.json({ success: true, data: { acknowledged: true, alertId } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const backgroundAnalysisOptIn = async (req: Request, res: Response) => {
  try {
    const { accountLabel, consentConfirmed, consentReference, messages } = req.body as {
      accountLabel?: unknown;
      consentConfirmed?: unknown;
      consentReference?: unknown;
      messages?: unknown;
    };

    if (consentConfirmed !== true) {
      return res.status(400).json({
        success: false,
        error: 'Explicit consent is required before any background analysis.',
      });
    }

    if (!consentReference || typeof consentReference !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'consentReference is required for auditability.',
      });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'messages must be a non-empty array.',
      });
    }

    const rows = messages
      .filter(m => m && typeof m === 'object')
      .map(m => ({
        conversationId: String((m as { conversationId?: unknown }).conversationId ?? 'unknown'),
        text: String((m as { text?: unknown }).text ?? ''),
      }))
      .filter(m => m.text.trim().length > 0);

    const keywordHits = {
      viewing: rows.filter(r => /view|tour|معاينة/i.test(r.text)).length,
      pricing: rows.filter(r => /price|budget|aed|سعر|درهم/i.test(r.text)).length,
      complaint: rows.filter(r => /problem|issue|complaint|شكوى|مشكلة/i.test(r.text)).length,
      maintenance: rows.filter(r => /maintenance|repair|صيانة/i.test(r.text)).length,
    };

    const scheduleRecommendations = [
      keywordHits.viewing > 0
        ? 'Increase viewing coordination blocks for high-intent conversations.'
        : 'No viewing surge detected.',
      keywordHits.complaint > 0
        ? 'Add daily complaint triage slot with a senior agent.'
        : 'Complaint volume currently stable.',
      keywordHits.pricing > 0
        ? 'Prepare pricing FAQ snippets for sales agents before outbound follow-ups.'
        : 'Pricing objection volume is low in this sample.',
    ];

    res.json({
      success: true,
      data: {
        accountLabel: typeof accountLabel === 'string' ? accountLabel : 'linked-account',
        analyzedConversationCount: new Set(rows.map(r => r.conversationId)).size,
        analyzedMessageCount: rows.length,
        keywordHits,
        scheduleRecommendations,
        compliance: {
          consentReference,
          consentConfirmed: true,
          mode: 'opt-in-background-analysis',
        },
        analyzedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

