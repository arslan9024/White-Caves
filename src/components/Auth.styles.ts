import styled from 'styled-components';
import { keyframes } from 'styled-components';

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
`;

export const AuthContainer = styled.div`
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: ${slideUp} 0.5s ease-out;
`;

export const AuthHeader = styled.div`
  text-align: center;
  padding: 2.5rem 2rem 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
`;

export const AuthLogo = styled.div`
  margin-bottom: 1.5rem;
`;

export const AuthLogoIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  letter-spacing: -1px;
  box-shadow: 0 10px 30px -10px rgba(102, 126, 234, 0.5);
`;

export const AuthTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem;
  letter-spacing: -0.5px;
`;

export const AuthSubtitle = styled.p`
  font-size: 0.95rem;
  color: #718096;
  margin: 0;
`;

export const AuthMethodSelector = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const MethodBtn = styled.button<{ active?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border: 2px solid ${props => props.active ? '#667eea' : '#e2e8f0'};
  background: ${props => props.active 
    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' 
    : 'white'};
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.active ? '#667eea' : '#4a5568'};
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    border-color: #cbd5e0;
    background: #f7fafc;
  }

  ${props => props.active && `
    border-color: #667eea;
    color: #667eea;
  `}
`;

export const AuthContent = styled.div`
  padding: 0 2rem 2rem;
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InputLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: color 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const AuthInput = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 2px solid ${props => props.error ? '#ef4444' : '#e5e7eb'};
  border-radius: 12px;
  font-size: 0.95rem;
  color: #1f2937;
  background: ${props => props.error ? '#fef2f2' : '#f9fafb'};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#ef4444' : '#667eea'};
    background: white;
    box-shadow: 0 0 0 4px ${props => props.error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }

  &:focus + ${InputIcon}, &:focus ~ ${InputIcon} {
    color: ${props => props.error ? '#ef4444' : '#667eea'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const InputError = styled.span`
  font-size: 0.8rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

export const AuthButton = styled.button`
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SocialButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

export const SocialButton = styled.button`
  padding: 0.875rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const AuthDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.25rem 0;
  color: #9ca3af;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }
`;

export const AuthFooter = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: #718096;

  button {
    background: none;
    border: none;
    color: #667eea;
    cursor: pointer;
    text-decoration: underline;
    font-weight: 600;

    &:hover {
      color: #764ba2;
    }
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    color: #764ba2;
    gap: 0.75rem;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;
