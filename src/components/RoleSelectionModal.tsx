import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { safeStorage } from '../utils/safeStorage';

interface RoleOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  role: string;
  color: string;
}

const roles: RoleOption[] = [
  {
    id: 'buyer',
    title: 'Buy a Property',
    subtitle: 'Find your dream home',
    description: 'Browse listings, compare properties, and use our mortgage calculator.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        <path d="M12 10h-2v2H8v-2H6V8h2V6h2v2h2v2z" />
      </svg>
    ),
    path: '/buyer/dashboard',
    role: 'buyer',
    color: '#212121',
  },
  {
    id: 'seller',
    title: 'Sell or List Property',
    subtitle: 'List your property with us',
    description:
      'Get property valuations, manage listings, and receive offers from qualified buyers.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5L18 10v9H6v-9l6-4.5z" />
        <path d="M10 14h4v5h-4v-5z" />
      </svg>
    ),
    path: '/seller/dashboard',
    role: 'seller',
    color: '#C9A84C',
  },
  {
    id: 'tenant',
    title: 'Rent or Lease',
    subtitle: 'Find your next home',
    description: 'Browse rental properties, manage leases, and submit maintenance requests.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.5 12c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5zm1.5 5h-2.5v-2.5h1V15h1.5v2z" />
        <path d="M10 3L2 9v12h8.07c-.04-.32-.07-.66-.07-1 0-3.03 2.47-5.5 5.5-5.5.95 0 1.84.24 2.62.66V9l-8-6z" />
      </svg>
    ),
    path: '/landlord/dashboard',
    role: 'landlord',
    color: '#10B981',
  },
  {
    id: 'agent',
    title: "I'm an Agent",
    subtitle: 'Staff & Team Portal',
    description: 'Access performance dashboards, manage leads, and internal team tools.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        <path d="M20 9V7h-2v2h-2v2h2v2h2v-2h2V9h-2z" />
      </svg>
    ),
    path: '/signin',
    role: 'agent',
    color: '#C9A84C',
  },
];

const RoleSelectionModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const firstButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = safeStorage.getJSON<{ role: string }>('preferredRole');
    if (saved) return; // Already chosen
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Focus trap + Escape handling
  useEffect(() => {
    if (!visible) return;
    firstButtonRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleRoleSelect = useCallback(
    (role: RoleOption) => {
      safeStorage.setJSON('preferredRole', {
        role: role.role,
        selectedAt: new Date().toISOString(),
        locked: false,
        fromGateway: false,
      });
      setVisible(false);
      navigate(role.path);
    },
    [navigate]
  );

  const handleSkip = useCallback(() => {
    safeStorage.setJSON('preferredRole', { role: 'guest', skipped: true });
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={handleSkip}
      role="dialog"
      aria-modal="true"
      aria-label="Select your role"
    >
      <div
        ref={modalRef}
        style={{
          background: '#0f0f0f',
          border: '1px solid rgba(201, 168, 76, 0.25)',
          borderRadius: 20,
          padding: '2.5rem 2rem',
          maxWidth: 680,
          width: '100%',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '0.5rem',
            }}
          >
            Welcome to White Caves
          </div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
            How can we assist you today?
          </h2>
          <p
            style={{ margin: '0.5rem 0 0', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}
          >
            Select your role to access personalised features and services
          </p>
          <div
            style={{
              width: 48,
              height: 3,
              background: 'linear-gradient(90deg, #C9A84C, #a8883a)',
              borderRadius: 2,
              margin: '1rem auto 0',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {roles.map((role, idx) => (
            <button
              key={role.id}
              ref={idx === 0 ? firstButtonRef : undefined}
              onClick={() => handleRoleSelect(role)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '1rem',
                borderRadius: 12,
                border: `2px solid ${role.color}30`,
                background: `${role.color}08`,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = role.color;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${role.color}30`;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ color: role.color, flexShrink: 0, marginTop: 2 }}>{role.icon}</div>
              <div>
                <div
                  style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff', marginBottom: 2 }}
                >
                  {role.title}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: role.color,
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  {role.subtitle}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    lineHeight: 1.4,
                  }}
                >
                  {role.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: '0.85rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 8,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
