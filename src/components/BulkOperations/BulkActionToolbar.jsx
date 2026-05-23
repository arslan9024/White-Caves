import React from 'react';
import { AlertCircle, Trash2, Mail, Tag, DollarSign, Home, Check } from 'lucide-react';
import './BulkActionToolbar.css';

const BulkActionToolbar = ({
  selectedCount,
  onStatusUpdate,
  onPriceUpdate,
  onFurnishingUpdate,
  onTagsUpdate,
  onNotification,
  onDelete,
  onClear,
  isLoading,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bulk-action-toolbar">
      <div className="toolbar-container">
        {/* Selection Info */}
        <div className="toolbar-info">
          <Check size={18} />
          <span className="selection-count">{selectedCount} selected</span>
        </div>

        {/* Action Buttons */}
        <div className="toolbar-actions">
          <button
            className="toolbar-btn toolbar-btn-status"
            onClick={onStatusUpdate}
            disabled={isLoading}
            title="Update status for selected properties"
          >
            <Home size={16} />
            <span>Status</span>
          </button>

          <button
            className="toolbar-btn toolbar-btn-price"
            onClick={onPriceUpdate}
            disabled={isLoading}
            title="Update price for selected properties"
          >
            <DollarSign size={16} />
            <span>Price</span>
          </button>

          <button
            className="toolbar-btn toolbar-btn-furnishing"
            onClick={onFurnishingUpdate}
            disabled={isLoading}
            title="Update furnishing for selected properties"
          >
            <Home size={16} />
            <span>Furnish</span>
          </button>

          <button
            className="toolbar-btn toolbar-btn-tags"
            onClick={onTagsUpdate}
            disabled={isLoading}
            title="Add or remove tags"
          >
            <Tag size={16} />
            <span>Tags</span>
          </button>

          <button
            className="toolbar-btn toolbar-btn-notify"
            onClick={onNotification}
            disabled={isLoading}
            title="Send notification to agents"
          >
            <Mail size={16} />
            <span>Notify</span>
          </button>

          <button
            className="toolbar-btn toolbar-btn-delete"
            onClick={onDelete}
            disabled={isLoading}
            title="Delete selected properties"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>

        {/* Clear Button */}
        <button
          className="toolbar-btn-clear"
          onClick={onClear}
          disabled={isLoading}
          title="Clear selection"
        >
          ✕
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="toolbar-loading">
          <div className="spinner"></div>
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
};

export default BulkActionToolbar;
