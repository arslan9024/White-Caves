import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import './BulkStatusModal.css';

const BulkDeleteModal = ({
  isOpen,
  propertyCount,
  onConfirm,
  onCancel,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const requiredText = 'DELETE';

  const handleConfirm = () => {
    if (confirmationText === requiredText) {
      onConfirm();
      setConfirmationText('');
    }
  };

  const handleCancel = () => {
    setConfirmationText('');
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bulk-delete-modal">
        <div className="modal-header">
          <h2>Delete Properties</h2>
          <button className="modal-close" onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="delete-warning">
            <AlertTriangle size={20} />
            <div>
              <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>Warning: This action cannot be undone</p>
              <p style={{ margin: 0, fontSize: '13px' }}>
                You are about to permanently delete <strong>{propertyCount}</strong> properties.
                This will remove all associated data including offers, contracts, and viewing history.
              </p>
            </div>
          </div>

          <p className="modal-description" style={{ marginTop: '20px' }}>
            To confirm, type <strong>{requiredText}</strong> in the field below:
          </p>

          <div className="delete-confirmation">
            <input
              type="text"
              placeholder={`Type "${requiredText}" to confirm`}
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
            />
          </div>

          <p style={{ fontSize: '12px', color: '#6b7280', margin: '10px 0 0 0' }}>
            Properties will be soft-deleted and can be recovered from trash within 30 days.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className="btn-confirm btn-delete"
            onClick={handleConfirm}
            disabled={confirmationText !== requiredText}
          >
            Delete Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkDeleteModal;
