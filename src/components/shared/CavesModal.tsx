import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { X } from 'lucide-react';

const RED = '#EF4444';
const SLATE = '#1E293B';

export interface CavesModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalBox = styled(motion.div)<{ $maxWidth: string }>`
  background: #FFFFFF;
  border-radius: 24px;
  max-width: ${props => props.$maxWidth};
  width: 100%;
  padding: 32px;
  box-shadow: 0 30px 60px -15px rgba(239, 68, 68, 0.2);
  border: 2px solid rgba(239, 68, 68, 0.15);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const CloseBtn = styled.button`
  background: #F1F5F9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${SLATE};
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: ${RED};
  }
`;

export const CavesModal: React.FC<CavesModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '640px',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay onClick={onClose}>
          <ModalBox
            $maxWidth={maxWidth}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
          >
            <Header>
              <div>
                <span style={{ color: RED, fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.12em' }}>
                  WHITE CAVES OPERATIONAL DIALOG
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: SLATE, margin: '4px 0 0' }}>
                  {title}
                </h2>
                {subtitle && (
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0' }}>{subtitle}</p>
                )}
              </div>
              <CloseBtn onClick={onClose} aria-label="Close modal">
                <X size={18} />
              </CloseBtn>
            </Header>
            <div>{children}</div>
          </ModalBox>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default CavesModal;
