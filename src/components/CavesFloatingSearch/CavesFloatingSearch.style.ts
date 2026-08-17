import styled from 'styled-components';
import { motion } from 'framer-motion';

export const SearchPill = styled(motion.button)`
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid #EF4444;
  border-radius: 9999px;
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.15);
  cursor: pointer;
  outline: none;
  font-family: 'Inter', sans-serif;
  transition: all 0.25s ease-in-out;
  
  &:hover {
    box-shadow: 0 12px 48px rgba(239, 68, 68, 0.25);
    transform: translateY(-2px);
  }
`;

export const SearchText = styled.span`
  color: #1E293B;
  font-weight: 700;
  font-size: 0.88rem;
`;

export const SearchShortcut = styled.span`
  background: #1E293B;
  color: #FFFFFF;
  font-size: 0.7rem;
  padding: 3px 7px;
  border-radius: 4px;
  font-weight: 800;
  letter-spacing: 0.5px;
`;

export const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(20px);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px 20px;
  overflow-y: auto;
`;

export const ModalCard = styled(motion.div)`
  width: 100%;
  max-width: 800px;
  background: #FFFFFF;
  border-radius: 20px;
  border: 1.5px solid #EF4444;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(239, 68, 68, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ModalSearchHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px;
  border-bottom: 1px solid #E2E8F0;
  background: #F8FAFC;

  input {
    flex: 1;
    font-size: 1.25rem;
    font-weight: 600;
    color: #0F172A;
    border: none;
    outline: none;
    background: transparent;
    font-family: 'Inter', sans-serif;

    &::placeholder {
      color: #94A3B8;
      font-size: 1.05rem;
    }
  }

  button.close-btn {
    background: #F1F5F9;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 0.8rem;
    font-weight: 700;
    color: #64748B;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: #EF4444;
      color: #FFFFFF;
      border-color: #EF4444;
    }
  }
`;

export const ModalCategoryPills = styled.div`
  display: flex;
  gap: 8px;
  padding: 14px 24px;
  background: #FFFFFF;
  border-bottom: 1px solid #F1F5F9;
  overflow-x: auto;
`;

export const ModalCategoryBtn = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid ${p => (p.$active ? '#EF4444' : '#E2E8F0')};
  background: ${p => (p.$active ? 'rgba(239, 68, 68, 0.1)' : '#F8FAFC')};
  color: ${p => (p.$active ? '#EF4444' : '#475569')};
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    border-color: #EF4444;
    color: #EF4444;
  }
`;

export const ResultsList = styled.div`
  max-height: 420px;
  overflow-y: auto;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ResultItemCard = styled.div`
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #EF4444;
    background: #FFF5F5;
    transform: translateX(4px);
  }

  .item-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong.title {
      font-size: 0.92rem;
      color: #0F172A;
    }

    span.sub {
      font-size: 0.76rem;
      color: #64748B;
    }
  }

  span.badge {
    padding: 3px 8px;
    border-radius: 6px;
    background: rgba(239, 68, 68, 0.12);
    color: #EF4444;
    font-size: 0.72rem;
    font-weight: 800;
  }
`;
