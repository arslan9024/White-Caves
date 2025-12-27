import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './HomeButton.css';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

export default function HomeButton({ variant = 'default', showText = true, className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') return null;

  const handleClick = () => {
    navigate('/');
  };

  return (
    <button 
      className={`home-button home-button-${variant} ${className}`}
      onClick={handleClick}
      title="Go to Home"
    >
      <HomeIcon />
      {showText && <span>Home</span>}
    </button>
  );
}

export function FloatingHomeButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') return null;

  return (
    <button 
      className="floating-home-button"
      onClick={() => navigate('/')}
      title="Go to Home"
    >
      <HomeIcon />
    </button>
  );
}
