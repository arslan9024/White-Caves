import styled, { keyframes, css } from 'styled-components';

// ─── Animations ───────────────────────────────────────────────
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// ─── Container ────────────────────────────────────────────────
export const ImageContainer = styled.div<{
  $aspectRatio?: string;
  $borderRadius?: string;
  $width?: number;
  $height?: number;
}>`
  position: relative;
  overflow: hidden;
  display: inline-block;
  width: 100%;
  line-height: 0;

  ${({ $aspectRatio }) =>
    $aspectRatio &&
    css`
      aspect-ratio: ${$aspectRatio};
    `}

  ${({ $borderRadius }) =>
    $borderRadius &&
    css`
      border-radius: ${$borderRadius};
    `}
`;

// ─── Skeleton ─────────────────────────────────────────────────
export const Skeleton = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    var(--color-surface-secondary, #e2e8f0) 25%,
    var(--color-surface-tertiary, #f1f5f9) 50%,
    var(--color-surface-secondary, #e2e8f0) 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  transition: opacity 0.3s ease;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  z-index: 1;
`;

// ─── Image ────────────────────────────────────────────────────
export const StyledImage = styled.img<{
  $loaded: boolean;
  $objectFit: string;
  $objectPosition?: string;
}>`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: ${({ $objectFit }) => $objectFit};
  ${({ $objectPosition }) =>
    $objectPosition &&
    css`
      object-position: ${$objectPosition};
    `}
  animation: ${({ $loaded }) =>
    $loaded
      ? css`
          ${fadeIn} 0.3s ease-out
        `
      : 'none'};
`;

// ─── Error Fallback ───────────────────────────────────────────
export const ErrorFallback = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--color-surface-secondary, #f1f5f9);
  color: var(--color-text-tertiary, #94a3b8);
  font-size: 13px;
  text-align: center;
  padding: 16px;

  svg {
    width: 32px;
    height: 32px;
    opacity: 0.5;
  }
`;
