import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import './BulkStatusModal.css';

const BulkStatusModal = ({
  isOpen,
  propertyCount,
  onConfirm,
  onCancel,
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');

  const statuses = [
    { value: 'available', label: 'Available', color: '#10b981' },
    { value: 'occupied', label: 'Occupied', color: '#ef4444' },
    { value: 'maintenance', label: 'Maintenance', color: '#6b7280' },
    { value: 'ready_for_leasing', label: 'Ready for Leasing', color: '#10b981' },
    { value: 'offer_in_progress', label: 'Offer In Progress', color: '#f59e0b' },
    { value: 'contract_generation', label: 'Contract Generation', color: '#EF4444' },
    { value: 'archived', label: 'Archived', color: '#9ca3af' },
  ];

  const handleConfirm = () => {
    if (selectedStatus) {
      onConfirm(selectedStatus);
      setSelectedStatus('');
    }
  };

  const handleCancel = () => {
    setSelectedStatus('');
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bulk-status-modal">
        <div className="modal-header">
          <h2>Update Property Status</h2>
          <button className="modal-close" onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            You are about to update the status for <strong>{propertyCount}</strong> properties.
            Please select the new status:
          </p>

          <div className="status-grid">
            {statuses.map((status) => (
              <button
                key={status.value}
                className={`status-option ${selectedStatus === status.value ? 'selected' : ''}`}
                onClick={() => setSelectedStatus(status.value)}
              >
                <div className="status-color" style={{ backgroundColor: status.color }}></div>
                <span>{status.label}</span>
              </button>
            ))}
          </div>

          {selectedStatus && (
            <div className="status-preview">
              <AlertCircle size={16} />
              <p>Will update all {propertyCount} properties to <strong>{statuses.find(s => s.value === selectedStatus)?.label}</strong></p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={!selectedStatus}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkStatusModal;
