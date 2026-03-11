import styled from 'styled-components';

type PaddingSize = 'none' | 'small' | 'medium' | 'large';
type BackgroundVariant = 'transparent' | 'primary' | 'secondary' | 'accent';

const getPaddingValue = (padding: PaddingSize): string => {
  switch (padding) {
    case 'none':
      return '0';
    case 'small':
      return '1rem 0';
    case 'medium':
      return '2rem 0';
    case 'large':
      return '3rem 0';
    default:
      return '3rem 0';
  }
};

const getBackgroundColor = (bg: BackgroundVariant): string => {
  switch (bg) {
    case 'primary':
      return 'var(--bg-primary, #FFFFFF)';
    case 'secondary':
      return 'var(--bg-secondary, #F9FAFB)';
    case 'accent':
      return 'rgba(220, 38, 38, 0.05)';
    case 'transparent':
    default:
      return 'transparent';
  }
};

export const StyledSection = styled.section<{
  $padding?: PaddingSize;
  $background?: BackgroundVariant;
  $minHeight?: string;
  $maxWidth?: string;
}>`
  width: 100%;
  padding: ${(props) => getPaddingValue(props.$padding || 'large')};
  background-color: ${(props) => getBackgroundColor(props.$background || 'transparent')};
  ${(props) => props.$minHeight && `min-height: ${props.$minHeight};`}
  ${(props) => props.$maxWidth && `max-width: ${props.$maxWidth};`}
  transition: background-color 0.3s ease;

  /* Dark theme support */
  [data-theme='dark'] & {
    ${(props) => {
      switch (props.$background) {
        case 'primary':
          return 'background-color: var(--bg-primary-dark, #1a1a1a);';
        case 'secondary':
          return 'background-color: var(--bg-secondary-dark, #2a2a2a);';
        case 'accent':
          return 'background-color: rgba(220, 38, 38, 0.1);';
        default:
          return 'background-color: transparent;';
      }
    }}
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  [data-theme='dark'] & {
    color: var(--text-primary-dark, #ffffff);
  }
`;

export const SectionHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary, #1f2937);
  letter-spacing: -0.015em;

  @media (min-width: 768px) {
    font-size: 2.25rem;
  }

  [data-theme='dark'] & {
    color: var(--text-primary-dark, #ffffff);
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 1rem;
  margin: 0;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;

  [data-theme='dark'] & {
    color: var(--text-secondary-dark, #d1d5db);
  }
`;

export const SectionHeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const SectionContent = styled.div`
  width: 100%;

  [data-theme='dark'] & {
    color: var(--text-primary-dark, #ffffff);
  }
`;
