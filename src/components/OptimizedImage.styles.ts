import styled, { keyframes } from 'styled-components';

const skeletonLoading = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

export const StyledOptimizedImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  background: var(--bg-secondary, #f5f5f5);

  [data-theme='dark'] & {
    background: #2d3748;
  }
`;

export const StyledImagePlaceholder = styled.div<{ type?: 'blur' | 'skeleton' }>`
  position: absolute;
  inset: 0;
  z-index: 1;

  ${props => props.type === 'blur' && `
    background: linear-gradient(135deg, var(--bg-secondary, #f5f5f5), var(--bg-tertiary, #2a2a3a));
    filter: blur(20px);
    transform: scale(1.1);
  `}

  ${props => props.type === 'skeleton' && `
    background: linear-gradient(
      90deg,
      var(--bg-secondary, #f5f5f5) 25%,
      var(--bg-tertiary, #2a2a3a) 50%,
      var(--bg-secondary, #f5f5f5) 75%
    );
    background-size: 200% 100%;
    animation: ${skeletonLoading} 1.5s infinite;
  `}
`;

export const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.visible {
    opacity: 1;
  }

  ${StyledOptimizedImageContainer}.loaded & {
    opacity: 1;
  }

  ${StyledOptimizedImageContainer}.loaded ${StyledImagePlaceholder} {
    opacity: 0;
    pointer-events: none;
  }
`;

export const StyledImageError = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--bg-secondary, #f5f5f5);
  color: var(--text-secondary, #9ca3af);

  [data-theme='dark'] & {
    background: #2d3748;
    color: #cbd5e0;
  }

  svg {
    width: 40px;
    height: 40px;
    opacity: 0.5;
  }

  span {
    font-size: 0.85rem;
    opacity: 0.7;
  }
`;

export const StyledLazyBackground = styled.div`
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 0.3s ease;

  &:not(.loaded) {
    background: linear-gradient(135deg, var(--bg-secondary, #f5f5f5), var(--bg-tertiary, #2a2a3a));
  }

  [data-theme='dark'] & {
    &:not(.loaded) {
      background: linear-gradient(135deg, #2d3748, #1a1a2e);
    }
  }
`;
