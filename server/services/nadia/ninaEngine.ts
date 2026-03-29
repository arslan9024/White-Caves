/**
 * NINA NLP Engine - Advanced Intent & Context Processing
 * Core AI logic for understanding customer messages
 * Supports: Intent detection, entity extraction, sentiment analysis, confidence scoring
 * Training: Hybrid (pre-built patterns + gradual learning from corrections)
 */

export enum Intent {
  // Property-related intents
  PROPERTY_INQUIRY = 'PROPERTY_INQUIRY',
  PROPERTY_INQUIRY_RESIDENTIAL = 'PROPERTY_INQUIRY_RESIDENTIAL',
  PROPERTY_INQUIRY_COMMERCIAL = 'PROPERTY_INQUIRY_COMMERCIAL',
  PROPERTY_INQUIRY_LAND = 'PROPERTY_INQUIRY_LAND',
  PROPERTY_INQUIRY_INVESTMENT = 'PROPERTY_INQUIRY_INVESTMENT',

  // Viewing-related intents
  VIEWING_REQUEST = 'VIEWING_REQUEST',
  VIEWING_REQUEST_IMMEDIATE = 'VIEWING_REQUEST_IMMEDIATE',
  VIEWING_REQUEST_SCHEDULED = 'VIEWING_REQUEST_SCHEDULED',
  VIEWING_REQUEST_GROUP = 'VIEWING_REQUEST_GROUP',
  VIEWING_REQUEST_VIRTUAL = 'VIEWING_REQUEST_VIRTUAL',

  // Purchase-related intents
  PURCHASE_INTEREST = 'PURCHASE_INTEREST',
  PURCHASE_INTEREST_READY = 'PURCHASE_INTEREST_READY',
  PURCHASE_INTEREST_1_3_MONTHS = 'PURCHASE_INTEREST_1_3_MONTHS',
  PURCHASE_INTEREST_3_12_MONTHS = 'PURCHASE_INTEREST_3_12_MONTHS',
  PURCHASE_INTEREST_FUTURE = 'PURCHASE_INTEREST_FUTURE',

  // Complaint intents
  COMPLAINT = 'COMPLAINT',
  COMPLAINT_AGENT = 'COMPLAINT_AGENT',
  COMPLAINT_PROPERTY = 'COMPLAINT_PROPERTY',
  COMPLAINT_PROCESS = 'COMPLAINT_PROCESS',
  COMPLAINT_SERVICE = 'COMPLAINT_SERVICE',

  // Information-related intents
  INFORMATION_REQUEST = 'INFORMATION_REQUEST',
  INFORMATION_REQUEST_PRICING = 'INFORMATION_REQUEST_PRICING',
  INFORMATION_REQUEST_AVAILABILITY = 'INFORMATION_REQUEST_AVAILABILITY',
  INFORMATION_REQUEST_SPECS = 'INFORMATION_REQUEST_SPECS',
  INFORMATION_REQUEST_LOCATION = 'INFORMATION_REQUEST_LOCATION',

  // Negotiation intents
  NEGOTIATION = 'NEGOTIATION',
  NEGOTIATION_PRICE = 'NEGOTIATION_PRICE',
  NEGOTIATION_TERMS = 'NEGOTIATION_TERMS',
  NEGOTIATION_FINANCING = 'NEGOTIATION_FINANCING',
  NEGOTIATION_TRADEIN = 'NEGOTIATION_TRADEIN',

  // General intents
  GREETING = 'GREETING',
  FAREWELL = 'FAREWELL',
  ASSISTANCE_NEEDED = 'ASSISTANCE_NEEDED',
  UNKNOWN = 'UNKNOWN',
}

export interface IntentScore {
  intent: Intent;
  confidence: number;
  reasoning: string;
}

export interface SentimentResult {
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  score: number; // -1.0 to 1.0
  keywords: string[];
}

export interface Entity {
  type: 'PROPERTY_TYPE' | 'LOCATION' | 'PRICE' | 'BEDROOMS' | 'SIZE' | 'NAME' | 'PHONE' | 'DATE' | 'AMENITY';
  value: string;
  confidence: number;
}

export interface IntentResult {
  primary: IntentScore;
  secondary: IntentScore[];
  entities: Entity[];
  sentiment: SentimentResult;
  topics: string[];
  requiresAgentHandoff: boolean;
  suggestedResponse: string;
  timestamp: Date;
}

