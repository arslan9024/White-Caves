const trainingData = {
  intents: [
    {
      name: 'greeting',
      priority: 1,
      examples: {
        en: [
          'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
          'hi there', 'greetings', 'howdy', 'hey there'
        ],
        ar: [
          'مرحبا', 'السلام عليكم', 'صباح الخير', 'مساء الخير', 'أهلا', 'هلا',
          'مرحبتين', 'أهلين', 'هاي'
        ]
      },
      responses: {
        en: [
          "Hello! Welcome to White Caves Real Estate. How can I assist you today?",
          "Hi there! I'm here to help you find your perfect property in Dubai. What are you looking for?",
          "Welcome! Whether you're buying, selling, or renting, I'm here to help. How may I assist you?"
        ],
        ar: [
          "مرحباً! أهلاً بك في وايت كيفز للعقارات. كيف يمكنني مساعدتك اليوم؟",
          "أهلاً وسهلاً! أنا هنا لمساعدتك في إيجاد عقارك المثالي في دبي. ماذا تبحث عنه؟",
          "مرحباً بك! سواء كنت تريد الشراء أو البيع أو الإيجار، أنا هنا للمساعدة. كيف يمكنني خدمتك؟"
        ]
      },
      entities: []
    },
    {
      name: 'property_inquiry',
      priority: 2,
      examples: {
        en: [
          'looking for apartment', 'want to buy villa', 'need a property',
          'show me apartments', 'properties for sale', 'properties for rent',
          'looking for 2 bedroom', '3 bed apartment', 'studio for rent',
          'penthouse for sale', 'townhouse in dubai'
        ],
        ar: [
          'أبحث عن شقة', 'أريد شراء فيلا', 'أحتاج عقار',
          'أرني شقق', 'عقارات للبيع', 'عقارات للإيجار',
          'أبحث عن غرفتين', 'شقة 3 غرف', 'استوديو للإيجار',
          'بنتهاوس للبيع', 'تاون هاوس في دبي'
        ]
      },
      responses: {
        en: [
          "I can help you find the perfect property. Which area in Dubai are you interested in?",
          "Great! We have many options available. What's your preferred location?",
          "I'd be happy to help you find a property. Could you tell me your budget range?"
        ],
        ar: [
          "يمكنني مساعدتك في إيجاد العقار المثالي. أي منطقة في دبي تفضل؟",
          "ممتاز! لدينا العديد من الخيارات. ما هو موقعك المفضل؟",
          "سأكون سعيداً بمساعدتك في إيجاد عقار. هل يمكنك إخباري بميزانيتك؟"
        ]
      },
      entities: ['propertyType', 'bedrooms', 'listingType']
    },
    {
      name: 'location_inquiry',
      priority: 2,
      examples: {
        en: [
          'dubai marina', 'palm jumeirah', 'downtown dubai', 'business bay',
          'jbr', 'arabian ranches', 'jumeirah', 'al barsha', 'deira',
          'properties in marina', 'apartments in downtown', 'villas in palm'
        ],
        ar: [
          'دبي مارينا', 'نخلة جميرا', 'وسط دبي', 'بيزنس باي',
          'جي بي آر', 'المرابع العربية', 'جميرا', 'البرشاء', 'ديرة',
          'عقارات في المارينا', 'شقق في داون تاون', 'فلل في النخلة'
        ]
      },
      responses: {
        en: [
          "That's a fantastic choice! We have several properties available there. Would you like to see the listings?",
          "I have several options in that area. Are you looking to buy or rent?",
          "That's one of the most sought-after areas in Dubai. What type of property interests you there?"
        ],
        ar: [
          "خيار رائع! لدينا عدة عقارات متاحة هناك. هل تود رؤية القوائم؟",
          "لدي عدة خيارات في تلك المنطقة. هل تريد الشراء أم الإيجار؟",
          "هذه من أكثر المناطق طلباً في دبي. ما نوع العقار الذي يهمك هناك؟"
        ]
      },
      entities: ['location', 'community', 'emirate']
    },
    {
      name: 'budget_inquiry',
      priority: 3,
      examples: {
        en: [
          'my budget is', 'price range', 'under 1 million', 'around 500k',
          '2 million budget', 'how much', 'what\'s the price', 'cost',
          'affordable', 'luxury', 'premium'
        ],
        ar: [
          'ميزانيتي', 'نطاق السعر', 'أقل من مليون', 'حوالي 500 ألف',
          'ميزانية 2 مليون', 'كم السعر', 'ما هو السعر', 'التكلفة',
          'بأسعار معقولة', 'فاخر', 'راقي'
        ]
      },
      responses: {
        en: [
          "With that budget, I can show you excellent options. Shall I send you some listings?",
          "For that price range, we have several matching properties. Would you like the details?",
          "That's a great budget for Dubai real estate. Let me find the best matches for you."
        ],
        ar: [
          "بهذه الميزانية، يمكنني عرض خيارات ممتازة لك. هل أرسل لك بعض القوائم؟",
          "لهذا النطاق السعري، لدينا عدة عقارات مطابقة. هل تريد التفاصيل؟",
          "هذه ميزانية جيدة للعقارات في دبي. دعني أجد أفضل الخيارات لك."
        ]
      },
      entities: ['budget', 'currency', 'priceRange']
    },
    {
      name: 'schedule_viewing',
      priority: 4,
      examples: {
        en: [
          'schedule viewing', 'book appointment', 'want to see the property',
          'arrange visit', 'viewing time', 'can I visit', 'tour',
          'show me the property', 'when can I see it', 'tomorrow viewing'
        ],
        ar: [
          'حجز موعد', 'جدولة معاينة', 'أريد رؤية العقار',
          'ترتيب زيارة', 'وقت المعاينة', 'هل يمكنني الزيارة', 'جولة',
          'أرني العقار', 'متى يمكنني رؤيته', 'معاينة غداً'
        ]
      },
      responses: {
        en: [
          "I'd be happy to schedule a viewing for you. When would be a convenient time?",
          "Great! I can book a viewing for you. Would you prefer morning or afternoon?",
          "Let me connect you with our agent who will arrange the viewing. What's your preferred date and time?"
        ],
        ar: [
          "سأكون سعيداً بترتيب موعد معاينة لك. متى يكون الوقت المناسب؟",
          "ممتاز! يمكنني حجز معاينة لك. هل تفضل الصباح أم المساء؟",
          "دعني أوصلك بوكيلنا الذي سيرتب المعاينة. ما هو التاريخ والوقت المفضل لديك؟"
        ]
      },
      entities: ['date', 'time', 'propertyId']
    },
    {
      name: 'contact_agent',
      priority: 4,
      examples: {
        en: [
          'talk to agent', 'speak to someone', 'human agent', 'call me',
          'contact me', 'need help', 'representative', 'consultant',
          'real person', 'phone call'
        ],
        ar: [
          'تحدث مع وكيل', 'أريد شخص', 'وكيل بشري', 'اتصل بي',
          'تواصل معي', 'أحتاج مساعدة', 'ممثل', 'مستشار',
          'شخص حقيقي', 'مكالمة هاتفية'
        ]
      },
      responses: {
        en: [
          "I'll connect you with one of our expert agents right away. They will reach out to you shortly!",
          "Our agents are available to help. Someone will contact you within the next few minutes.",
          "I'll have a property consultant reach out to you. Expect a call or message soon!"
        ],
        ar: [
          "سأوصلك بأحد وكلائنا الخبراء فوراً. سيتواصلون معك قريباً!",
          "وكلاؤنا متاحون للمساعدة. سيتواصل معك أحدهم خلال دقائق.",
          "سأطلب من مستشار عقاري التواصل معك. توقع مكالمة أو رسالة قريباً!"
        ]
      },
      entities: ['contactMethod', 'phoneNumber']
    },
    {
      name: 'price_inquiry',
      priority: 3,
      examples: {
        en: [
          'what is the price', 'how much does it cost', 'price of this property',
          'rental price', 'sale price', 'monthly rent', 'annual rent',
          'asking price', 'negotiable'
        ],
        ar: [
          'ما هو السعر', 'كم يكلف', 'سعر هذا العقار',
          'سعر الإيجار', 'سعر البيع', 'الإيجار الشهري', 'الإيجار السنوي',
          'السعر المطلوب', 'قابل للتفاوض'
        ]
      },
      responses: {
        en: [
          "Prices vary based on location and property type. Could you share more details about what you're looking for?",
          "I can provide pricing information. Which property or area are you interested in?",
          "Our listings range from affordable studios to luxury penthouses. What's your budget range?"
        ],
        ar: [
          "الأسعار تختلف حسب الموقع ونوع العقار. هل يمكنك مشاركة المزيد من التفاصيل؟",
          "يمكنني تقديم معلومات الأسعار. أي عقار أو منطقة تهمك؟",
          "قوائمنا تتراوح من استوديوهات بأسعار معقولة إلى بنتهاوس فاخرة. ما هو نطاق ميزانيتك؟"
        ]
      },
      entities: ['price', 'listingType']
    },
    {
      name: 'document_inquiry',
      priority: 3,
      examples: {
        en: [
          'what documents needed', 'paperwork', 'requirements for buying',
          'rental requirements', 'visa requirement', 'emirates id needed',
          'title deed', 'ejari', 'noc', 'rera'
        ],
        ar: [
          'ما هي المستندات المطلوبة', 'الأوراق', 'متطلبات الشراء',
          'متطلبات الإيجار', 'متطلبات التأشيرة', 'هل أحتاج هوية إماراتية',
          'سند الملكية', 'إيجاري', 'شهادة عدم ممانعة', 'ريرا'
        ]
      },
      responses: {
        en: [
          "For property transactions in Dubai, you'll typically need: passport copy, visa copy, Emirates ID (if resident), and proof of income. Our team will guide you through every step!",
          "The documentation process is straightforward. Our team will guide you through every step. Would you like me to connect you with an agent?",
          "I can provide a complete checklist of documents needed. Would you like that?"
        ],
        ar: [
          "للمعاملات العقارية في دبي، ستحتاج عادة: صورة جواز السفر، صورة التأشيرة، الهوية الإماراتية (للمقيمين)، وإثبات الدخل. فريقنا سيرشدك في كل خطوة!",
          "عملية التوثيق بسيطة. فريقنا سيرشدك في كل خطوة. هل تريد أن أوصلك بوكيل؟",
          "يمكنني تقديم قائمة كاملة بالمستندات المطلوبة. هل تريد ذلك؟"
        ]
      },
      entities: ['transactionType', 'documentType']
    },
    {
      name: 'thank_you',
      priority: 1,
      examples: {
        en: [
          'thank you', 'thanks', 'appreciate it', 'great help', 'helpful',
          'thank you so much', 'thanks a lot', 'you\'ve been helpful'
        ],
        ar: [
          'شكراً', 'شكراً جزيلاً', 'ممتن', 'مساعدة رائعة', 'مفيد جداً',
          'شكراً كثيراً', 'ألف شكر', 'كنت مفيداً'
        ]
      },
      responses: {
        en: [
          "You're welcome! Feel free to reach out if you have any more questions.",
          "My pleasure! Is there anything else I can help you with?",
          "Happy to help! Don't hesitate to contact us anytime."
        ],
        ar: [
          "على الرحب والسعة! لا تتردد في التواصل إذا كان لديك أي أسئلة أخرى.",
          "سعدت بخدمتك! هل هناك شيء آخر يمكنني مساعدتك به؟",
          "سعيد بالمساعدة! لا تتردد في التواصل معنا في أي وقت."
        ]
      },
      entities: []
    },
    {
      name: 'goodbye',
      priority: 1,
      examples: {
        en: [
          'bye', 'goodbye', 'see you', 'talk later', 'have a nice day',
          'take care', 'good night', 'later'
        ],
        ar: [
          'مع السلامة', 'وداعاً', 'إلى اللقاء', 'نتحدث لاحقاً', 'يوماً سعيداً',
          'اعتني بنفسك', 'تصبح على خير', 'لاحقاً'
        ]
      },
      responses: {
        en: [
          "Goodbye! Thank you for choosing White Caves Real Estate. Have a wonderful day!",
          "Take care! We look forward to helping you find your dream property.",
          "Goodbye! Feel free to reach out anytime. We're here for you."
        ],
        ar: [
          "مع السلامة! شكراً لاختيارك وايت كيفز للعقارات. يوماً سعيداً!",
          "اعتنِ بنفسك! نتطلع لمساعدتك في إيجاد عقار أحلامك.",
          "وداعاً! لا تتردد في التواصل في أي وقت. نحن هنا من أجلك."
        ]
      },
      entities: []
    }
  ],

  entities: {
    propertyType: {
      en: {
        'apartment': ['apartment', 'flat', 'unit', 'apt'],
        'villa': ['villa', 'house', 'home', 'residence'],
        'townhouse': ['townhouse', 'town house', 'th'],
        'penthouse': ['penthouse', 'ph', 'duplex'],
        'studio': ['studio', 'bachelor'],
        'office': ['office', 'commercial', 'workspace'],
        'warehouse': ['warehouse', 'storage', 'industrial'],
        'land': ['land', 'plot', 'vacant']
      },
      ar: {
        'شقة': ['شقة', 'وحدة', 'سكن'],
        'فيلا': ['فيلا', 'منزل', 'بيت', 'سكن'],
        'تاون هاوس': ['تاون هاوس', 'تاونهاوس'],
        'بنتهاوس': ['بنتهاوس', 'دوبلكس'],
        'استوديو': ['استوديو', 'ستوديو'],
        'مكتب': ['مكتب', 'تجاري', 'مساحة عمل'],
        'مستودع': ['مستودع', 'مخزن', 'صناعي'],
        'أرض': ['أرض', 'قطعة', 'فضاء']
      }
    },
    
    location: {
      en: {
        'dubai marina': ['dubai marina', 'marina', 'the marina'],
        'palm jumeirah': ['palm jumeirah', 'palm', 'the palm', 'palm island'],
        'downtown dubai': ['downtown dubai', 'downtown', 'dt', 'burj khalifa area'],
        'business bay': ['business bay', 'bb'],
        'jbr': ['jbr', 'jumeirah beach residence', 'the walk'],
        'arabian ranches': ['arabian ranches', 'ranches', 'ar'],
        'jumeirah': ['jumeirah', 'jumeira'],
        'al barsha': ['al barsha', 'barsha'],
        'deira': ['deira', 'old dubai'],
        'dubai hills': ['dubai hills', 'hills estate', 'dh'],
        'emaar beachfront': ['emaar beachfront', 'beachfront'],
        'city walk': ['city walk', 'citywalk'],
        'bluewaters': ['bluewaters', 'bluewaters island', 'ain dubai']
      },
      ar: {
        'دبي مارينا': ['دبي مارينا', 'المارينا', 'مارينا'],
        'نخلة جميرا': ['نخلة جميرا', 'النخلة', 'بالم'],
        'وسط دبي': ['وسط دبي', 'داون تاون', 'منطقة برج خليفة'],
        'بيزنس باي': ['بيزنس باي', 'خليج الأعمال'],
        'جي بي آر': ['جي بي آر', 'شاطئ جميرا ريزيدنس'],
        'المرابع العربية': ['المرابع العربية', 'أرابيان رانشز'],
        'جميرا': ['جميرا', 'جميره'],
        'البرشاء': ['البرشاء', 'برشاء'],
        'ديرة': ['ديرة', 'دبي القديمة'],
        'دبي هيلز': ['دبي هيلز', 'هيلز استيت'],
        'إعمار بيتشفرونت': ['إعمار بيتشفرونت', 'الواجهة البحرية'],
        'سيتي ووك': ['سيتي ووك'],
        'بلو واترز': ['بلو واترز', 'جزيرة بلو واترز', 'عين دبي']
      }
    },

    bedrooms: {
      patterns: {
        en: /(\d+)\s*(bed|bedroom|br|bhk)/i,
        ar: /(\d+)\s*(غرف|غرفة|نوم)/
      }
    },

    budget: {
      patterns: {
        en: /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(k|m|million|thousand|aed|dhs)?/i,
        ar: /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(ألف|مليون|درهم)?/
      }
    }
  },

  fallback: {
    en: [
      "I'm not sure I understand. Could you rephrase that?",
      "Let me connect you with one of our agents who can better assist you.",
      "I didn't quite catch that. Are you looking to buy, sell, or rent a property?"
    ],
    ar: [
      "لست متأكداً من فهمي. هل يمكنك إعادة الصياغة؟",
      "دعني أوصلك بأحد وكلائنا الذي يمكنه مساعدتك بشكل أفضل.",
      "لم أفهم ذلك تماماً. هل تريد الشراء أو البيع أو الإيجار؟"
    ]
  }
};

