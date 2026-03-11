import styled from 'styled-components';

export const ContactContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
`;

export const ContactTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary, #1f2937);

  [data-theme='dark'] & {
    color: var(--text-primary, #ffffff);
  }
`;

export const ContactText = styled.p`
  font-size: 1.1rem;
  margin: 0.8rem 0;
  color: var(--text-secondary, #4b5563);

  [data-theme='dark'] & {
    color: var(--text-secondary, #cccccc);
  }
`;

export const ContactMethods = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ContactButton = styled.button`
  padding: 1.5rem;
  border: none;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const Icon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

export const ContactInfo = styled.div`
  text-align: left;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }

  p {
    margin: 0.3rem 0 0;
    font-size: 0.9rem;
    color: #666;
  }

  [data-theme='dark'] & {
    h3 {
      color: var(--text-primary, #ffffff);
    }

    p {
      color: var(--text-secondary, #cccccc);
    }
  }
`;

export const WhatsAppButton = styled(ContactButton)`
  background: #25d366;
  color: white;

  ${ContactInfo} {
    h3,
    p {
      color: white;
    }
  }
`;

export const EmailButton = styled(ContactButton)`
  background: #f8f9fa;
`;
