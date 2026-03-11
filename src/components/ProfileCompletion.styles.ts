import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const Modal = styled.div`
  background: ${props => props.theme?.colors?.cardBg || '#ffffff'};
  border-radius: 20px;
  max-width: 480px;
  width: 100%;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const WelcomeIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${props => props.theme?.colors?.primary || '#2563eb'} 0%, ${props => props.theme?.colors?.secondary || '#7c3aed'} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;

  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
`;

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textColor || '#1a1a1a'};
  margin: 0 0 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.35rem;
  }
`;

export const Subtitle = styled.p`
  color: ${props => props.theme?.colors?.textMuted || '#6b7280'};
  font-size: 1rem;
  margin: 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme?.colors?.textColor || '#1a1a1a'};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme?.colors?.borderColor || '#e5e7eb'};
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.theme?.colors?.primary || 'rgba(37, 99, 235, 0.1)'};
  }

  &:disabled {
    background: ${props => props.theme?.colors?.surfaceAlt || '#f3f4f6'};
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme?.colors?.borderColor || '#e5e7eb'};
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.theme?.colors?.primary || 'rgba(37, 99, 235, 0.1)'};
  }
`;

export const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme?.colors?.borderColor || '#e5e7eb'};
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.theme?.colors?.primary || 'rgba(37, 99, 235, 0.1)'};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  ${props => props.variant === 'secondary' ? `
    background: ${props.theme?.colors?.surfaceAlt || '#f3f4f6'};
    color: ${props.theme?.colors?.text || '#374151'};

    &:hover {
      background: ${props.theme?.colors?.border || '#e5e7eb'};
    }
  ` : `
    background: ${props.theme?.colors?.primary || '#2563eb'};
    color: white;

    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  input[type='checkbox'] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  label {
    cursor: pointer;
    margin: 0;
    font-weight: normal;
    font-size: 0.95rem;
  }
`;

export const Progress = styled.div`
  margin-bottom: 1.5rem;
`;

export const ProgressLabel = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.textMuted || '#6b7280'};
  margin-bottom: 0.5rem;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme?.colors?.border || '#e5e7eb'};
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: var(--progress, 0%);
    background: linear-gradient(90deg, ${props => props.theme?.colors?.primary || '#2563eb'} 0%, ${props => props.theme?.colors?.secondary || '#7c3aed'} 100%);
    transition: width 0.3s ease;
  }
`;
