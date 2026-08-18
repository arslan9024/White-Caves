/** LeadNotificationToast.logic.ts */
import { useState, useEffect, useCallback } from 'react';

export interface ToastNotification {
  id: string; type: 'new_lead' | 'commission' | 'reminder' | 'viewing';
  title: string; body: string; timestamp: string;
}

const MOCK_NOTIFICATIONS: ToastNotification[] = [
  { id: 'n1', type: 'new_lead', title: 'New Lead Assigned', body: 'Ahmed Al Mansouri — PropertyFinder — Budget AED 2.5M', timestamp: 'now' },
  { id: 'n2', type: 'viewing', title: 'Viewing Confirmed', body: 'Emma Johnson · Unit 14C Dubai Hills · 2:00 PM today', timestamp: '1m ago' },
  { id: 'n3', type: 'commission', title: 'Commission Released', body: 'AED 48,000 — Deal #WC-2026-0891 closed by Sarah Johnson', timestamp: '5m ago' },
];

const TYPE_ICONS: Record<string, string> = { new_lead: '👤', commission: '💰', reminder: '⏰', viewing: '🏠' };

export function useLeadNotificationToastLogic() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [queue] = useState(MOCK_NOTIFICATIONS);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = queue[Math.floor(Math.random() * queue.length)];
      const toast = { ...next, id: `t${Date.now()}` };
      setToasts((prev) => [toast, ...prev].slice(0, 5));
    }, 6000);
    setToasts([queue[0]]);
    return () => clearInterval(timer);
  }, [queue]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleSound = useCallback(() => setSoundEnabled((v) => !v), []);

  return { toasts, soundEnabled, toggleSound, dismiss, TYPE_ICONS };
}
