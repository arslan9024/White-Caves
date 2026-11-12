import type { Express } from 'express';
export function mountChatbot(app: Express): void {
  app.post('/api/chatbot/test', async (req, res) => {
    const { message } = req.body;
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'message must be a non-empty string' });
    }
    const lower = message.toLowerCase();

    const isArabic = /[\u0600-\u06FF]/.test(message);
    const language = isArabic ? 'ar' : 'en';

    const intents = {
      property_inquiry: [
        'property',
        'apartment',
        'villa',
        'rent',
        'buy',
        'شقة',
        'فيلا',
        'إيجار',
        'شراء',
      ],
      viewing_request: ['view', 'visit', 'see', 'tour', 'معاينة', 'زيارة'],
      price_inquiry: ['price', 'cost', 'how much', 'سعر', 'كم'],
      agent_request: ['agent', 'contact', 'call', 'وكيل', 'اتصل'],
      greeting: ['hello', 'hi', 'مرحبا', 'السلام'],
    };

    let detected = 'general_inquiry';
    let confidence = 60;
    for (const [intent, kws] of Object.entries(intents)) {
      if (kws.some(k => lower.includes(k))) {
        detected = intent;
        confidence = 85;
        break;
      }
    }

    const responses = new Map([
      [
        'property_inquiry',
        {
          en: "I'd be happy to help you find the perfect property. What type are you looking for?",
          ar: 'يسعدني مساعدتك في العثور على العقار المثالي. ما نوع العقار؟',
        },
      ],
      [
        'viewing_request',
        {
          en: 'I can schedule a viewing for you. When would be convenient?',
          ar: 'يمكنني تحديد موعد للمعاينة. ما هو الوقت المناسب؟',
        },
      ],
      [
        'price_inquiry',
        {
          en: "Our properties range from affordable to luxury. What's your budget?",
          ar: 'تتراوح عقاراتنا من الميزانية المعقولة إلى الفاخرة. ما ميزانيتك؟',
        },
      ],
      [
        'agent_request',
        {
          en: "I'll connect you with an experienced agent right away.",
          ar: 'سأقوم بتوصيلك بأحد وكلائنا فوراً.',
        },
      ],
      [
        'greeting',
        {
          en: 'Hello! Welcome to White Caves Real Estate. How can I assist you?',
          ar: 'مرحباً! أهلاً بك في وايت كيفز العقارية. كيف يمكنني مساعدتك؟',
        },
      ],
      [
        'general_inquiry',
        {
          en: 'Thank you for your message. How can I help with your real estate needs?',
          ar: 'شكراً لرسالتك. كيف يمكنني مساعدتك؟',
        },
      ],
    ]);
    const entry = responses.get(detected);
    const responseText = entry ? (language === 'ar' ? entry.ar : entry.en) : '';

    res.json({
      success: true,
      response: responseText,
      intent: detected,
      confidence,
      language,
    });
  });
}
