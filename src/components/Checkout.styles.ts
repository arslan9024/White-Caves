import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const CheckoutContainerStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-overlay, 600);
  padding: 20px;
`;

export const CheckoutFormStyled = styled.form`
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

export const PaymentDetailsSection = styled.div`
  margin-bottom: 24px;

  h3 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 24px;
    font-weight: 600;
  }
`;

export const PropertySummary = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;

  p {
    margin: 8px 0;
    color: #555;
    font-size: 0.95rem;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: #333;
    font-weight: 600;
  }
`;

export const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin: 16px 0;
  border: 1px solid #fcc;
  font-size: 0.95rem;
`;

export const CheckoutActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const CheckoutButton = styled.button`
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const SubmitBtn = styled(CheckoutButton)`
  background: #0066ff;
  color: white;

  &:hover:not(:disabled) {
    background: #0052cc;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
  }
`;

export const CancelBtn = styled(CheckoutButton)`
  background: #f5f5f5;
  color: #333;

  &:hover:not(:disabled) {
    background: #e5e5e5;
  }
`;

export const CheckoutLoadingContainer = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

export const SpinnerStyled = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066ff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 20px;
`;

export const LoadingText = styled.p`
  color: #666;
  font-size: 1rem;
`;

export const CheckoutErrorContainer = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 100%;

  h3 {
    color: #c33;
    margin: 0 0 12px 0;
    font-size: 1.25rem;
  }

  p {
    color: #666;
    margin: 0 0 20px 0;
    font-size: 0.95rem;
  }
`;

export const ConfigErrorText = styled.p`
  color: #666;
  margin: 0 0 20px 0;
  font-size: 0.95rem;
`;
