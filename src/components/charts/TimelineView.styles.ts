import styled from 'styled-components';

export const TimelineContainer = styled.div`
  position: relative;
  padding: 20px 0;

  &::before {
    content: '';
    position: absolute;
    left: 24px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 100%);

    @media (prefers-color-scheme: dark) {
      background: linear-gradient(180deg, rgba(96, 165, 250, 0.3) 0%, rgba(96, 165, 250, 0) 100%);
    }
  }

  @media (max-width: 768px) {
    padding-left: 0;

    &::before {
      left: 12px;
    }
  }
`;

export const TimelineEvent = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  position: relative;
  animation: slideInLeft 0.5s ease;

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 768px) {
    gap: 12px;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const TimelineMarker = styled.div<{ color?: string; size?: 'small' | 'medium' | 'large' }>`
  flex: 0 0 ${props => {
    switch(props.size) {
      case 'large': return '40px';
      case 'small': return '16px';
      default: return '24px';
    }
  }};
  height: ${props => {
    switch(props.size) {
      case 'large': return '40px';
      case 'small': return '16px';
      default: return '24px';
    }
  }};
  border-radius: 50%;
  background: ${props => props.color || '#3b82f6'};
  border: 3px solid white;
  box-shadow: 0 0 0 2px ${props => props.color || '#3b82f6'}88;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.2);
    box-shadow: 0 0 0 4px ${props => props.color || '#3b82f6'}44;
  }

  @media (prefers-color-scheme: dark) {
    border-color: #1f2937;
    box-shadow: 0 0 0 2px ${props => props.color || '#3b82f6'};
  }

  @media (max-width: 768px) {
    flex-basis: 20px;
    width: 20px;
    height: 20px;
    border-width: 2px;
  }
`;

export const TimelineContent = styled.div`
  flex: 1;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border-left: 3px solid rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.08);
    border-left-color: #3b82f6;
    transform: translateY(-2px);
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.05);
    border-left-color: rgba(96, 165, 250, 0.3);

    &:hover {
      background: rgba(59, 130, 246, 0.15);
      border-left-color: #60a5fa;
    }
  }
`;

export const TimelineTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);
  margin: 0 0 4px 0;
  letter-spacing: -0.3px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const TimelineTime = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const TimelineDescription = styled.p`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.7);
  margin: 8px 0 0 0;
  line-height: 1.5;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.7);
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const TimelineTags = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

export const TimelineTag = styled.span<{ color?: string }>`
  display: inline-block;
  padding: 3px 8px;
  background: ${props => props.color || '#3b82f6'}22;
  color: ${props => props.color || '#3b82f6'};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;
