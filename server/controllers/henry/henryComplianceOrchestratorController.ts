import { Request, Response } from 'express';
import {
  evaluateCompliance,
  getComplianceSummary,
  TemplateKey,
} from '../../services/henry/complianceEngine.js';
import {
  HenryEventLogEntry,
  MAX_HENRY_EVENT_LOG,
  henryEventLog,
} from './henryCommon.js';

export const checkCompliance = (req: Request, res: Response) => {
  try {
    const { templateKey, documentData } = req.body;

    if (!templateKey) {
      return res.status(400).json({ success: false, error: 'templateKey is required' });
    }
    if (!documentData || typeof documentData !== 'object') {
      return res.status(400).json({ success: false, error: 'documentData must be an object' });
    }

    const validTemplateKeys: TemplateKey[] = [
      'tenancy_contract',
      'booking_form',
      'addendum',
      'viewing_agreement',
      'key_handover',
      'offer_letter',
      'invoice',
      'salary_certificate',
      'gov_employee_booking',
    ];
    if (!validTemplateKeys.includes(templateKey as TemplateKey)) {
      return res.status(400).json({
        success: false,
        error: `Invalid templateKey. Valid options: ${validTemplateKeys.join(', ')}`,
      });
    }

    const report = evaluateCompliance(
      templateKey as TemplateKey,
      documentData as Record<string, unknown>
    );
    res.json({ success: true, data: report });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const getComplianceSummaryHandler = (_req: Request, res: Response) => {
  try {
    const summary = getComplianceSummary();
    res.json({ success: true, data: summary });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const triggerOrchestrator = async (req: Request, res: Response) => {
  try {
    const { triggerSource, event, payload } = req.body as {
      triggerSource?: unknown;
      event?: unknown;
      payload?: unknown;
    };

    const VALID_SOURCES = ['nadia', 'linda', 'mary', 'nina'] as const;
    type TriggerSource = (typeof VALID_SOURCES)[number];

    if (!triggerSource || !VALID_SOURCES.includes(triggerSource as TriggerSource)) {
      return res.status(400).json({
        success: false,
        error: `triggerSource must be one of: ${VALID_SOURCES.join(', ')}`,
      });
    }
    if (!event || typeof event !== 'string') {
      return res.status(400).json({ success: false, error: 'event is required' });
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return res
        .status(400)
        .json({ success: false, error: 'payload must be a non-null object' });
    }

    const safeSource = triggerSource as TriggerSource;
    const safePayload = payload as Record<string, unknown>;

    console.info(`[Henry] Cross-trigger from ${safeSource}: event="${event}"`);

    let complianceResult: HenryEventLogEntry['complianceResult'];
    const validTemplateKeys: TemplateKey[] = [
      'tenancy_contract', 'booking_form', 'addendum', 'viewing_agreement',
      'key_handover', 'offer_letter', 'invoice', 'salary_certificate', 'gov_employee_booking',
    ];
    if (
      typeof safePayload.templateKey === 'string' &&
      validTemplateKeys.includes(safePayload.templateKey as TemplateKey)
    ) {
      const report = evaluateCompliance(
        safePayload.templateKey as TemplateKey,
        safePayload
      );
      complianceResult = {
        passed: report.isCompliant,
        errorCount: report.errorCount,
        warningCount: report.warningCount,
        templateKey: safePayload.templateKey,
      };
    }

    const logEntry: HenryEventLogEntry = {
      id: `hlog-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: new Date().toISOString(),
      triggerSource: safeSource,
      event,
      payload: safePayload,
      complianceResult,
    };
    henryEventLog.push(logEntry);
    if (henryEventLog.length > MAX_HENRY_EVENT_LOG) henryEventLog.shift();

    const { assistantOrchestrator } = await import(
      '../../services/orchestrator/AssistantOrchestrator.js'
    );

    if (event === 'cross:viewing_booked') {
      assistantOrchestrator.emitEvent('cross:viewing_booked', {
        propertyId: String(safePayload.propertyId ?? 'unknown'),
        contactPhone: String(safePayload.contactPhone ?? ''),
        scheduledAt: String(safePayload.scheduledAt ?? new Date().toISOString()),
        documentData: safePayload,
      });
    } else if (event === 'cross:offer_accepted') {
      assistantOrchestrator.emitEvent('cross:offer_accepted', {
        propertyId: String(safePayload.propertyId ?? 'unknown'),
        buyerPhone: String(safePayload.buyerPhone ?? ''),
        agentPhone: typeof safePayload.agentPhone === 'string' ? safePayload.agentPhone : undefined,
        offerAmount: Number(safePayload.offerAmount ?? 0),
        documentData: safePayload,
      });
    } else if (complianceResult && !complianceResult.passed) {
      assistantOrchestrator.emitEvent('henry:compliance_failed', {
        templateKey: String(safePayload.templateKey ?? event),
        violations: [`${complianceResult.errorCount} compliance error(s) in "${complianceResult.templateKey}"`],
        severity: 'error',
      });
    } else {
      assistantOrchestrator.emitEvent('henry:document_generated', {
        documentId: logEntry.id,
        templateKey: String(safePayload.templateKey ?? event),
        fileName: `${String(safePayload.templateKey ?? event)}_${Date.now()}.pdf`,
      });
    }

    res.json({
      success: true,
      data: { processed: true, complianceResult: complianceResult ?? null },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const getEventLog = (_req: Request, res: Response) => {
  try {
    const events = [...henryEventLog].reverse().slice(0, MAX_HENRY_EVENT_LOG);
    res.json({ success: true, data: { events, count: events.length } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};
