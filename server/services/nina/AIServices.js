import { EventEmitter } from 'events';

class AIIntentClassifier extends EventEmitter {
  constructor() {
    super();
    this.intents = {
      property_inquiry: {
        keywords: ['price', 'cost', 'how much', 'available', 'rent', 'buy', 'bedroom', 'sqft', 'location', 'area', 'size', 'payment plan'],
        weight: 1.0
      },
      viewing_request: {
        keywords: ['visit', 'see', 'viewing', 'tour', 'appointment', 'schedule', 'meet', 'show me', 'can i view'],
        weight: 1.2
      },
      documentation: {
        keywords: ['document', 'contract', 'paper', 'sign', 'ejari', 'title deed', 'noc', 'mortgage', 'loan'],
        weight: 1.0
      },
      negotiation: {
        keywords: ['offer', 'negotiate', 'discount', 'best price', 'deal', 'lower', 'final price', 'reduce'],
        weight: 1.1
      },
      urgency: {
        keywords: ['urgent', 'asap', 'immediately', 'today', 'now', 'quick', 'hurry', 'emergency'],
        weight: 1.3
      },
      greeting: {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'salam', 'marhaba', 'good afternoon'],
        weight: 0.8
      },
      opt_out: {
        keywords: ['stop', 'unsubscribe', 'remove', 'do not send', 'opt-out', 'no more', 'delete my number', 'block'],
        weight: 1.5
      },
      complaint: {
        keywords: ['problem', 'issue', 'complaint', 'unhappy', 'disappointed', 'wrong', 'not satisfied', 'terrible'],
        weight: 1.2
      },
      thank_you: {
        keywords: ['thank', 'thanks', 'appreciate', 'grateful', 'shukran', 'excellent service'],
        weight: 0.7
      },
      follow_up: {
        keywords: ['update', 'status', 'progress', 'any news', 'waiting', 'heard back', 'response'],
        weight: 0.9
      },
      payment_inquiry: {
        keywords: ['payment', 'pay', 'cheque', 'bank', 'transfer', 'installment', 'down payment'],
        weight: 1.0
      },
      location_inquiry: {
        keywords: ['where', 'location', 'address', 'near', 'close to', 'metro', 'mall', 'school'],
        weight: 0.9
      }
    };
    
    this.arabicIntents = {
      property_inquiry: {
        keywords: ['سعر', 'كم', 'متاح', 'إيجار', 'شراء', 'غرفة', 'مساحة', 'موقع'],
        weight: 1.0
      },
      greeting: {
        keywords: ['السلام', 'مرحبا', 'صباح', 'مساء', 'أهلا'],
        weight: 0.8
      },
      thank_you: {
        keywords: ['شكرا', 'ممتن', 'جزاك الله'],
        weight: 0.7
      },
      opt_out: {
        keywords: ['توقف', 'أوقف', 'احذف', 'لا ترسل'],
        weight: 1.5
      },
      viewing_request: {
        keywords: ['معاينة', 'زيارة', 'أرى', 'موعد'],
        weight: 1.2
      }
    };

