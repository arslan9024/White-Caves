/**
 * recruitment.context.js — Shared mutable dependencies & audit logging
 * Extracted from recruitment.js (Single Purpose File decomposition).
 * Route modules read swappable services through `ctx` so test-dep
 * injection via __setRecruitmentTestDeps affects every handler.
 */
import { PrismaClient } from '@prisma/client';
import { CandidateScoringService } from '../../services/CandidateScoringService.js';
import MessageTemplateService from '../../services/MessageTemplateService.js';

const defaultAuditLogger = (eventType, payload) => {
  console.log(`[RecruitmentAudit] ${eventType}`, payload);
};

export const ctx = {
  prisma: new PrismaClient(),
  scoringService: CandidateScoringService,
  templateService: MessageTemplateService,
  auditLogger: defaultAuditLogger,
};

export const RECRUITMENT_READ_ROLES = ['hr', 'hiring_manager', 'executive', 'admin'];
export const RECRUITMENT_WRITE_ROLES = ['hr', 'admin'];
export const RECRUITMENT_MANAGER_REVIEW_ROLES = ['hiring_manager', 'hr', 'admin'];

export function __setRecruitmentTestDeps({
  prismaClient,
  candidateScoringService,
  messageTemplateService,
  auditLogger,
} = {}) {
  if (prismaClient) ctx.prisma = prismaClient;
  if (candidateScoringService) ctx.scoringService = candidateScoringService;
  if (messageTemplateService) ctx.templateService = messageTemplateService;
  if (auditLogger) ctx.auditLogger = auditLogger;
}

export function __resetRecruitmentTestDeps() {
  ctx.prisma = new PrismaClient();
  ctx.scoringService = CandidateScoringService;
  ctx.templateService = MessageTemplateService;
  ctx.auditLogger = defaultAuditLogger;
}

export function logRecruitmentAudit(req, eventType, payload = {}) {
  try {
    ctx.auditLogger(eventType, {
      at: new Date().toISOString(),
      actor_role:
        req.recruitmentAccess?.role || req.headers['x-user-role'] || req.user?.role || 'unknown',
      actor_id: req.user?.id || req.headers['x-user-id'] || null,
      route: req.originalUrl,
      method: req.method,
      ...payload,
    });
  } catch (auditError) {
    console.warn('Recruitment audit logging failed:', auditError.message);
  }
}