export interface ConversationContext {
  conversationId: string;
  customerName?: string;
  customerPhone?: string;
  recentIntents: Intent[];
  recentTopics: string[];
  mentionedProperties: string[];
  budget?: number;
  timeline?: string;
  needsAssistance: boolean;
  lastMessageTimestamp: Date;
}

/**
 * NINA Engine - Core NLP Processing
 */
export class NinaEngine {
  private intentKeywords: Map<Intent, string[]>;
  private sentimentKeywords: Map<string, number>;
  private learningData: Map<string, { actualIntent: Intent; predictedIntent: Intent; timestamp: Date }>;

  constructor() {
    this.intentKeywords = this.initializeIntentKeywords();
    this.sentimentKeywords = this.initializeSentimentKeywords();
    this.learningData = new Map();
  }

  /**
   * Main entry point: Process message with context
   */
  public processMessage(
    message: string,
    context: ConversationContext
  ): IntentResult {
    // Normalize message
    const normalized = this.normalizeMessage(message);

    // Detect sentiment
    const sentiment = this.analyzeSentiment(normalized);

    // Detect primary intent
    const primaryIntent = this.detectPrimaryIntent(normalized, context);

    // Detect secondary intents
    const secondaryIntents = this.detectSecondaryIntents(normalized, context, primaryIntent.intent);

    // Extract entities
    const entities = this.extractEntities(normalized);

    // Extract topics
    const topics = this.extractTopics(normalized, entities);

    // Check if handoff needed
    const requiresHandoff = this.shouldHandoffToAgent(
      primaryIntent.intent,
      sentiment,
      entities,
      context
    );

    // Generate suggested response
    const suggestedResponse = this.generateResponse(
      primaryIntent.intent,
      sentiment,
      context,
      requiresHandoff
    );

    return {
      primary: primaryIntent,
      secondary: secondaryIntents,
      entities,
      sentiment,
      topics,
      requiresAgentHandoff: requiresHandoff,
      suggestedResponse,
      timestamp: new Date(),
    };
  }

  /**
   * Detect primary intent with confidence scoring
   */
  private detectPrimaryIntent(message: string, context: ConversationContext): IntentScore {
    const scores: Map<Intent, number> = new Map();

    // Score all intents
    for (const [intent, keywords] of this.intentKeywords) {
      const score = this.scoreMatch(message, keywords, intent);
      if (score > 0) {
        scores.set(intent, score);
      }
    }

    // Apply context boost
    for (const recentIntent of context.recentIntents.slice(0, 3)) {
      const current = scores.get(recentIntent) || 0;
      scores.set(recentIntent, current * 1.15); // 15% boost for recent intents
    }

    // Find top intent
    let topIntent = Intent.UNKNOWN;
    let topScore = 0;

    for (const [intent, score] of scores) {
      if (score > topScore) {
        topScore = score;
        topIntent = intent;
      }
    }

    // Calibrate confidence (0-100)
    const confidence = Math.min(100, Math.max(0, topScore * 100));

    return {
      intent: topIntent,
      confidence,
      reasoning: this.generateIntentReasoning(topIntent, message),
    };
  }

  /**
   * Detect secondary intents (up to 3)
   */
  private detectSecondaryIntents(
    message: string,
    context: ConversationContext,
    primaryIntent: Intent
  ): IntentScore[] {
    const scores: Array<{ intent: Intent; score: number }> = [];

    for (const [intent, keywords] of this.intentKeywords) {
      if (intent === primaryIntent) continue;

      const score = this.scoreMatch(message, keywords, intent);
      if (score > 0.3) {
        // Only include if at least 30% match
        scores.push({ intent, score });
      }
    }

    // Sort and take top 3
    scores.sort((a, b) => b.score - a.score);

    return scores.slice(0, 3).map((item) => ({
      intent: item.intent,
      confidence: Math.min(100, item.score * 100),
      reasoning: `Secondary match for ${item.intent}`,
    }));
  }

