/**
 * LeadDetailSlideOver.logic.ts — Logic Layer
 */
import { useState } from 'react';

export interface LeadEvent {
  id: string;
  type: 'call' | 'whatsapp' | 'viewing' | 'offer' | 'note';
  label: string;
  timestamp: string;
  detail: string;
}

export interface LeadDetail {
  id: string;
  name: string;
  phone: string;
  email: string;
  budget: string;
  nationality: string;
  interest: string;
  assignedAgent: string;
  stage: string;
  heat: 'hot' | 'warm' | 'cold';
  source: string;
  createdAt: string;
  events: LeadEvent[];
}

const MOCK_LEAD: LeadDetail = {
  id: 'l1',
  name: 'Ahmed Al Mansouri',
  phone: '+971 55 123 4567',
  email: 'ahmed@example.com',
  budget: 'AED 2,500,000',
  nationality: 'UAE',
  interest: '3BR Villa — Dubai Hills Estate',
  assignedAgent: 'Sarah Johnson',
  stage: 'Viewing',
  heat: 'hot',
  source: 'PropertyFinder',
  createdAt: '2026-08-10',
  events: [
    { id: 'e1', type: 'call', label: 'Initial Call', timestamp: '2026-08-10 09:15', detail: 'Discussed budget and preferred areas.' },
    { id: 'e2', type: 'whatsapp', label: 'WhatsApp Follow-up', timestamp: '2026-08-11 14:30', detail: 'Sent listing brochures for 3 properties.' },
    { id: 'e3', type: 'viewing', label: 'Property Viewing', timestamp: '2026-08-13 11:00', detail: 'Viewed Unit 14C, Dubai Hills. Positive feedback.' },
    { id: 'e4', type: 'note', label: 'Agent Note', timestamp: '2026-08-14 16:00', detail: 'Client requests 30-day payment flexibility.' },
  ],
};

export function useLeadDetailSlideOverLogic(onClose: () => void) {
  const [lead] = useState<LeadDetail>(MOCK_LEAD);
  const [activeTab, setActiveTab] = useState<'timeline' | 'details'>('timeline');

  return { lead, activeTab, setActiveTab, onClose };
}
