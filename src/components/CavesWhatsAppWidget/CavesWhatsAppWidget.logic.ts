import { useCallback } from 'react';

export const useWhatsAppWidgetLogic = () => {
  const openWhatsApp = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(50);
    window.open('https://wa.me/971501234567?text=Hello%20White%20Caves%20Real%20Estate,%20I%20would%20like%20to%20inquire.', '_blank');
  }, []);

  return { openWhatsApp };
};
