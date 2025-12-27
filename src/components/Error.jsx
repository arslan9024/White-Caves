import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Error.css';

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
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Error</h3>
      <p>{message || 'Something went wrong. Please try again.'}</p>
      <p className="redirect-notice">
        Redirecting to home page in <span className="countdown">{countdown}</span> seconds...
      </p>
      <button onClick={handleGoHome} className="error-home-btn">
        Go to Home Now
      </button>
    </div>
  );
}
