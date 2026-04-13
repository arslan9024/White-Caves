import styled from 'styled-components';
import { transitions } from '../../../styles/theme/transitions';
import { typography } from '../../../styles/theme/typography';
import { radius } from '../../../styles/theme/radius';
import { spacing } from '../../../styles/theme/spacing';

export const PropertyDetailsCardContainer = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: ${radius.xl};
  overflow: hidden;
  font-size: ${(props) => (props.className?.includes('compact') ? '13px' : '14px')};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
`;

export const PropertyId = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.weights.bold};
  color: var(--text-primary);
`;

export const StatusBadge = styled.span<{ $status?: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: ${typography.sizes.xs};
  font-weight: ${typography.weights.semibold};
  text-transform: uppercase;
  background: ${(props) => {
    switch (props.$status) {
      case 'rented':
        return 'rgba(34, 197, 94, 0.15)';
      case 'available':
        return 'rgba(59, 130, 246, 0.15)';
      case 'sold':
        return 'rgba(220, 38, 38, 0.15)';
      case 'reserved':
        return 'rgba(245, 158, 11, 0.15)';
      default:
        return 'rgba(107, 114, 128, 0.15)';
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case 'rented':
        return '#22c55e';
      case 'available':
        return '#3b82f6';
      case 'sold':
        return '#D4AF37';
      case 'reserved':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  }};
`;

export const SectionsContainer = styled.div`
  padding: 16px 20px;
`;

export const DetailsSection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.sizes.sm};
  font-weight: ${typography.weights.semibold};
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
`;

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;

  &.compact {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: ${spacing.sm};
  }
`;

export const FieldItem = styled.div<{ $empty?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: var(--bg-secondary);
  border-radius: ${radius.lg};
  transition: ${transitions.hover};
  opacity: ${(props) => (props.$empty ? '0.5' : '1')};

  &:hover {
    background: rgba(212, 175, 55, 0.05);
  }
`;

export const FieldIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: ${radius.md};
  color: var(--primary);
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const FieldContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const FieldLabel = styled.span`
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const FieldValue = styled.span`
  font-size: ${typography.sizes.base};
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary);
  word-break: break-word;

  &.compact {
    font-size: ${typography.sizes.xs};
  }
`;

export const OwnersSection = styled.div`
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
`;

export const OwnersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const OwnerItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: ${transitions.hover};
  text-align: left;

  &:hover {
    border-color: var(--primary);
    transform: translateX(4px);
  }
`;

export const OwnerAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(
    135deg,
    var(--primary),
    #ff6b6b
  );
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${typography.weights.bold};
  font-size: ${typography.sizes.md};
  flex-shrink: 0;
`;

export const OwnerInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const OwnerName = styled.span`
  display: block;
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary);
  margin-bottom: 4px;
`;

export const OwnerContacts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const ContactBadge = styled.span`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: 3px 8px;
  background: var(--bg-secondary);
  border-radius: ${radius.sm};
  font-size: 11px;
  color: var(--text-secondary);
`;

export const MoreContacts = styled.span`
  padding: 3px 8px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: ${radius.sm};
  font-size: 11px;
  color: var(--primary);
  font-weight: ${typography.weights.semibold};
`;
