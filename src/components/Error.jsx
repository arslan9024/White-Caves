
import React from 'react';
import './Error.css';

export default function Error({ message }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Error</h3>
      <p>{message || 'Something went wrong. Please try again.'}</p>
    </div>
  );
}