class ChatbotService {
  constructor() {
    this.trainingData = trainingData;
    this.conversationContext = new Map();
  }

  detectLanguage(message) {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(message) ? 'ar' : 'en';
  }

  normalizeText(text, language) {
    let normalized = text.toLowerCase().trim();
    if (language === 'ar') {
      normalized = normalized
        .replace(/[أإآا]/g, 'ا')
        .replace(/[ؤئء]/g, '')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي');
    }
    return normalized;
  }

  extractEntities(message, language) {
    const entities = {};
    const normalizedMessage = this.normalizeText(message, language);

    Object.entries(this.trainingData.entities.propertyType[language] || {}).forEach(([type, synonyms]) => {
      if (synonyms.some(syn => normalizedMessage.includes(syn.toLowerCase()))) {
        entities.propertyType = type;
      }
    });

    Object.entries(this.trainingData.entities.location[language] || {}).forEach(([location, synonyms]) => {
      if (synonyms.some(syn => normalizedMessage.includes(syn.toLowerCase()))) {
        entities.location = location;
      }
    });

    const bedroomPattern = this.trainingData.entities.bedrooms.patterns[language];
    const bedroomMatch = message.match(bedroomPattern);
    if (bedroomMatch) {
      entities.bedrooms = parseInt(bedroomMatch[1], 10);
    }

    const budgetPattern = this.trainingData.entities.budget.patterns[language];
    const budgetMatch = message.match(budgetPattern);
    if (budgetMatch) {
      let amount = parseFloat(budgetMatch[1].replace(/,/g, ''));
      const modifier = (budgetMatch[2] || '').toLowerCase();
      if (modifier === 'k' || modifier === 'ألف' || modifier === 'thousand') {
        amount *= 1000;
      } else if (modifier === 'm' || modifier === 'مليون' || modifier === 'million') {
        amount *= 1000000;
      }
      entities.budget = amount;
    }

    return entities;
  }

