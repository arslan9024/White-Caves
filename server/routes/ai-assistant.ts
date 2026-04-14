/**
 * AI Assistant API Routes
 * ───────────────────────
 * RESTful endpoints for the White Caves AI Assistant system.
 *
 * Base Path: /api/ai-assistant
 *
 * Endpoints:
 *   GET    /                       Registry of all assistants
 *   GET    /departments            Assistants grouped by department
 *   GET    /search?q=              Search assistants
 *   GET    /:id                    Single assistant info
 *   GET    /metrics/dashboard      Dashboard: counts, today's chats, top usage
 *
 *   POST   /chat                   Send a message to any assistant
 *   GET    /conversations          List user's conversations
 *   GET    /conversations/:id      Conversation history
 *
 *   POST   /lead-score/:leadId     Score a single lead (Lex)
 *   POST   /lead-score/batch       Batch-score multiple leads (Lex)
 *
 *   POST   /documents/generate     Generate a document (Docu)
 *
 *   GET    /market/insights        Market insights (Maven)
 *   GET    /market/forecast/:area  Price forecast for an area (Maven)
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { requirePermission, requireRole } from '../middleware/rbac.js';
import {
  // Registry
  getAllAssistants,
  getAssistantById,
  getAssistantsByDepartment,
  searchAssistants,
  getAssistantMetrics,
  // Chat
  chat,
  getConversationHistory,
  getUserConversations,
  // Lead scoring (Lex)
  scoreLead,
  batchScoreLeads,
  // Document generation (Docu)
  generateDocument,
  // Market analysis (Maven)
  getMarketInsights,
  getAreaForecast,
} from '../services/AIAssistantService.js';

const router = Router();

// ============================================================================
// ASSISTANT REGISTRY ENDPOINTS
// ============================================================================

/**
 * GET /api/ai-assistant
 * Returns all 27 AI assistant personas with their metadata
 */
router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const assistants = getAllAssistants();
    res.json({
      success: true,
      count: assistants.length,
      data: assistants,
    });
  })
);

/**
 * GET /api/ai-assistant/departments
 * Returns assistants grouped by department
 */
router.get(
  '/departments',
  asyncHandler(async (_req: Request, res: Response) => {
    const all = getAllAssistants();
    const grouped: Record<string, typeof all> = {};
    for (const a of all) {
      if (!grouped[a.department]) grouped[a.department] = [];
      grouped[a.department].push(a);
    }
    res.json({
      success: true,
      departments: Object.keys(grouped),
      data: grouped,
    });
  })
);

/**
 * GET /api/ai-assistant/search?q=marketing
 * Full-text search across assistant names, roles, departments, capabilities
 */
router.get(
  '/search',
  asyncHandler(async (req: Request, res: Response) => {
    const query = (req.query.q as string) || '';
    if (!query) {
      throw new AppError('Query parameter "q" is required', 400);
    }
    const results = searchAssistants(query);
    res.json({
      success: true,
      query,
      count: results.length,
      data: results,
    });
  })
);

/**
 * GET /api/ai-assistant/metrics/dashboard
 * Dashboard metrics: total assistants, active count, department distribution, today's chats
 */
router.get(
  '/metrics/dashboard',
  requirePermission('view_dashboard'),
  asyncHandler(async (_req: Request, res: Response) => {
    const metrics = await getAssistantMetrics();
    res.json({
      success: true,
      data: metrics,
    });
  })
);

/**
 * GET /api/ai-assistant/:id
 * Returns a single assistant's full information
 */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const assistant = getAssistantById(req.params.id);
    if (!assistant) {
      throw new AppError(`Assistant "${req.params.id}" not found`, 404);
    }
    res.json({
      success: true,
      data: assistant,
    });
  })
);

// ============================================================================
// CHAT ENDPOINTS
// ============================================================================

/**
 * POST /api/ai-assistant/chat
 * Send a message to any AI assistant and receive a response
 *
 * Body: { assistantId, message, conversationId?, context? }
 */
router.post(
  '/chat',
  asyncHandler(async (req: Request, res: Response) => {
    const { assistantId, message, conversationId, context } = req.body;

    if (!assistantId) throw new AppError('assistantId is required', 400);
    if (!message || typeof message !== 'string') throw new AppError('message (string) is required', 400);
    if (message.length > 4000) throw new AppError('Message too long (max 4000 chars)', 400);

    const userId = (req as any).user?.id || 'anonymous';
    const response = await chat(
      { assistantId, message, conversationId, context },
      userId
    );

    res.json({
      success: true,
      data: response,
    });
  })
);

