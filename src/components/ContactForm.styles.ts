import styled from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background: var(--bg-secondary, rgba(255, 255, 255, 0.95));
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &[data-theme='dark'] {
    background: var(--bg-secondary, #1a1a2e);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  input,
  textarea {
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 6px;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    background: var(--bg-primary, #ffffff);
    color: var(--text-primary, #212121);
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color, #E31E24);
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
      background: var(--bg-primary, #ffffff);
    }

    &::placeholder {
      color: var(--text-secondary, #9e9e9e);
    }

    &[data-theme='dark'] {
      background: #2d2d44;
      color: #e0e0e0;
      border-color: #3d3d54;

      &:focus {
        border-color: var(--primary-color, #ff6b6b);
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
      }

      &::placeholder {
        color: #9e9e9e;
      }
    }
  }

  textarea {
    resize: vertical;
    min-height: 150px;
    font-family: 'Inter', sans-serif;
  }
`;

export const ErrorMessage = styled.span`
  color: var(--error-color, #d32f2f);
  font-size: 0.875rem;
  font-weight: 500;
  animation: slideInDown 0.2s ease;

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &[data-theme='dark'] {
    color: #ff6b6b;
  }
`;

export const SubmitButton = styled.button`
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color, #E31E24), #C62828);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &[data-theme='dark'] {
    background: linear-gradient(135deg, #EF5350, #E31E24);
    box-shadow: 0 4px 12px rgba(240, 208, 96, 0.2);

    &:hover {
      box-shadow: 0 4px 12px rgba(240, 208, 96, 0.4);
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