    this.contextPatterns = [
      { pattern: /(\d+)\s*(bed|br|bedroom)/i, intent: 'property_inquiry', boost: 0.2 },
      { pattern: /aed\s*[\d,]+/i, intent: 'property_inquiry', boost: 0.25 },
      { pattern: /(villa|apartment|studio|townhouse|penthouse)/i, intent: 'property_inquiry', boost: 0.15 },
      { pattern: /(tomorrow|next week|this weekend)/i, intent: 'viewing_request', boost: 0.2 },
      { pattern: /(palm|marina|downtown|jvc|jlt|business bay)/i, intent: 'location_inquiry', boost: 0.15 }
    ];
  }

  async classifyIntent(message) {
    const lowerMessage = message.toLowerCase();
    const results = [];
    
    for (const [intent, config] of Object.entries(this.intents)) {
      const matches = config.keywords.filter(kw => lowerMessage.includes(kw));
      if (matches.length > 0) {
        let confidence = Math.min(0.95, 0.4 + (matches.length * 0.12 * config.weight));
        results.push({
          intent,
          confidence,
          matchedKeywords: matches,
          language: 'english'
        });
      }
    }

    for (const [intent, config] of Object.entries(this.arabicIntents)) {
      const matches = config.keywords.filter(kw => message.includes(kw));
      if (matches.length > 0) {
        const existing = results.find(r => r.intent === intent);
        if (existing) {
          existing.confidence = Math.min(0.98, existing.confidence + 0.15);
          existing.language = 'bilingual';
        } else {
          results.push({
            intent,
            confidence: Math.min(0.95, 0.45 + (matches.length * 0.12 * config.weight)),
            matchedKeywords: matches,
            language: 'arabic'
          });
        }
      }
    }

    for (const { pattern, intent, boost } of this.contextPatterns) {
      if (pattern.test(message)) {
        const existing = results.find(r => r.intent === intent);
        if (existing) {
          existing.confidence = Math.min(0.98, existing.confidence + boost);
        }
      }
    }

    results.sort((a, b) => b.confidence - a.confidence);
    
    this.emit('classification', { message, results });
    
    return {
      primaryIntent: results[0] || { intent: 'general', confidence: 0.25 },
      secondaryIntents: results.slice(1, 3),
      allIntents: results,
      messageLength: message.length,
      timestamp: new Date().toISOString()
    };
  }

  addCustomIntent(name, keywords, weight = 1.0) {
    this.intents[name] = { keywords, weight };
    return true;
  }

  removeIntent(name) {
    if (this.intents[name]) {
      delete this.intents[name];
      return true;
    }
    return false;
  }
}

class AILeadScorer extends EventEmitter {
  constructor() {
    super();
    this.weights = {
      responseSpeed: { points: 15, description: 'Quick response time' },
      messageCount: { points: 10, description: 'Active engagement' },
      questionAsked: { points: 20, description: 'Asking questions' },
      budgetMentioned: { points: 25, description: 'Budget discussion' },
      timeframeMentioned: { points: 15, description: 'Timeline interest' },
      propertySpecific: { points: 20, description: 'Specific property interest' },
      viewingRequested: { points: 30, description: 'Viewing requested' },
      documentRequested: { points: 25, description: 'Document inquiry' },
      negotiationInitiated: { points: 20, description: 'Negotiation started' },
      repeatContact: { points: 15, description: 'Repeat customer' },
      premiumArea: { points: 10, description: 'Premium area interest' },
      readyBuyer: { points: 25, description: 'Ready to purchase' }
    };
    
    this.premiumAreas = ['palm', 'downtown', 'marina', 'emirates hills', 'jumeirah', 'bluewaters'];
    this.readySignals = ['mortgage approved', 'cash buyer', 'ready to move', 'looking to close', 'immediate'];
  }

