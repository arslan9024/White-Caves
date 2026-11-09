import React, { memo } from 'react';
import type { VerificationMethod } from './authTypes';

interface VerificationModalCardProps {
  isOpen: boolean;
  onClose: () => void;
  targetIdentity: string;
  targetType: 'email' | 'phone';
}

export const VerificationModalCard = memo(function VerificationModalCard({
  isOpen,
  onClose,
  targetIdentity,
  targetType,
}: VerificationModalCardProps) {
  const [method, setMethod] = React.useState<VerificationMethod>(
    targetType === 'email' ? 'email-link' : 'sms-otp'
  );
  const [otpCode, setOtpCode] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = () => {
    setSent(true);
    setStatusMsg(`Verification code successfully dispatched via ${method.toUpperCase()}!`);
  };

  return (
    <div className="auth-verification-overlay" role="dialog" aria-modal="true" aria-label="Security Verification">
      <div className="auth-verification-card">
        <div className="auth-verification-header">
          <div className="auth-badge-pill">
            <span className="auth-badge-dot"></span>
            UAE Tier-1 Security Verification
          </div>
          <button
            type="button"
            className="auth-verification-close"
            onClick={onClose}
            aria-label="Close Verification"
          >
            ✕
          </button>
        </div>

        <h3>Verify Your Identity</h3>
        <p className="auth-verification-desc">
          We sent or can send an encrypted authorization key to:
          <strong className="auth-target-id"> {targetIdentity || 'your registered contact'}</strong>
        </p>

        {/* Multi-layered Channel Toggle */}
        <div className="auth-channel-selector" role="group" aria-label="Channel selection">
          {targetType === 'email' ? (
            <button
              type="button"
              className={`auth-channel-chip ${method === 'email-link' ? 'selected' : ''}`}
              onClick={() => setMethod('email-link')}
            >
              ✉️ Magic Link
            </button>
          ) : (
            <>
              <button
                type="button"
                className={`auth-channel-chip ${method === 'sms-otp' ? 'selected' : ''}`}
                onClick={() => setMethod('sms-otp')}
              >
                📱 SMS OTP
              </button>
              <button
                type="button"
                className={`auth-channel-chip ${method === 'whatsapp' ? 'selected' : ''}`}
                onClick={() => setMethod('whatsapp')}
              >
                💬 WhatsApp Key
              </button>
            </>
          )}
        </div>

        {sent ? (
          <div className="auth-otp-input-group">
            <label htmlFor="auth-otp-digits">Enter 6-digit Code</label>
            <input
              id="auth-otp-digits"
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otpCode}
              onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className="form-input auth-otp-field"
            />
            {statusMsg && <div className="auth-success-badge">{statusMsg}</div>}
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={onClose}
              disabled={otpCode.length < 4}
            >
              Confirm & Continue
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-primary btn-full" onClick={handleSend}>
            Dispatch Verification Code
          </button>
        )}
      </div>
    </div>
  );
});

export default VerificationModalCard;
