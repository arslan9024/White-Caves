/**
 * MobilePropertyQuickActions.logic.ts — Hook Layer
 */

import { useState, useCallback } from 'react';

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'MessageCircle',
    color: '#25d366',
    description: 'Open WhatsApp chat',
  },
  {
    id: 'call',
    label: 'Call',
    icon: 'Phone',
    color: '#3b82f6',
    description: 'Initiate phone call',
  },
  {
    id: 'view360',
    label: '360° Tour',
    icon: 'Eye',
    color: '#8b5cf6',
    description: 'Launch VR tour',
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: 'Calendar',
    color: '#f97316',
    description: 'Book a viewing',
  },
  {
    id: 'compare',
    label: 'Compare',
    icon: 'BarChart2',
    color: '#0ea5e9',
    description: 'Add to comparison',
  },
  {
    id: 'share',
    label: 'Share',
    icon: 'Share2',
    color: '#6366f1',
    description: 'Share listing link',
  },
  {
    id: 'favourite',
    label: 'Favourite',
    icon: 'Heart',
    color: '#ef4444',
    description: 'Save to favourites',
  },
  {
    id: 'pdf',
    label: 'Brochure',
    icon: 'FileText',
    color: '#64748b',
    description: 'Download PDF brochure',
  },
];

export interface UseMobilePropertyQuickActionsReturn {
  actions: QuickAction[];
  isOpen: boolean;
  activeAction: string | null;
  handleOpen: () => void;
  handleClose: () => void;
  handleAction: (id: string) => void;
}

export function useMobilePropertyQuickActionsLogic(): UseMobilePropertyQuickActionsReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleAction = useCallback((id: string) => {
    setActiveAction(id);
    // Simulated action dispatch — real implementation wires to service layer
    setTimeout(() => setActiveAction(null), 800);
    setIsOpen(false);
  }, []);

  return { actions: QUICK_ACTIONS, isOpen, activeAction, handleOpen, handleClose, handleAction };
}
