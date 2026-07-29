import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { MessageCircle, Phone, Bot, X } from 'lucide-react';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
  70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

const WidgetWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
`;

const MenuMenu = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  flex-direction: column;
  gap: 10px;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  transform-origin: bottom right;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

const MenuItem = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    transform: translateX(-4px);
  }
`;

const MainFAB = styled.button<{ $open: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
  animation: ${pulse} 2.5s infinite;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.08) rotate(${({ $open }) => ($open ? '90deg' : '0deg')});
    background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export interface CavesFloatingWidgetProps {
  whatsAppNumber?: string;
  assistantPath?: string;
}

export const CavesFloatingWidget: FC<CavesFloatingWidgetProps> = ({
  whatsAppNumber = '971501234567',
  assistantPath = '/crm/ai-assistant',
}) => {
  const [open, setOpen] = useState(false);

  return (
    <WidgetWrapper data-testid="caves-floating-widget">
      <MenuMenu $open={open}>
        <MenuItem
          href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent('Hello White Caves Real Estate, I would like to inquire about luxury properties.')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={18} color="#25D366" />
          <span>Chat on WhatsApp</span>
        </MenuItem>
        <MenuItem href={`tel:+${whatsAppNumber}`}>
          <Phone size={18} color="#ef4444" />
          <span>Call Direct</span>
        </MenuItem>
        <MenuItem href={assistantPath}>
          <Bot size={18} color="#ef4444" />
          <span>AI Concierge</span>
        </MenuItem>
      </MenuMenu>

      <MainFAB
        $open={open}
        onClick={() => setOpen(!open)}
        aria-label="Toggle Support & Contact Menu"
        title="White Caves Contact & AI Assistant"
      >
        {open ? <X /> : <MessageCircle />}
      </MainFAB>
    </WidgetWrapper>
  );
};

export default CavesFloatingWidget;
