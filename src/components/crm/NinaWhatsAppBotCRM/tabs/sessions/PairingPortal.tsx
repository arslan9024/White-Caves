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
        background: 'var(--bg-primary)',
        border: '2px solid var(--primary-color)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.75rem',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--primary-color)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Official Device Authentication Portal
          </span>
          <h4 style={{ margin: '2px 0 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Link WhatsApp Account +971 50 576 0056 to Nina AI
          </h4>
        </div>

        {/* Linking Method Switcher */}
        <div role="group" aria-label="Pairing method" style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px', gap: '4px' }}>
          <button
            type="button"
            aria-pressed={pairingMethod === 'pairingCode'}
            onClick={() => onPairingMethodChange('pairingCode')}
            style={{
              background: pairingMethod === 'pairingCode' ? 'var(--primary-color)' : 'transparent',
              color: pairingMethod === 'pairingCode' ? 'var(--color-white)' : 'var(--text-secondary)',
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
            type="button"
            aria-pressed={pairingMethod === 'qr'}
            onClick={() => onPairingMethodChange('qr')}
            style={{
              background: pairingMethod === 'qr' ? 'var(--primary-color)' : 'transparent',
              color: pairingMethod === 'qr' ? 'var(--color-white)' : 'var(--text-secondary)',
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
            <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              🔑 Step-by-Step WhatsApp Pairing Code Linking
            </h5>
            <ol style={{ margin: '0 0 1.25rem 0', paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <li>Open <strong>WhatsApp</strong> on your phone (<strong>{inputPhoneNumber}</strong>).</li>
              <li>Tap <strong>Settings ➔ Linked Devices ➔ Link a Device</strong>.</li>
              <li>Tap <strong>"Link with phone number instead"</strong> at the bottom of the camera screen.</li>
              <li>Enter the 8-digit verification pairing code shown on the right.</li>
            </ol>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                aria-label="WhatsApp phone number"
                value={inputPhoneNumber}
                onChange={e => onPhoneNumberChange(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-color)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  width: '220px',
                }}
              />
              <button
                type="button"
                onClick={onRegenerateCode}
                disabled={isGenerating}
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
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
              background: 'var(--bg-secondary)',
              border: '2px dashed var(--primary-color)',
              borderRadius: '16px',
              padding: '1.75rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Live 8-Digit Pairing Code for +971 50 576 0056
            </span>
            <div
              style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                letterSpacing: '0.14em',
                color: 'var(--text-primary)',
                fontFamily: 'monospace',
                margin: '0.85rem 0',
              }}
            >
              {generatedPairingCode}
            </div>

            <button
              type="button"
              onClick={onCopyCode}
              style={{
                background: 'var(--primary-color)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-red)',
              }}
            >
              {copiedCode ? <Check size={18} /> : <Copy size={18} />}
              {copiedCode ? 'Copied to Clipboard!' : 'Copy Pairing Code'}
            </button>

            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.85rem', fontWeight: 700 }}>
              ✓ Valid for 3 Minutes · Auto-Handshake Active
            </span>
          </div>
        </div>
      ) : (
        /* METHOD B: HIGH-RES VECTOR QR CODE SCAN */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              📷 High-Resolution Vector QR Code Scanner
            </h5>
            <ol style={{ margin: '0 0 1rem 0', paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
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
                  background: 'var(--primary-color)',
                  color: 'var(--color-white)',
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
          <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <img
              src={qrCodeUrl}
              alt="Nina High Res QR Code"
              style={{
                width: '220px',
                height: '220px',
                borderRadius: '12px',
                border: '6px solid var(--color-white)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}
            />
            <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-color)', marginTop: '0.75rem' }}>
              Verified QR Code for +971 50 576 0056
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
