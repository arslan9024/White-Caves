import React, { FC } from 'react';
import { useTotp2faSetupLogic } from './Totp2faSetupCard.logic';
import {
  CardContainer,
  QrBox,
  SecretKeyDisplay,
  TokenInputGroup,
} from './Totp2faSetupCard.style';

export const Totp2faSetupCard: FC = () => {
  const {
    token,
    setToken,
    isVerified,
    errorMessage,
    verifyToken,
    secretKey,
    backupCodes,
  } = useTotp2faSetupLogic();

  return (
    <CardContainer data-testid="totp-2fa-setup-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: 'var(--accent-red, #EF4444)' }}>🔐 Two-Factor Authentication (2FA Setup)</h4>
        <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', background: isVerified ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: isVerified ? 'var(--accent-green, #10B981)' : 'var(--accent-red, #EF4444)', fontWeight: 800 }}>
          {isVerified ? '✓ ACTIVE' : 'PENDING SETUP'}
        </span>
      </div>

      {!isVerified ? (
        <>
          <QrBox>
            <div style={{ textAlign: 'center', color: 'var(--color-0f172a, #0F172A)' }}>
              <span style={{ fontSize: '3.5rem' }}>📱</span>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, marginTop: '4px' }}>SCAN WITH AUTH APP</div>
            </div>
          </QrBox>

          <SecretKeyDisplay>{secretKey}</SecretKeyDisplay>

          <TokenInputGroup>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button onClick={verifyToken}>Verify Token</button>
          </TokenInputGroup>

          {errorMessage && (
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-red, #EF4444)', display: 'block', textAlign: 'center' }}>
              {errorMessage}
            </span>
          )}
        </>
      ) : (
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem' }}>🎉</span>
          <h5 style={{ margin: '8px 0 4px', color: 'var(--accent-green, #10B981)' }}>2FA Security Enforced</h5>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Your account is now protected with RFC 6238 TOTP authentication.</p>
          <div style={{ marginTop: '1rem', padding: '10px', background: 'var(--color-1e293b, #1E293B)', borderRadius: '8px', textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-red, #EF4444)', fontWeight: 800 }}>Single-Use Backup Codes:</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginTop: '6px', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--white, #FFF)' }}>
              {backupCodes.map((code) => (
                <div key={code}>• {code}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </CardContainer>
  );
};

export default Totp2faSetupCard;