  async scoreLeadFromConversation(conversation) {
    let score = 0;
    const factors = [];
    const text = (conversation.messages || []).join(' ').toLowerCase();

    if (conversation.responseTimeMinutes && conversation.responseTimeMinutes < 30) {
      const points = this.weights.responseSpeed.points;
      score += points;
      factors.push({ factor: this.weights.responseSpeed.description, points });
    }

    if (conversation.messageCount > 3) {
      const points = Math.min(this.weights.messageCount.points, conversation.messageCount * 2);
      score += points;
      factors.push({ factor: this.weights.messageCount.description, points });
    }

    if (text.includes('price') || text.includes('cost') || text.includes('budget') || text.includes('aed') || /\d{3,}/.test(text)) {
      const points = this.weights.budgetMentioned.points;
      score += points;
      factors.push({ factor: this.weights.budgetMentioned.description, points });
    }

    if (text.includes('when') || text.includes('move') || text.includes('ready') || text.includes('handover') || text.includes('timeline')) {
      const points = this.weights.timeframeMentioned.points;
      score += points;
      factors.push({ factor: this.weights.timeframeMentioned.description, points });
    }

    if (text.includes('viewing') || text.includes('visit') || text.includes('see the') || text.includes('tour')) {
      const points = this.weights.viewingRequested.points;
      score += points;
      factors.push({ factor: this.weights.viewingRequested.description, points });
    }

    if (text.includes('bedroom') || text.includes('villa') || text.includes('apartment') || text.includes('townhouse') || text.includes('penthouse')) {
      const points = this.weights.propertySpecific.points;
      score += points;
      factors.push({ factor: this.weights.propertySpecific.description, points });
    }

    if (text.includes('contract') || text.includes('document') || text.includes('ejari') || text.includes('title deed')) {
      const points = this.weights.documentRequested.points;
      score += points;
      factors.push({ factor: this.weights.documentRequested.description, points });
    }

    if (text.includes('offer') || text.includes('negotiate') || text.includes('discount') || text.includes('best price')) {
      const points = this.weights.negotiationInitiated.points;
      score += points;
      factors.push({ factor: this.weights.negotiationInitiated.description, points });
    }

    for (const area of this.premiumAreas) {
      if (text.includes(area)) {
        const points = this.weights.premiumArea.points;
        score += points;
        factors.push({ factor: `Premium area: ${area}`, points });
        break;
      }
    }

    for (const signal of this.readySignals) {
      if (text.includes(signal)) {
        const points = this.weights.readyBuyer.points;
        score += points;
        factors.push({ factor: this.weights.readyBuyer.description, points });
        break;
      }
    }

    const normalizedScore = Math.min(100, Math.round(score));

    this.emit('scored', { score: normalizedScore, factors });

    return {
      score: normalizedScore,
      grade: this.getGrade(normalizedScore),
      priority: this.getPriority(normalizedScore),
      factors,
      recommendation: this.getRecommendation(normalizedScore),
      nextAction: this.getNextAction(normalizedScore),
      timestamp: new Date().toISOString()
    };
  }

  getGrade(score) {
    if (score >= 80) return 'A';
    if (score >= 60) return 'B';
    if (score >= 40) return 'C';
    if (score >= 20) return 'D';
    return 'F';
  }

  getPriority(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'minimal';
  }

  getRecommendation(score) {
    if (score >= 80) return 'Hot lead - Immediate follow-up required by senior agent';
    if (score >= 60) return 'Warm lead - Schedule viewing within 24 hours';
    if (score >= 40) return 'Interested - Continue engagement and nurturing';
    if (score >= 20) return 'Early stage - Add to automated drip campaign';
    return 'Cold lead - Monitor for future activity';
  }

  getNextAction(score) {
    if (score >= 80) return 'Call within 1 hour';
    if (score >= 60) return 'Send property shortlist';
    if (score >= 40) return 'Schedule follow-up call';
    if (score >= 20) return 'Add to nurture sequence';
    return 'Archive for future reference';
  }

  updateWeight(factor, points) {
    if (this.weights[factor]) {
      this.weights[factor].points = points;
      return true;
    }
    return false;
  }
}

class AISentimentAnalyzer extends EventEmitter {
  constructor() {
    super();
    this.lexicon = {
      positive: {
        strong: ['excellent', 'amazing', 'perfect', 'wonderful', 'fantastic', 'outstanding', 'love'],
        moderate: ['good', 'great', 'nice', 'happy', 'pleased', 'satisfied', 'helpful'],
        mild: ['okay', 'fine', 'interested', 'curious', 'considering']
      },
      negative: {
        strong: ['terrible', 'awful', 'horrible', 'hate', 'worst', 'scam', 'fraud'],
        moderate: ['bad', 'disappointed', 'frustrated', 'angry', 'annoyed', 'upset'],
        mild: ['not sure', 'hesitant', 'concern', 'worry', 'doubt']
      },
      urgency: {
        high: ['urgent', 'asap', 'immediately', 'emergency', 'critical'],
        medium: ['soon', 'quickly', 'today', 'this week'],
        low: ['eventually', 'sometime', 'no rush', 'whenever']
      }
    };

    this.negationWords = ['not', "don't", "doesn't", "won't", "can't", "never", "no"];
    this.intensifiers = ['very', 'really', 'extremely', 'absolutely', 'totally'];
  }

