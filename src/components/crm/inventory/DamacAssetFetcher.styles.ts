import styled from 'styled-components';
import { keyframes } from 'styled-components';
import { typography } from '../../../styles/theme/typography';
import { theme } from '../../../styles/theme';

const { colors, shadows, transitions, radius } = theme;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const DamacFetcherContainer = styled.div`
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border-color);

  @media (prefers-color-scheme: dark) {
    background: #1e1e2e;
    border-color: #333333;
  }
`;

export const FetcherHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: ${colors.primary};
    flex-shrink: 0;
  }

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-primary);
  }

  span {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  @media (prefers-color-scheme: dark) {
    h3 {
      color: #e2e8f0;
    }
    span {
      color: #94a3b8;
    }
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
  background: var(--bg-tertiary);
  padding: 4px;
  border-radius: 8px;

  @media (prefers-color-scheme: dark) {
    background: #333333;
  }
`;

export const ViewToggleButton = styled.button<{ $active?: boolean }>`
  padding: 8px;
  border: none;
  background: ${props => props.$active ? 'var(--bg-primary)' : 'transparent'};
  border-radius: 6px;
  cursor: pointer;
  color: ${props => props.$active ? colors.primary : 'var(--text-muted)'};
  transition: all 0.2s;

  &:hover {
    color: ${colors.primary};
  }

  @media (prefers-color-scheme: dark) {
    background: ${props => props.$active ? '#2a2a3e' : 'transparent'};
  }
`;

export const FetcherInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (prefers-color-scheme: dark) {
    color: #a0aec0;
  }
`;

export const AutoFillButton = styled.button`
  font-size: 0.75rem;
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  border-radius: 4px;
  cursor: pointer;
  color: ${colors.primary};
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;

  &:hover {
    background: rgba(212, 175, 55, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    background: #333333;
    border-color: #444444;

    &:hover {
      background: rgba(212, 175, 55, 0.15);
    }
  }
`;

export const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: ${typography.fontFamily.mono};
  font-size: 0.9rem;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }

  &::placeholder {
    color: var(--text-muted);
    opacity: 0.6;
  }

  @media (prefers-color-scheme: dark) {
    background: #1a1a2e;
    border-color: #333333;
    color: #e2e8f0;
  }
`;

export const FetcherActions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const FetchButton = styled.button<{ $variant?: 'primary' | 'danger' | 'default' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  background: ${props => {
    switch (props.$variant) {
      case 'primary':
        return colors.primary;
      case 'danger':
        return 'transparent';
      default:
        return 'var(--bg-tertiary)';
    }
  }};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: ${props => {
    switch (props.$variant) {
      case 'primary':
        return 'white';
      case 'danger':
        return colors.error;
      default:
        return 'var(--text-primary)';
    }
  }};
  border-color: ${props => {
    switch (props.$variant) {
      case 'primary':
        return colors.primary;
      case 'danger':
        return 'rgba(239, 68, 68, 0.3)';
      default:
        return 'var(--border-color)';
    }
  }};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    ${props => {
      switch (props.$variant) {
        case 'primary':
          return `background: ${colors.primaryDark};`;
        case 'danger':
          return 'background: rgba(239, 68, 68, 0.1);';
        default:
          return 'background: var(--bg-hover);';
      }
    }}
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    background: ${props => {
      switch (props.$variant) {
        case 'primary':
          return colors.primary;
        case 'danger':
          return 'transparent';
        default:
          return '#333333';
      }
    }};

    &:hover:not(:disabled) {
      ${props => {
        switch (props.$variant) {
          case 'primary':
            return `background: ${colors.primaryDark};`;
          case 'danger':
            return 'background: rgba(239, 68, 68, 0.15);';
          default:
            return 'background: #444444;';
        }
      }}
    }
  }
`;

export const SpinningIcon = styled.svg`
  animation: ${spin} 1s linear infinite;
`;

export const ResultsSummary = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  flex-wrap: wrap;

  @media (prefers-color-scheme: dark) {
    background: #333333;
  }
`;

export const SummaryItem = styled.div<{ $variant?: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.$variant === 'success' ? colors.success : props.$variant === 'error' ? colors.error : 'var(--text-primary)'};
`;

export const AssetsGrid = styled.div<{ $viewMode?: 'grid' | 'list' }>`
  display: ${props => props.$viewMode === 'list' ? 'flex' : 'grid'};
  ${props => props.$viewMode === 'list' ? 'flex-direction: column;' : 'grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));'}
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
`;

export const AssetCard = styled.div<{ $selected?: boolean }>`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${props => props.$selected ? colors.primary : 'var(--border-color)'};
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-secondary);

  &:hover {
    border-color: ${colors.primary};
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
  }

  @media (prefers-color-scheme: dark) {
    background: #1e1e2e;
    border-color: ${props => props.$selected ? colors.primary : '#333333'};
  }
`;

export const AssetImage = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  background: var(--bg-primary);

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const SelectionBadge = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(212, 175, 55, 0.9);
  border-radius: 50%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const AssetInfo = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.75rem;
`;

export const AssetSD = styled.span`
  font-weight: 600;
  color: var(--text-primary);

  @media (prefers-color-scheme: dark) {
    color: #e2e8f0;
  }
`;

export const AssetRegistration = styled.span`
  color: var(--text-secondary);
  font-size: 0.7rem;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
`;

export const AssetType = styled.span<{ $type?: string }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${props => props.$type === 'primary' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(156, 163, 175, 0.2)'};
  color: ${props => props.$type === 'primary' ? colors.primary : '#6b7280'};
  text-transform: capitalize;
  font-weight: 500;
`;

export const OpenLink = styled.a`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(212, 175, 55, 0.2);
  color: ${colors.primary};
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: rgba(212, 175, 55, 0.4);
  }

  ${AssetCard}:hover & {
    opacity: 1;
  }
`;

export const NotFoundSection = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;

  h4 {
    margin: 0 0 12px 0;
    color: #ef4444;
    font-size: 14px;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);

    h4 {
      color: #fca5a5;
    }
  }
`;

export const NotFoundList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const NotFoundItem = styled.span`
  padding: 4px 8px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 4px;
  font-size: 0.85rem;
  color: #ef4444;

  @media (prefers-color-scheme: dark) {
    background: rgba(239, 68, 68, 0.15);
    color: #fca5a5;
  }
`;
