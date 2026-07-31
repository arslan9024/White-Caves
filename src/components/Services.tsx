import React from 'react';

/**
 * Services — Section showcasing White Caves services for tenants and buyers
 */
const Services: React.FC = () => {
  return (
    <section
      id="services"
      style={{
        padding: '5rem 2rem',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          color: '#d4af37',
        }}
      >
        Our Services
      </h2>
      <p
        style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '3rem',
          fontSize: '1.1rem',
        }}
      >
        Comprehensive real estate solutions tailored to your needs
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        {/* For Tenants */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 16,
            padding: '2rem',
            border: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <h3 style={{ color: 'var(--color-d4af37, #d4af37)', marginBottom: '0.5rem' }}>For Tenants</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            We help tenants find and rent their ideal home in Dubai with ease and confidence.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'rgba(255,255,255,0.85)' }}>
            <li style={{ padding: '0.35rem 0' }}>Property matching based on preferences</li>
            <li style={{ padding: '0.35rem 0' }}>Lease agreement assistance</li>
            <li style={{ padding: '0.35rem 0' }}>Ejari registration support</li>
            <li style={{ padding: '0.35rem 0' }}>24/7 maintenance coordination</li>
          </ul>
        </div>

        {/* For Buyers */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 16,
            padding: '2rem',
            border: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <h3 style={{ color: 'var(--color-d4af37, #d4af37)', marginBottom: '0.5rem' }}>For Buyers</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            We assist buyers in purchasing their dream home or investment property in Dubai.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'rgba(255,255,255,0.85)' }}>
            <li style={{ padding: '0.35rem 0' }}>Property search and matching</li>
            <li style={{ padding: '0.35rem 0' }}>Purchase negotiation</li>
            <li style={{ padding: '0.35rem 0' }}>DLD registration handling</li>
            <li style={{ padding: '0.35rem 0' }}>Mortgage advisory services</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Services;