/**
 * GET /api/ai-assistant/conversations
 * List all chat conversations for the current user
 */
router.get(
  '/conversations',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || 'anonymous';
    const conversations = getUserConversations(userId);
    res.json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  })
);

/**
 * GET /api/ai-assistant/conversations/:id
 * Get full message history for a conversation
 */
router.get(
  '/conversations/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || 'anonymous';
    const messages = getConversationHistory(req.params.id, userId);
    res.json({
      success: true,
      conversationId: req.params.id,
      count: messages.length,
      data: messages,
    });
  })
);

// ============================================================================
// LEAD SCORING ENDPOINTS (Lex)
// ============================================================================

/**
 * POST /api/ai-assistant/lead-score/:leadId
 * Score a single lead using behavioral analysis
 */
router.post(
  '/lead-score/:leadId',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { leadId } = req.params;
    const result = await scoreLead(leadId);
    res.json({
      success: true,
      data: result,
    });
  })
);

/**
 * POST /api/ai-assistant/lead-score/batch
 * Batch-score multiple leads
 * Body: { leadIds: string[] }
 */
router.post(
  '/lead-score/batch',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { leadIds } = req.body;
    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      throw new AppError('leadIds (non-empty array) is required', 400);
    }
    if (leadIds.length > 100) {
      throw new AppError('Maximum 100 leads per batch', 400);
    }

    const results = await batchScoreLeads(leadIds);
    const data: Record<string, unknown> = {};
    for (const [id, result] of results) {
      data[id] = result;
    }

    res.json({
      success: true,
      count: results.size,
      data,
    });
  })
);

// ============================================================================
// DOCUMENT GENERATION ENDPOINTS (Docu)
// ============================================================================

/**
 * POST /api/ai-assistant/documents/generate
 * Generate a Dubai real estate document from template
 * Body: { type, propertyId?, leadId?, tenantId?, customFields? }
 */
router.post(
  '/documents/generate',
  requirePermission('create_contracts'),
  asyncHandler(async (req: Request, res: Response) => {
    const { type, propertyId, leadId, tenantId, customFields } = req.body;

    if (!type) throw new AppError('Document type is required', 400);

    const validTypes = ['mou', 'form_f', 'ejari', 'noc', 'invoice', 'tenancy_contract'];
    if (!validTypes.includes(type)) {
      throw new AppError(`Invalid document type. Valid: ${validTypes.join(', ')}`, 400);
    }

    const userId = (req as any).user?.id || 'anonymous';
    const result = await generateDocument(
      { type, propertyId, leadId, tenantId, customFields },
      userId
    );

    res.json({
      success: true,
      data: result,
    });
  })
);

/**
 * GET /api/ai-assistant/documents/types
 * List all available document templates
 */
router.get(
  '/documents/types',
  asyncHandler(async (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: [
        { type: 'mou',              label: 'Memorandum of Understanding',   description: 'Initial buyer-seller agreement' },
        { type: 'form_f',           label: 'Form F (Sale Contract)',        description: 'DLD official sale contract' },
        { type: 'ejari',            label: 'Ejari Registration',            description: 'Tenancy registration with RERA' },
        { type: 'noc',              label: 'No Objection Certificate',      description: 'Developer NOC for resale' },
        { type: 'invoice',          label: 'Commission Invoice',            description: 'Agent commission and fee invoice' },
        { type: 'tenancy_contract', label: 'Tenancy Contract',              description: 'Full rental/lease agreement' },
      ],
    });
  })
);

// ============================================================================
// MARKET ANALYSIS ENDPOINTS (Maven)
// ============================================================================

/**
 * GET /api/ai-assistant/market/insights?area=Dubai%20Marina
 * Get market insights for Dubai real estate areas
 */
router.get(
  '/market/insights',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const area = req.query.area as string | undefined;
    const insights = getMarketInsights(area);
    res.json({
      success: true,
      count: insights.length,
      data: insights,
    });
  })
);

/**
 * GET /api/ai-assistant/market/forecast/:area
 * Get 3/6/12-month price forecast for an area
 */
router.get(
  '/market/forecast/:area',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const { area } = req.params;
    const forecast = getAreaForecast(decodeURIComponent(area));
    res.json({
      success: true,
      data: forecast,
    });
  })
);

export default router;