  findBestIntent(message, language) {
    const normalizedMessage = this.normalizeText(message, language);
    let bestMatch = null;
    let highestScore = 0;

    for (const intent of this.trainingData.intents) {
      const examples = intent.examples[language] || intent.examples.en;
      
      for (const example of examples) {
        const normalizedExample = this.normalizeText(example, language);
        const score = this.calculateSimilarity(normalizedMessage, normalizedExample);
        
        if (score > highestScore && score > 0.3) {
          highestScore = score;
          bestMatch = intent;
        }
      }
    }

    return { intent: bestMatch, confidence: highestScore };
  }

  calculateSimilarity(text1, text2) {
    const words1 = new Set(text1.split(/\s+/));
    const words2 = new Set(text2.split(/\s+/));
    
    const intersection = [...words1].filter(word => words2.has(word));
    const union = new Set([...words1, ...words2]);
    
    return intersection.length / union.size;
  }

  generateResponse(intent, entities, language, conversationId) {
    if (!intent) {
      const fallbacks = this.trainingData.fallback[language];
      return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    const responses = intent.responses[language] || intent.responses.en;
    let response = responses[Math.floor(Math.random() * responses.length)];

    Object.entries(entities).forEach(([key, value]) => {
      response = response.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
    });

    response = response.replace(/\$\{[^}]+\}/g, '');

    return response;
  }

