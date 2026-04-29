import React, { useState } from 'react';
import { X } from 'lucide-react';
import './BulkStatusModal.css';

const BulkNotificationModal = ({
  isOpen,
  propertyCount,
  onConfirm,
  onCancel,
}) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const templates = [
    {
      label: 'Viewings Available',
      message: 'These properties are now available for viewings. Please schedule appointments with interested clients.',
      type: 'info',
    },
    {
      label: 'Price Update',
      message: 'The rental rates for these properties have been updated. Please inform clients accordingly.',
      type: 'info',
    },
    {
      label: 'Maintenance Notice',
      message: 'These properties are scheduled for maintenance. Please coordinate with tenants.',
      type: 'warning',
    },
    {
      label: 'Lease Renewal',
      message: 'Lease renewal documents are ready for the following properties. Please contact tenants.',
      type: 'info',
    },
  ];

  const handleUseTemplate = (template) => {
    setMessage(template.message);
    setMessageType(template.type);
  };

  const handleConfirm = () => {
    if (message.trim()) {
      onConfirm({
        message: message.trim(),
        type: messageType,
      });
      setMessage('');
      setMessageType('info');
    }
  };

  const handleCancel = () => {
    setMessage('');
    setMessageType('info');
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bulk-notification-modal">
        <div className="modal-header">
          <h2>Send Notification</h2>
          <button className="modal-close" onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Send a notification to agents for <strong>{propertyCount}</strong> properties:
          </p>

          <div className="notification-template">
            {templates.map((template, index) => (
              <button
                key={index}
                className="template-btn"
                onClick={() => handleUseTemplate(template)}
              >
                {template.label}
              </button>
            ))}
          </div>

          <textarea
            className="notification-input"
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div style={{ marginTop: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>
              Notification Type:
            </label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
              }}
            >
              <option value="info">Information</option>
              <option value="warning">Warning</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={!message.trim()}
          >
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkNotificationModal;
