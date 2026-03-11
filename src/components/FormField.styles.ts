import styled from 'styled-components';

export const StyledFormField = styled.div`
  margin-bottom: 1.5rem;
`;

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;

  [data-theme='dark'] & {
    color: #e2e8f0;
  }
`;

export const StyledRequired = styled.span`
  color: #f56565;
  margin-left: 0.25rem;

  [data-theme='dark'] & {
    color: #fc8181;
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #2d3748;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background: #f7fafc;
    color: #a0aec0;
    cursor: not-allowed;
  }

  [data-theme='dark'] & {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }

    &:disabled {
      background: #1a202c;
      color: #718096;
    }
  }
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #2d3748;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background: #f7fafc;
    color: #a0aec0;
    cursor: not-allowed;
  }

  [data-theme='dark'] & {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }

    &:disabled {
      background: #1a202c;
      color: #718096;
    }
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background: #f7fafc;
    color: #a0aec0;
    cursor: not-allowed;
  }

  [data-theme='dark'] & {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }

    &:disabled {
      background: #1a202c;
      color: #718096;
    }
  }
`;

export const StyledErrorField = styled(StyledFormField)`
  ${StyledInput},
  ${StyledTextArea},
  ${StyledSelect} {
    border-color: #f56565;

    &:focus {
      border-color: #f56565;
      box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
    }

    [data-theme='dark'] & {
      border-color: #fc8181;

      &:focus {
        border-color: #fc8181;
        box-shadow: 0 0 0 3px rgba(252, 129, 129, 0.2);
      }
    }
  }
`;

export const StyledErrorMessage = styled.span`
  display: block;
  margin-top: 0.5rem;
  color: #f56565;
  font-size: 0.875rem;
  font-weight: 500;

  [data-theme='dark'] & {
    color: #fc8181;
  }
`;
