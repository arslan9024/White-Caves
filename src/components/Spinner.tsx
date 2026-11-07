import React from 'react';
import './Spinner.css';

const Spinner: React.FC = () => (
  <div className="spinner-overlay" role="status" aria-live="polite" aria-label="Loading">
    <div className="spinner" />
  </div>
);

export default Spinner;
