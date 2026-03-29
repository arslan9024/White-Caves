import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const StyledNewsletterSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, var(--primary, #c9a962) 0%, #b08d4a 100%);

  [data-theme='dark'] & {
    background: linear-gradient(135deg, #8b6f47 0%, #6b5636 100%);
  }
`;

export const StyledNewsletterContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
`;

export const StyledNewsletterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

export const StyledNewsletterText = styled.div`
  h2 {
    font-size: 2.25rem;
    font-weight: 700;
    color: white;
    margin: 0 0 16px 0;
  }

  p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 24px 0;
    line-height: 1.6;
  }
`;

export const StyledNewsletterBenefits = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  li {
    color: white;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledNewsletterFormWrapper = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);

  [data-theme='dark'] & {
    background: #1a1a2e;
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

export const StyledNewsletterForm = styled.form`
  margin-bottom: 20px;
`;

export const StyledFormGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StyledNewsletterInput = styled.input`
  flex: 1;
  padding: 16px 20px;
  border: 2px solid var(--border, #e5e5e7);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--surface, #ffffff);
  color: var(--text-primary, #1a1a2e);

  &:focus {
    outline: none;
    border-color: var(--primary, #c9a962);
  }

  &.error {
    border-color: #ef4444;
  }

  &::placeholder {
    color: var(--text-muted, #9ca3af);
  }

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: white;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

export const StyledNewsletterButton = styled.button`
  padding: 16px 32px;
  background: var(--primary, #c9a962);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 140px;

  &:hover:not(:disabled) {
    background: #b08d4a;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  [data-theme='dark'] & {
    background: #8b6f47;

    &:hover:not(:disabled) {
      background: #9a7d51;
    }
  }

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

export const StyledSpinner = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const StyledFormMessage = styled.p<{ $status?: 'success' | 'error' }>`
  margin: 12px 0 0 0;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  background: ${props => props.$status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.$status === 'success' ? '#10b981' : '#ef4444'};

  [data-theme='dark'] & {
    background: ${props => props.$status === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
  }
`;

export const StyledPrivacyNote = styled.p`
  font-size: 0.8rem;
  color: var(--text-muted, #9ca3af);
  text-align: center;
  margin: 0 0 20px 0;

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const StyledSubscriberCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  strong {
    color: #1a1a2e;
  }

  [data-theme='dark'] & {
    color: #e2e8f0;

    strong {
      color: #f0f0f0;
    }
  }
`;

export const StyledSubscriberAvatars = styled.div`
  display: flex;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid white;
    margin-left: -10px;
    object-fit: cover;

    &:first-child {
      margin-left: 0;
    }
  }
`;

export const StyledMoreSubscribers = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary, #c9a962);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border: 2px solid white;

  [data-theme='dark'] & {
    background: #8b6f47;
  }
`;
