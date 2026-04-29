import styled from 'styled-components';
import { theme } from '../../../../styles/theme';

const { spacing, radius, shadows, transitions, colors, typography } = theme;

export const MaryDetailsTabContainer = styled.div`
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;

  [data-theme='dark'] & {
  }
`;

export const TabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-secondary, #f9fafb);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  [data-theme='dark'] & {
    background: var(--bg-secondary, #2a2a3e);
    border-color: var(--border-color, #3a3a5a);
  }
`;

export const HeaderContent = styled.div`
  flex: 1;

  h3 {
    margin: 0;
    font-size: ${typography.sizes.lg};
    font-weight: ${typography.weights.bold};
    color: var(--text-primary, #1f2937);

    [data-theme='dark'] & {
      color: white;
    }
  }
`;

export const HeaderSubtitle = styled.p`
  margin: ${spacing.xs} 0 0 0;
  font-size: ${typography.sizes.sm};
  color: var(--text-secondary, #6b7280);

  [data-theme='dark'] & {
    color: var(--text-secondary, #a0a0a0);
  }
`;

export const DetailsViewTabs = styled.div`
  display: flex;
  gap: ${spacing.sm};
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
  overflow-x: auto;

  [data-theme='dark'] & {
    background: var(--bg-primary, #1a1a2e);
    border-color: var(--border-color, #3a3a5a);
  }
`;

export const ViewTab = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: ${radius.md};
  font-size: ${typography.sizes.base};
  font-weight: ${typography.weights.medium};
  cursor: pointer;
  transition: ${transitions.hover};
  white-space: nowrap;
  color: var(--text-secondary);

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  ${props =>
    props.$isActive &&
    `
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--primary);
  `}

  [data-theme='dark'] & {
    color: var(--text-secondary, #a0a0a0);

    &:hover {
      background: var(--bg-secondary, #2a2a3e);
      color: white;
    }

    ${props =>
      props.$isActive &&
      `
      background: var(--bg-secondary, #2a2a3e);
      color: white;
      border-color: var(--primary, ${colors.primary});
    `}
  }
`;

export const DetailsViewContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;

    &:hover {
      background: var(--text-muted);
    }
  }

  [data-theme='dark'] & {
  }
`;

export const GuideSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};

  [data-theme='dark'] & {
  }
`;

export const InfoCard = styled.div`
  display: flex;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: ${radius.lg};
  border-left: 4px solid ${colors.info};

  h4 {
    margin: 0 0 ${spacing.sm} 0;
    color: var(--text-primary);
    font-size: 15px;
    font-weight: ${typography.weights.semibold};

    [data-theme='dark'] & {
      color: white;
    }
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: ${typography.sizes.base};
    line-height: 1.5;

    [data-theme='dark'] & {
      color: var(--text-secondary, #a0a0a0);
    }
  }

  svg {
    flex-shrink: 0;
    color: ${colors.info};
    margin-top: 2px;
  }

  [data-theme='dark'] & {
    background: var(--bg-secondary, #2a2a3e);
    border-color: var(--border-color, #3a3a5a);
  }
`;

export const GuideContent = styled.div`
  h4 {
    margin: 0 0 12px 0;
    color: var(--text-primary);
    font-size: 15px;
    font-weight: ${typography.weights.semibold};

    &.mt-6 {
      margin-top: 24px;
    }

    [data-theme='dark'] & {
      color: white;
    }
  }
`;

export const GuideList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    color: var(--text-secondary);
    font-size: ${typography.sizes.base};
    line-height: 1.5;
    padding-left: 24px;
    position: relative;

    &::before {
      content: '•';
      position: absolute;
      left: 8px;
      color: var(--primary);
      font-weight: bold;
    }

    strong {
      color: var(--text-primary);
      font-weight: ${typography.weights.semibold};

      [data-theme='dark'] & {
        color: white;
      }
    }

    [data-theme='dark'] & {
      color: var(--text-secondary, #a0a0a0);
    }
  }

  [data-theme='dark'] & {
  }
`;

export const SelectedPropertySection = styled.div`
  [data-theme='dark'] & {
  }
`;

export const PropertyDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${spacing.md};

  [data-theme='dark'] & {
  }
`;

export const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: ${radius.md};

  label {
    font-size: ${typography.sizes.xs};
    font-weight: ${typography.weights.semibold};
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;

    [data-theme='dark'] & {
      color: var(--text-muted, #808080);
    }
  }

  > div,
  > p {
    font-size: ${typography.sizes.base};
    font-weight: ${typography.weights.medium};
    color: var(--text-primary);

    [data-theme='dark'] & {
      color: white;
    }
  }

  [data-theme='dark'] & {
    background: var(--bg-secondary, #2a2a3e);
    border-color: var(--border-color, #3a3a5a);
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: ${spacing.xs} ${radius.xl};
  background: rgba(56, 142, 60, 0.1);
  color: ${colors.success};
  border-radius: ${radius.md};
  font-size: ${typography.sizes.xs};
  font-weight: ${typography.weights.semibold};
  text-transform: uppercase;

  [data-theme='dark'] & {
    background: rgba(56, 142, 60, 0.2);
  }
`;

export const OwnersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};

  li {
    color: var(--text-secondary);
    font-size: ${typography.sizes.base};
    padding-left: 16px;
    position: relative;

    &::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--primary);
    }

    [data-theme='dark'] & {
      color: var(--text-secondary, #a0a0a0);
    }
  }

  [data-theme='dark'] & {
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;

  svg {
    color: var(--text-muted);
    margin-bottom: 16px;
    width: 48px;
    height: 48px;
  }

  h4 {
    margin: 0 0 8px 0;
    color: var(--text-primary);
    font-size: ${typography.sizes.md};
    font-weight: ${typography.weights.semibold};

    [data-theme='dark'] & {
      color: white;
    }
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: ${typography.sizes.base};
    line-height: 1.5;
    max-width: 400px;

    [data-theme='dark'] & {
      color: var(--text-secondary, #a0a0a0);
    }
  }

  [data-theme='dark'] & {
  }
`;

export const MatrixSection = styled.div`
  [data-theme='dark'] & {
  }
`;

export const MatrixInfo = styled.div`
  padding: ${spacing.md};
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: ${radius.lg};
  margin-bottom: 20px;

  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: ${typography.sizes.base};

    [data-theme='dark'] & {
      color: var(--text-secondary, #a0a0a0);
    }
  }

  [data-theme='dark'] & {
    background: var(--bg-secondary, #2a2a3e);
    border-color: var(--border-color, #3a3a5a);
  }
`;

export const ClustersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};

  [data-theme='dark'] & {
  }
`;

export const ClusterBlock = styled.div`
  [data-theme='dark'] & {
  }
`;

export const ClusterTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary);

  [data-theme='dark'] & {
    color: white;
  }
`;

export const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;

  [data-theme='dark'] & {
  }
`;

export const PropertyCard = styled.div<{ $isSelected: boolean }>`
  padding: 12px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: ${radius.lg};
  cursor: pointer;
  transition: ${transitions.hover};

  ${props =>
    props.$isSelected &&
    `
    border-color: var(--primary);
    background: rgba(212, 175, 55, 0.05);
  `}

  &:hover {
    border-color: var(--primary);
    box-shadow: ${shadows.sm};
  }

  [data-theme='dark'] & {
    background: var(--bg-secondary, #2a2a3e);
    border-color: var(--border-color, #3a3a5a);

    &:hover {
      border-color: var(--primary, ${colors.primary});
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    ${props =>
      props.$isSelected &&
      `
      border-color: var(--primary, ${colors.primary});
      background: rgba(212, 175, 55, 0.08);
    `}
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: ${spacing.sm};

  [data-theme='dark'] & {
  }
`;

export const PNumber = styled.span`
  font-weight: ${typography.weights.semibold};
  font-size: ${typography.sizes.base};
  color: var(--text-primary);

  [data-theme='dark'] & {
    color: white;
  }
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  margin-bottom: 8px;

  p {
    margin: 0;
    font-size: ${typography.sizes.xs};
    color: var(--text-secondary);

    &.card-project {
      font-weight: ${typography.weights.medium};
      color: var(--text-primary);

      [data-theme='dark'] & {
        color: white;
      }
    }

    [data-theme='dark'] & {
      color: var(--text-secondary, #a0a0a0);
    }
  }

  [data-theme='dark'] & {
  }
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
  font-size: ${typography.sizes.xs};
  color: var(--text-muted);

  [data-theme='dark'] & {
    color: var(--text-muted, #808080);
    border-color: var(--border-color, #3a3a5a);
  }
`;

export const EmptyMatrix = styled.div`
  padding: 40px;
  text-align: center;
  color: var(--text-muted);

  p {
    margin: 0;
    font-size: ${typography.sizes.base};

    [data-theme='dark'] & {
      color: var(--text-muted, #808080);
    }
  }

  [data-theme='dark'] & {
  }
`;
