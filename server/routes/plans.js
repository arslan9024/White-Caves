import express from 'express';
import { getPlanService } from '../../src/server/services/PlanService.js';
import { getPlanAIService } from '../../src/server/services/PlanAIService.js';
import logger from '../../src/server/lib/logger.js';

const router = express.Router();
const SAFE_PLAN_ID_REGEX = /^[a-zA-Z0-9_-]{1,128}$/;
const SAFE_PLAN_FILENAME_REGEX = /^[a-zA-Z0-9._-]+\.md$/;

let planService = null;
let planAIService = null;

async function initializePlanServices() {
  try {
    if (!planService) planService = await getPlanService();
    if (!planAIService) planAIService = getPlanAIService(process.env.ZOE_AI_MODEL || 'deepseek');
    logger.info('Plan services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize plan services', { error: error.message });
  }
}

function startTimer() {
  return Date.now();
}

function durationMs(startedAt) {
  return Date.now() - startedAt;
}

function validatePlanIdParam(req, res, next) {
  const { id } = req.params;
  if (!SAFE_PLAN_ID_REGEX.test(id)) {
    return res.status(400).json({ error: 'Invalid plan id format' });
  }
  next();
}

function isValidFilename(filename) {
  return SAFE_PLAN_FILENAME_REGEX.test(filename);
}

// Initialize services on first request
router.use(async (req, res, next) => {
  if (!planService || !planAIService) {
    await initializePlanServices();
  }
  next();
});

// POST /api/plans/create - Create new plan
router.post('/create', async (req, res) => {
  const startedAt = startTimer();
  try {
    if (!planService) {
      return res.status(503).json({ error: 'Plan service not available' });
    }

    const { filename, content, metadata } = req.body;
    if (!filename || !content) {
      return res.status(400).json({ error: 'filename and content required' });
    }
    if (!isValidFilename(filename)) {
      return res.status(400).json({ error: 'Invalid filename. Use a simple .md filename only.' });
    }

    const result = await planService.createPlan(filename, content, metadata || {});
    logger.info(`Plan created: ${filename}`, {
      planId: result.id,
      durationMs: durationMs(startedAt),
    });
    res.status(201).json(result);
  } catch (error) {
    logger.error('Plan creation failed', {
      error: error.message,
      durationMs: durationMs(startedAt),
    });
    res.status(500).json({ error: error.message });
  }
});

