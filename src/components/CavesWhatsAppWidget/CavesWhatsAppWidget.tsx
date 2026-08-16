import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useWhatsAppWidgetLogic } from './CavesWhatsAppWidget.logic';
import { WhatsAppButton } from './CavesWhatsAppWidget.style';

export const CavesWhatsAppWidget: React.FC = () => {
  const { openWhatsApp } = useWhatsAppWidgetLogic();

  return (
    <WhatsAppButton
      onClick={openWhatsApp}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      title="Contact Agent via WhatsApp"
    >
      <MessageCircle size={32} color="#FFFFFF" />
    </WhatsAppButton>
  );
};

export default CavesWhatsAppWidget;
