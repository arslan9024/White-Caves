import styled, { keyframes } from 'styled-components';

const glowPulse = keyframes`
  0% { opacity: 0; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const scaleHover = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.1); }
`;

export const BigTileContainer = styled.div<{ 
  $size?: 'small' | 'medium' | 'large';
  $isActive?: boolean;
  $isHovered?: boolean;
  $tileColor?: string;
}>`
  position: relative;
  background: var(--bg-card, #ffffff);
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 20px;
  padding: ${props => {
    switch (props.$size) {
      case 'small': return '16px';
      case 'large': return '32px';
      default: return '24px';
    }
  }};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  ${props => props.$isActive && `
    border-color: ${props.$tileColor || 'var(--primary-color, #dc2626)'};
    box-shadow: 0 0 0 3px rgba(${props.$tileColor ? '220, 38, 38' : '220, 38, 38'}, 0.2);
  `}

  ${props => props.$isHovered && `
    border-color: ${props.$tileColor || 'var(--primary-color, #dc2626)'};
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  `}

  &:hover {
    border-color: ${props => props.$tileColor || 'var(--primary-color, #dc2626)'};
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  [data-theme="dark"] & {
    background: var(--bg-card-dark, #1e293b);
    border-color: var(--border-color-dark, #334155);

    &:hover {
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
  }
`;

export const TileBadge = styled.div<{ $backgroundColor?: string }>`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.$backgroundColor || 'var(--primary-color, #dc2626)'};
`;

export const TileHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
`;

export const TileIconContainer = styled.div<{ 
  $backgroundColor?: string;
  $color?: string;
  $size?: 'small' | 'medium' | 'large';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => {
    switch (props.$size) {
      case 'small': return '40px';
      case 'large': return '64px';
      default: return '56px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'small': return '40px';
      case 'large': return '64px';
      default: return '56px';
    }
  }};
  border-radius: 16px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  background: ${props => props.$backgroundColor || 'var(--bg-tertiary, #f3f4f6)'};
  color: ${props => props.$color || 'var(--primary-color, #dc2626)'};

  ${`&:hover`} {
    transform: scale(1.1);
  }
`;

export const TileTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const TileTitle = styled.h3<{ $size?: 'small' | 'medium' | 'large' }>`
  margin: 0;
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '14px';
      case 'large': return '20px';
      default: return '16px';
    }
  }};
  font-weight: 700;
  color: var(--text-primary, #1f2937);
  line-height: 1.3;

  [data-theme="dark"] & {
    color: var(--text-primary-dark, #f9fafb);
  }
`;

export const TileSubtitle = styled.span`
  font-size: 12px;
  color: var(--text-tertiary, #9ca3af);
  font-weight: 500;

  [data-theme="dark"] & {
    color: var(--text-tertiary-dark, #94a3b8);
  }
`;

export const TileDescription = styled.p`
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
  margin: 0 0 16px 0;

  [data-theme="dark"] & {
    color: var(--text-secondary-dark, #cbd5e1);
  }
`;

export const TileStats = styled.div`
  display: flex;
  gap: 24px;
  padding: 16px 0;
  border-top: 1px solid var(--border-color, #e5e7eb);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  margin-bottom: 16px;

  [data-theme="dark"] & {
    border-color: var(--border-color-dark, #374151);
  }
`;

export const TileStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StatValue = styled.span<{ $color?: string }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.$color || 'var(--primary-color, #dc2626)'};

  [data-theme="dark"] & {
    color: ${props => props.$color || 'var(--primary-color, #dc2626)'};
  }
`;

export const StatLabel = styled.span`
  font-size: 11px;
  color: var(--text-tertiary, #9ca3af);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  [data-theme="dark"] & {
    color: var(--text-tertiary-dark, #64748b);
  }
`;

export const TileContent = styled.div`
  margin: 16px 0;
`;

export const TileFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 16px;
`;

export const LearnMoreButton = styled.button<{ $tileColor?: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-hover, #f3f4f6);
    border-color: ${props => props.$tileColor || 'var(--primary-color, #dc2626)'};
    color: ${props => props.$tileColor || 'var(--primary-color, #dc2626)'};
  }

  [data-theme="dark"] & {
    border-color: var(--border-color-dark, #374151);
    color: var(--text-secondary-dark, #cbd5e1);

    &:hover {
      background: var(--bg-hover-dark, #334155);
    }
  }
`;

export const TileArrow = styled.div<{ $tileColor?: string; $isHovered?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary, #f9fafb);
  color: ${props => props.$tileColor || 'var(--primary-color, #dc2626)'};
  border-radius: 50%;
  transition: all 0.3s ease;

  ${props => props.$isHovered && `
    background: ${props.$tileColor || 'var(--primary-color, #dc2626)'};
    color: white;
    transform: translateX(4px);
  `}

  [data-theme="dark"] & {
    background: var(--bg-tertiary-dark, #334155);
  }
`;

export const TileGlow = styled.div<{ $isHovered?: boolean }>`
  position: absolute;
  bottom: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: ${props => props.$isHovered ? 1 : 0};
  transition: opacity 0.3s ease;
`;