// GET /api/plans/list - List all plans
router.get('/list', async (req, res) => {
  const startedAt = startTimer();
  try {
    if (!planService) {
      return res.status(503).json({ error: 'Plan service not available' });
    }

    const { status, tags, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (tags) filter.tags = tags.split(',');
    if (search) filter.search = search;

    const plans = await planService.listPlans(filter);
    logger.info('Plans listed', { count: plans.length, durationMs: durationMs(startedAt) });
    res.json({ plans, count: plans.length });
  } catch (error) {
    logger.error('Plans retrieval failed', {
      error: error.message,
      durationMs: durationMs(startedAt),
    });
    res.status(500).json({ error: error.message });
  }
});

// GET /api/plans/search/:query - Search plans
router.get('/search/:query', async (req, res) => {
  const startedAt = startTimer();
  try {
    if (!planService) {
      return res.status(503).json({ error: 'Plan service not available' });
    }

    const results = await planService.searchPlans(req.params.query);
    logger.info(`Plans searched: ${req.params.query}`, {
      count: results.length,
      durationMs: durationMs(startedAt),
    });
    res.json({ results, count: results.length });
  } catch (error) {
    logger.error('Plan search failed', { error: error.message, durationMs: durationMs(startedAt) });
    res.status(500).json({ error: error.message });
  }
});

// GET /api/plans/stats - Get plan statistics
router.get('/stats', async (req, res) => {
  const startedAt = startTimer();
  try {
    if (!planService) {
      return res.status(503).json({ error: 'Plan service not available' });
    }

    const stats = await planService.getPlanStats();
    logger.info('Plan statistics retrieved', { durationMs: durationMs(startedAt) });
    res.json(stats);
  } catch (error) {
    logger.error('Plan stats retrieval failed', {
      error: error.message,
      durationMs: durationMs(startedAt),
    });
    res.status(500).json({ error: error.message });
  }
});

// GET /api/plans/ai-status - Check AI model availability
router.get('/ai-status', async (req, res) => {
  const startedAt = startTimer();
  try {
    if (!planAIService) {
      return res.status(503).json({ error: 'AI service not initialized' });
    }

    const deepseekAvailable = await planAIService.checkDeepseekAvailability();
    const ollamaAvailable = await planAIService.checkOllamaAvailability();
    const currentModel = process.env.ZOE_AI_MODEL || 'deepseek';

    logger.info('AI status checked', {
      deepseekAvailable,
      ollamaAvailable,
      currentModel,
      durationMs: durationMs(startedAt),
    });

    res.json({
      deepseekAvailable,
      ollamaAvailable,
      currentModel,
      availableModels: [deepseekAvailable && 'deepseek', ollamaAvailable && 'ollama'].filter(
        Boolean
      ),
    });
  } catch (error) {
    logger.error('Failed to check AI status', {
      error: error.message,
      durationMs: durationMs(startedAt),
    });
    res.status(500).json({ error: error.message });
  }
});

// POST /api/plans/set-ai-model - Switch AI model
router.post('/set-ai-model', async (req, res) => {
  const startedAt = startTimer();
  try {
    const { model } = req.body;

    if (!['deepseek', 'ollama'].includes(model)) {
      return res
        .status(400)
        .json({ error: 'Invalid model specified. Use "deepseek" or "ollama".' });
    }

    // Check model availability before switching
    if (model === 'deepseek') {
      const isAvailable = await planAIService.checkDeepseekAvailability();
      if (!isAvailable) {
        return res.status(400).json({ error: 'DeepSeek API key not configured' });
      }
    }

    if (model === 'ollama') {
      const isAvailable = await planAIService.checkOllamaAvailability();
      if (!isAvailable) {
        return res
          .status(400)
          .json({
            error: 'Ollama service not available. Ensure it is running on the configured host.',
          });
      }
    }

    // Update current model in service and environment
    process.env.ZOE_AI_MODEL = model;
    if (planAIService) {
      planAIService.setModel(model);
    }

    logger.info(`AI model switched to: ${model}`, { durationMs: durationMs(startedAt) });
    res.json({ success: true, model, message: `Switched to ${model}` });
  } catch (error) {
    logger.error('Failed to set AI model', {
      error: error.message,
      durationMs: durationMs(startedAt),
    });
    res.status(500).json({ error: error.message });
  }
});

// POST /api/plans/generate - Generate plan with AI
router.post('/generate', async (req, res) => {
  const startedAt = startTimer();
  try {
    if (!planService || !planAIService) {
      return res.status(503).json({ error: 'Plan services not available' });
    }

    const { planType, requirements, filename } = req.body;
    if (!planType || !requirements) {
      return res.status(400).json({ error: 'planType and requirements required' });
    }

    const generatedContent = await planAIService.generatePlan(planType, requirements);
    const generatedFilename = filename || `${planType.toLowerCase().replace(/\s+/g, '-')}.md`;
    if (!isValidFilename(generatedFilename)) {
      return res.status(400).json({ error: 'Invalid generated filename' });
    }

    logger.info(`Plan generated with AI: ${planType}`, { durationMs: durationMs(startedAt) });
    res.json({
      content: generatedContent.content,
      filename: generatedFilename,
      aiModel: generatedContent.model,
    });
  } catch (error) {
    logger.error('Plan generation failed', {
      error: error.message,
      durationMs: durationMs(startedAt),
    });
    res.status(500).json({ error: error.message });
  }
});

// POST /api/plans/merge - Merge plans
router.post('/merge', async (req, res) => {
  const startedAt = startTimer();
  try {
    if (!planService) {
      return res.status(503).json({ error: 'Plan service not available' });
    }

    const { planIds, outputFilename, metadata } = req.body;
    if (!planIds || planIds.length < 2 || !outputFilename) {
      return res.status(400).json({ error: 'planIds (2+), outputFilename required' });
    }
    if (!isValidFilename(outputFilename)) {
      return res.status(400).json({ error: 'Invalid output filename' });
    }
    if (!planIds.every(id => SAFE_PLAN_ID_REGEX.test(id))) {
      return res.status(400).json({ error: 'Invalid plan id in planIds' });
    }

    const result = await planService.mergePlans(planIds, outputFilename, metadata);
    logger.info(`Plans merged: ${planIds.join(', ')}`, { durationMs: durationMs(startedAt) });
    res.status(201).json(result);
  } catch (error) {
    logger.error('Plan merge failed', { error: error.message, durationMs: durationMs(startedAt) });
    res.status(500).json({ error: error.message });
  }
});

// GET /api/plans/:id - Read specific plan
router.get('/:id', validatePlanIdParam, async (req, res) => {
  const startedAt = startTimer();
  try {
    if (!planService) {
      return res.status(503).json({ error: 'Plan service not available' });
    }

    const plan = await planService.readPlan(req.params.id);
    logger.info(`Plan read: ${req.params.id}`, { durationMs: durationMs(startedAt) });
    res.json(plan);
  } catch (error) {
    logger.error('Plan read failed', { error: error.message, durationMs: durationMs(startedAt) });
    res.status(404).json({ error: error.message });
  }
});

// PUT /api/plans/:id - Update plan
router.put('/:id', validatePlanIdParam, async (req, res) => {
  const startedAt = startTimer();
  try {
    if (!planService) {
      return res.status(503).json({ error: 'Plan service not available' });
    }

    const { content, metadata } = req.body;
    const result = await planService.updatePlan(req.params.id, { content, metadata });
    logger.info(`Plan updated: ${req.params.id}`, { durationMs: durationMs(startedAt) });
    res.json(result);
  } catch (error) {
    logger.error('Plan update failed', { error: error.message, durationMs: durationMs(startedAt) });
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/plans/:id - Delete plan
router.delete('/:id', validatePlanIdParam, async (req, res) => {
  const startedAt = startTimer();
  try {
    if (!planService) {
      return res.status(503).json({ error: 'Plan service not available' });
    }

    const result = await planService.deletePlan(req.params.id);
    logger.info(`Plan deleted: ${req.params.id}`, { durationMs: durationMs(startedAt) });
    res.json(result);
  } catch (error) {
    logger.error('Plan deletion failed', {
      error: error.message,
      durationMs: durationMs(startedAt),
    });
    res.status(500).json({ error: error.message });
  }
});

// POST /api/plans/:id/improve - Improve plan with AI
router.post('/:id/improve', validatePlanIdParam, async (req, res) => {
  const startedAt = startTimer();
  try {
    if (!planService || !planAIService) {
      return res.status(503).json({ error: 'Plan services not available' });
    }

    const plan = await planService.readPlan(req.params.id);
    const { focusAreas } = req.body;

    const safeFocusAreas = Array.isArray(focusAreas)
      ? focusAreas.filter(item => typeof item === 'string').slice(0, 20)
      : [];

    const improved = await planAIService.improvePlan(plan.content, safeFocusAreas);
    logger.info(`Plan improved with AI: ${req.params.id}`, { durationMs: durationMs(startedAt) });
    res.json({
      planId: req.params.id,
      improvedContent: improved.content,
      aiModel: improved.model,
    });
  } catch (error) {
    logger.error('Plan improvement failed', {
      error: error.message,
      durationMs: durationMs(startedAt),
    });
    res.status(500).json({ error: error.message });
  }
});

// POST /api/plans/:id/summarize - Summarize plan with AI
router.post('/:id/summarize', validatePlanIdParam, async (req, res) => {
  const startedAt = startTimer();
  try {
    if (!planService || !planAIService) {
      return res.status(503).json({ error: 'Plan services not available' });
    }

    const plan = await planService.readPlan(req.params.id);
    const summary = await planAIService.summarizePlan(plan.content);

    logger.info(`Plan summarized: ${req.params.id}`, { durationMs: durationMs(startedAt) });
    res.json({
      planId: req.params.id,
      summary: summary.content,
      aiModel: summary.model,
    });
  } catch (error) {
    logger.error('Plan summarization failed', {
      error: error.message,
      durationMs: durationMs(startedAt),
    });
    res.status(500).json({ error: error.message });
  }
});

export default router;
