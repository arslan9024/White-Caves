import { EventEmitter } from 'events';

class AIIntentClassifier extends EventEmitter {
  constructor() {
    super();
    this.intents = {
      property_inquiry: ['price', 'cost', 'how much', 'available', 'rent', 'buy', 'bedroom', 'sqft', 'location'],
      viewing_request: ['visit', 'see', 'viewing', 'tour', 'appointment', 'schedule', 'meet'],
      documentation: ['document', 'contract', 'paper', 'sign', 'ejari', 'title deed'],
      negotiation: ['offer', 'negotiate', 'discount', 'best price', 'deal', 'lower'],
      urgency: ['urgent', 'asap', 'immediately', 'today', 'now', 'quick'],
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'salam', 'marhaba'],
      opt_out: ['stop', 'unsubscribe', 'remove', 'do not send', 'opt-out', 'no more'],
      complaint: ['problem', 'issue', 'complaint', 'unhappy', 'disappointed', 'wrong'],
      thank_you: ['thank', 'thanks', 'appreciate', 'grateful', 'shukran'],
      follow_up: ['update', 'status', 'progress', 'any news', 'waiting']
    };
    this.arabicIntents = {
      property_inquiry: ['سعر', 'كم', 'متاح', 'إيجار', 'شراء', 'غرفة'],
      greeting: ['السلام', 'مرحبا', 'صباح', 'مساء'],
      thank_you: ['شكرا', 'ممتن']
    };
  }

  async classifyIntent(message) {
    const lowerMessage = message.toLowerCase();
    const results = [];
    
    for (const [intent, keywords] of Object.entries(this.intents)) {
      const matches = keywords.filter(kw => lowerMessage.includes(kw));
      if (matches.length > 0) {
        results.push({
          intent,
          confidence: Math.min(0.95, 0.5 + (matches.length * 0.15)),
          matchedKeywords: matches
        });
      }
    }

    for (const [intent, keywords] of Object.entries(this.arabicIntents)) {
      const matches = keywords.filter(kw => message.includes(kw));
      if (matches.length > 0) {
        const existing = results.find(r => r.intent === intent);
        if (existing) {
          existing.confidence = Math.min(0.98, existing.confidence + 0.1);
        } else {
          results.push({
            intent,
            confidence: Math.min(0.95, 0.5 + (matches.length * 0.15)),
            matchedKeywords: matches,
            language: 'arabic'
          });
        }
      }
    }

    results.sort((a, b) => b.confidence - a.confidence);
    
    return {
      primaryIntent: results[0] || { intent: 'general', confidence: 0.3 },
      allIntents: results,
      timestamp: new Date().toISOString()
    };
  }
}

class AILeadScorer extends EventEmitter {
  constructor() {
    super();
    this.weights = {
      responseSpeed: 15,
      messageCount: 10,
      questionAsked: 20,
      budgetMentioned: 25,
      timeframeMentioned: 15,
      propertySpecific: 20,
      viewingRequested: 30,
      documentRequested: 25,
      negotiationInitiated: 20,
      repeatContact: 15
    };
  }

  async scoreLeadFromConversation(conversation) {
    let score = 0;
    const factors = [];

    if (conversation.responseTimeMinutes && conversation.responseTimeMinutes < 30) {
      score += this.weights.responseSpeed;
      factors.push({ factor: 'Fast Response', points: this.weights.responseSpeed });
    }

    if (conversation.messageCount > 3) {
      const points = Math.min(this.weights.messageCount, conversation.messageCount * 2);
      score += points;
      factors.push({ factor: 'Engaged Conversation', points });
    }

    const text = (conversation.messages || []).join(' ').toLowerCase();

    if (text.includes('price') || text.includes('cost') || text.includes('budget') || text.includes('aed')) {
      score += this.weights.budgetMentioned;
      factors.push({ factor: 'Budget Interest', points: this.weights.budgetMentioned });
    }

    if (text.includes('when') || text.includes('move') || text.includes('ready') || text.includes('handover')) {
      score += this.weights.timeframeMentioned;
      factors.push({ factor: 'Timeline Mentioned', points: this.weights.timeframeMentioned });
    }

    if (text.includes('viewing') || text.includes('visit') || text.includes('see the')) {
      score += this.weights.viewingRequested;
      factors.push({ factor: 'Viewing Requested', points: this.weights.viewingRequested });
    }

    if (text.includes('bedroom') || text.includes('villa') || text.includes('apartment') || text.includes('townhouse')) {
      score += this.weights.propertySpecific;
      factors.push({ factor: 'Property Specific', points: this.weights.propertySpecific });
    }

    const normalizedScore = Math.min(100, Math.round(score));

    return {
      score: normalizedScore,
      grade: this.getGrade(normalizedScore),
      factors,
      recommendation: this.getRecommendation(normalizedScore),
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

  getRecommendation(score) {
    if (score >= 80) return 'Hot lead - Immediate follow-up required';
    if (score >= 60) return 'Warm lead - Schedule viewing within 24h';
    if (score >= 40) return 'Interested - Continue nurturing';
    if (score >= 20) return 'Early stage - Add to drip campaign';
    return 'Cold lead - Low priority';
  }
}

class AISentimentAnalyzer extends EventEmitter {
  constructor() {
    super();
    this.positiveWords = ['great', 'good', 'excellent', 'perfect', 'love', 'interested', 'amazing', 'wonderful', 'thanks', 'appreciate'];
    this.negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'angry', 'frustrated', 'problem', 'issue', 'complaint'];
    this.urgencyWords = ['urgent', 'asap', 'immediately', 'now', 'quickly', 'hurry'];
  }

  async analyzeSentiment(text) {
    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    let urgencyCount = 0;

    this.positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });

