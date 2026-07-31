import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import './WhatsAppQRAuth.css';

/**
 * WhatsApp QR Code Authentication Component
 * Allows users to link their WhatsApp account by scanning QR code
 * Part of Linda WhatsApp sourcing system
 */
export default function WhatsAppQRAuth({ onSuccess, onClose, isModal = false }) {
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState('initializing'); // initializing, waiting, scanning, authenticated, error
  const [statusMessage, setStatusMessage] = useState('Initializing WhatsApp connection...');
  const [errorMessage, setErrorMessage] = useState('');
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [clientInfo, setClientInfo] = useState(null);

  useEffect(() => {
    initializeWhatsAppConnection();
  }, []);

  const initializeWhatsAppConnection = async () => {
    try {
      setStatus('initializing');
      setStatusMessage('Initializing WhatsApp Web connection...');

      // In a real implementation, this would call the WhatsAppWebIntegration service
      // For now, showing the flow structure
      await simulateQRGeneration();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
      setStatusMessage('Failed to initialize connection');
    }
  };

  const simulateQRGeneration = () => {
    return new Promise((resolve) => {
      setStatus('waiting');
      setStatusMessage('Waiting for QR code generation...');

      // Simulate QR code generation delay
      setTimeout(() => {
        // In production, this would be a real QR code from whatsapp-web.js
        const mockQRCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=WhatsAppSession_${Date.now()}`;
        setQrCode(mockQRCode);
        setStatus('scanning');
        setStatusMessage('Ready to scan. Please use your phone to scan the QR code.');
        resolve();
      }, 1500);
    });
  };

  const handleRetry = () => {
    setQrCode(null);
    setErrorMessage('');
    setConnectionAttempts(prev => prev + 1);
    initializeWhatsAppConnection();
  };

  const handleManualEntry = () => {
    // Alternative: Manual session code entry
    const code = prompt('Enter your WhatsApp session code:');
    if (code) {
      simulateAuthentication(code);
    }
  };

  const simulateAuthentication = (code) => {
    setStatus('authenticated');
    setStatusMessage('Device authenticated successfully!');
    setClientInfo({
      id: code.substring(0, 8),
      phone: '+971XXXXXXXXX',
      status: 'ready',
      linkedAt: new Date().toLocaleString()
    });

    setTimeout(() => {
      onSuccess?.({
        authenticated: true,
        clientId: code.substring(0, 8),
        timestamp: new Date()
      });
    }, 2000);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'authenticated':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'scanning':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const containerClass = isModal ? 'whatsapp-qr-auth modal' : 'whatsapp-qr-auth';

  return (
    <div className={containerClass}>
      <div className="qr-auth-container">
        {/* Header */}
        <div className="qr-header">
          <div className="qr-icon-wrapper">
            <QrCode size={32} />
          </div>
          <h2>Link WhatsApp Account</h2>
          <p className="qr-subtitle">Connect your WhatsApp to start sourcing properties</p>
        </div>

        {/* Status Indicator */}
        <div className="status-indicator" style={{ borderColor: getStatusColor() }}>
          {status === 'initializing' && (
            <div className="status-content loading">
              <Loader size={24} className="spinner" />
              <span>{statusMessage}</span>
            </div>
          )}

          {status === 'waiting' && (
            <div className="status-content">
              <Loader size={24} className="spinner" />
              <span>{statusMessage}</span>
            </div>
          )}

          {status === 'scanning' && (
            <div className="status-content">
              <div className="pulse-dot"></div>
              <span>{statusMessage}</span>
            </div>
          )}

          {status === 'authenticated' && (
            <div className="status-content success">
              <CheckCircle size={24} style={{ color: 'var(--accent-green, #10B981)' }} />
              <span>{statusMessage}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="status-content error">
              <AlertCircle size={24} style={{ color: 'var(--accent-red, #EF4444)' }} />
              <span>{errorMessage || statusMessage}</span>
            </div>
          )}
        </div>

        {/* QR Code Display */}
        {qrCode && status !== 'authenticated' && (
          <div className="qr-code-section">
            <div className="qr-instructions">
              <div className="instruction-step">
                <span className="step-number">1</span>
                <span>Open WhatsApp on your phone</span>
              </div>
              <div className="instruction-step">
                <span className="step-number">2</span>
                <span>Go to Settings → Linked Devices</span>
              </div>
              <div className="instruction-step">
                <span className="step-number">3</span>
                <span>Tap "Link a Device" and scan this code</span>
              </div>
            </div>

            <div className="qr-code-wrapper">
              <img src={qrCode} alt="WhatsApp QR Code" className="qr-code-image" />
              <p className="qr-expiry">QR code expires in 45 seconds</p>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === 'authenticated' && clientInfo && (
          <div className="authentication-success">
            <div className="success-details">
              <div className="detail-row">
                <span className="label">Device ID:</span>
                <span className="value">{clientInfo.id}</span>
              </div>
              <div className="detail-row">
                <span className="label">Phone:</span>
                <span className="value">{clientInfo.phone}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className="value status-badge ready">Ready</span>
              </div>
              <div className="detail-row">
                <span className="label">Linked At:</span>
                <span className="value">{clientInfo.linkedAt}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="error-actions">
            <p className="error-details">
              {errorMessage || 'Unable to initialize WhatsApp connection. Please try again.'}
            </p>
            {connectionAttempts < 3 && (
              <button onClick={handleRetry} className="btn-retry">
                Try Again
              </button>
            )}
            <button onClick={handleManualEntry} className="btn-manual">
              Enter Session Code Manually
            </button>
          </div>
        )}

        {/* Alternative Options */}
        {status === 'scanning' && (
          <div className="alternative-section">
            <div className="divider">
              <span>OR</span>
            </div>
            <button onClick={handleManualEntry} className="btn-manual-entry">
              Enter Session Code Manually
            </button>
            <p className="manual-hint">
              Don't have a phone nearby? You can enter a session code instead
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="qr-actions">
          {status !== 'authenticated' && (
            <button onClick={onClose} className="btn-cancel">
              Cancel
            </button>
          )}
          {status === 'authenticated' && (
            <button onClick={onClose} className="btn-success">
              Continue to Dashboard
            </button>
          )}
        </div>

        {/* Footer Info */}
        <div className="qr-footer">
          <p className="footer-text">
            Your WhatsApp account is secured. We only access conversations with property keywords.
          </p>
          <a href="#privacy" className="privacy-link">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
