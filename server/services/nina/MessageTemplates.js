const MESSAGE_TEMPLATES = {
  greetings: {
    morning_en: `Good morning! How are you doing today?`,
    morning_ar: `صباح الخير! كيف حالك اليوم؟`,
    afternoon_en: `Good Afternoon! I hope you are doing well.`,
    afternoon_ar: `مساء الخير! أتمنى أن تكون بخير.`,
    evening_en: `Good Evening! How can I assist you?`,
    evening_ar: `مساء النور! كيف يمكنني مساعدتك؟`,
    night_en: `Hello! Thank you for reaching out.`,
    night_ar: `مرحبا! شكرا للتواصل معنا.`,
    ramadan_en: `Ramadan Kareem! May this blessed month bring you peace.`,
    ramadan_ar: `رمضان كريم! أتمنى لك شهرا مباركا.`,
    eid_en: `Eid Mubarak! Wishing you and your family joy and happiness.`,
    eid_ar: `عيد مبارك! أتمنى لك ولعائلتك السعادة والفرح.`
  },

  property_inquiry: {
    initial_en: `Hello {client_name}! Thank you for your interest in {property_name}. Would you like to schedule a viewing?`,
    initial_ar: `مرحبا {client_name}! شكرا لاهتمامك بـ {property_name}. هل تود جدولة معاينة؟`,
    follow_up_en: `Hi {client_name}, I wanted to follow up on your interest in the {property_type} at {location}. Are you still looking?`,
    follow_up_ar: `مرحبا {client_name}، أردت المتابعة بشأن اهتمامك بـ {property_type} في {location}. هل لا تزال تبحث؟`,
    availability_en: `The property at {location} is currently available. May I share more details with you?`,
    availability_ar: `العقار في {location} متاح حاليا. هل يمكنني مشاركة المزيد من التفاصيل معك؟`
  },

  appointment: {
    confirmation_en: `Your viewing for {property_name} is confirmed for {date} at {time}. Please let me know if you need to reschedule.`,
    confirmation_ar: `تم تأكيد موعد المعاينة لـ {property_name} في {date} الساعة {time}. يرجى إخباري إذا كنت بحاجة لإعادة الجدولة.`,
    reminder_en: `Reminder: You have a viewing scheduled for {property_name} tomorrow at {time}. See you there!`,
    reminder_ar: `تذكير: لديك موعد معاينة لـ {property_name} غدا الساعة {time}. نراك هناك!`,
    reschedule_en: `We've rescheduled your viewing to {date} at {time}. Thank you for your flexibility.`,
    reschedule_ar: `تم إعادة جدولة معاينتك إلى {date} الساعة {time}. شكرا لتفهمك.`
  },

  payment: {
    reminder_en: `Dear {client_name}, this is a reminder that your payment of AED {amount} is due on {due_date}.`,
    reminder_ar: `عزيزي {client_name}، هذا تذكير بأن الدفعة المستحقة بقيمة {amount} درهم في تاريخ {due_date}.`,
    confirmation_en: `Thank you! We've received your payment of AED {amount}. Your receipt number is {receipt_id}.`,
    confirmation_ar: `شكرا! لقد استلمنا دفعتك بقيمة {amount} درهم. رقم الإيصال هو {receipt_id}.`,
    overdue_en: `Your payment of AED {amount} is now overdue. Please contact us to discuss payment options.`,
    overdue_ar: `دفعتك بقيمة {amount} درهم متأخرة الآن. يرجى التواصل معنا لمناقشة خيارات الدفع.`
  },

  general: {
    welcome_en: `Thank you for reaching out to White Caves Real Estate. An agent will respond shortly.`,
    welcome_ar: `شكرا للتواصل مع وايت كيفز للعقارات. سيتواصل معك أحد وكلائنا قريبا.`,
    away_en: `We're currently outside business hours. We'll respond when we're back online.`,
    away_ar: `نحن خارج ساعات العمل حاليا. سنرد عليك عند عودتنا.`,
    thank_you_en: `Thank you for your interest. We look forward to serving you!`,
    thank_you_ar: `شكرا لاهتمامك. نتطلع لخدمتك!`
  },

  campaigns: {
    damac_hills_2_en: `Assalam o alikum! Good Morning! I hope you are doing well. May I ask if your property is still available in Damac Hills 2 for "Sale" or "Rent"?`,
    damac_hills_2_ar: `السلام عليكم! صباح الخير! أتمنى أن تكون بخير. هل يمكنني السؤال إذا كان عقارك لا يزال متاحا في داماك هيلز 2 للبيع أو الإيجار؟`,
    owner_outreach_en: `Hello! We have buyers interested in properties in {location}. Is your property available?`,
    owner_outreach_ar: `مرحبا! لدينا مشترون مهتمون بالعقارات في {location}. هل عقارك متاح؟`
  }
};

class MessageTemplateService {
  constructor() {
    this.templates = MESSAGE_TEMPLATES;
    this.customTemplates = new Map();
  }

  getTemplate(category, key) {
    if (this.templates[category] && this.templates[category][key]) {
      return this.templates[category][key];
    }
    return this.customTemplates.get(`${category}.${key}`) || null;
  }

  getGreeting(language = 'en') {
    const hour = new Date().getHours();
    let timeOfDay;
    
    if (hour >= 5 && hour < 12) {
      timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 17) {
      timeOfDay = 'afternoon';
    } else if (hour >= 17 && hour < 21) {
      timeOfDay = 'evening';
    } else {
      timeOfDay = 'night';
    }

    return this.getTemplate('greetings', `${timeOfDay}_${language}`);
  }

  getBilingualGreeting() {
    const hour = new Date().getHours();
    let timeOfDay;
    
    if (hour >= 5 && hour < 12) {
      timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 17) {
      timeOfDay = 'afternoon';
    } else if (hour >= 17 && hour < 21) {
      timeOfDay = 'evening';
    } else {
      timeOfDay = 'night';
    }

    const en = this.getTemplate('greetings', `${timeOfDay}_en`);
    const ar = this.getTemplate('greetings', `${timeOfDay}_ar`);
    
    return `${en}\n\n${ar}`;
  }

  fillTemplate(template, variables) {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
  }

  addCustomTemplate(category, key, template) {
    this.customTemplates.set(`${category}.${key}`, template);
  }

  removeCustomTemplate(category, key) {
    return this.customTemplates.delete(`${category}.${key}`);
  }

  getAllTemplates() {
    const result = { ...this.templates };
    
    for (const [key, value] of this.customTemplates) {
      const [category, templateKey] = key.split('.');
      if (!result.custom) result.custom = {};
      if (!result.custom[category]) result.custom[category] = {};
      result.custom[category][templateKey] = value;
    }
    
    return result;
  }

  getTemplateCategories() {
    return Object.keys(this.templates);
  }

  getTemplatesInCategory(category) {
    return this.templates[category] || {};
  }
}

export default new MessageTemplateService();
