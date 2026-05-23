import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import './BulkStatusModal.css';

const BulkFurnishingModal = ({
  isOpen,
  propertyCount,
  onConfirm,
  onCancel,
}) => {
  const [selectedFurnishing, setSelectedFurnishing] = useState('');

  const furnishingTypes = [
    { value: 'unfurnished', label: 'Unfurnished' },
    { value: 'semi-furnished', label: 'Semi-Furnished' },
    { value: 'furnished', label: 'Furnished' },
    { value: 'luxury-furnished', label: 'Luxury Furnished' },
  ];

  const handleConfirm = () => {
    if (selectedFurnishing) {
      onConfirm(selectedFurnishing);
      setSelectedFurnishing('');
    }
  };

  const handleCancel = () => {
    setSelectedFurnishing('');
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bulk-furnishing-modal">
        <div className="modal-header">
          <h2>Update Furnishing Type</h2>
          <button className="modal-close" onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            You are about to update furnishing type for <strong>{propertyCount}</strong> properties.
            Please select the new furnishing type:
          </p>

          <div className="status-grid">
            {furnishingTypes.map((type) => (
              <button
                key={type.value}
                className={`status-option ${selectedFurnishing === type.value ? 'selected' : ''}`}
                onClick={() => setSelectedFurnishing(type.value)}
              >
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          {selectedFurnishing && (
            <div className="status-preview">
              <AlertCircle size={16} />
              <p>Will update all {propertyCount} properties to <strong>{furnishingTypes.find(t => t.value === selectedFurnishing)?.label}</strong></p>
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
            disabled={!selectedFurnishing}
          >
            Update Furnishing
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkFurnishingModal;
