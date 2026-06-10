import React from 'react';

export default function Card({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
