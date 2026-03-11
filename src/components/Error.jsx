import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ErrorContainer,
  ErrorIcon,
  ErrorTitle,
  ErrorMessage,
  RedirectNotice,
  Countdown,
  ErrorHomeBtn,
} from './Error.styles';

export default function Error({ message, redirectDelay = 5 }) {
  const [countdown, setCountdown] = useState(redirectDelay);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown <= 0) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <ErrorContainer>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorTitle>Error</ErrorTitle>
      <ErrorMessage>{message || 'Something went wrong. Please try again.'}</ErrorMessage>
      <RedirectNotice>
        Redirecting to home page in <Countdown>{countdown}</Countdown> seconds...
      </RedirectNotice>
      <ErrorHomeBtn onClick={handleGoHome}>
        Go to Home Now
      </ErrorHomeBtn>
    </ErrorContainer>
  );
}
