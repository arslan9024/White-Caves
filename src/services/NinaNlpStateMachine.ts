/**
 * NinaNlpStateMachine — Wave 51 GOAL-052
 * Multi-turn Nina AI chatbot NLP state machine with intent classification
 * White Caves Real Estate LLC — WhatsApp AI Suite
 */

export type Intent =
  | 'property_inquiry'
  | 'price_inquiry'
  | 'viewing_request'
  | 'agent_handoff'
  | 'rental_inquiry'
  | 'offplan_inquiry'
  | 'golden_visa'
  | 'mortgage_inquiry'
  | 'greeting'
  | 'farewell'
  | 'complaint'
  | 'unknown';

export type Sentiment = 'positive' | 'neutral' | 'negative' | 'urgent';

export type LeadQuality = 'hot' | 'warm' | 'cold';

export interface NinaMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface NinaState {
  conversationId: string;
  messages: NinaMessage[];
  detectedIntent: Intent;
  sentiment: Sentiment;
  leadScore: number; // 0-100
  leadQuality: LeadQuality;
  extractedData: {
    budget?: string;
    bedrooms?: number;
    community?: string;
    moveInDate?: string;
    nationality?: string;
    purpose?: 'investment' | 'end_use' | 'rental';
  };
  requiresHandoff: boolean;
  handoffReason?: string;
  language: 'en' | 'ar';
}

// Intent keyword map
const INTENT_PATTERNS: Record<Intent, RegExp[]> = {
  property_inquiry: [/looking for|need a|want (a|to buy|to rent)|searching|interested in|show me|available/i],
  price_inquiry: [/how much|price|cost|aed|million|budget|afford|valuation/i],
  viewing_request: [/viewing|visit|see the|show|appointment|schedule|book|when can/i],
  agent_handoff: [/speak (to|with)|agent|manager|human|person|call me|whatsapp/i],
  rental_inquiry: [/rent|lease|tenancy|ejari|landlord|tenant/i],
  offplan_inquiry: [/off.?plan|launch|handover|payment plan|oqood|developer|emaar|damac/i],
  golden_visa: [/golden visa|residency|2 million|2m|visa eligib/i],
  mortgage_inquiry: [/mortgage|loan|finance|bank|ltv|interest rate|emi/i],
  greeting: [/^(hi|hello|hey|good morning|good afternoon|good evening|salaam|مرحبا|السلام)/i],
  farewell: [/(bye|goodbye|thanks|thank you|shukran|done|that's all)/i],
  complaint: [/(problem|issue|unhappy|complaint|disappointed|bad service|not satisfied)/i],
  unknown: [],
};

const SENTIMENT_PATTERNS: Record<Sentiment, RegExp[]> = {
  positive: [/(great|excellent|perfect|love|amazing|interested|yes|definitely|sure)/i],
  urgent: [/(urgent|asap|immediately|today|now|quickly|fast)/i],
  negative: [/(not interested|no thanks|bad|terrible|awful|never mind)/i],
  neutral: [],
};

function detectIntent(text: string): Intent {
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS) as [Intent, RegExp[]][]) {
    if (intent === 'unknown') continue;
    if (patterns.some(p => p.test(text))) return intent;
  }
  return 'unknown';
}

function detectSentiment(text: string): Sentiment {
  for (const [sentiment, patterns] of Object.entries(SENTIMENT_PATTERNS) as [Sentiment, RegExp[]][]) {
    if (sentiment === 'neutral') continue;
    if (patterns.some(p => p.test(text))) return sentiment;
  }
  return 'neutral';
}

function detectLanguage(text: string): 'en' | 'ar' {
  return /[\u0600-\u06FF]/.test(text) ? 'ar' : 'en';
}

function extractBudget(text: string): string | undefined {
  const m = text.match(/(\d[\d,]*)\s*(million|m|aed|k)?/i);
  if (m) {
    const num = parseInt(m[1].replace(/,/g, ''));
    const unit = (m[2]||'').toLowerCase();
    if (unit === 'million' || unit === 'm') return `AED ${(num * 1_000_000).toLocaleString()}`;
    if (unit === 'k') return `AED ${(num * 1_000).toLocaleString()}`;
    if (num > 1_000) return `AED ${num.toLocaleString()}`;
  }
  return undefined;
}

function extractBedrooms(text: string): number | undefined {
  const m = text.match(/(\d)\s*(?:bed(?:room)?s?|br)/i);
  return m ? parseInt(m[1]) : undefined;
}

function calculateLeadScore(state: NinaState, intent: Intent, sentiment: Sentiment): number {
  let score = state.leadScore;
  const boosts: Record<Intent, number> = {
    viewing_request: 25, price_inquiry: 15, property_inquiry: 10,
    offplan_inquiry: 12, mortgage_inquiry: 15, golden_visa: 20,
    rental_inquiry: 8, greeting: 2, farewell: -5,
    agent_handoff: 10, complaint: -10, unknown: 0,
  };
  score += boosts[intent] ?? 0;
  if (sentiment === 'positive') score += 8;
  if (sentiment === 'urgent') score += 15;
  if (sentiment === 'negative') score -= 10;
  return Math.max(0, Math.min(100, score));
}