  /**
   * Extract entities from message
   */
  private extractEntities(message: string): Entity[] {
    const entities: Entity[] = [];

    // Property types
    const propertyTypes = ['villa', 'apartment', 'townhouse', 'flat', 'studio', 'penthouse', 'plot', 'land'];
    for (const type of propertyTypes) {
      if (message.includes(type)) {
        entities.push({
          type: 'PROPERTY_TYPE',
          value: type,
          confidence: 0.95,
        });
      }
    }

    // Locations (Dubai neighborhoods)
    const locations = [
      'dubai marina', 'downtown', 'jbr', 'deira', 'bur dubai', 'mall of emirates',
      'emirates living', 'jumeirah', 'palm jumeirah', 'creek harbor', 'creek rise',
      'dfc', 'business bay', 'new dubai', 'difc', 'marina',
    ];
    for (const location of locations) {
      if (message.toLowerCase().includes(location)) {
        entities.push({
          type: 'LOCATION',
          value: location,
          confidence: 0.9,
        });
      }
    }

    // Prices (AED amounts)
    const priceMatches = message.match(/(\d{3,},?\d{3}|\d+)\s*(aed|درهم)?/gi);
    if (priceMatches) {
      for (const price of priceMatches) {
        const cleanPrice = price.replace(/[^\d]/g, '');
        if (cleanPrice.length >= 4) {
          entities.push({
            type: 'PRICE',
            value: `AED ${cleanPrice}`,
            confidence: 0.85,
          });
        }
      }
    }

    // Bedrooms
    const bedroomMatches = message.match(/(\d+)\s*(bed|br|bedroom|bedrooms)?/gi);
    if (bedroomMatches) {
      for (const match of bedroomMatches) {
        const rooms = match.match(/\d+/)?.[0];
        if (rooms && parseInt(rooms) <= 10) {
          entities.push({
            type: 'BEDROOMS',
            value: `${rooms}BR`,
            confidence: 0.8,
          });
        }
      }
    }

    // Sizes (sqft/sqm)
    const sizeMatches = message.match(/(\d{2,})\s*(sqft|sq\.?ft|sqm|sq\.?m|m2|ft2)/gi);
    if (sizeMatches) {
      for (const size of sizeMatches) {
        entities.push({
          type: 'SIZE',
          value: size,
          confidence: 0.85,
        });
      }
    }

    // Amenities
    const amenities = ['pool', 'gym', 'parking', 'garden', 'balcony', 'terrace', 'maid room', 'laundry'];
    for (const amenity of amenities) {
      if (message.toLowerCase().includes(amenity)) {
        entities.push({
          type: 'AMENITY',
          value: amenity,
          confidence: 0.8,
        });
      }
    }

    return entities;
  }

  /**
   * Analyze sentiment of message
   */
  private analyzeSentiment(message: string): SentimentResult {
    let score = 0;
    const keywords: string[] = [];

    // Count positive keywords
    const positiveKeywords = ['great', 'love', 'excellent', 'perfect', 'amazing', 'beautiful', 'best', 'wonderful'];
    for (const keyword of positiveKeywords) {
      const count = (message.match(new RegExp(`\\b${keyword}\\b`, 'gi')) || []).length;
      if (count > 0) {
        score += count * 0.5;
        keywords.push(keyword);
      }
    }

    // Count negative keywords
    const negativeKeywords = ['bad', 'terrible', 'horrible', 'awful', 'useless', 'disappointed', 'angry', 'frustrated'];
    for (const keyword of negativeKeywords) {
      const count = (message.match(new RegExp(`\\b${keyword}\\b`, 'gi')) || []).length;
      if (count > 0) {
        score -= count * 0.5;
        keywords.push(keyword);
      }
    }

    // Normalize sentiment to -1.0 to 1.0
    const normalizedScore = Math.max(-1, Math.min(1, score / 10));

    // Determine sentiment label
    let sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    if (normalizedScore > 0.2) {
      sentiment = 'POSITIVE';
    } else if (normalizedScore < -0.2) {
      sentiment = 'NEGATIVE';
    } else {
      sentiment = 'NEUTRAL';
    }

    return {
      sentiment,
      score: normalizedScore,
      keywords,
    };
  }

  /**
   * Extract topics from message
   */
  private extractTopics(message: string, entities: Entity[]): string[] {
    const topics: Set<string> = new Set();

    // Topic from entities
    for (const entity of entities) {
      topics.add(entity.type.toLowerCase());
    }

    // Domain-specific topics
    if (message.match(/view|tour|see|visit/i)) topics.add('VIEWING');
    if (message.match(/buy|purchase|acquire|invest/i)) topics.add('PURCHASE');
    if (message.match(/price|cost|afford|budget/i)) topics.add('PRICING');
    if (message.match(/available|stock|inventory/i)) topics.add('AVAILABILITY');
    if (message.match(/help|assist|support|issue|problem/i)) topics.add('SUPPORT');

    return Array.from(topics);
  }

