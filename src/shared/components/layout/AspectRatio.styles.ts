import styled from 'styled-components';

export const StyledAspectRatio = styled.div<{
  $ratio: number;
}>`
  position: relative;
  width: 100%;
  padding-bottom: ${(props) => `${(1 / props.$ratio) * 100}%`};
  background-color: var(--bg-secondary, #f9fafb);
  overflow: hidden;
  border-radius: 0.5rem;

  /* Dark theme support */
  [data-theme='dark'] & {
    background-color: var(--bg-secondary-dark, #2a2a2a);
  }
`;

export const AspectRatioContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
