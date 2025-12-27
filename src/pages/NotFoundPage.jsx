import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const [countdown, setCountdown] = useState(5);
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
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">🏠</div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <p className="redirect-notice">
          Redirecting to home page in <span className="countdown">{countdown}</span> seconds...
        </p>
        <button onClick={handleGoHome} className="home-btn">
          Go to Home Now
        </button>
      </div>
    </div>
  );
}
