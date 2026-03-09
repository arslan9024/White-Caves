
import React from 'react';
import './Loading.css';

export default function Loading() {
  return (
    <div className="loading-container flex-center flex-col">
      <div className="loading-spinner corner-full"></div>
      <p>Loading...</p>
    </div>
  );
}