  async analyzeSentiment(text) {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    
    let positiveScore = 0;
    let negativeScore = 0;
    let urgencyScore = 0;
    const indicators = { positive: [], negative: [], urgency: [] };

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const prevWord = words[i - 1] || '';
      const isNegated = this.negationWords.includes(prevWord);
      const isIntensified = this.intensifiers.includes(prevWord);
      const multiplier = isIntensified ? 1.5 : 1;

      for (const [level, levelWords] of Object.entries(this.lexicon.positive)) {
        if (levelWords.some(w => word.includes(w))) {
          const baseScore = level === 'strong' ? 0.3 : level === 'moderate' ? 0.2 : 0.1;
          if (isNegated) {
            negativeScore += baseScore * multiplier;
            indicators.negative.push(word);
          } else {
            positiveScore += baseScore * multiplier;
            indicators.positive.push(word);
          }
        }
      }

      for (const [level, levelWords] of Object.entries(this.lexicon.negative)) {
        if (levelWords.some(w => word.includes(w))) {
          const baseScore = level === 'strong' ? 0.3 : level === 'moderate' ? 0.2 : 0.1;
          if (isNegated) {
            positiveScore += baseScore * 0.5;
            indicators.positive.push(`not ${word}`);
          } else {
            negativeScore += baseScore * multiplier;
            indicators.negative.push(word);
          }
        }
      }

      for (const [level, levelWords] of Object.entries(this.lexicon.urgency)) {
        if (levelWords.some(w => lowerText.includes(w))) {
          urgencyScore = level === 'high' ? 3 : level === 'medium' ? 2 : 1;
          indicators.urgency.push(word);
        }
      }
    }

    let sentiment = 'neutral';
    let score = 0.5;

    if (positiveScore > negativeScore + 0.1) {
      sentiment = 'positive';
      score = Math.min(1, 0.5 + positiveScore);
    } else if (negativeScore > positiveScore + 0.1) {
      sentiment = 'negative';
      score = Math.max(0, 0.5 - negativeScore);
    }

    const result = {
      sentiment,
      score: Math.round(score * 100) / 100,
      confidence: Math.min(0.95, 0.6 + Math.abs(positiveScore - negativeScore)),
      indicators,
      urgency: urgencyScore > 0,
      urgencyLevel: urgencyScore >= 3 ? 'high' : urgencyScore >= 2 ? 'medium' : urgencyScore >= 1 ? 'low' : 'none',
      requiresEscalation: sentiment === 'negative' && negativeScore > 0.3,
      timestamp: new Date().toISOString()
    };

    this.emit('analyzed', result);
    return result;
  }

  addToLexicon(category, level, words) {
    if (this.lexicon[category] && this.lexicon[category][level]) {
      this.lexicon[category][level].push(...words);
      return true;
    }
    return false;
  }
}

class AILanguageDetector extends EventEmitter {
  constructor() {
    super();
    this.patterns = {
      arabic: { regex: /[\u0600-\u06FF\u0750-\u077F]/, name: 'Arabic', code: 'ar', rtl: true },
      hindi: { regex: /[\u0900-\u097F]/, name: 'Hindi', code: 'hi', rtl: false },
      chinese: { regex: /[\u4E00-\u9FFF]/, name: 'Chinese', code: 'zh', rtl: false },
      russian: { regex: /[\u0400-\u04FF]/, name: 'Russian', code: 'ru', rtl: false },
      urdu: { regex: /[\u0600-\u06FF][\u0750-\u077F]?/, name: 'Urdu', code: 'ur', rtl: true },
      persian: { regex: /[\u0600-\u06FF]/, name: 'Persian', code: 'fa', rtl: true }
    };

    this.commonPhrases = {
      arabic: ['مرحبا', 'شكرا', 'الله', 'خير', 'عقار', 'سعر'],
      english: ['hello', 'thank', 'please', 'property', 'price', 'bedroom']
    };
  }

