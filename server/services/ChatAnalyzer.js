const natural = require('natural');

/**
 * ChatAnalyzer Service
 * Uses NLP to analyze WhatsApp messages and extract intents/entities
 */
class ChatAnalyzer {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.classifier = null;
    this.initializePatterns();
  }

  initializePatterns() {
    // Intent patterns
    this.intentPatterns = {
      schedule_viewing: {
        keywords: [
          'visit',
          'viewing',
          'view',
          'schedule',
          'appointment',
          'when',
          'time',
          'available',
          'see',
          'tour',
        ],
        phrases: [
          /when can i (visit|see|view)/i,
          /i want to (schedule|book|arrange).*(viewing|appointment)/i,
          /can i.*(visit|tour|view)/i,
          /available for (viewing|tour)/i,
        ],
      },
      property_inquiry: {
        keywords: [
          'property',
          'apartment',
          'villa',
          'townhouse',
          'flat',
          'house',
          'bedroom',
          'bed',
          'kitchen',
          'area',
        ],
        phrases: [
          /looking for.*(apartment|villa|house|property)/i,
          /do you have.*(apartment|villa|property)/i,
          /interested in.*(property|apartment|villa)/i,
          /what (apartments|villas|properties).*(available)/i,
        ],
      },
      price_inquiry: {
        keywords: ['price', 'cost', 'rate', 'pay', 'expensive', 'cheap', 'affordable', 'budget'],
        phrases: [
          /how much|what.*(price|cost)/i,
          /price (of|for)/i,
          /what.*(budget|payment)/i,
        ],
      },
      location_info: {
        keywords: ['location', 'area', 'where', 'near', 'close', 'distance', 'downtown', 'suburb'],
        phrases: [
          /where.*(located|is|situated)/i,
          /(properties|apartments).*(location|area)/i,
          /properties in/i,
        ],
      },
      contact_agent: {
        keywords: ['agent', 'representative', 'speak', 'talk', 'call', 'connect', 'human'],
        phrases: [
          /connect me.*(agent|representative)/i,
          /i want to (speak|talk).*(agent|human)/i,
          /can i.*(speak|call).*(someone)/i,
        ],
      },
      help: {
        keywords: ['help', 'assist', 'support', 'can you', 'how do', 'what can'],
        phrases: [/help|assist|support/i, /how can you/i],
      },
    };

    // Entity extraction patterns
    this.entityPatterns = {
      area: [
        'marina',
        'jbr',
        'downtown',
        'deira',
        'bur dubai',
        'jumeirah',
        'palm jumeirah',
        'sports city',
        'dubai hills',
        'creek harbour',
        'business bay',
      ],
      propertyType: ['apartment', 'villa', 'townhouse', 'flat', 'duplex', 'penthouse', 'studio'],
      priceRange: {
        budget: /budget|affordable|cheap|under|less than/i,
        luxury: /luxury|premium|high-end|expensive/i,
      },
    };
  }

  /**
   * Analyze a message and extract intent, sentiment, and entities
   */
  async analyzeMessage(messageText, leadContext = {}) {
    try {
      const tokens = this.tokenizer.tokenize(messageText.toLowerCase());
      const stemmedTokens = tokens.map((token) => this.stemmer.stem(token));

      // Extract intent
      const intent = this.extractIntent(messageText, stemmedTokens);

      // Extract entities
      const entities = this.extractEntities(messageText, leadContext);

      // Analyze sentiment
      const sentiment = this.analyzeSentiment(messageText);

      // Extract keywords
      const keywords = this.extractKeywords(stemmedTokens);

      return {
        intent,
        entities,
        sentiment,
        keywords,
        confidence: this.calculateConfidence(messageText, intent),
      };
    } catch (error) {
      console.error('Error analyzing message:', error);
      return {
        intent: 'help',
        sentiment: 'neutral',
        keywords: [],
        entities: {},
        confidence: 0.5,
      };
    }
  }

  /**
   * Extract intent from message
   */
  extractIntent(messageText, stemmedTokens) {
    const scores = {};

    // Score each intent based on pattern matches
    for (const [intentName, patterns] of Object.entries(this.intentPatterns)) {
      let score = 0;

      // Check keywords
      for (const keyword of patterns.keywords) {
        for (const token of stemmedTokens) {
          if (token.includes(this.stemmer.stem(keyword))) {
            score += 2;
          }
        }
      }

      // Check phrases (exact patterns)
      for (const phrase of patterns.phrases) {
        if (phrase.test(messageText)) {
          score += 5;
        }
      }

      scores[intentName] = score;
    }

    // Return intent with highest score, default to 'help'
    const maxIntent = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
    return maxIntent && maxIntent[1] > 0 ? maxIntent[0] : 'general_inquiry';
  }

  /**
   * Extract entities from message
   */
  extractEntities(messageText, leadContext = {}) {
    const entities = {};
    const lowerMessage = messageText.toLowerCase();

    // Extract area
    for (const area of this.entityPatterns.area) {
      if (lowerMessage.includes(area)) {
        entities.area = area;
        break;
      }
    }

    // Extract property type
    for (const type of this.entityPatterns.propertyType) {
      if (lowerMessage.includes(type)) {
        entities.propertyType = type;
        break;
      }
    }

    // Extract bedrooms
    const bedroomMatch = messageText.match(/(\d+)\s*(?:bed|br|bedroom)/i);
    if (bedroomMatch) {
      entities.bedrooms = parseInt(bedroomMatch[1], 10);
    }

    // Extract price range
    const priceMatch = messageText.match(/(?:aed|dhs?|aed)?\s*(\d+(?:,\d{3})?(?:\.\d+)?)\s*[kmb]?/gi);
    if (priceMatch) {
      const prices = priceMatch.map((p) => {
        const num = parseInt(p.replace(/[^\d]/g, ''), 10);
        if (p.includes('k')) return num * 1000;
        if (p.includes('m')) return num * 1000000;
        return num;
      });

      if (prices.length > 0) {
        entities.priceMin = Math.min(...prices);
        entities.priceMax = Math.max(...prices);
      }
    }

    // Detect price category
    if (this.entityPatterns.priceRange.budget.test(messageText)) {
      entities.priceCategory = 'budget';
    } else if (this.entityPatterns.priceRange.luxury.test(messageText)) {
      entities.priceCategory = 'luxury';
    }

    return entities;
  }

  /**
   * Analyze sentiment of message
   */
  analyzeSentiment(messageText) {
    const positiveWords = [
      'good',
      'great',
      'perfect',
      'love',
      'nice',
      'beautiful',
      'excellent',
      'interested',
      'happy',
      'excited',
    ];
    const negativeWords = [
      'bad',
      'poor',
      'hate',
      'dislike',
      'ugly',
      'terrible',
      'angry',
      'frustrated',
      'disappointed',
      'not interested',
    ];

    const lowerMessage = messageText.toLowerCase();
    const positiveCount = positiveWords.filter((w) => lowerMessage.includes(w)).length;
    const negativeCount = negativeWords.filter((w) => lowerMessage.includes(w)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Extract keywords from tokens
   */
  extractKeywords(stemmedTokens) {
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'is',
      'are',
      'be',
      'have',
      'do',
      'i',
      'you',
      'we',
      'they',
      'can',
      'will',
      'would',
      'could',
    ]);

    return stemmedTokens
      .filter((token) => token.length > 3 && !stopWords.has(token))
      .slice(0, 5);
  }

  /**
   * Calculate confidence score
   */
  calculateConfidence(messageText, intent) {
    // Confidence based on message length and clarity
    const wordCount = messageText.split(' ').length;
    const baseConfidence = 0.5;

    // More words = more information = higher confidence
    const wordConfidence = Math.min(0.3, wordCount * 0.05);

    // Intent with clear patterns = higher confidence
    const intentConfidence = intent !== 'general_inquiry' ? 0.2 : 0;

    return Math.min(1, baseConfidence + wordConfidence + intentConfidence);
  }
}

module.exports = new ChatAnalyzer();
