import styled from 'styled-components';

export const SummaryCardContainer = styled.div<{ variant?: 'primary' | 'success' | 'warning' | 'danger' }>`
  background: linear-gradient(135deg, 
    ${props => {
      switch(props.variant) {
        case 'success': return 'rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02)';
        case 'warning': return 'rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02)';
        case 'danger': return 'rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02)';
        default: return 'rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02)';
      }
    }} 100%);
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid ${props => {
    switch(props.variant) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return '#3b82f6';
    }
  }};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -100px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, ${props => {
      switch(props.variant) {
        case 'success': return '#10b98122';
        case 'warning': return '#f59e0b22';
        case 'danger': return '#ef444422';
        default: return '#3b82f622';
      }
    }} 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(25, 25, 25, 0.9) 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    &:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    }
  }
`;

export const CardInner = styled.div`
  position: relative;
  z-index: 2;
`;

export const SummaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const SummaryLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.6);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const SummaryIcon = styled.span`
  font-size: 24px;
`;

export const SummaryContent = styled.div`
  margin-bottom: 12px;
`;

export const SummaryValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.95);
  line-height: 1.2;
  letter-spacing: -0.5px;
  margin-bottom: 4px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.97);
  }

  @media (max-width: 640px) {
    font-size: 26px;
  }
`;

export const SummarySubtext = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.5;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const SummaryFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);

  @media (prefers-color-scheme: dark) {
    border-top-color: rgba(255, 255, 255, 0.12);
  }
`;

export const SummaryMeta = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const SummaryAction = styled.button`
  padding: 6px 12px;
  border: none;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
    transform: translateY(-1px);
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(96, 165, 250, 0.15);
  }
`;

export const SummaryBadge = styled.span<{ color?: string }>`
  display: inline-block;
  padding: 4px 8px;
  background: ${props => props.color || '#3b82f6'}22;
  color: ${props => props.color || '#3b82f6'};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;
