import styled from 'styled-components';
import { transitions } from '../styles/theme/transitions';
import { radius } from '../styles/theme/radius';

export const ErrorBoundaryContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%);
  padding: 2rem;
`;

export const ErrorBoundaryContent = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 60px 40px;
  max-width: 500px;
  text-align: center;
  border: 1px solid rgba(212, 175, 55, 0.2);
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ErrorIconBoundary = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 1s ease infinite;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

export const ErrorTitle = styled.h1`
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

export const ErrorMessage = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

export const RedirectNotice = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  margin-bottom: 25px;
`;

export const Countdown = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #EF5350, #D32F2F);
  color: #FFFFFF;
  width: 28px;
  height: 28px;
  line-height: 28px;
  border-radius: 50%;
  font-weight: 700;
  margin: 0 4px;
`;

export const ErrorActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

export const ErrorButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.875rem 2rem;
  border-radius: ${radius.lg};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${transitions.all};
  border: none;
  outline: none;

  ${(props) => {
    if (props.$variant === 'secondary') {
      return `
        background: transparent;
        border: 2px solid rgba(211, 47, 47, 0.5);
        color: #EF5350;

        &:hover {
          background: rgba(211, 47, 47, 0.1);
          border-color: #EF5350;
        }
      `;
    }
    return `
      background: linear-gradient(135deg, #EF5350, #D32F2F);
      color: #FFFFFF;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(211, 47, 47, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    `;
  }}
`;

export const ErrorDetails = styled.details`
  margin-top: 2rem;
  text-align: left;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: ${radius.lg};
  border: 1px solid rgba(255, 255, 255, 0.1);

  summary {
    cursor: pointer;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 600;
    margin-bottom: 0.5rem;

    &:hover {
      color: rgba(255, 255, 255, 0.9);
    }
  }
`;

export const ErrorStack = styled.pre`
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  border-radius: ${radius.sm};
  overflow-x: auto;
  color: #ff6b6b;
  font-size: 0.75rem;
  line-height: 1.4;
  margin: 0;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(211, 47, 47, 0.3);
    border-radius: 2px;

    &:hover {
      background: rgba(211, 47, 47, 0.5);
    }
  }
`;