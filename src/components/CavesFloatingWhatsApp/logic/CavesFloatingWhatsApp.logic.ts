/**
 * CavesFloatingWhatsApp.logic.ts — Hook & Logic Layer
 */

import { useCallback } from 'react';
import { Config } from '../../../config/constants';
import { WHATSAPP_WIDGET_TEXT } from '../data/CavesFloatingWhatsApp.data';

export interface UseCavesFloatingWhatsAppProps {
  phoneNumber?: string;
  customMessage?: string;
}

export function useCavesFloatingWhatsAppLogic(props?: UseCavesFloatingWhatsAppProps) {
  const phoneNumber = props?.phoneNumber || Config.COMPANY?.WHATSAPP || WHATSAPP_WIDGET_TEXT.phoneNumber;
  const message = encodeURIComponent(props?.customMessage || WHATSAPP_WIDGET_TEXT.defaultMessage);

  const handleClick = useCallback(() => {
    window.open(`https://wa.me/${phoneNumber.replace(/[^0-9+]/g, '')}?text=${message}`, '_blank', 'noopener,noreferrer');
  }, [phoneNumber, message]);

  return {
    phoneNumber,
    handleClick,
  };
}
