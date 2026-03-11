import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary, #111827);
  margin: 0 0 0.5rem 0;
  text-align: center;
`;

export const Subtitle = styled.p`
  color: var(--text-secondary, #6B7280);
  margin: 0 0 2rem 0;
  text-align: center;
`;

export const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const RoleCard = styled.button<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--glass-bg, rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(20px);
  border: 2px solid ${props => props.active ? 'var(--primary-color, #C41835)' : 'var(--glass-border, #E5E7EB)'};
  border-radius: var(--radius-lg, 16px);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: var(--primary-color, #C41835);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  ${props => props.active && `
    background: rgba(196, 24, 53, 0.05);
  `}
`;

export const RoleIcon = styled.span`
  font-size: 2.5rem;
  line-height: 1;
`;

export const RoleLabel = styled.span`
  font-weight: 600;
  color: var(--text-primary, #111827);
  font-size: 1.125rem;
`;

export const RoleDescription = styled.span`
  font-size: 0.875rem;
  color: var(--text-secondary, #6B7280);
  text-align: center;
  line-height: 1.4;
`;

// Compact variant
export const CompactContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const CompactLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary, #111827);
  white-space: nowrap;
`;

export const RoleSelect = styled.select`
  padding: 0.5rem 0.75rem;
  background: var(--color-surface, #FFFFFF);
  border: 1px solid var(--color-border, #E5E7EB);
  border-radius: 0.375rem;
  color: var(--text-primary, #111827);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color, #C41835);
  }

  &:focus {
    outline: none;
    border-color: var(--primary-color, #C41835);
    box-shadow: 0 0 0 3px rgba(196, 24, 53, 0.1);
  }

  option {
    color: var(--text-primary, #111827);
  }
`;
