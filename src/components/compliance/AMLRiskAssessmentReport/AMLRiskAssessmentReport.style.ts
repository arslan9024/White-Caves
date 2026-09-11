import styled from 'styled-components';

export const WidgetContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--bg-surface, #1A1A1A);
  border-radius: 12px;
  padding: 24px;
  color: var(--text-primary, #FFFFFF);
  font-family: 'Inter', sans-serif;
  direction: ${({ $isRtl }) => ($isRtl ? 'rtl' : 'ltr')};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const WidgetHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;

  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--accent-gold, #D4AF37);
  }

  p {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary, #A0A0A0);
  }
`;

export const ActionButton = styled.button<{ $primary?: boolean }>`
  background: ${({ $primary }) => $primary ? 'linear-gradient(135deg, var(--accent-gold, #D4AF37) 0%, #AA8C2C 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ $primary }) => $primary ? '#000000' : '#FFFFFF'};
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    background: ${({ $primary }) => $primary ? 'linear-gradient(135deg, #F0C950 0%, #D4AF37 100%)' : 'rgba(255, 255, 255, 0.15)'};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ScoreCard = styled.div<{ $level: string }>`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top: 4px solid ${({ $level }) => 
    $level === 'High' ? '#EF4444' : 
    $level === 'Medium' ? '#F59E0B' : '#10B981'};
    
  .score-value {
    font-size: 48px;
    font-weight: 800;
    margin: 16px 0 8px;
    color: ${({ $level }) => 
      $level === 'High' ? '#EF4444' : 
      $level === 'Medium' ? '#F59E0B' : '#10B981'};
  }
  
  .score-label {
    font-size: 14px;
    color: var(--text-secondary, #A0A0A0);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

export const MatrixTable = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 24px;
  
  h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: #FFFFFF;
  }
`;

export const MatrixRow = styled.div<{ $level: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  .name {
    font-size: 14px;
    flex: 1;
  }
  
  .badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    background: ${({ $level }) => 
      $level === 'high' ? 'rgba(239, 68, 68, 0.1)' : 
      $level === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
    color: ${({ $level }) => 
      $level === 'high' ? '#EF4444' : 
      $level === 'medium' ? '#F59E0B' : '#10B981'};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  margin-top: 24px;
  
  svg {
    color: var(--text-secondary, #A0A0A0);
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  p {
    color: var(--text-secondary, #A0A0A0);
    margin: 0 0 24px 0;
  }
`;
