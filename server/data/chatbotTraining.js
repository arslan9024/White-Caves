const chatbotTraining = {
  intents: [
    {
      name: "property_inquiry",
      examples: {
        en: [
          "Looking for 2 bedroom apartment in Dubai Marina",
          "Show me villas for rent in Arabian Ranches",
          "Properties for sale in Business Bay under 2M AED",
          "I want to buy a penthouse in Palm Jumeirah",
          "Any townhouses available in Emirates Hills?",
          "Looking for studio apartment in JBR"
        ],
        ar: [
          "أبحث عن شقة غرفتين في دبي مارينا",
          "أرغب في فيلات للإيجار في الرانش العربية",
          "عقارات للبيع في بيزنس باي بأقل من ٢ مليون درهم",
          "أريد شراء بنتهاوس في نخلة جميرا",
          "هل يوجد تاون هاوس في تلال الإمارات؟",
          "أبحث عن استوديو في جي بي آر"
        ]
      },
      responses: {
        en: [
          "I found {count} properties in {location}. What's your budget range?",
          "Great! I have {count} {property_type} options in {location}. When would you like to view?",
          "I can help you find the perfect {property_type}. What's your preferred area?",
          "We have excellent {property_type} options available. May I know your budget?"
        ],
        ar: [
          "وجدت {count} عقار في {location}. ما هو نطاق ميزانيتك؟",
          "ممتاز! لدي {count} خيار {property_type} في {location}. متى ترغب في المعاينة؟",
          "يمكنني مساعدتك في إيجاد {property_type} المثالي. ما هي منطقتك المفضلة؟",
          "لدينا خيارات ممتازة من {property_type}. هل يمكنني معرفة ميزانيتك؟"
        ]
      }
    },
    {
      name: "viewing_request",
      examples: {
        en: [
          "Can I view the property tomorrow?",
          "Schedule a viewing for Friday at 4 PM",
          "I want to visit the villa this weekend",
          "Book an appointment for property inspection",
          "When can I see this apartment?"
        ],
        ar: [
          "هل يمكنني معاينة العقار غداً؟",
          "حدد موعد معاينة يوم الجمعة الساعة ٤ مساءً",
          "أرغب في زيارة الفيلا نهاية هذا الأسبوع",
          "احجز موعد لفحص العقار",
          "متى يمكنني رؤية هذه الشقة؟"
        ]
      },
      responses: {
        en: [
          "I've scheduled a viewing for {date} at {time}. You'll receive a calendar invite shortly.",
          "Viewing scheduled! Your agent {agent_name} will meet you at the property.",
          "Perfect! I'll arrange a viewing. What time works best for you?",
          "Our agent will contact you shortly to confirm the viewing appointment."
        ],
        ar: [
          "لقد حددت موعد معاينة يوم {date} الساعة {time}. ستستلم دعوة التقويم قريباً.",
          "تم تحديد موعد المعاينة! وكيلك {agent_name} سيلتقيك في العقار.",
          "ممتاز! سأرتب موعد معاينة. ما هو الوقت المناسب لك؟",
          "وكيلنا سيتواصل معك قريباً لتأكيد موعد المعاينة."
        ]
      }
    },
    {
      name: "price_inquiry",
      examples: {
        en: [
          "What's the price of this property?",
          "Is there any discount available?",
          "What are the payment terms?",
          "How much is the rent per year?",
          "Can you negotiate the price?"
        ],
        ar: [
          "ما هو سعر هذا العقار؟",
          "هل يوجد خصم متاح؟",
          "ما هي شروط الدفع؟",
          "كم الإيجار السنوي؟",
          "هل يمكن التفاوض على السعر؟"
        ]
      },
      responses: {
        en: [
          "The property is listed at AED {price}. Would you like more details on payment options?",
          "We offer flexible payment plans including 1, 2, 4, or 12 cheques. What suits you best?",
          "The asking price is negotiable. Let me connect you with our sales team."
        ],
        ar: [
          "سعر العقار {price} درهم. هل تريد مزيد من التفاصيل عن خيارات الدفع؟",
          "نقدم خطط دفع مرنة تشمل ١، ٢، ٤، أو ١٢ شيك. ما الذي يناسبك؟",
          "السعر المطلوب قابل للتفاوض. دعني أوصلك بفريق المبيعات."
        ]
      }
    },
    {
      name: "contact_agent",
      examples: {
        en: [
          "I want to speak to an agent",
          "Connect me with a sales representative",
          "Can someone call me?",
          "I need to talk to someone about this property"
        ],
        ar: [
          "أريد التحدث مع وكيل",
          "وصلني بممثل المبيعات",
          "هل يمكن لأحد الاتصال بي؟",
          "أحتاج التحدث مع شخص حول هذا العقار"
        ]
      },
      responses: {
        en: [
          "I'll connect you with our best agent for this property. They'll call you within 5 minutes.",
          "Our sales team will reach out to you shortly. What's the best number to call?"
        ],
        ar: [
          "سأوصلك بأفضل وكيل لهذا العقار. سيتصل بك خلال ٥ دقائق.",
          "فريق المبيعات سيتواصل معك قريباً. ما هو أفضل رقم للاتصال؟"
        ]
      }
    },
    {
      name: "greeting",
      examples: {
        en: ["Hello", "Hi", "Hey", "Good morning", "Good afternoon"],
        ar: ["مرحبا", "السلام عليكم", "أهلاً", "صباح الخير", "مساء الخير"]
      },
      responses: {
        en: [
          "Hello! Welcome to White Caves Real Estate. How can I help you find your dream property in Dubai?",
          "Hi there! I'm here to assist you with your real estate needs. What are you looking for today?"
        ],
        ar: [
          "مرحباً! أهلاً بك في وايت كيفز العقارية. كيف يمكنني مساعدتك في إيجاد عقار أحلامك في دبي؟",
          "أهلاً! أنا هنا لمساعدتك في احتياجاتك العقارية. ما الذي تبحث عنه اليوم؟"
        ]
      }
    },
    {
      name: "farewell",
      examples: {
        en: ["Goodbye", "Bye", "Thanks", "Thank you", "That's all"],
        ar: ["مع السلامة", "شكراً", "هذا كل شيء", "وداعاً"]
      },
      responses: {
        en: [
          "Thank you for contacting White Caves Real Estate! Feel free to reach out anytime.",
          "Goodbye! We look forward to helping you find your perfect property."
        ],
        ar: [
          "شكراً لتواصلك مع وايت كيفز العقارية! لا تتردد في التواصل معنا في أي وقت.",
          "مع السلامة! نتطلع لمساعدتك في إيجاد عقارك المثالي."
        ]
      }
    }
  ],

  entities: {
    location: {
      type: "list",
      values: [
        { value: "Dubai Marina", synonyms: ["Marina", "دبي مارينا", "المارينا"] },
        { value: "Palm Jumeirah", synonyms: ["Palm", "نخلة جميرا", "النخلة"] },
        { value: "Downtown Dubai", synonyms: ["Downtown", "داون تاون", "وسط دبي"] },
        { value: "Business Bay", synonyms: ["بيزنس باي", "خليج الأعمال"] },
        { value: "JBR", synonyms: ["Jumeirah Beach Residence", "جي بي آر", "جميرا بيتش"] },
        { value: "Emirates Hills", synonyms: ["تلال الإمارات"] },
        { value: "Arabian Ranches", synonyms: ["الرانش العربية", "المرابع العربية"] },
        { value: "Dubai Hills", synonyms: ["تلال دبي", "دبي هيلز"] },
        { value: "City Walk", synonyms: ["سيتي ووك"] },
        { value: "Dubai Creek Harbour", synonyms: ["ميناء خور دبي"] }
      ]
    },
    propertyType: {
      type: "list",
      values: [
        { value: "apartment", synonyms: ["flat", "unit", "شقة", "وحدة"] },
        { value: "villa", synonyms: ["house", "فيلا", "منزل", "بيت"] },
        { value: "townhouse", synonyms: ["تاون هاوس", "منزل متلاصق"] },
        { value: "penthouse", synonyms: ["بنتهاوس", "شقة علوية"] },
        { value: "studio", synonyms: ["استوديو", "ستوديو"] },
        { value: "duplex", synonyms: ["دوبلكس", "شقة دوبلكس"] },
        { value: "office", synonyms: ["مكتب", "commercial"] },
        { value: "warehouse", synonyms: ["مستودع", "مخزن"] }
      ]
    },
    bedrooms: {
      type: "pattern",
      patterns: {
        en: /(\d+)\s*(?:bed(?:room)?s?|BR|bhk)/i,
        ar: /(\d+)\s*(?:غرف?(?:ة)?(?:\s*نوم)?)/i
      }
    },
    budget: {
      type: "pattern",
      patterns: {
        en: /(?:AED\s*)?(\d+(?:,\d{3})*(?:\.\d+)?)\s*(k|m|million|thousand)?/i,
        ar: /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(ألف|مليون|k|m)?\s*(?:درهم)?/i
      }
    }
  },

  quickReplies: {
    property_inquiry: [
      { label: "View Properties", action: "show_properties" },
      { label: "Schedule Viewing", action: "schedule_viewing" },
      { label: "Contact Agent", action: "contact_agent" }
    ],
    price_inquiry: [
      { label: "Payment Plans", action: "show_payment_plans" },
      { label: "Request Quote", action: "request_quote" },
      { label: "Mortgage Calculator", action: "mortgage_calculator" }
    ],
    general: [
      { label: "Buy Property", action: "buy" },
      { label: "Rent Property", action: "rent" },
      { label: "Sell Property", action: "sell" },
      { label: "Talk to Agent", action: "contact_agent" }
    ]
  }
};

export default chatbotTraining;
