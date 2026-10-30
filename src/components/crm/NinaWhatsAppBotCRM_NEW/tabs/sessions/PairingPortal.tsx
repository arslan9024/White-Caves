import React from 'react';
import { Key, QrCode, RefreshCw, Check, Copy, Download } from 'lucide-react';

export interface PairingPortalProps {
  pairingMethod: 'qr' | 'pairingCode';
  onPairingMethodChange: (method: 'qr' | 'pairingCode') => void;
  inputPhoneNumber: string;
  onPhoneNumberChange: (val: string) => void;
  generatedPairingCode: string;
  isGenerating: boolean;
  copiedCode: boolean;
  onRegenerateCode: () => void;
  onCopyCode: () => void;
  qrCodeUrl: string;
}

export const PairingPortal: React.FC<PairingPortalProps> = ({
  pairingMethod,
  onPairingMethodChange,
  inputPhoneNumber,
  onPhoneNumberChange,
  generatedPairingCode,
  isGenerating,
  copiedCode,
  onRegenerateCode,
  onCopyCode,
  qrCodeUrl,
}) => {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '2px solid #06B6D4',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 16px rgba(6, 182, 212, 0.08)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--text-secondary, #E2E8F0)',
          paddingBottom: '0.75rem',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--color-06b6d4, #06B6D4)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Official Device Authentication Portal
          </span>
          <h4 style={{ margin: '2px 0 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            Link WhatsApp Account +971 50 576 0056 to Nina AI
          </h4>
        </div>

        {/* Linking Method Switcher */}
        <div style={{ display: 'flex', background: 'var(--color-f1f5f9, #F1F5F9)', padding: '4px', borderRadius: '10px', gap: '4px' }}>
          <button
            onClick={() => onPairingMethodChange('pairingCode')}
            style={{
              background: pairingMethod === 'pairingCode' ? '#06B6D4' : 'transparent',
              color: pairingMethod === 'pairingCode' ? '#FFFFFF' : '#475569',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 16px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Key size={16} /> 8-Digit Pairing Code
          </button>
          <button
            onClick={() => onPairingMethodChange('qr')}
            style={{
              background: pairingMethod === 'qr' ? '#06B6D4' : 'transparent',
              color: pairingMethod === 'qr' ? '#FFFFFF' : '#475569',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 16px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <QrCode size={16} /> High-Res QR Code
          </button>
        </div>
      </div>

      {/* METHOD A: 8-DIGIT PAIRING CODE LINKING */}
      {pairingMethod === 'pairingCode' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
              🔑 Step-by-Step WhatsApp Pairing Code Linking
            </h5>
            <ol style={{ margin: '0 0 1.25rem 0', paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--color-475569, #475569)', lineHeight: 1.8 }}>
              <li>Open <strong>WhatsApp</strong> on your phone (<strong>{inputPhoneNumber}</strong>).</li>
              <li>Tap <strong>Settings ➔ Linked Devices ➔ Link a Device</strong>.</li>
              <li>Tap <strong>"Link with phone number instead"</strong> at the bottom of the camera screen.</li>
              <li>Enter the 8-digit verification pairing code shown on the right.</li>
            </ol>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                value={inputPhoneNumber}
                onChange={e => onPhoneNumberChange(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  width: '220px',
                }}
              />
              <button
                onClick={onRegenerateCode}
                disabled={isGenerating}
                style={{
                  background: '#F1F5F9',
                  color: '#1E293B',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RefreshCw size={15} className={isGenerating ? 'spin' : ''} /> {isGenerating ? 'Generating...' : 'Regenerate Code'}
              </button>
            </div>
          </div>

          {/* PAIRING CODE DISPLAY CARD */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
              border: '2px dashed #10B981',
              borderRadius: '16px',
              padding: '1.75rem',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.1)',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-047857, #047857)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Live 8-Digit Pairing Code for +971 50 576 0056
            </span>
            <div
              style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                letterSpacing: '0.14em',
                color: '#065F46',
                fontFamily: 'monospace',
                margin: '0.85rem 0',
              }}
            >
              {generatedPairingCode}
            </div>

            <button
              onClick={onCopyCode}
              style={{
                background: copiedCode ? '#047857' : '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              {copiedCode ? <Check size={18} /> : <Copy size={18} />}
              {copiedCode ? 'Copied to Clipboard!' : 'Copy Pairing Code'}
            </button>

            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-047857, #047857)', marginTop: '0.85rem', fontWeight: 700 }}>
              ✓ Valid for 3 Minutes · Auto-Handshake Active
            </span>
          </div>
        </div>
      ) : (
        /* METHOD B: HIGH-RES VECTOR QR CODE SCAN */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
              📷 High-Resolution Vector QR Code Scanner
            </h5>
            <ol style={{ margin: '0 0 1rem 0', paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--color-475569, #475569)', lineHeight: 1.8 }}>
              <li>Open <strong>WhatsApp</strong> on your mobile phone (<strong>+971 50 576 0056</strong>).</li>
              <li>Tap <strong>Settings ➔ Linked Devices ➔ Link a Device</strong>.</li>
              <li>Point your mobile camera at the high-res QR code on the right.</li>
            </ol>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a
                href={qrCodeUrl}
                download="Nina-WhatsApp-QR-5760056.png"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#06B6D4',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Download size={15} /> Download Vector QR
              </a>
            </div>
          </div>

          {/* HIGH RES QR DISPLAY */}
          <div style={{ textAlign: 'center', background: 'var(--color-f8fafc, #F8FAFC)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
            <img
              src={qrCodeUrl}
              alt="Nina High Res QR Code"
              style={{
                width: '220px',
                height: '220px',
                borderRadius: '12px',
                border: '6px solid #FFFFFF',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}
            />
            <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-06b6d4, #06B6D4)', marginTop: '0.75rem' }}>
              Verified QR Code for +971 50 576 0056
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

