import React, { useState } from 'react';
import { Settings, ChevronRight, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import WhatsAppQRAuth from './WhatsAppQRAuth';
import './WhatsAppSetup.css';

/**
 * WhatsApp Setup Component
 * Complete setup flow for WhatsApp integration with QR authentication
 * Includes status checking and device management
 */
export default function WhatsAppSetup({ onComplete, onClose }) {
  const [setupStep, setSetupStep] = useState('welcome'); // welcome, qr-auth, verification, success
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected
  const [linkedDevices, setLinkedDevices] = useState([]);
  const [authError, setAuthError] = useState(null);

  const handleQRSuccess = (data) => {
    setConnectionStatus('connected');
    setLinkedDevices(prev => [...prev, {
      id: data.clientId,
      linkedAt: new Date(),
      status: 'active'
    }]);
    setSetupStep('success');
  };

  const handleQRError = (error) => {
    setAuthError(error);
    setConnectionStatus('error');
  };

  const handleRemoveDevice = (deviceId) => {
    setLinkedDevices(prev => prev.filter(d => d.id !== deviceId));
  };

  const handleStartSetup = () => {
    setConnectionStatus('connecting');
    setSetupStep('qr-auth');
  };

  const handleCompleteSetup = () => {
    onComplete?.({
      status: 'completed',
      linkedDevices: linkedDevices,
      timestamp: new Date()
    });
    onClose?.();
  };

  return (
    <div className="whatsapp-setup">
      {/* Welcome Step */}
      {setupStep === 'welcome' && (
        <div className="setup-step welcome-step">
          <div className="setup-header">
            <div className="setup-icon-wrapper">
              <Zap size={40} />
            </div>
            <h1>WhatsApp Property Sourcing</h1>
            <p className="setup-subtitle">
              Connect your WhatsApp account to automatically extract property opportunities
            </p>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <CheckCircle2 size={20} className="feature-check" />
              <div>
                <h3>Automatic Detection</h3>
                <p>Smart AI identifies property leads in your conversations</p>
              </div>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={20} className="feature-check" />
              <div>
                <h3>Quick Add to Mary</h3>
                <p>Add verified properties to inventory in seconds</p>
              </div>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={20} className="feature-check" />
              <div>
                <h3>Owner Relationship Tracking</h3>
                <p>Manage relationships and track engagement metrics</p>
              </div>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={20} className="feature-check" />
              <div>
                <h3>Privacy Protected</h3>
                <p>Only access conversations containing property keywords</p>
              </div>
            </div>
          </div>

          <div className="setup-actions">
            <button onClick={onClose} className="btn-skip">
              Skip for Now
            </button>
            <button onClick={handleStartSetup} className="btn-start">
              Start Setup
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* QR Authentication Step */}
      {setupStep === 'qr-auth' && (
        <div className="setup-step qr-step">
          <WhatsAppQRAuth
            onSuccess={handleQRSuccess}
            onClose={() => setSetupStep('welcome')}
          />
        </div>
      )}

      {/* Success Step */}
      {setupStep === 'success' && (
        <div className="setup-step success-step">
          <div className="success-content">
            <div className="success-icon">
              <CheckCircle2 size={64} />
            </div>

            <h2>Setup Complete!</h2>
            <p className="success-message">
              Your WhatsApp account is now connected and ready for property sourcing.
            </p>

            {linkedDevices.length > 0 && (
              <div className="linked-devices">
                <h3>Linked Devices</h3>
                <div className="device-list">
                  {linkedDevices.map(device => (
                    <div key={device.id} className="device-card">
                      <div className="device-info">
                        <span className="device-id">{device.id}</span>
                        <span className="device-status active">Active</span>
                      </div>
                      <div className="device-time">
                        Linked {new Date(device.linkedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="next-steps">
              <h3>What's Next?</h3>
              <ol className="steps-list">
                <li>Go to the Linda WhatsApp Dashboard</li>
                <li>Wait for property opportunities to appear</li>
                <li>Review and verify extracted property details</li>
                <li>Click "Add to Mary" to add to inventory</li>
                <li>Monitor owner relationships and engagement</li>
              </ol>
            </div>

            <div className="setup-actions">
              <button onClick={handleCompleteSetup} className="btn-complete">
                Go to Dashboard
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {authError && (
        <div className="setup-error">
          <AlertCircle size={24} />
          <h3>Connection Error</h3>
          <p>{authError}</p>
          <button onClick={() => setSetupStep('welcome')} className="btn-back">
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
