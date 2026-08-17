/**
 * FloatingHeroSearchPill.style.ts — UI Style Layer & Styled-Components
 * Enforces White Caves Luxury Red / Crisp White / Slate color palette.
 */

import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 840px;
  margin: 0 auto;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(239, 68, 68, 0.3);
  border-radius: 20px;
  padding: 16px 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(239, 68, 68, 0.15);
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.5s ease;
`;

export const TabsRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(100, 116, 139, 0.2);
  padding-bottom: 10px;
  overflow-x: auto;
`;

export const TabBtn = styled.button<{ $active: boolean }>`
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid ${p => (p.$active ? '#EF4444' : 'transparent')};
  background: ${p => (p.$active ? '#EF4444' : 'rgba(100, 116, 139, 0.12)')};
  color: #FFFFFF;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: ${p => (p.$active ? '#DC2626' : 'rgba(239, 68, 68, 0.2)')};
  }
`;

export const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.2fr auto;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Label = styled.label`
  font-size: 0.65rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const Input = styled.input`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(7, 11, 20, 0.7);
  color: #FFFFFF;
  font-size: 0.82rem;
  font-weight: 600;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #EF4444;
  }
`;

export const Select = styled.select`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(7, 11, 20, 0.7);
  color: #FFFFFF;
  font-size: 0.82rem;
  font-weight: 600;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #EF4444;
  }
`;

export const SearchBtn = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #DC2626, #EF4444);
  color: #FFFFFF;
  font-size: 0.85rem;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  margin-top: 18px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(239, 68, 68, 0.5);
  }

  @media (max-width: 768px) {
    margin-top: 0;
    justify-content: center;
  }
`;

export const SuggestionText = styled.div`
  margin-top: 10px;
  font-size: 0.72rem;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 6px;
`;
