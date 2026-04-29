import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import './BulkStatusModal.css';

const BulkPriceModal = ({
  isOpen,
  propertyCount,
  onConfirm,
  onCancel,
}) => {
  const [priceValue, setPriceValue] = useState('');
  const [operationType, setOperationType] = useState('set');
  const [preview, setPreview] = useState(null);

  const handleConfirm = () => {
    if (priceValue) {
      onConfirm({
        value: parseFloat(priceValue),
        type: operationType,
      });
      setPriceValue('');
      setOperationType('set');
      setPreview(null);
    }
  };

  const handleCancel = () => {
    setPriceValue('');
    setOperationType('set');
    setPreview(null);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bulk-price-modal">
        <div className="modal-header">
          <h2>Update Property Prices</h2>
          <button className="modal-close" onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            You are about to update prices for <strong>{propertyCount}</strong> properties.
          </p>

          <div className="price-input-group">
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value)}
              className="price-operation"
            >
              <option value="set">Set Price</option>
              <option value="increase">Increase by</option>
              <option value="decrease">Decrease by</option>
              <option value="percentage">Increase by %</option>
            </select>
            <input
              type="number"
              placeholder="Enter value"
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
              step="0.01"
            />
            {operationType === 'set' && <span>AED</span>}
            {operationType === 'percentage' && <span>%</span>}
          </div>

          {priceValue && (
            <div className="price-preview">
              <AlertCircle size={16} />
              <p>Will {operationType === 'set' ? 'set' : operationType} all property prices</p>
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
            disabled={!priceValue}
          >
            Update Prices
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkPriceModal;
