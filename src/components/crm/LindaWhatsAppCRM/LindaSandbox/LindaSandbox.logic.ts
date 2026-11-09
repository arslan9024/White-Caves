// FILE: src/components/crm/LindaWhatsAppCRM/LindaSandbox/LindaSandbox.logic.ts
/**
 * White Caves Real Estate LLC - AI Linda WhatsApp Sandbox Logic
 * Bilingual EN/AR Luxury Real Estate Conversational NLP & Inventory Matching
 * Single Purpose File Law: < 350 lines
 */

import { useState, useCallback } from 'react';
import type { ChatMessage, MatchedProperty, ViewingBooking } from './LindaSandbox.types';

export const SAMPLE_INVENTORY: MatchedProperty[] = [
  {
    id: 'prop-dh2-camelia',
    title: '4-Bedroom Luxury Villa · Camelia Cluster',
    location: 'DAMAC Hills 2 (Akoya), Dubai',
    priceAed: 3200000,
    bedrooms: 4,
    type: 'Villa',
    verifiedDld: true,
    estDldFee: 128000,
  },
  {
    id: 'prop-dh2-pacific',
    title: '5-Bedroom Signature Villa with Private Garden',
    location: 'DAMAC Hills 2 (Pacific Cluster), Dubai',
    priceAed: 4100000,
    bedrooms: 5,
    type: 'Villa',
    verifiedDld: true,
    estDldFee: 164000,
  },
  {
    id: 'prop-marina-penthouse',
    title: '3-Bedroom Panoramic Waterfront Penthouse',
    location: 'Dubai Marina, Dubai',
    priceAed: 5800000,
    bedrooms: 3,
    type: 'Penthouse',
    verifiedDld: true,
    estDldFee: 232000,
  },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'linda',
    text: 'Hello! I am AI Linda, your 24/7 White Caves luxury real estate concierge. Are you looking to acquire, sell, or lease prime property in Dubai?',
    timestamp: 'Just now',
    language: 'en',
  },
];

export function parseLeadIntent(input: string): {
  isArabic: boolean;
  bedrooms: number | null;
  locationKeyword: string | null;
  wantsViewing: boolean;
} {
  const arabicRegex = /[\u0600-\u06FF]/;
  const isArabic = arabicRegex.test(input);
  const lower = input.toLowerCase();

  let bedrooms: number | null = null;
  if (lower.includes('4br') || lower.includes('4 br') || lower.includes('4 bedroom') || input.includes('٤ غرف') || input.includes('اربع غرف')) {
    bedrooms = 4;
  } else if (lower.includes('5br') || lower.includes('5 br') || lower.includes('5 bedroom') || input.includes('٥ غرف') || input.includes('خمس غرف')) {
    bedrooms = 5;
  } else if (lower.includes('3br') || lower.includes('3 br') || lower.includes('3 bedroom') || input.includes('٣ غرف') || input.includes('ثلاث غرف')) {
    bedrooms = 3;
  }

  let locationKeyword: string | null = null;
  if (lower.includes('damac') || lower.includes('dh2') || lower.includes('hills 2') || input.includes('داماك')) {
    locationKeyword = 'DAMAC Hills 2';
  } else if (lower.includes('marina') || input.includes('مارينا')) {
    locationKeyword = 'Dubai Marina';
  }

  const wantsViewing =
    lower.includes('viewing') ||
    lower.includes('visit') ||
    lower.includes('tour') ||
    lower.includes('schedule') ||
    lower.includes('book') ||
    input.includes('معاينة') ||
    input.includes('زيارة') ||
    input.includes('حجز');

  return { isArabic, bedrooms, locationKeyword, wantsViewing };
}

export function useLindaSandbox() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeBooking, setActiveBooking] = useState<ViewingBooking | null>(null);

  const handleSendMessage = useCallback((textToSend?: string) => {
    const content = (textToSend || inputMessage).trim();
    if (!content) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    const intent = parseLeadIntent(content);

    setTimeout(() => {
      let replyText = '';
      let suggestedProps: MatchedProperty[] | undefined = undefined;
      let viewing: ViewingBooking | undefined = undefined;

      if (intent.wantsViewing) {
        const targetProp = SAMPLE_INVENTORY[0];
        viewing = {
          propertyTitle: targetProp.title,
          date: 'Tomorrow, 11:00 AM GST',
          timeSlot: '11:00 AM - 12:00 PM',
          agentLead: 'Arslan Malik (Managing Director) & AI Linda',
          status: 'SCHEDULED',
          calendarSyncLink: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=VIP+White+Caves+Viewing',
        };
        setActiveBooking(viewing);

        replyText = intent.isArabic
          ? `تم تأكيد موعد المعاينة بنجاح لـ ${targetProp.title}. سيقوم مستشار وايت كيفز بمرافقتك غداً الساعة 11:00 صباحاً بتوقيت دبي.`
          : `Excellent! I have scheduled an exclusive VIP private viewing for ${targetProp.title} tomorrow at 11:00 AM GST. Our managing director and luxury sales squad have been synced.`;
      } else if (intent.bedrooms || intent.locationKeyword) {
        suggestedProps = SAMPLE_INVENTORY.filter(p => {
          if (intent.bedrooms && p.bedrooms !== intent.bedrooms) return false;
          if (intent.locationKeyword && !p.location.includes(intent.locationKeyword)) return false;
          return true;
        });

        if (suggestedProps.length === 0) suggestedProps = SAMPLE_INVENTORY;

        replyText = intent.isArabic
          ? `وجدت لك ${suggestedProps.length} عقارات فاخرة متطابقة ومسجلة رسمياً لدى دائرة الأراضي والأملاك في دبي (DLD). تفضل بمراجعة الأسعار ورسوم التسجيل أدناه:`
          : `I found ${suggestedProps.length} DLD-verified luxury properties matching your exact criteria. Each includes our verified 4% DLD transfer and Law 50/2022 escrow underwrite:`;
      } else {
        replyText = intent.isArabic
          ? 'أهلاً بك! يسعدني إرشادك في العثور على أفضل الفلل والوحدات الفاخرة في دبي هيلز ومارينا وداماك هيلز 2. ما هي المساحة أو الميزانية المفضلة لديك؟'
          : 'Thank you for reaching out to White Caves Real Estate LLC. We specialize in off-plan and secondary prime villas across Dubai. Would you prefer 4-5 BR villas in DAMAC Hills 2 or waterfront penthouses?';
      }

      const lindaMsg: ChatMessage = {
        id: `linda-${Date.now()}`,
        sender: 'linda',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProperties: suggestedProps,
        viewingInvite: viewing,
        language: intent.isArabic ? 'ar' : 'en',
      };

      setMessages(prev => [...prev, lindaMsg]);
      setIsTyping(false);
    }, 450);
  }, [inputMessage]);

  const handleQuickPrompt = useCallback((prompt: string) => {
    handleSendMessage(prompt);
  }, [handleSendMessage]);

  const handleClearHistory = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    setActiveBooking(null);
  }, []);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    activeBooking,
    handleSendMessage,
    handleQuickPrompt,
    handleClearHistory,
  };
}
