/**
 * MobileLeadCardStack.logic.ts — Hook Layer
 */

import { useState, useCallback } from 'react';

export interface LeadCard {
  id: string;
  name: string;
  phone: string;
  budget: string;
  area: string;
  stage: 'Hot' | 'Warm' | 'Cold' | 'Investor' | 'Tenant';
  source: string;
  lastContact: string;
}

const STAGE_COLORS: Record<LeadCard['stage'], string> = {
  Hot: '#ef4444',
  Warm: '#f97316',
  Cold: '#64748b',
  Investor: '#8b5cf6',
  Tenant: '#0ea5e9',
};

export interface UseMobileLeadCardStackReturn {
  cards: LeadCard[];
  activeIndex: number;
  stageColor: (stage: LeadCard['stage']) => string;
  handleSwipeLeft: (id: string) => void;
  handleSwipeRight: (id: string) => void;
}

const DEMO_LEADS: LeadCard[] = [
  {
    id: 'L001',
    name: 'Mohammed Al Rashidi',
    phone: '+971 50 123 4567',
    budget: 'AED 3.5M',
    area: 'Dubai Marina',
    stage: 'Hot',
    source: 'PropertyFinder',
    lastContact: '2h ago',
  },
  {
    id: 'L002',
    name: 'Sarah Williams',
    phone: '+44 7700 900123',
    budget: 'AED 8M',
    area: 'Palm Jumeirah',
    stage: 'Investor',
    source: 'Referral',
    lastContact: '1d ago',
  },
  {
    id: 'L003',
    name: 'Rajesh Kumar',
    phone: '+971 55 987 6543',
    budget: 'AED 95K/y',
    area: 'JVC',
    stage: 'Warm',
    source: 'WhatsApp',
    lastContact: '3h ago',
  },
  {
    id: 'L004',
    name: 'Aisha Mohammed',
    phone: '+971 52 345 6789',
    budget: 'AED 1.2M',
    area: 'Business Bay',
    stage: 'Cold',
    source: 'Walk-in',
    lastContact: '5d ago',
  },
  {
    id: 'L005',
    name: 'Chen Wei',
    phone: '+971 56 432 1987',
    budget: 'AED 150K/y',
    area: 'Downtown',
    stage: 'Tenant',
    source: 'Bayut',
    lastContact: '30m ago',
  },
];

export function useMobileLeadCardStackLogic(): UseMobileLeadCardStackReturn {
  const [cards, setCards] = useState<LeadCard[]>(DEMO_LEADS);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSwipeLeft = useCallback((id: string) => {
    // Dismiss — remove card from stack
    setCards(prev => {
      const next = prev.filter(c => c.id !== id);
      setActiveIndex(i => Math.min(i, Math.max(0, next.length - 1)));
      return next;
    });
  }, []);

  const handleSwipeRight = useCallback((id: string) => {
    // Assign / contact — move to back of stack
    setCards(prev => {
      const card = prev.find(c => c.id === id);
      if (!card) return prev;
      const rest = prev.filter(c => c.id !== id);
      return [...rest, card];
    });
    setActiveIndex(0);
  }, []);

  return {
    cards,
    activeIndex,
    stageColor: s => STAGE_COLORS[s],
    handleSwipeLeft,
    handleSwipeRight,
  };
}