function getLeadQuality(score: number): LeadQuality {
  if (score >= 65) return 'hot';
  if (score >= 30) return 'warm';
  return 'cold';
}

function generateResponse(intent: Intent, state: NinaState, lang: 'en' | 'ar'): string {
  const responses: Record<Intent, string> = {
    greeting: "Hello! Welcome to White Caves Real Estate 🏡 I'm Nina, your AI property consultant. Are you looking to buy, rent, or invest in Dubai property?",
    property_inquiry: `Great! We have a wonderful selection of properties in Dubai's most sought-after communities — Palm Jumeirah, Downtown, Dubai Marina, and more. What's your preferred community, number of bedrooms, and budget?`,
    price_inquiry: `Our portfolio ranges from AED 800K studios to AED 150M+ ultra-luxury penthouses. Could you share your budget range and preferred community so I can find the perfect match for you?`,
    viewing_request: `Excellent! I'd love to arrange a viewing for you 📅 Please share your preferred date and time, and I'll coordinate with our senior agent immediately. We also offer virtual 360° tours!`,
    agent_handoff: `Of course! I'm connecting you with one of our senior property consultants right away. They'll reach out within 5 minutes. Is WhatsApp or phone call preferred?`,
    rental_inquiry: `We manage over 200 premium rental properties across Dubai 🏢 What's your preferred area, bedroom count, and budget per year? We handle all Ejari registration.`,
    offplan_inquiry: `We're official partners with EMAAR, DAMAC, NAKHEEL, and MERAAS for exclusive off-plan launches! Are you interested in investment or end-use? Post-handover payment plans available from 10% down.`,
    golden_visa: `Great news — purchasing AED 2M+ property qualifies you for the UAE 10-Year Golden Visa! I can walk you through our eligible projects and visa processing. Shall I?`,
    mortgage_inquiry: `We work with all major UAE banks offering mortgage rates from 3.49% p.a. (1-year fixed). Would you like a pre-qualification estimate? We need your income, nationality, and desired property price.`,
    farewell: `Thank you for chatting with White Caves! 🌟 I'll send you our property brochures via WhatsApp. Have a wonderful day!`,
    complaint: `I'm truly sorry to hear about your experience. Your satisfaction is our highest priority. I'm escalating this to our Senior Manager who will contact you within 30 minutes to resolve this personally.`,
    unknown: `Thank you for your message! Could you tell me more about what you're looking for? Whether buying, renting, or investing in Dubai property, I'm here to help 😊`,
  };
  if (lang === 'ar') return `شكرًا لتواصلك مع وايت كيفز! ${responses[intent]}`;
  return responses[intent];
}

/**
 * Process a user message through the Nina NLP state machine.
 * Returns the updated state and Nina's response.
 */
export function processNinaMessage(
  state: NinaState,
  userMessage: string
): { state: NinaState; response: string } {
  const lang = detectLanguage(userMessage);
  const intent = detectIntent(userMessage);
  const sentiment = detectSentiment(userMessage);
  const budget = extractBudget(userMessage);
  const bedrooms = extractBedrooms(userMessage);

  const newLeadScore = calculateLeadScore(state, intent, sentiment);
  const requiresHandoff = intent === 'agent_handoff' || intent === 'complaint' || newLeadScore >= 75;

  const updatedState: NinaState = {
    ...state,
    detectedIntent: intent,
    sentiment,
    leadScore: newLeadScore,
    leadQuality: getLeadQuality(newLeadScore),
    language: lang,
    requiresHandoff,
    handoffReason: requiresHandoff ? (intent === 'complaint' ? 'Complaint escalation' : 'High-intent buyer') : undefined,
    extractedData: {
      ...state.extractedData,
      ...(budget && { budget }),
      ...(bedrooms && { bedrooms }),
    },
    messages: [
      ...state.messages,
      { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
    ],
  };

  const response = generateResponse(intent, updatedState, lang);
  updatedState.messages.push({ role: 'assistant', content: response, timestamp: new Date().toISOString() });

  return { state: updatedState, response };
}

/**
 * Initialize a new Nina conversation state.
 */
export function createNinaState(conversationId?: string): NinaState {
  return {
    conversationId: conversationId ?? `nina-${Date.now()}`,
    messages: [],
    detectedIntent: 'unknown',
    sentiment: 'neutral',
    leadScore: 0,
    leadQuality: 'cold',
    extractedData: {},
    requiresHandoff: false,
    language: 'en',
  };
}

export default { processNinaMessage, createNinaState };
