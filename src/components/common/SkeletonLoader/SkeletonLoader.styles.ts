import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

export const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SkeletonLine = styled.div`
  background: linear-gradient(
    90deg,
    var(--bg-quaternary, #e5e7eb) 25%,
    var(--bg-tertiary, #f3f4f6) 50%,
    var(--bg-quaternary, #e5e7eb) 75%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;

  [data-theme='dark'] & {
    background: linear-gradient(
      90deg,
      var(--bg-tertiary, #374151) 25%,
      var(--bg-secondary, #1f2937) 50%,
      var(--bg-tertiary, #374151) 75%
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite;
  }
`;

export const SkeletonCircle = styled(SkeletonLine)`
  border-radius: 50%;
  flex-shrink: 0;
`;

export const SkeletonBlock = styled(SkeletonLine)<{ $rounded?: boolean }>`
  border-radius: ${(props) => (props.$rounded ? '8px' : '4px')};
`;

export const SkeletonLoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const SkeletonLoadingText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SkeletonLoadingImage = styled.div`
  width: 100%;
`;

export const SkeletonLoadingCard = styled.div`
  border-radius: 8px;
  background: var(--bg-primary, #ffffff);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  [data-theme='dark'] & {
    background: var(--bg-secondary, #1f2937);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
`;
