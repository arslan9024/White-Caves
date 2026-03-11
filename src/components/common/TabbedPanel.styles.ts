import styled from 'styled-components';

export const TabbedPanelContainer = styled.div<{ $variant?: string }>`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const TabButtons = styled.div<{ $variant?: string }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => (props.$variant === 'pills' ? '0.75rem' : '0')};
  border-bottom: ${(props) => 
    props.$variant === 'pills' ? 'none' : '1px solid var(--border-color)'};
  padding-bottom: 0;

  @media (max-width: 768px) {
    overflow-x: auto;
    flex-wrap: ${(props) => (props.$variant === 'pills' ? 'wrap' : 'nowrap')};
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const TabButton = styled.button<{ 
  $isActive: boolean; 
  $variant?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${(props) =>
    props.$variant === 'pills'
      ? '0.75rem 1.25rem'
      : '0.75rem 1.25rem'};
  background: ${(props) => {
    if (props.$variant === 'pills') {
      return props.$isActive 
        ? 'var(--color-primary)' 
        : 'var(--bg-hover)';
    }
    return 'transparent';
  }};
  border: none;
  color: ${(props) => {
    if (props.$variant === 'pills') {
      return props.$isActive ? 'white' : 'var(--text-muted)';
    }
    return props.$isActive ? 'var(--color-primary)' : 'var(--text-muted)';
  }};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  border-bottom: ${(props) =>
    props.$variant === 'pills' ? 'none' : '2px solid transparent'};
  margin-bottom: ${(props) => (props.$variant === 'pills' ? '0' : '-1px')};
  border-radius: ${(props) => (props.$variant === 'pills' ? '25px' : '0')};
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: var(--text-primary);
    background: ${(props) =>
      props.$variant === 'pills' 
        ? 'var(--bg-hover)' 
        : 'var(--bg-hover)'};
  }

  ${(props) => {
    if (props.$variant === 'pills' && props.$isActive) {
      return `
        background: var(--color-primary);
        color: white;
      `;
    }
    if (!props.$variant || props.$variant === 'default') {
      return props.$isActive 
        ? `
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        ` 
        : '';
    }
  }}

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
  }
`;

export const TabIcon = styled.span`
  font-size: 1rem;
`;

export const TabLabel = styled.span`
  font-weight: 500;
`;

export const TabBadge = styled.span<{ $variant?: string; $isActive?: boolean }>`
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: ${(props) => {
    if (props.$variant === 'pills' && props.$isActive) {
      return 'white';
    }
    return 'var(--color-primary)';
  }};
  color: ${(props) => {
    if (props.$variant === 'pills' && props.$isActive) {
      return 'var(--color-primary)';
    }
    return 'white';
  }};
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TabContent = styled.div`
  animation: tabFadeIn 0.2s ease;

  @keyframes tabFadeIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const TabPanelContent = styled.div`
  padding: 0;
`;
