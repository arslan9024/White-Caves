import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Banner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #111;
  color: #fff;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 99999;
  font-family: 'Inter', sans-serif;
  flex-wrap: wrap;
  gap: 16px;
`;

const Text = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  flex: 1;
  min-width: 300px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $variant?: 'outline' }>`
  background: ${props => props.$variant === 'outline' ? 'transparent' : '#38BDF8'};
  color: ${props => props.$variant === 'outline' ? '#fff' : '#000'};
  border: 1px solid ${props => props.$variant === 'outline' ? '#555' : '#38BDF8'};
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('wc_cookie_consent');
    if (!consent) {
      setShow(true);
    } else if (consent === 'accepted') {
      window.dispatchEvent(new Event('consent_granted'));
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('wc_cookie_consent', 'accepted');
    setShow(false);
    window.dispatchEvent(new Event('consent_granted'));
  };

  const handleReject = () => {
    localStorage.setItem('wc_cookie_consent', 'rejected');
    setShow(false);
  };

  if (!show) return null;

  return (
    <Banner role="dialog" aria-live="polite" aria-label="Cookie consent banner">
      <Text>
        We use cookies and similar technologies (like Meta Pixel and Analytics) to enhance your experience on White Caves. 
        By clicking "Accept All", you agree to the storage of cookies on your device for analytics and personalized marketing. 
        You can choose to reject non-essential cookies.
      </Text>
      <ButtonGroup>
        <Button $variant="outline" onClick={handleReject}>Reject All</Button>
        <Button onClick={handleAccept}>Accept All</Button>
      </ButtonGroup>
    </Banner>
  );
};

export default CookieConsent;
