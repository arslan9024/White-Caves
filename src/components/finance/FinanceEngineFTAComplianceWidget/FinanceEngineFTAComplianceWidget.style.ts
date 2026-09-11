import styled from 'styled-components';

export const WidgetContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--white, #FFFFFF);
  border-radius: 12px;
  border: 1px solid var(--text-secondary, #E2E8F0);
  padding: 1.5rem;
  font-family: ${props => props.$isRtl ? "'Tajawal', sans-serif" : "'Inter', sans-serif"};
  direction: ${props => props.$isRtl ? 'rtl' : 'ltr'};
  text-align: ${props => props.$isRtl ? 'right' : 'left'};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

export const WidgetHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-1e293b, #1E293B);
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary, #64748B);
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-334155, #334155);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const COAList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const COAItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-f8fafc, #F8FAFC);
  border: 1px solid var(--color-e2e8f0, #E2E8F0);
  border-radius: 8px;

  .label {
    font-weight: 600;
    color: var(--color-1e293b, #1E293B);
  }
`;

export const FTACard = styled.div`
  background: var(--color-f0fdf4, #F0FDF4);
  border: 1px solid var(--color-bbf7d0, #BBF7D0);
  border-radius: 8px;
  padding: 1rem;

  h5 {
    margin: 0 0 0.5rem 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-166534, #166534);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--color-15803d, #15803D);
    line-height: 1.5;
  }
`;

export const ActionButton = styled.button`
  margin-top: 1rem;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  background: var(--white, #FFFFFF);
  color: var(--color-475569, #475569);
  border: 1px solid var(--color-cbd5e1, #CBD5E1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: var(--color-f8fafc, #F8FAFC);
    color: var(--color-1e293b, #1E293B);
  }
`;