  detect(text) {
    const results = [];
    let totalChars = text.replace(/\s/g, '').length;
    
    for (const [lang, config] of Object.entries(this.patterns)) {
      const matches = text.match(config.regex) || [];
      if (matches.length > 0) {
        const charCount = matches.join('').length;
        const percentage = (charCount / totalChars) * 100;
        results.push({
          language: config.name,
          code: config.code,
          confidence: Math.min(0.98, 0.5 + (percentage / 100)),
          rtl: config.rtl,
          percentage: Math.round(percentage)
        });
      }
    }

    if (results.length === 0 || results.every(r => r.percentage < 30)) {
      results.push({
        language: 'English',
        code: 'en',
        confidence: 0.85,
        rtl: false,
        percentage: 100 - results.reduce((sum, r) => sum + r.percentage, 0)
      });
    }

    results.sort((a, b) => b.confidence - a.confidence);

    const isMixed = results.length > 1 && results[1].percentage > 20;

    return {
      primary: results[0],
      detected: results,
      isMixed,
      suggestedResponse: isMixed ? 'bilingual' : results[0].code,
      timestamp: new Date().toISOString()
    };
  }
}

class AIResponseGenerator extends EventEmitter {
  constructor() {
    super();
    this.templates = {
      property_inquiry: {
        en: [
          "Thank you for your interest! I'd be happy to provide more details about this property. What specific information would you like to know?",
          "Great question! Let me help you with property details. Are you looking for pricing, location, or specifications?",
          "I appreciate your inquiry! This property offers excellent value. Would you like to schedule a viewing?"
        ],
        ar: [
          "شكراً لاهتمامك! يسعدني تقديم المزيد من التفاصيل حول هذا العقار. ما هي المعلومات التي تريد معرفتها؟",
          "سؤال رائع! دعني أساعدك في تفاصيل العقار. هل تبحث عن السعر أو الموقع أو المواصفات؟"
        ]
      },
      viewing_request: {
        en: [
          "I'd love to arrange a viewing for you! What dates and times work best for your schedule?",
          "Excellent choice wanting to see this property! Our team is available for viewings. When would be convenient for you?",
          "A viewing can definitely be arranged! Would you prefer a weekday or weekend appointment?"
        ],
        ar: [
          "أرغب في ترتيب معاينة لك! ما هي التواريخ والأوقات المناسبة لجدولك؟",
          "خيار ممتاز! فريقنا متاح للمعاينات. متى يناسبك؟"
        ]
      },
      greeting: {
        en: [
          "Hello! Welcome to White Caves Real Estate. How may I assist you today?",
          "Hi there! Thanks for reaching out. What can I help you with?",
          "Good day! White Caves Real Estate at your service. How can I help?"
        ],
        ar: [
          "مرحباً! أهلاً بك في وايت كيفز العقارية. كيف يمكنني مساعدتك اليوم؟",
          "أهلاً وسهلاً! شكراً لتواصلك. كيف أستطيع مساعدتك؟"
        ]
      },
      thank_you: {
        en: [
          "You're welcome! Please don't hesitate to reach out if you have any more questions.",
          "My pleasure! Feel free to contact us anytime you need assistance.",
          "Happy to help! We're always here for you."
        ],
        ar: [
          "على الرحب والسعة! لا تتردد في التواصل معنا إذا كان لديك أي أسئلة أخرى.",
          "سعيد بمساعدتك! لا تتردد في الاتصال بنا في أي وقت."
        ]
      },
      opt_out: {
        en: [
          "We've noted your preference and removed you from our contact list. Thank you for your time.",
          "Your request has been processed. You will no longer receive messages from us. Take care!"
        ],
        ar: [
          "لقد لاحظنا تفضيلك وأزلناك من قائمة الاتصال لدينا. شكراً لوقتك.",
          "تم معالجة طلبك. لن تتلقى المزيد من الرسائل منا."
        ]
      },
      complaint: {
        en: [
          "I'm sorry to hear about your concern. Your feedback is important to us. A senior team member will contact you shortly.",
          "I apologize for any inconvenience. Let me escalate this to our management team for immediate attention."
        ],
        ar: [
          "أنا آسف لسماع قلقك. ملاحظاتك مهمة لنا. سيتصل بك أحد أعضاء فريقنا الكبار قريباً.",
          "أعتذر عن أي إزعاج. دعني أحيل هذا إلى فريق الإدارة لدينا للاهتمام الفوري."
        ]
      },
      negotiation: {
        en: [
          "I appreciate your interest in negotiating! Let me check with the property owner and get back to you with the best possible offer.",
          "Thank you for your offer. Our team will review it and respond within 24 hours."
        ],
        ar: [
          "أقدر اهتمامك بالتفاوض! دعني أتحقق مع مالك العقار وأعود إليك بأفضل عرض ممكن.",
          "شكراً لعرضك. سيراجعه فريقنا ويرد خلال 24 ساعة."
        ]
      },
      urgency: {
        en: [
          "I understand this is urgent. Let me prioritize your request and connect you with an available agent immediately.",
          "Your request has been marked as urgent. A team member will contact you within the hour."
        ],
        ar: [
          "أفهم أن هذا عاجل. دعني أولوية طلبك وأوصلك بوكيل متاح فوراً.",
          "تم تحديد طلبك كعاجل. سيتصل بك أحد أعضاء الفريق خلال الساعة."
        ]
      },
      default: {
        en: [
          "Thank you for reaching out. One of our consultants will contact you shortly.",
          "Thanks for your message! We'll get back to you as soon as possible."
        ],
        ar: [
          "شكراً لتواصلك معنا. سيتصل بك أحد مستشارينا قريباً.",
          "شكراً لرسالتك! سنعود إليك في أقرب وقت ممكن."
        ]
      }
    };

    this.personalizationTokens = {
      '{name}': 'Customer',
      '{property}': 'the property',
      '{agent}': 'our team',
      '{company}': 'White Caves Real Estate'
    };
  }

