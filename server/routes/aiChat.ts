import { Router, type Request, type Response } from 'express';

const router = Router();

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

function fallbackReply(messages: Array<{ role: string; content: string }>): string {
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

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const ip = (req.ip ?? req.socket?.remoteAddress ?? '0.0.0.0').replace('::ffff:', '');

  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
    return;
  }

  const { messages } = req.body as {
    messages?: Array<{ role: string; content: string }>;
    sessionId?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }

  const validMessages = messages.filter(
    m => m && typeof m.role === 'string' && typeof m.content === 'string'
  );

  if (validMessages.length === 0) {
    res.status(400).json({ error: 'No valid messages provided' });
    return;
  }

  const ollamaHost = process.env.OLLAMA_HOST ?? 'http://localhost:11434';
  const ollamaModel = process.env.OLLAMA_MODEL ?? 'llama3.2';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const ollamaRes = await fetch(`${ollamaHost}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel,
        messages: [SYSTEM_MESSAGE, ...validMessages],
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!ollamaRes.ok) {
      throw new Error(`Ollama returned ${ollamaRes.status}`);
    }

    const data = (await ollamaRes.json()) as { message?: { content?: string } };
    const reply = data?.message?.content ?? fallbackReply(validMessages);
    res.json({ reply, source: 'ollama' });
  } catch {
    res.json({ reply: fallbackReply(validMessages), source: 'fallback' });
  }
});

export default router;
