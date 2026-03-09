import React from 'react';
import './SuspenseLoader.css';

/**
 * SuspenseLoader Component
 * Displayed while lazy-loaded route components are being loaded
 * Provides smooth transition with loading indicator
 */
export default function SuspenseLoader() {
  return (
    <div className="suspense-loader">
      <div className="suspense-loader-overlay">
        <div className="suspense-loader-spinner">
          <div className="spinner-circle"></div>
          <p className="spinner-text">Loading page...</p>
        </div>
      </div>
    </div>
  );
}
