import styled from 'styled-components';

export const HubWrap = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(12px);
  margin-bottom: 24px;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #F8FAFC;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

export const Card = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(100, 116, 139, 0.1);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CardTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #E2E8F0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CardDesc = styled.div`
  font-size: 0.85rem;
  color: #94A3B8;
  line-height: 1.4;
`;

export const GenerateButton = styled.button<{ $variant?: 'excel' | 'pdf' }>`
  margin-top: auto;
  background: ${({ $variant }) => 
    $variant === 'excel' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ $variant }) => 
    $variant === 'excel' ? '#22C55E' : '#EF4444'};
  border: 1px solid ${({ $variant }) => 
    $variant === 'excel' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  padding: 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${({ $variant }) => 
      $variant === 'excel' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  }
`;