    this.negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });

    this.urgencyWords.forEach(word => {
      if (lowerText.includes(word)) urgencyCount++;
    });

    let sentiment = 'neutral';
    let score = 0.5;

    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      score = Math.min(1, 0.5 + (positiveCount * 0.1));
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      score = Math.max(0, 0.5 - (negativeCount * 0.1));
    }

    return {
      sentiment,
      score,
      positiveIndicators: positiveCount,
      negativeIndicators: negativeCount,
      urgency: urgencyCount > 0,
      urgencyLevel: urgencyCount > 2 ? 'high' : urgencyCount > 0 ? 'medium' : 'low',
      timestamp: new Date().toISOString()
    };
  }
}

class AILanguageDetector extends EventEmitter {
  constructor() {
    super();
    this.arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
    this.hindiPattern = /[\u0900-\u097F]/;
    this.chinesePattern = /[\u4E00-\u9FFF]/;
  }

  detect(text) {
    if (this.arabicPattern.test(text)) {
      return { language: 'arabic', code: 'ar', confidence: 0.95 };
    }
    if (this.hindiPattern.test(text)) {
      return { language: 'hindi', code: 'hi', confidence: 0.95 };
    }
    if (this.chinesePattern.test(text)) {
      return { language: 'chinese', code: 'zh', confidence: 0.95 };
    }
    return { language: 'english', code: 'en', confidence: 0.85 };
  }
}

class AIResponseGenerator extends EventEmitter {
  constructor() {
    super();
    this.templates = {
      property_inquiry: {
        en: "Thank you for your interest! I'd be happy to provide more details about this property. What specific information would you like to know?",
        ar: "شكراً لاهتمامك! يسعدني تقديم المزيد من التفاصيل حول هذا العقار. ما هي المعلومات التي تريد معرفتها؟"
      },
      viewing_request: {
        en: "I'd love to arrange a viewing for you. What dates and times work best for your schedule?",
        ar: "أرغب في ترتيب معاينة لك. ما هي التواريخ والأوقات المناسبة لجدولك؟"
      },
      greeting: {
        en: "Hello! Welcome to White Caves Real Estate. How may I assist you today?",
        ar: "مرحباً! أهلاً بك في وايت كيفز العقارية. كيف يمكنني مساعدتك اليوم؟"
      },
      thank_you: {
        en: "You're welcome! Please don't hesitate to reach out if you have any more questions.",
        ar: "على الرحب والسعة! لا تتردد في التواصل معنا إذا كان لديك أي أسئلة أخرى."
      },
      opt_out: {
        en: "We've noted your preference and removed you from our contact list. Thank you for your time.",
        ar: "لقد لاحظنا تفضيلك وأزلناك من قائمة الاتصال لدينا. شكراً لوقتك."
      }
    };
  }

  async generateResponse(intent, language = 'en') {
    const template = this.templates[intent];
    if (!template) {
      return {
        response: language === 'ar' 
          ? "شكراً لتواصلك معنا. سيتصل بك أحد مستشارينا قريباً."
          : "Thank you for reaching out. One of our consultants will contact you shortly.",
        generated: true,
        intent,
        language
      };
    }

    return {
      response: template[language] || template.en,
      generated: true,
      intent,
      language
    };
  }
}

export const intentClassifier = new AIIntentClassifier();
export const leadScorer = new AILeadScorer();
export const sentimentAnalyzer = new AISentimentAnalyzer();
export const languageDetector = new AILanguageDetector();
export const responseGenerator = new AIResponseGenerator();

export default {
  intentClassifier,
  leadScorer,
  sentimentAnalyzer,
  languageDetector,
  responseGenerator
};
