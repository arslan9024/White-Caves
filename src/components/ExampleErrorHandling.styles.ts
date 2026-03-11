import styled from 'styled-components';

export const StyledExampleErrorHandling = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
`;

export const StyledErrorTitle = styled.h2`
  color: #2d3748;
  margin-bottom: 0.5rem;

  [data-theme='dark'] & {
    color: #f7fafc;
  }
`;

export const StyledErrorDescription = styled.p`
  color: #718096;
  margin-bottom: 2rem;

  [data-theme='dark'] & {
    color: #cbd5e0;
  }
`;

export const StyledTestSection = styled.section`
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  [data-theme='dark'] & {
    background: #2d3748;
    border-color: #4a5568;
  }

  h3 {
    color: #2d3748;
    margin-bottom: 1rem;
    font-size: 1.25rem;

    [data-theme='dark'] & {
      color: #e2e8f0;
    }
  }
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const StyledButton = styled.button<{ variant?: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => {
    switch (props.variant) {
      case 'success':
        return '#48bb78';
      case 'error':
        return '#f56565';
      case 'warning':
        return '#ed8936';
      case 'info':
        return '#4299e1';
      case 'primary':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'secondary':
        return '#718096';
      default:
        return '#667eea';
    }
  }};
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const StyledInfoBox = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #4299e1;

  [data-theme='dark'] & {
    background: #1a202c;
    border-left-color: #63b3ed;
  }

  p {
    margin: 0.5rem 0;
    color: #2d3748;

    [data-theme='dark'] & {
      color: #e2e8f0;
    }
  }

  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
    color: #718096;

    [data-theme='dark'] & {
      color: #cbd5e0;
    }
  }

  li {
    margin: 0.25rem 0;
  }
`;
