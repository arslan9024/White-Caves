import React from 'react';
import './PageLoader.css';

export default function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="page-loader">
      <div className="loader-content">
        <div className="loader-logo">
          <img src="/company-logo.jpg" alt="White Caves" />
        </div>
        <div className="loader-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
}