  /**
   * Score match between message and keywords
   */
  private scoreMatch(message: string, keywords: string[], intent: Intent): number {
    const normalized = message.toLowerCase();
    let matches = 0;

    for (const keyword of keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        matches += 1;
      }
    }

    // Normalize match score (0-1)
    return Math.min(1, matches / Math.max(1, keywords.length));
  }

  /**
   * Should this message be handled by an agent?
   */
  private shouldHandoffToAgent(
    intent: Intent,
    sentiment: SentimentResult,
    entities: Entity[],
    context: ConversationContext
  ): boolean {
    // Always handoff complaints
    if (intent.includes('COMPLAINT')) return true;

    // Handoff negative sentiment with many entities (complex issue)
    if (sentiment.sentiment === 'NEGATIVE' && entities.length > 5) return true;

    // Handoff if customer asks for help
    if (intent === Intent.ASSISTANCE_NEEDED) return true;

    // Otherwise, use auto-response
    return false;
  }

  /**
   * Generate suggested auto-response
   */
  private generateResponse(
    intent: Intent,
    sentiment: SentimentResult,
    context: ConversationContext,
    requiresHandoff: boolean
  ): string {
    if (requiresHandoff) {
      return `Thank you for contacting White Caves Real Estate! Your message has been received and our team will be with you shortly to assist.`;
    }

    // Auto-response based on intent
    switch (intent) {
      case Intent.GREETING:
        return `Hello${context.customerName ? ` ${context.customerName}` : ''}! Welcome to White Caves Real Estate. How can I help you today?`;
      case Intent.PROPERTY_INQUIRY:
      case Intent.PROPERTY_INQUIRY_RESIDENTIAL:
      case Intent.PROPERTY_INQUIRY_COMMERCIAL:
        return `Great! I'd be happy to help you find the perfect property. Could you tell me more about your preferences? (Budget, location, type)`;
      case Intent.VIEWING_REQUEST:
      case Intent.VIEWING_REQUEST_IMMEDIATE:
        return `Perfect! I'll arrange a viewing for you. Our agents have excellent properties available. Can you share your preferred time?`;
      case Intent.PURCHASE_INTEREST:
      case Intent.PURCHASE_INTEREST_READY:
        return `Excellent! We're here to guide you through the purchase process. Let's connect you with our sales team.`;
      case Intent.INFORMATION_REQUEST_PRICING:
        return `I'd be happy to share pricing details. Could you specify which property or area interests you?`;
      case Intent.FAREWELL:
        return `Thank you for contacting White Caves! We look forward to helping you. Have a great day!`;
      default:
        return `Thank you for your message. Our team will get back to you shortly with more information.`;
    }
  }

  /**
   * Generate reasoning explanation for intent detection
   */
  private generateIntentReasoning(intent: Intent, message: string): string {
    const keywords = this.intentKeywords.get(intent) || [];
    const found = keywords.filter((k) => message.toLowerCase().includes(k.toLowerCase()));
    return `Detected from keywords: ${found.slice(0, 3).join(', ')}`;
  }

  /**
   * Record user correction for learning
   */
  public recordFeedback(messageId: string, actualIntent: Intent, predictedIntent: Intent): void {
    if (actualIntent !== predictedIntent) {
      this.learningData.set(messageId, {
        actualIntent,
        predictedIntent,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Initialize intent->keywords mapping (pre-built patterns)
   */
  private initializeIntentKeywords(): Map<Intent, string[]> {
    return new Map([
      // Property inquiry
      [Intent.PROPERTY_INQUIRY, ['show', 'property', 'properties', 'looking for', 'interested in', 'search']],
      [Intent.PROPERTY_INQUIRY_RESIDENTIAL, ['apartment', 'villa', 'townhouse', 'flat', 'residential']],
      [Intent.PROPERTY_INQUIRY_COMMERCIAL, ['office', 'shop', 'commercial', 'retail', 'space']],
      [Intent.PROPERTY_INQUIRY_LAND, ['plot', 'land', 'terrain', 'development']],
      [Intent.PROPERTY_INQUIRY_INVESTMENT, ['investment', 'roi', 'yield', 'rental', 'income']],

      // Viewing
      [Intent.VIEWING_REQUEST, ['view', 'viewing', 'tour', 'see', 'visit', 'schedule', 'appointment']],
      [Intent.VIEWING_REQUEST_IMMEDIATE, ['today', 'now', 'asap', 'urgent', 'immediately', 'tomorrow']],
      [Intent.VIEWING_REQUEST_SCHEDULED, ['next week', 'next month', 'later', 'schedule', 'plan']],
      [Intent.VIEWING_REQUEST_GROUP, ['group', 'friends', 'family', 'team', 'together']],
      [Intent.VIEWING_REQUEST_VIRTUAL, ['virtual', 'video', 'online', 'video call', '360']],

      // Purchase
      [Intent.PURCHASE_INTEREST, ['buy', 'purchase', 'acquire', 'own', 'invest']],
      [Intent.PURCHASE_INTEREST_READY, ['ready to buy', 'ready', 'serious', 'cash ready', 'approved']],
      [Intent.PURCHASE_INTEREST_1_3_MONTHS, ['1 month', '2 months', '3 months', 'soon', 'next quarter']],
      [Intent.PURCHASE_INTEREST_3_12_MONTHS, ['6 months', '9 months', 'year', 'next year']],
      [Intent.PURCHASE_INTEREST_FUTURE, ['future', 'later', 'maybe', 'consider', 'thinking']],

      // Complaint
      [Intent.COMPLAINT, ['complaint', 'issue', 'problem', 'unhappy', 'disappointed', 'wrong']],
      [Intent.COMPLAINT_AGENT, ['agent', 'staff', 'service', 'rude', 'unprofessional']],
      [Intent.COMPLAINT_PROPERTY, ['property', 'damage', 'issue', 'problem', 'defect']],
      [Intent.COMPLAINT_PROCESS, ['process', 'paperwork', 'documentation', 'delay', 'slow']],

      // Information
      [Intent.INFORMATION_REQUEST, ['what', 'how', 'tell me', 'explain', 'information']],
      [Intent.INFORMATION_REQUEST_PRICING, ['price', 'cost', 'afford', 'payment', 'aed']],
      [Intent.INFORMATION_REQUEST_AVAILABILITY, ['available', 'stock', 'inventory', 'units']],
      [Intent.INFORMATION_REQUEST_LOCATION, ['where', 'location', 'area', 'district', 'neighborhood']],

      // Negotiation
      [Intent.NEGOTIATION, ['negotiate', 'offer', 'discount', 'reduce', 'lower']],
      [Intent.NEGOTIATION_PRICE, ['price', 'discount', 'reduce', 'lower', 'cheaper']],
      [Intent.NEGOTIATION_TERMS, ['terms', 'payment', 'installment', 'options']],
      [Intent.NEGOTIATION_FINANCING, ['mortgage', 'finance', 'loan', 'bank', 'funding']],

      // General
      [Intent.GREETING, ['hello', 'hi', 'hey', 'good', 'morning', 'afternoon', 'evening']],
      [Intent.FAREWELL, ['bye', 'goodbye', 'thanks', 'thank you', 'see you', 'later']],
      [Intent.ASSISTANCE_NEEDED, ['help', 'assist', 'support', 'need', 'please', 'can you']],
    ]);
  }

  /**
   * Initialize sentiment keywords
   */
  private initializeSentimentKeywords(): Map<string, number> {
    return new Map([
      // Positive
      ['excellent', 1.0],
      ['amazing', 0.9],
      ['great', 0.8],
      ['good', 0.6],
      ['love', 1.0],
      ['beautiful', 0.8],
      ['perfect', 0.9],
      ['wonderful', 0.8],
      ['fantastic', 0.9],

      // Negative
      ['bad', -0.8],
      ['terrible', -1.0],
      ['horrible', -0.95],
      ['awful', -0.9],
      ['disappointed', -0.8],
      ['angry', -0.85],
      ['frustrated', -0.75],
      ['useless', -0.9],
      ['hate', -1.0],
    ]);
  }

  /**
   * Normalize message (lowercase, trim, remove extra spaces)
   */
  private normalizeMessage(message: string): string {
    return message
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\d\-\.]/g, '');
  }
}

// Export singleton instance
export const ninaEngine = new NinaEngine();