  async generateResponse(intent, language = 'en', context = {}) {
    const templates = this.templates[intent] || this.templates.default;
    const langTemplates = templates[language] || templates.en;
    
    const randomIndex = Math.floor(Math.random() * langTemplates.length);
    let response = langTemplates[randomIndex];

    for (const [token, defaultValue] of Object.entries(this.personalizationTokens)) {
      const value = context[token.replace(/[{}]/g, '')] || defaultValue;
      response = response.replace(new RegExp(token, 'g'), value);
    }

    const result = {
      response,
      intent,
      language,
      templateIndex: randomIndex,
      personalized: Object.keys(context).length > 0,
      timestamp: new Date().toISOString()
    };

    this.emit('generated', result);
    return result;
  }

  addTemplate(intent, language, template) {
    if (!this.templates[intent]) {
      this.templates[intent] = {};
    }
    if (!this.templates[intent][language]) {
      this.templates[intent][language] = [];
    }
    this.templates[intent][language].push(template);
    return true;
  }

  getAvailableIntents() {
    return Object.keys(this.templates);
  }
}

class AIEntityExtractor extends EventEmitter {
  constructor() {
    super();
    this.patterns = {
      phone: {
        regex: /(?:\+971|00971|971)?[\s-]?(?:5[0-9]|4[0-9])[\s-]?\d{3}[\s-]?\d{4}/g,
        type: 'phone_uae'
      },
      email: {
        regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        type: 'email'
      },
      price: {
        regex: /(?:aed|dhs?)?\s*[\d,]+(?:\s*(?:k|m|million|thousand))?/gi,
        type: 'price'
      },
      bedrooms: {
        regex: /(\d+)\s*(?:bed|br|bedroom|bhk)/gi,
        type: 'bedrooms'
      },
      area: {
        regex: /(?:palm|marina|downtown|jvc|jlt|business bay|difc|silicon oasis|arabian ranches|jumeirah|emirates hills|creek harbour)/gi,
        type: 'location'
      },
      propertyType: {
        regex: /(?:villa|apartment|studio|townhouse|penthouse|duplex|loft|office|retail|warehouse)/gi,
        type: 'property_type'
      },
      date: {
        regex: /(?:today|tomorrow|next week|this weekend|\d{1,2}[\/\-]\d{1,2}[\/\-]?\d{0,4})/gi,
        type: 'date'
      }
    };
  }

