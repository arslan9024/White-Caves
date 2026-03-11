import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
`;

export const LazyImageContainerStyled = styled.div`
  position: relative;
  overflow: hidden;
  background: var(--bg-secondary, #f0f0f0);

  [data-theme="dark"] & {
    background: var(--bg-tertiary, #252542);
  }
`;

export const LazyImageElement = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease, transform 0.3s ease;

  &.loading {
    opacity: 0;
  }

  &.loaded {
    opacity: 1;
  }
`;

export const LazyImagePlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--bg-secondary, #f0f0f0),
    var(--bg-tertiary, #e0e0e0)
  );
  animation: ${shimmer} 1.5s ease-in-out infinite;

  [data-theme="dark"] & {
    background: linear-gradient(
      135deg,
      var(--bg-tertiary, #252542),
      var(--bg-secondary, #1a1a2e)
    );
  }

  svg {
    width: 48px;
    height: 48px;
    color: var(--text-tertiary, #a0a0a0);
    opacity: 0.5;
  }
`;

export const LazyImageSkeleton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LazyImageError = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-muted);

  svg {
    width: 48px;
    height: 48px;
  }

  span {
    font-size: 0.875rem;
  }
`;

export const LazyBackgroundImageContainer = styled.div<{ src: string; fallbackColor: string }>`
  position: relative;
  overflow: hidden;
  background-color: ${props => props.fallbackColor};
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  transition: opacity 0.3s ease;

  &.loading {
    opacity: 0.5;
  }

  &.loaded {
    opacity: 1;
  }
`;
