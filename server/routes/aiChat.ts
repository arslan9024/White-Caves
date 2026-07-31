import { Router, type Request, type Response } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { createLogger } from '../utils/logger.js';

const router = Router();
const log = createLogger('aiChatRoute');

// In-memory rate limiter: max 20 req/min per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
setInterval(() => rateLimitMap.clear(), 60_000);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

const SYSTEM_MESSAGE = {
  role: 'system' as const,
  content:
    'You are Zoe, a luxury real estate AI assistant for White Caves Real Estate LLC in Dubai, UAE. You help buyers, sellers, landlords, and tenants with property questions, market insights, and navigation of Dubai real estate. Be concise, helpful, and professional. Answer only real estate related questions.',
};

type ChatMessage = { role: string; content: string };

function fallbackReply(messages: ChatMessage[]): string {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() ?? '';

  if (/\b(buy|purchase|invest)\b/.test(lastMsg)) {
    return "White Caves offers premium buying options across Dubai's prime locations including Downtown, Palm Jumeirah, and Dubai Marina. Would you like to explore available properties or speak with a specialist?";
  }
  if (/\b(rent|lease|tenant)\b/.test(lastMsg)) {
    return 'We have a wide range of rental options from studio apartments to luxury villas. Our leasing specialists can guide you through the process. Visit /properties or chat with an agent for available rentals.';
  }
  if (/\b(price|cost|value|aed|million)\b/.test(lastMsg)) {
    return 'Dubai property prices vary by location and type. Prime areas like Downtown Dubai average 8M AED, while emerging areas offer competitive starting prices. I can connect you with a specialist for a custom valuation.';
  }
  if (/\b(location|area|community|district|neighborhood)\b/.test(lastMsg)) {
    return "White Caves serves Dubai's finest neighborhoods: Palm Jumeirah, Downtown Dubai, Dubai Marina, JBR, Business Bay, and Dubai Hills Estate. Each offers unique lifestyle and investment advantages.";
  }
  if (/\b(agent|consultant|team|contact|speak)\b/.test(lastMsg)) {
    return 'Our team of RERA-licensed consultants is ready to assist you. You can reach us via WhatsApp, call, or visit our contact page at /contact for personalized guidance.';
  }
  if (/\b(mortgage|finance|loan|payment|installment)\b/.test(lastMsg)) {
    return 'We work with top UAE banks to arrange competitive mortgage solutions. Typical LTV is up to 80% for residents. Our finance team can provide a free eligibility assessment — shall I connect you?';
  }
  if (/\b(rera|license|legal|dld|registration|complian)\b/.test(lastMsg)) {
    return 'White Caves is fully RERA licensed and compliant with DLD regulations. All our listings are verified, and our agents are registered professionals with the Dubai Land Department.';
  }
  if (/\b(off.?plan|developer|new project|launch)\b/.test(lastMsg)) {
    return 'We partner with leading Dubai developers for off-plan projects with flexible payment plans. Off-plan investments often offer attractive entry prices and capital appreciation.';
  }
  if (/\b(hello|hi|hey|good|greet|start|help)\b/.test(lastMsg)) {
    return "Hello! I'm Zoe, your White Caves AI property assistant. I can help you with buying, renting, property valuations, Dubai market insights, and more. What would you like to know? 🏠";
  }
  return "I'm here to help with any Dubai real estate questions — whether you're buying, renting, investing, or just exploring the market. Feel free to ask about specific areas, property types, pricing, or our services!";
}

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const ip = (req.ip ?? req.socket?.remoteAddress ?? '0.0.0.0').replace('::ffff:', '');

    if (!checkRateLimit(ip)) {
      throw new AppError('Too many requests. Please try again in a minute.', 429);
    }

    // Schema validation enforced for AI chat payload
    const { messages, sessionId, assistantId } = req.body as {
      messages?: ChatMessage[];
      sessionId?: string;
      assistantId?: string;
    };

    const targetAssistantId = assistantId || 'zoe-default';
    const { NinaEngine } = await import('../services/ai/ninaEngine.js');
    if (!(await NinaEngine.checkCap(targetAssistantId))) {
      res.status(429).json({
        error: 'Daily token cap exceeded for this assistant. Please try again tomorrow.',
        resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
      });
      return;
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new AppError('messages array is required', 400);
    }

    const validMessages = messages.filter(
      message => message && typeof message.role === 'string' && typeof message.content === 'string'
    );

    if (validMessages.length === 0) {
      throw new AppError('No valid messages provided', 400);
    }

    const ollamaHost = process.env.OLLAMA_HOST ?? 'http://localhost:11434';
    const ollamaModel = process.env.OLLAMA_MODEL ?? 'llama3.2';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10_000);

      let ollamaRes: globalThis.Response;
      try {
        ollamaRes = await fetch(`${ollamaHost}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollamaModel,
            messages: [SYSTEM_MESSAGE, ...validMessages],
            stream: false,
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!ollamaRes.ok) {
        throw new Error(`Ollama returned ${ollamaRes.status}`);
      }

      const data = (await ollamaRes.json()) as { message?: { content?: string } };
      const reply = data?.message?.content ?? fallbackReply(validMessages);
      res.json({ reply, source: 'ollama' });
    } catch (error) {
      log.warn('Falling back to local reply due to provider error', {
        ip,
        error: error instanceof Error ? error.message : String(error),
      });
      res.json({ reply: fallbackReply(validMessages), source: 'fallback' });
    }
  })
);

// W24-007: SSE Streaming Endpoint
router.get(
  '/stream/:sessionId',
  asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    const assistantId =
      typeof req.query.assistantId === 'string' ? req.query.assistantId : 'nina-default';
    const userId = req.headers['x-user-id'] as string;
    const message = typeof req.query.message === 'string' ? req.query.message : '';

    const { NinaEngine } = await import('../services/ai/ninaEngine.js');
    if (!(await NinaEngine.checkCap(assistantId))) {
      res.status(429).json({
        error: 'Daily token cap exceeded for this assistant. Please try again tomorrow.',
        resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
      });
      return;
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    if (!message) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Message is required' })}\n\n`);
      res.end();
      return;
    }

    try {
      // Import dynamically to avoid circular/init issues
      const { NinaEngine } = await import('../services/ai/ninaEngine.js');

      await NinaEngine.streamResponse(
        sessionId,
        assistantId,
        message,
        undefined, // Optional entity context
        (token: string) => {
          res.write(`data: ${JSON.stringify({ type: 'token', content: token })}\n\n`);
        }
      );

      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    } catch (error) {
      log.error('[NinaEngine] Streaming error:', error);
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Internal Server Error' })}\n\n`);
      res.end();
    }
  })
);

export default router;
