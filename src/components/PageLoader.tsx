import React from 'react';

interface PageLoaderProps {
  message?: string;
}

/**
 * PageLoader — Full-page loading spinner with company branding
 */
const PageLoader: React.FC<PageLoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        gap: '1.5rem',
      }}
    >
      <img
        src="/company-logo.jpg"
        alt="White Caves"
        style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
      />
      <div
        style={{
          width: 48,
          height: 48,
          border: '3px solid rgba(212,175,55,0.2)',
          borderTop: '3px solid #d4af37',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
        }}
      />
      <p
        style={{
          color: '#d4af37',
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          margin: 0,
          letterSpacing: '0.05em',
        }}
      >
        {message}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PageLoader;
