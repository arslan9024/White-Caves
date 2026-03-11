import styled from 'styled-components';

export const ErrorContainer = styled.div`
  text-align: center;
  padding: 60px 40px;
  margin: 40px auto;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 100, 100, 0.3);
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

  [data-theme='light'] & {
    background: #fff5f5;
    border-color: #feb2b2;
  }
`;

export const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
`;

export const ErrorTitle = styled.h3`
  color: #ff6b6b;
  font-size: 28px;
  margin-bottom: 15px;
  font-weight: 600;
`;

export const ErrorMessage = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin-bottom: 10px;
  line-height: 1.6;

  [data-theme='light'] & {
    color: #666;
  }
`;

export const RedirectNotice = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  margin-top: 20px;

  [data-theme='light'] & {
    color: #999;
  }
`;

export const Countdown = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #d4af37, #b8860b);
  color: #0a0a0f;
  width: 26px;
  height: 26px;
  line-height: 26px;
  border-radius: 50%;
  font-weight: 700;
  margin: 0 4px;
`;

export const ErrorHomeBtn = styled.button`
  margin-top: 25px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #d4af37, #b8860b);
  color: #0a0a0f;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;
