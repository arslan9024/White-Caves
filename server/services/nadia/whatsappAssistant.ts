/**
 * WhatsApp Assistant Service — Phase 4D
 *
 * Provides:
 *  - Intent classification with confidence scoring
 *  - Escalation decisioning
 *  - Auto-response generation
 */

import {
  detectIntent,
  detectSentiment,
  extractEntities,
  calculateLeadScore,
  generateBotResponse,
  type Sentiment,
} from './messageProcessor.js';

export interface IntentClassificationResult {
  intent: string;
  confidence: number; // 0..1
  sentiment: Sentiment;
  entities: string[];
  leadScore: number;
  shouldEscalate: boolean;
  escalationReason: string | null;
}

export interface AutoResponseResult {
  classification: IntentClassificationResult;
  response: string;
  responseType: 'bot' | 'escalate_to_agent';
}

const ESCALATION_KEYWORDS = [
  'agent',
  'human',
  'manager',
  'complaint',
  'lawyer',
  'urgent',
  'speak to someone',
];

function detectEscalationRequest(message: string): boolean {
  const lower = message.toLowerCase();
  return ESCALATION_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Lightweight confidence estimator for rule-based intent classification.
 */
function estimateConfidence(intent: string, entities: string[], message: string): number {
  const msgLen = message.trim().length;
  const base = intent === 'general_inquiry' ? 0.45 : 0.65;
  const entityBoost = Math.min(entities.length * 0.08, 0.24);
  const lengthBoost = msgLen >= 30 ? 0.08 : msgLen >= 15 ? 0.05 : 0.02;
  return Math.max(0.2, Math.min(0.98, base + entityBoost + lengthBoost));
}

export function classifyWhatsAppIntent(message: string): IntentClassificationResult {
  const intent = detectIntent(message);
  const sentiment = detectSentiment(message);
  const entities = extractEntities(message);
  const confidence = estimateConfidence(intent, entities, message);

  const leadScore = calculateLeadScore({
    messageCount: 1,
    intent,
    sentiment,
    hasPhone: true,
    entities,
  });

  const explicitEscalation = detectEscalationRequest(message);
  const confidenceEscalation = confidence < 0.6;
  const intentEscalation = intent === 'complaint' || intent === 'legal_enquiry';
  const sentimentEscalation = sentiment === 'negative' && confidence < 0.75;

  const shouldEscalate =
    explicitEscalation || confidenceEscalation || intentEscalation || sentimentEscalation;

  let escalationReason: string | null = null;
  if (explicitEscalation) escalationReason = 'customer_requested_human';
  else if (intentEscalation) escalationReason = 'intent_requires_agent';
  else if (confidenceEscalation) escalationReason = 'low_intent_confidence';
  else if (sentimentEscalation) escalationReason = 'negative_sentiment';

  return {
    intent,
    confidence,
    sentiment,
    entities,
    leadScore,
    shouldEscalate,
    escalationReason,
  };
}

export function generateWhatsAppAutoResponse(input: {
  message: string;
  customerName?: string;
}): AutoResponseResult {
  const classification = classifyWhatsAppIntent(input.message);

  if (classification.shouldEscalate) {
    return {
      classification,
      response:
        `Thanks for your message${input.customerName ? `, ${input.customerName}` : ''}. ` +
        `I'm connecting you to a WhatsApp specialist right now for faster assistance.`,
      responseType: 'escalate_to_agent',
    };
  }

  const response = generateBotResponse({
    intent: classification.intent,
    sentiment: classification.sentiment,
    entities: classification.entities,
    customerName: input.customerName,
  });

  return {
    classification,
    response,
    responseType: 'bot',
  };
}
