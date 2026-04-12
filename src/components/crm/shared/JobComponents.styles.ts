import styled from 'styled-components';
import { theme } from '../../../styles/theme';

const { colors, shadows, transitions, radius } = theme;

/* ============================================================================
 * JobComponents Styled Components
 * Used by: JobPostComposer.jsx
 * Dark-themed job posting UI with slate/amber palette
 * ============================================================================ */

export const JobPostComposer = styled.div`
  background: ${colors.background.overlay};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${radius.xl};
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    border-radius: ${radius.lg};
  }
`;

export const NotificationToast = styled.div<{ $type?: 'success' | 'error' }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.75rem 1.25rem;
  border-radius: ${radius.lg};
  font-size: 0.875rem;
  font-weight: 500;
  z-index: var(--z-notification, 800);
  animation: slideIn 0.3s ease;

  background: ${(props) => {
    if (props.$type === 'success') {
      return 'rgba(16, 185, 129, 0.9)';
    }
    if (props.$type === 'error') {
      return 'rgba(239, 68, 68, 0.9)';
    }
    return 'rgba(59, 130, 246, 0.9)';
  }};
  color: #fff;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

export const FormFieldError = styled.div`
  &.has-error input,
  &.has-error textarea,
  &.has-error select {
    border-color: #ef4444;
  }
`;

export const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
`;

export const PlatformError = styled.div`
  color: #ef4444;
  font-size: 0.8125rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  margin: 0 1.5rem;
`;

export const ComposerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

export const HeaderIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${radius.xl};
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const HeaderInfo = styled.div`
  flex: 1;

  h3 {
    color: #fff;
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
  }

  p {
    color: #64748b;
    font-size: 0.8125rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1rem;
    }
  }
`;

export const PlatformSelection = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  h4 {
    color: #94a3b8;
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.75rem 0;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const PlatformsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const PlatformChip = styled.button<{ $selected?: boolean; $color?: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${(props) =>
    props.$selected ? `color-mix(in srgb, ${props.$color || '#f59e0b'} 15%, transparent)` : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${(props) => (props.$selected ? props.$color || '#f59e0b' : 'rgba(255, 255, 255, 0.1)')};
  border-radius: 9999px;
  color: ${(props) => (props.$selected ? props.$color || '#f59e0b' : '#94a3b8')};
  font-size: 0.8125rem;
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.2);
    color: #fff;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;

export const JobForm = styled.form`
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const FormSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  h4 {
    color: #fff;
    font-size: 0.9375rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    margin-bottom: 1.25rem;

    h4 {
      font-size: 0.875rem;
    }
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormField = styled.div<{ $span2?: boolean; $hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  grid-column: ${(props) => (props.$span2 ? 'span 2' : 'span 1')};

  @media (max-width: 768px) {
    grid-column: span 1;
  }

  label {
    color: #94a3b8;
    font-size: 0.8125rem;
    font-weight: 500;
  }

  .required {
    color: #ef4444;
    margin-left: 2px;
  }

  input,
  select,
  textarea {
    padding: 0.625rem 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid ${(props) => (props.$hasError ? '#ef4444' : 'rgba(255, 255, 255, 0.1)')};
    border-radius: 6px;
    color: #fff;
    font-size: 0.875rem;
    font-family: inherit;
    transition: ${transitions.hover};

    &:focus {
      outline: none;
      border-color: #f59e0b;
      background: rgba(255, 255, 255, 0.08);
    }

    &::placeholder {
      color: #64748b;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
    max-height: 200px;
  }

  select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2394a3b8'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1.25rem;
    padding-right: 2rem;
  }
`;

export const InputWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  transition: ${transitions.hover};

  &:focus-within {
    border-color: #f59e0b;
    background: rgba(255, 255, 255, 0.08);
  }

  svg {
    color: #64748b;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    padding: 0;
    color: #fff;
    font-size: 0.875rem;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #64748b;
    }
  }
`;

export const SalaryRange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input {
    flex: 1;
    padding: 0.625rem 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: #fff;
    font-size: 0.875rem;
    transition: ${transitions.hover};

    &:focus {
      outline: none;
      border-color: #f59e0b;
    }

    &::placeholder {
      color: #64748b;
    }
  }

  span {
    color: #64748b;
    font-size: 0.8125rem;
    font-weight: 500;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;

    span {
      order: -1;
    }
  }
`;

export const ComposerActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
  }
`;

export const ActionBtn = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: ${radius.lg};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${transitions.hover};
  border: none;
  font-family: inherit;

  ${(props) =>
    props.$variant === 'primary'
      ? `
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #000;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }
  `
      : `
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #94a3b8;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.3);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem 1rem;
  }
`;

export const JobPreview = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);

  h4 {
    color: #94a3b8;
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 1rem 0;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const PreviewCard = styled.div`
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: ${radius.lg};
  }
`;

export const PreviewHeader = styled.div`
  h3 {
    color: #fff;
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
  }

  .company {
    color: #f59e0b;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 0.25rem;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1rem;
    }
  }
`;

export const PreviewMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  span {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: #64748b;
    font-size: 0.8125rem;

    svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
  }

  @media (max-width: 768px) {
    gap: 0.75rem;
    font-size: 0.75rem;
  }
`;

export const PreviewSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  h5 {
    color: #94a3b8;
    font-size: 0.8125rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #cbd5e1;
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 0;
    white-space: pre-line;
  }

  @media (max-width: 768px) {
    h5 {
      font-size: 0.75rem;
    }

    p {
      font-size: 0.8125rem;
    }
  }
`;
