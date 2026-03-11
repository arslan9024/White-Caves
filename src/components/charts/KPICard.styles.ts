import styled from 'styled-components';

export const KPICardContainer = styled.div<{ isHovered?: boolean }>`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.9) 100%);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
    transform: scaleX(${props => props.isHovered ? 1 : 0});
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(25, 25, 25, 0.9) 100%);
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2);

    &:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3);
    }
  }
`;

export const KPIHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const KPILabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
  transition: color 0.3s ease;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const KPIIcon = styled.div<{ color?: string }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${props => props.color || '#3b82f6'}22;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || '#3b82f6'};
  font-size: 24px;
  transition: all 0.3s ease;

  @media (prefers-color-scheme: dark) {
    background: ${props => props.color || '#3b82f6'}44;
  }
`;

export const KPIValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 8px;
  line-height: 1.2;
  letter-spacing: -0.5px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

export const KPIChange = styled.div<{ positive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  animation: slideUp 0.5s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-color-scheme: dark) {
    /* Colors work well in dark mode */
  }
`;

export const KPITrend = styled.span`
  font-size: 16px;
`;

export const KPIFooter = styled.div`
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (prefers-color-scheme: dark) {
    border-top-color: rgba(255, 255, 255, 0.12);
  }
`;

export const KPIPeriod = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const KPIComparison = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.6);
  }
`;