  processMessage(message, conversationId = 'default') {
    const language = this.detectLanguage(message);
    const entities = this.extractEntities(message, language);
    const { intent, confidence } = this.findBestIntent(message, language);

    let context = this.conversationContext.get(conversationId) || {
      entities: {},
      lastIntent: null,
      language: language
    };

    context.entities = { ...context.entities, ...entities };
    context.lastIntent = intent?.name;
    context.language = language;
    this.conversationContext.set(conversationId, context);

    const response = this.generateResponse(intent, context.entities, language, conversationId);

    return {
      response,
      intent: intent?.name || 'unknown',
      confidence,
      entities,
      language,
      suggestedActions: this.getSuggestedActions(intent, language)
    };
  }

  getSuggestedActions(intent, language) {
    const actions = {
      en: {
        property_inquiry: ['View Properties', 'Schedule Viewing', 'Talk to Agent'],
        location_inquiry: ['Show Properties', 'Compare Areas', 'Market Analysis'],
        budget_inquiry: ['See Matches', 'Adjust Budget', 'Financing Options'],
        schedule_viewing: ['Morning Slot', 'Afternoon Slot', 'Weekend'],
        contact_agent: ['Call Now', 'WhatsApp', 'Email'],
        greeting: ['Browse Properties', 'Schedule Viewing', 'Contact Agent'],
        price_inquiry: ['View Listings', 'Set Budget Alert', 'Talk to Agent'],
        document_inquiry: ['Get Checklist', 'Talk to Agent', 'Learn More']
      },
      ar: {
        property_inquiry: ['عرض العقارات', 'حجز معاينة', 'تحدث مع وكيل'],
        location_inquiry: ['عرض العقارات', 'مقارنة المناطق', 'تحليل السوق'],
        budget_inquiry: ['رؤية المتطابقات', 'تعديل الميزانية', 'خيارات التمويل'],
        schedule_viewing: ['موعد صباحي', 'موعد مسائي', 'نهاية الأسبوع'],
        contact_agent: ['اتصل الآن', 'واتساب', 'بريد إلكتروني'],
        greeting: ['تصفح العقارات', 'حجز معاينة', 'تواصل مع وكيل'],
        price_inquiry: ['عرض القوائم', 'تنبيه الميزانية', 'تحدث مع وكيل'],
        document_inquiry: ['الحصول على القائمة', 'تحدث مع وكيل', 'معرفة المزيد']
      }
    };

    if (!intent) return [];
    return actions[language]?.[intent.name] || actions.en[intent.name] || [];
  }

  clearContext(conversationId) {
    this.conversationContext.delete(conversationId);
  }

  calculateLeadScore(conversationId) {
    const context = this.conversationContext.get(conversationId);
    if (!context) return 0;

    let score = 0;
    if (context.entities.propertyType) score += 20;
    if (context.entities.location) score += 20;
    if (context.entities.budget) score += 25;
    if (context.entities.bedrooms) score += 15;
    if (context.lastIntent === 'schedule_viewing') score += 30;
    if (context.lastIntent === 'contact_agent') score += 25;

    return Math.min(score, 100);
  }
}

const chatbotService = new ChatbotService();

export { ChatbotService, chatbotService };
export default chatbotService;
