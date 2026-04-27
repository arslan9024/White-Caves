import styled from 'styled-components';
import { theme } from '../styles/theme';

const { colors, shadows, transitions, radius, spacing, typography } = theme;

export const JobBoardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const BoardTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary);
  margin-bottom: 2rem;
  margin: 0 0 2rem 0;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }
`;

export const JobsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const JobCard = styled.div`
  background: ${colors.background.secondary};
  padding: 1.5rem;
  border-radius: ${radius.lg};
  box-shadow: ${shadows.card};
  transition: all ${transitions.durations.standard} ${transitions.easing.easeOut};
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: ${shadows.luxuryHover};
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

export const JobTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  margin: 0 0 0.75rem 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const JobDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

export const JobDetails = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

export const DetailBadge = styled.span`
  background: ${colors.background.tertiary};
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  color: var(--text-primary);
`;

export const SubmitButton = styled.button`
  background: ${colors.primary};
  color: ${colors.background.secondary};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: ${radius.sm};
  cursor: pointer;
  width: 100%;
  margin-top: auto;
  font-weight: ${typography.weights.semibold};
  transition: ${transitions.hover};

  &:hover {
    background: ${colors.primaryDark};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
  }
`;

export const ApplicationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: ${colors.background.tertiary};
  border-radius: ${radius.lg};
`;

export const FormSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm};
  font-size: 0.9rem;
  background: ${colors.background.secondary};
  color: var(--text-primary);
  cursor: pointer;
  transition: ${transitions.hover};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: ${shadows.luxuryFocus};
  }

  option {
    color: var(--text-primary);
  }
`;

export const FormInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm};
  font-size: 0.9rem;
  background: ${colors.background.secondary};
  color: var(--text-primary);
  transition: ${transitions.hover};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: ${shadows.luxuryFocus};
  }

  &[type="file"] {
    border: none;
    padding: 0.5rem 0;
    cursor: pointer;
  }

  &[type="file"]::file-selector-button {
    background: ${colors.primary};
    color: ${colors.background.secondary};
    border: none;
    padding: 0.5rem 1rem;
    border-radius: ${radius.sm};
    cursor: pointer;
    font-weight: ${typography.weights.medium};

    &:hover {
      background: ${colors.primaryDark};
    }
  }
`;

export const FormTextarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm};
  font-size: 0.9rem;
  background: ${colors.background.secondary};
  color: var(--text-primary);
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: ${transitions.hover};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: ${shadows.luxuryFocus};
  }
`;

export const FormSubmitButton = styled.button`
  background: ${colors.primary};
  color: ${colors.background.secondary};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: ${radius.sm};
  cursor: pointer;
  font-weight: ${typography.weights.semibold};
  transition: ${transitions.hover};
  width: 100%;

  &:hover {
    background: ${colors.primaryDark};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: ${colors.borderDark};
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormLabel = styled.label`
  font-size: 0.85rem;
  font-weight: ${typography.weights.medium};
  color: var(--text-primary);
`;

export const ErrorMessage = styled.span`
  color: ${colors.error};
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

export const SuccessMessage = styled.div`
  background: #E8F5E9;
  color: ${colors.success};
  padding: 1rem;
  border-radius: ${radius.sm};
  margin-bottom: 1rem;
  border-left: 4px solid ${colors.success};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
`;

export const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: ${typography.weights.semibold};
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`;

export const EmptyStateDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FilterButton = styled.button<{ $isActive?: boolean }>`
  padding: 0.6rem 1.2rem;
  background: ${props => props.$isActive ? colors.primary : colors.background.tertiary};
  color: ${props => props.$isActive ? colors.background.secondary : 'var(--text-primary)'};
  border: ${props => props.$isActive ? 'none' : `1px solid ${colors.border}`};
  border-radius: 20px;
  cursor: pointer;
  font-weight: ${typography.weights.medium};
  transition: ${transitions.hover};
  white-space: nowrap;

  &:hover {
    ${props => props.$isActive 
      ? `background: ${colors.primaryDark};` 
      : `background: ${colors.borderLight}; border-color: ${colors.borderDark};`
    }
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const SortDropdown = styled.select`
  padding: 0.6rem 1rem;
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm};
  background: ${colors.background.secondary};
  color: var(--text-primary);
  cursor: pointer;
  font-weight: ${typography.weights.medium};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const JobCount = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;