  extract(text) {
    const entities = [];
    
    for (const [name, config] of Object.entries(this.patterns)) {
      const matches = text.match(config.regex);
      if (matches) {
        for (const match of matches) {
          entities.push({
            type: config.type,
            value: match.trim(),
            normalized: this.normalize(config.type, match),
            position: text.indexOf(match)
          });
        }
      }
    }

    entities.sort((a, b) => a.position - b.position);

    return {
      entities,
      count: entities.length,
      types: [...new Set(entities.map(e => e.type))],
      timestamp: new Date().toISOString()
    };
  }

  normalize(type, value) {
    switch (type) {
      case 'phone_uae':
        return value.replace(/[\s\-]/g, '').replace(/^00/, '+').replace(/^971/, '+971');
      case 'price':
        const num = value.replace(/[^\d]/g, '');
        if (/million|m$/i.test(value)) return parseInt(num) * 1000000;
        if (/thousand|k$/i.test(value)) return parseInt(num) * 1000;
        return parseInt(num);
      case 'bedrooms':
        return parseInt(value.match(/\d+/)[0]);
      default:
        return value.toLowerCase().trim();
    }
  }
}

class AISmartRouter extends EventEmitter {
  constructor() {
    super();
    this.routes = {
      hot_lead: { priority: 1, handler: 'senior_agent', sla: 60 },
      viewing: { priority: 2, handler: 'viewing_coordinator', sla: 120 },
      complaint: { priority: 1, handler: 'manager', sla: 30 },
      negotiation: { priority: 2, handler: 'sales_manager', sla: 90 },
      documentation: { priority: 3, handler: 'documentation_team', sla: 240 },
      general: { priority: 4, handler: 'available_agent', sla: 480 }
    };
  }

  async routeConversation(intent, leadScore, sentiment) {
    let routeKey = 'general';

    if (sentiment?.requiresEscalation) {
      routeKey = 'complaint';
    } else if (leadScore?.score >= 80) {
      routeKey = 'hot_lead';
    } else if (intent?.primaryIntent?.intent === 'viewing_request') {
      routeKey = 'viewing';
    } else if (intent?.primaryIntent?.intent === 'negotiation') {
      routeKey = 'negotiation';
    } else if (intent?.primaryIntent?.intent === 'documentation') {
      routeKey = 'documentation';
    }

    const route = this.routes[routeKey];

    return {
      routeKey,
      ...route,
      assignedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + route.sla * 60000).toISOString()
    };
  }
}

export const intentClassifier = new AIIntentClassifier();
export const leadScorer = new AILeadScorer();
export const sentimentAnalyzer = new AISentimentAnalyzer();
export const languageDetector = new AILanguageDetector();
export const responseGenerator = new AIResponseGenerator();
export const entityExtractor = new AIEntityExtractor();
export const smartRouter = new AISmartRouter();

export default {
  intentClassifier,
  leadScorer,
  sentimentAnalyzer,
  languageDetector,
  responseGenerator,
  entityExtractor,
  smartRouter,
  version: '2.0.0',
  type: 'open-source',
  cost: 'free'
};
