/**
 * Vercel Serverless API — White Caves Real Estate
 * Uses Prisma (MongoDB) — unified with /server backend
 * Routes: health, properties, chatbot/test
 */
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
let prisma = null;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// CORS: restrict origins in production
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5000,http://localhost:3000')
  .split(',')
  .map(s => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, health checks)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true
}));
app.use(express.json());

// ─── Health ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    environment: 'production',
    platform: 'vercel',
    database: 'prisma-mongodb',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/system/health', async (_req, res) => {
  let dbConnected = false;
  try {
    await getPrismaClient().$runCommandRaw({ ping: 1 });
    dbConnected = true;
  } catch { /* db unreachable */ }

  res.json({
    server: { status: 'healthy', environment: 'production', platform: 'vercel' },
    database: {
      status: dbConnected ? 'connected' : 'not_connected',
      engine: 'prisma-mongodb',
    },
    firebase: {
      status: process.env.FIREBASE_SERVICE_ACCOUNT ? 'configured' : 'not_configured',
    },
    stripe: {
      status: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not_configured',
    },
  });
});

// ─── Properties ──────────────────────────────────────────────────────────
app.get('/api/properties', async (req, res) => {
  try {
    const {
      type, status, area, minPrice, maxPrice,
      search, page = '1', pageSize = '20',
      sortBy = 'createdAt', sortOrder = 'desc',
    } = req.query;

    const limit = Math.min(100, Math.max(1, parseInt(pageSize) || 20));
    const skip = (Math.max(1, parseInt(page) || 1) - 1) * limit;

    const where = {};
    if (type && type !== 'all') where.type = type;
    if (status && status !== 'all') where.status = status;
    if (area) where.area = area;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [properties, total] = await Promise.all([
      getPrismaClient().property.findMany({ where, skip, take: limit, orderBy: { [sortBy]: sortOrder } }),
      getPrismaClient().property.count({ where }),
    ]);

    res.json({
      success: true,
      properties,
      pagination: { page: parseInt(page) || 1, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Properties API error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await getPrismaClient().property.findUnique({ where: { id: req.params.id } });
    if (!property) return res.status(404).json({ success: false, error: 'Property not found' });
    res.json({ success: true, property });
  } catch (error) {
    console.error('Property detail API error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ─── Chatbot Test ────────────────────────────────────────────────────────
app.post('/api/chatbot/test', (req, res) => {
  const { message } = req.body;
  const isArabic = /[\u0600-\u06FF]/.test(message || '');
  const lang = isArabic ? 'ar' : 'en';
  const lower = (message || '').toLowerCase();

  const intents = {
    property_inquiry: ['property', 'apartment', 'villa', 'rent', 'buy', 'شقة', 'فيلا', 'إيجار', 'شراء'],
    viewing_request: ['view', 'visit', 'see', 'tour', 'معاينة', 'زيارة'],
    price_inquiry: ['price', 'cost', 'how much', 'سعر', 'كم'],
    agent_request: ['agent', 'contact', 'call', 'وكيل', 'اتصل'],
    greeting: ['hello', 'hi', 'مرحبا', 'السلام'],
  };

  let detected = 'general_inquiry';
  let confidence = 60;
  for (const [intent, kws] of Object.entries(intents)) {
    if (kws.some(k => lower.includes(k))) { detected = intent; confidence = 85; break; }
  }

  const responses = new Map([
    ['property_inquiry', { en: "I'd be happy to help you find the perfect property. What type are you looking for?", ar: "يسعدني مساعدتك في العثور على العقار المثالي. ما نوع العقار؟" }],
    ['viewing_request', { en: "I can schedule a viewing for you. When would be convenient?", ar: "يمكنني تحديد موعد للمعاينة. ما هو الوقت المناسب؟" }],
    ['price_inquiry', { en: "Our properties range from affordable to luxury. What's your budget?", ar: "تتراوح عقاراتنا من الميزانية المعقولة إلى الفاخرة. ما ميزانيتك؟" }],
    ['agent_request', { en: "I'll connect you with an experienced agent right away.", ar: "سأقوم بتوصيلك بأحد وكلائنا فوراً." }],
    ['greeting', { en: "Hello! Welcome to White Caves Real Estate. How can I assist you?", ar: "مرحباً! أهلاً بك في وايت كيفز العقارية. كيف يمكنني مساعدتك؟" }],
    ['general_inquiry', { en: "Thank you for your message. How can I help with your real estate needs?", ar: "شكراً لرسالتك. كيف يمكنني مساعدتك؟" }],
  ]);
  const entry = responses.get(detected);
  const responseText = entry ? (lang === 'ar' ? entry.ar : entry.en) : '';

  res.json({
    success: true,
    response: responseText,
    intent: detected,
    confidence,
    language: lang,
  });
});

// ─── Catch-all ───────────────────────────────────────────────────────────
// Express 5 + path-to-regexp requires a named wildcard or regex path.
app.all(/^\/api\/.*$/, (_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

export default app;
