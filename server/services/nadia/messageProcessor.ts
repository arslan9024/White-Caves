/**
 * NADIA Message Processor - Mock NLP Services
 * Handles intent detection, lead scoring, sentiment analysis, entity extraction
 * In production, these would be replaced with real NLP engines (Nina for NLP, Meta APIs for sentiment)
 */
import { createLogger } from '../../utils/logger.js';

const log = createLogger('MessageProcessor');

// ============================================================================
// INTENT DETECTION
// ============================================================================

export interface IntentResult {
  intent: string;
  confidence: number;
}

// Mock intent keywords (in production, would use real NLP)
const INTENT_KEYWORDS: Record<string, string[]> = {
  property_search: [
    'property',
    'apartment',
    'villa',
    'land',
    'house',
    'home',
    'apartment',
    'penthouse',
    'commercial',
    'search',
    'looking',
    'find',
  ],
  schedule_tour: [
    'tour',
    'visit',
    'see',
    'view',
    'schedule',
    'appointment',
    'time',
    'when',
    'available',
    'book',
  ],
  information_request: [
    'price',
    'cost',
    'bedrooms',
    'beds',
    'baths',
    'specifications',
    'specs',
    'details',
    'amenities',
    'facilities',
    'area',
    'size',
  ],
  make_offer: [
    'offer',
    'negotiate',
    'buy',
    'purchase',
    'price',
    'interested',
    'proceed',
    'next step',
    'payment',
  ],
  financing: [
    'loan',
    'mortgage',
    'finance',
    'payment plan',
    'emi',
    'installment',
    'funding',
    'credit',
  ],
  legal_enquiry: ['contract', 'deed', 'registration', 'legal', 'authorization', 'documents', 'paperwork'],
  complaint: ['issue', 'problem', 'help', 'urgent', 'error', 'broken', 'not working', 'complaint'],
};

/**
 * Detect intent from customer message
 * Returns intent and confidence score
 */
export function detectIntent(messageContent: string): string {
  const lower = messageContent.toLowerCase();
  let bestMatch = 'general_inquiry';
  let highestKeywordCount = 0;

  // Score each intent based on keyword matches
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    const matchCount = keywords.filter((kw) => lower.includes(kw)).length;
    if (matchCount > highestKeywordCount) {
      highestKeywordCount = matchCount;
      bestMatch = intent;
    }
  }

  return highestKeywordCount > 0 ? bestMatch : 'general_inquiry';
}

// ============================================================================
// SENTIMENT ANALYSIS
// ============================================================================

const POSITIVE_KEYWORDS = [
  'good',
  'great',
  'love',
  'amazing',
  'perfect',
  'excellent',
  'wonderful',
  'fantastic',
  'interested',
  'excited',
  'happy',
];
const NEGATIVE_KEYWORDS = [
  'bad',
  'hate',
  'terrible',
  'awful',
  'ugly',
  'disappointing',
  'poor',
  'worst',
  'angry',
  'frustrated',
];
const NEUTRAL_KEYWORDS = ['ok', 'fine', 'alright', 'maybe', 'perhaps', 'could', 'might'];

export type Sentiment = 'positive' | 'neutral' | 'negative';

/**
 * Detect sentiment from message
 * Returns sentiment classification
 */
export function detectSentiment(messageContent: string): Sentiment {
  const lower = messageContent.toLowerCase();

  const positiveCount = POSITIVE_KEYWORDS.filter((w) => lower.includes(w)).length;
  const negativeCount = NEGATIVE_KEYWORDS.filter((w) => lower.includes(w)).length;
  const neutralCount = NEUTRAL_KEYWORDS.filter((w) => lower.includes(w)).length;

  // If no matches, return neutral
  if (positiveCount === 0 && negativeCount === 0 && neutralCount === 0) {
    return 'neutral';
  }

  if (positiveCount > negativeCount && positiveCount > neutralCount) {
    return 'positive';
  }
  if (negativeCount > positiveCount && negativeCount > neutralCount) {
    return 'negative';
  }
  return 'neutral';
}

// ============================================================================
// ENTITY EXTRACTION
// ============================================================================

export interface ExtractedEntities {
  propertyType?: string;
  bedrooms?: number;
  priceRange?: string;
  location?: string;
  amenities?: string[];
}

