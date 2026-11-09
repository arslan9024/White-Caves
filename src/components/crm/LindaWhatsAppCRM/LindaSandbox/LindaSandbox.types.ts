// FILE: src/components/crm/LindaWhatsAppCRM/LindaSandbox/LindaSandbox.types.ts
/**
 * White Caves Real Estate LLC - AI Linda WhatsApp Sandbox Types
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'linda';
  text: string;
  timestamp: string;
  suggestedProperties?: MatchedProperty[];
  viewingInvite?: ViewingBooking;
  language?: 'en' | 'ar';
}

export interface MatchedProperty {
  id: string;
  title: string;
  location: string;
  priceAed: number;
  bedrooms: number;
  type: string;
  verifiedDld: boolean;
  estDldFee: number;
}

export interface ViewingBooking {
  propertyTitle: string;
  date: string;
  timeSlot: string;
  agentLead: string;
  status: 'SCHEDULED' | 'CONFIRMED';
  calendarSyncLink: string;
}
