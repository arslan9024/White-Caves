import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery'; // assuming this exists or I'll just use CSS media queries
import './MobileLeadFAB.css';

const MobileLeadFAB: React.FC = () => {
  const navigate = useNavigate();
  // Ensure it only renders on mobile via CSS or JS. Let's use CSS for better performance.

  return (
    <button
      className="mobile-fab"
      onClick={() => navigate('/crm/leads/new')}
      aria-label="Quick Add Lead"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  );
};

export default MobileLeadFAB;