const PROPERTY_TYPES = ['villa', 'apartment', 'studio', 'penthouse', 'townhouse', 'land', 'commercial'];
const LOCATIONS = [
  'dubai marina',
  'downtown dubai',
  'palm jumeirah',
  'jbr',
  'deira',
  'bur dubai',
  'ajman',
  'dubai hills',
  'emirates hills',
];
const AMENITIES = [
  'pool',
  'gym',
  'parking',
  'garden',
  'balcony',
  'maid room',
  'laundry',
  'ac',
  'furnished',
];

/**
 * Extract key entities from message
 * Returns array of identified entities
 */
export function extractEntities(messageContent: string): string[] {
  const lower = messageContent.toLowerCase();
  const entities: string[] = [];

  // Check property types
  for (const type of PROPERTY_TYPES) {
    if (lower.includes(type)) {
      entities.push(`property_type:${type}`);
      break; // Only take first matching type
    }
  }

  // Check locations
  for (const location of LOCATIONS) {
    if (lower.includes(location)) {
      entities.push(`location:${location}`);
      break; // Only take first matching location
    }
  }

  // Check for bedroom mentions (e.g., "2 bed", "3br")
  const bedroomMatch = lower.match(/(\d+)\s*(?:bed|br|bedroom)/i);
  if (bedroomMatch) {
    entities.push(`bedrooms:${bedroomMatch[1]}`);
  }

  // Check for price mentions
  if (lower.match(/\d+\s*(?:million|lakh|thousand|k)/) || lower.match(/aed\s*\d+/i)) {
    entities.push('price_mentioned');
  }

  // Check amenities
  for (const amenity of AMENITIES) {
    if (lower.includes(amenity)) {
      entities.push(`amenity:${amenity}`);
    }
  }

  return entities;
}

// ============================================================================
// LEAD SCORING
// ============================================================================

export interface ScoringFactor {
  messageCount?: number;
  intent?: string;
  sentiment?: Sentiment;
  hasPhone?: boolean;
  hoursActive?: number;
  responseTime?: number; // minutes
  entities?: string[];
}

/**
 * Calculate lead score based on engagement and intent signals
 * Returns score 0-100
 */
export function calculateLeadScore(factors: ScoringFactor): number {
  let score = 50; // Base score

  // Intent bonus
  const intentBonuses: Record<string, number> = {
    make_offer: 25,
    schedule_tour: 20,
    financing: 15,
    information_request: 10,
    property_search: 5,
    general_inquiry: 0,
    complaint: -5,
  };
  const intentBonus = intentBonuses[factors.intent || 'general_inquiry'] || 0;
  score += intentBonus;

  // Message frequency bonus
  if ((factors.messageCount || 0) > 15) score += 20;
  else if ((factors.messageCount || 0) > 10) score += 15;
  else if ((factors.messageCount || 0) > 5) score += 10;
  else if ((factors.messageCount || 0) > 3) score += 5;

  // Sentiment bonus
  if (factors.sentiment === 'positive') score += 15;
  else if (factors.sentiment === 'negative') score -= 10;

  // Phone presence bonus
  if (factors.hasPhone) score += 5;

  // Entities bonus (more specific = higher quality lead)
  const entityCount = (factors.entities || []).length;
  if (entityCount >= 3) score += 15;
  else if (entityCount === 2) score += 10;
  else if (entityCount === 1) score += 5;

  // Engagement bonus (if they're actively communicating)
  if ((factors.hoursActive || 0) < 1) score += 10; // Fast engagement
  else if ((factors.hoursActive || 0) < 24) score += 5;

  // Response time bonus (faster = better quality)
  if ((factors.responseTime || 0) < 5) score += 10;
  else if ((factors.responseTime || 0) < 15) score += 5;

  // Normalize to 0-100 range
  return Math.max(0, Math.min(100, score));
}

// ============================================================================
// BOT RESPONSE GENERATOR (For automated replies)
// ============================================================================

export interface BotResponseContext {
  intent: string;
  entities: string[];
  sentiment: Sentiment;
  customerName?: string;
}

/**
 * Generate bot response based on intent and entities
 * Used for mock automated responses
 */
