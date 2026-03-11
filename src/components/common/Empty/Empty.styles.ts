import styled from 'styled-components';

export const EmptyContainer = styled.div<{ $fullHeight?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  min-height: ${(props) => (props.$fullHeight ? '100vh' : '300px')};
  color: var(--text-secondary, #6b7280);

  [data-theme='dark'] & {
    color: var(--text-secondary, #d1d5db);
  }

  @media (max-width: 640px) {
    padding: 32px 16px;
    min-height: ${(props) => (props.$fullHeight ? '100vh' : '200px')};
  }
`;

export const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 400px;
`;

export const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: var(--bg-secondary, #f3f4f6);
  color: var(--text-tertiary, #d1d5db);

  svg {
    width: 48px;
    height: 48px;
  }

  [data-theme='dark'] & {
    background: var(--bg-tertiary, #374151);
    color: var(--text-tertiary, #9ca3af);
  }

  @media (max-width: 640px) {
    width: 64px;
    height: 64px;

    svg {
      width: 36px;
      height: 36px;
    }
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
  margin: 0;

  [data-theme='dark'] & {
    color: var(--text-primary, #f3f4f6);
  }

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

export const EmptyDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  margin: 0;
  line-height: 1.5;

  [data-theme='dark'] & {
    color: var(--text-secondary, #d1d5db);
  }

  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

export const EmptyAction = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;

  button {
    min-width: 120px;
  }
`;