export function generateBotResponse(context: BotResponseContext): string {
  const { intent, entities, customerName } = context;
  const greeting = customerName ? `Hi ${customerName}! ` : 'Hello! ';

  const responses: Record<string, string> = {
    property_search: `${greeting}I'd love to help you find the perfect property! To narrow down options, could you share:
    â€¢ Type of property (villa, apartment, townhouse)?
    â€¢ Preferred location?
    â€¢ Budget range?
    Looking forward to assisting you! ðŸ `,

    schedule_tour: `${greeting}Great! I can help you schedule a property tour. Please let me know:
    â€¢ Which property interests you?
    â€¢ Your preferred date and time?
    â€¢ Any specific time that works best for you?
    I'll get that arranged right away! ðŸ“…`,

    information_request: `${greeting}Here's the information you're looking for! Would you like me to:
    â€¢ Provide detailed property specs?
    â€¢ Show you similar properties?
    â€¢ Schedule a viewing?
    â€¢ Connect you with a property specialist?
    Let me know how else I can help! â„¹ï¸`,

    make_offer: `${greeting}Excellent! I'm excited about your interest. To move forward:
    â€¢ Let me connect you with our sales specialist
    â€¢ We'll discuss pricing and terms
    â€¢ Get your offer documented
    Our team will contact you within the next hour! ðŸŽ‰`,

    financing: `${greeting}Great question! We offer flexible financing options. Our finance specialist can help with:
    â€¢ Mortgage/loan options
    â€¢ Payment plans
    â€¢ EMI calculations
    â€¢ ROI projections
    Shall I connect you with our finance expert? ðŸ’°`,

    legal_enquiry: `${greeting}Important documents - I'll help! Our legal team handles:
    â€¢ Property deeds and registration
    â€¢ Contracts and agreements
    â€¢ Ownership transfer
    â€¢ All compliance requirements
    Connecting you with our legal specialist now... âš–ï¸`,

    complaint: `${greeting}Sorry to hear you're experiencing an issue. Our support team is here to help:
    â€¢ What's the specific problem?
    â€¢ How can we assist?
    â€¢ Any solution preferences?
    I'm escalating this to our manager immediately! ðŸ†˜`,

    general_inquiry: `${greeting}Thanks for reaching out! I'm here to assist with:
    â€¢ Property search and information
    â€¢ Schedule tours and viewings
    â€¢ Financing and legal assistance
    â€¢ General inquiries about our services
    How can I help you today? ðŸ˜Š`,
  };

  return responses[intent] || responses.general_inquiry;
}

// ============================================================================
// CONVERSATION STATE ANALYZER
// ============================================================================

export interface ConversationAnalysis {
  activePhase: 'discovery' | 'engagement' | 'consideration' | 'decision' | 'closing';
  nextAction: string;
  estimatedDaysToClose: number;
}

/**
 * Analyze conversation state and suggest next action
 */
export function analyzeConversationState(
  messageCount: number,
  intent: string,
  sentiment: Sentiment,
  leadScore: number
): ConversationAnalysis {
  // Determine phase based on message count and intent
  let phase: 'discovery' | 'engagement' | 'consideration' | 'decision' | 'closing';

  if (messageCount === 0) {
    phase = 'discovery';
  } else if (messageCount < 3) {
    phase = 'engagement';
  } else if (messageCount < 7) {
    phase = 'consideration';
  } else if (messageCount < 12) {
    phase = 'decision';
  } else {
    phase = 'closing';
  }

  // Suggest next action based on state
  const actions: Record<string, string> = {
    discovery: 'Send property recommendations matching their search',
    engagement: 'Schedule a property tour or video call',
    consideration: 'Provide detailed comparison with similar properties',
    decision: 'Offer financing options and prepare documentation',
    closing: 'Connect with sales manager for final negotiations',
  };

  // Estimate days to close based on lead score and phase
  const baseEstimate = {
    discovery: 14,
    engagement: 10,
    consideration: 7,
    decision: 3,
    closing: 1,
  };

  const scoreMultiplier = leadScore < 40 ? 2 : leadScore < 70 ? 1.2 : 1;
  const sentimentMultiplier = sentiment === 'negative' ? 1.5 : sentiment === 'positive' ? 0.8 : 1;

  const estimatedDays = Math.round(
    baseEstimate[phase] * scoreMultiplier * sentimentMultiplier
  );

  return {
    activePhase: phase,
    nextAction: actions[phase],
    estimatedDaysToClose: estimatedDays,
  };
}
